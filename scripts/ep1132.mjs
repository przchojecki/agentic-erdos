#!/usr/bin/env node

// EP-1132 deep standalone computation:
// Finite-n proxy for infinite-sequence limsup questions of Lebesgue functions L_n(x).

function mulberry32(seed) {
  let t = seed >>> 0;
  return function rand() {
    t += 0x6d2b79f5;
    let z = t;
    z = Math.imul(z ^ (z >>> 15), z | 1);
    z ^= z + Math.imul(z ^ (z >>> 7), z | 61);
    return ((z ^ (z >>> 14)) >>> 0) / 4294967296;
  };
}

function frac(x) {
  return x - Math.floor(x);
}

function sequenceQuasiCos(Nmax) {
  const phi = (Math.sqrt(5) - 1) / 2;
  const out = [];
  for (let n = 1; n <= Nmax; n += 1) {
    const t = frac(n * phi);
    out.push(Math.cos(Math.PI * t));
  }
  return out;
}

function sequenceRandom(Nmax, rand) {
  const out = [];
  const used = new Set();
  while (out.length < Nmax) {
    const x = rand() * 2 - 1;
    const key = Math.round((x + 1) * 1e12);
    if (used.has(key)) continue;
    used.add(key);
    out.push(x);
  }
  return out;
}

function sequenceLejaLike(Nmax, candCount) {
  const cands = [];
  for (let i = 0; i < candCount; i += 1) cands.push(-1 + (2 * i) / (candCount - 1));
  const used = new Uint8Array(candCount);

  const seq = [];
  // start center-biased
  let idx0 = Math.floor((candCount - 1) / 2);
  seq.push(cands[idx0]);
  used[idx0] = 1;

  for (let t = 1; t < Nmax; t += 1) {
    let bestIdx = -1;
    let bestScore = -Infinity;

    for (let i = 0; i < candCount; i += 1) {
      if (used[i]) continue;
      const x = cands[i];
      let score = 0.0;
      let valid = true;
      for (const y of seq) {
        const d = Math.abs(x - y);
        if (d < 1e-15) {
          valid = false;
          break;
        }
        score += Math.log(d);
      }
      if (!valid) continue;
      if (score > bestScore) {
        bestScore = score;
        bestIdx = i;
      }
    }

    if (bestIdx < 0) break;
    used[bestIdx] = 1;
    seq.push(cands[bestIdx]);
  }

  return seq;
}

function stableWeights(nodes) {
  const n = nodes.length;
  const signs = new Array(n).fill(1);
  const logs = new Array(n).fill(0);
  for (let i = 0; i < n; i += 1) {
    let sgn = 1;
    let lg = 0.0;
    const xi = nodes[i];
    for (let j = 0; j < n; j += 1) {
      if (i === j) continue;
      const d = xi - nodes[j];
      if (Math.abs(d) < 1e-15) return null;
      if (d < 0) sgn = -sgn;
      lg += Math.log(Math.abs(d));
    }
    signs[i] = sgn;
    logs[i] = -lg;
  }
  let shift = -Infinity;
  for (const v of logs) if (v > shift) shift = v;
  const weights = new Array(n);
  for (let i = 0; i < n; i += 1) weights[i] = signs[i] * Math.exp(logs[i] - shift);
  return weights;
}

function lebesgueAt(nodes, weights, x) {
  const n = nodes.length;
  for (let i = 0; i < n; i += 1) {
    if (Math.abs(x - nodes[i]) < 1e-13) return 1.0;
  }
  let denom = 0.0;
  let numer = 0.0;
  for (let i = 0; i < n; i += 1) {
    const t = weights[i] / (x - nodes[i]);
    denom += t;
    numer += Math.abs(t);
  }
  return Math.abs(numer / denom);
}

function analyzeSequence(name, seq, nChecks, gridX, thresholdConst) {
  let ptr = 0;
  const rows = [];

  for (let n = 1; n <= seq.length; n += 1) {
    if (ptr >= nChecks.length) continue;
    if (n !== nChecks[ptr]) continue;
    const nodes = seq.slice(0, n);
    const weights = stableWeights(nodes);
    if (!weights) {
      rows.push({
        n,
        unstable_duplicate_nodes: true,
      });
      ptr += 1;
      continue;
    }

    const logn = Math.log(n);
    const thr = thresholdConst * logn;

    let maxL = 0.0;
    let exceed = 0;
    for (const x of gridX) {
      const L = lebesgueAt(nodes, weights, x);
      if (L > maxL) maxL = L;
      if (L >= thr) exceed += 1;
    }

    rows.push({
      n,
      max_L_on_grid: Number(maxL.toFixed(10)),
      max_over_log_n: Number((maxL / logn).toFixed(10)),
      threshold_2_over_pi_log_n: Number(thr.toFixed(10)),
      exceeds_threshold_somewhere: maxL >= thr,
      exceed_fraction_of_grid: Number((exceed / gridX.length).toFixed(10)),
    });

    ptr += 1;
  }

  return { sequence: name, rows };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const Nmax = Number(process.env.NMAX || (depth >= 4 ? 320 : 180));
  const gridCount = Number(process.env.GRID || (depth >= 4 ? 1201 : 601));

  const rand = mulberry32(0x1132 ^ (depth * 313));

  const nChecks = [];
  for (let n = 4; n <= Nmax; n += (n < 40 ? 2 : 4)) nChecks.push(n);

  const gridX = [];
  for (let i = 0; i < gridCount; i += 1) gridX.push(-1 + (2 * i) / (gridCount - 1));

  const thresholdConst = 2 / Math.PI;

  const seqs = [
    { name: 'quasi_cos', vals: sequenceQuasiCos(Nmax) },
    { name: 'random_uniform', vals: sequenceRandom(Nmax, rand) },
    { name: 'leja_like_grid', vals: sequenceLejaLike(Nmax, depth >= 4 ? 1801 : 801) },
  ];

  const rows = seqs.map((s) => analyzeSequence(s.name, s.vals, nChecks, gridX, thresholdConst));

  const payload = {
    problem: 'EP-1132',
    script: 'ep1132.mjs',
    method: 'deep_finite_prefix_tracking_of_lebesgue_function_growth_for_multiple_infinite_node_models',
    warning: 'Finite-grid finite-n evidence only; does not settle full infinite-sequence almost-everywhere statement.',
    params: { depth, Nmax, gridCount, nChecksCount: nChecks.length, thresholdConst_2_over_pi: thresholdConst },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
