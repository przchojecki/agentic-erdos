#!/usr/bin/env node

// EP-1066 deep standalone computation:
// exact independent-set computations on many induced subgraphs
// of triangular-lattice unit-distance contact graphs.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function popcnt(x) {
  let c = 0;
  let v = x;
  while (v) {
    v &= v - 1n;
    c += 1;
  }
  return c;
}

function firstBitIndex(x) {
  let idx = 0;
  let v = x;
  while ((v & 1n) === 0n) {
    v >>= 1n;
    idx += 1;
  }
  return idx;
}

function shuffle(a, rng) {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
}

function buildTriangularPatch(W, H) {
  const coords = [];
  const pos = new Map();
  for (let x = 0; x < W; x += 1) {
    for (let y = 0; y < H; y += 1) {
      const id = coords.length;
      coords.push([x, y]);
      pos.set(`${x},${y}`, id);
    }
  }
  const dirs = [[1,0],[0,1],[1,-1],[-1,0],[0,-1],[-1,1]];
  const n = coords.length;
  const masks = Array(n).fill(0n);
  for (let i = 0; i < n; i += 1) {
    const [x, y] = coords[i];
    for (const [dx, dy] of dirs) {
      const j = pos.get(`${x + dx},${y + dy}`);
      if (j !== undefined) masks[i] |= (1n << BigInt(j));
    }
  }
  return masks;
}

function inducedMasks(baseMasks, picked) {
  const n = picked.length;
  const idOf = new Map();
  for (let i = 0; i < n; i += 1) idOf.set(picked[i], i);
  const out = Array(n).fill(0n);
  for (let i = 0; i < n; i += 1) {
    const old = picked[i];
    let m = 0n;
    for (let j = 0; j < n; j += 1) {
      if (i === j) continue;
      const oldj = picked[j];
      if (((baseMasks[old] >> BigInt(oldj)) & 1n) !== 0n) m |= (1n << BigInt(j));
    }
    out[i] = m;
  }
  return out;
}

function exactMIS(adj) {
  const n = adj.length;
  const all = (1n << BigInt(n)) - 1n;
  let best = 0;

  function dfs(cand, cur) {
    if (cand === 0n) {
      if (cur > best) best = cur;
      return;
    }
    if (cur + popcnt(cand) <= best) return;

    const vBit = cand & -cand;
    const v = firstBitIndex(vBit);

    // include v
    dfs(cand & ~adj[v] & ~vBit, cur + 1);

    // exclude v
    dfs(cand & ~vBit, cur);
  }

  dfs(all, 0);
  return best;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const rng = makeRng(20260314 ^ 1066 ^ (depth * 104729));

  const W = 14;
  const H = 14;
  const base = buildTriangularPatch(W, H);
  const universe = [...Array(base.length).keys()];

  const nList = [24, 30, 36, 42];
  const samplesPerN = 60 * depth;

  const rows = [];
  for (const n of nList) {
    let bestRatio = 1;
    let worstRatio = 0;
    let sumRatio = 0;
    const sampleAlphas = [];

    for (let t = 0; t < samplesPerN; t += 1) {
      const verts = universe.slice();
      shuffle(verts, rng);
      const picked = verts.slice(0, n);
      const adj = inducedMasks(base, picked);
      const alpha = exactMIS(adj);
      const r = alpha / n;
      if (r < bestRatio) bestRatio = r;
      if (r > worstRatio) worstRatio = r;
      sumRatio += r;
      if (sampleAlphas.length < 20) sampleAlphas.push(alpha);
    }

    rows.push({
      n,
      samples: samplesPerN,
      min_alpha_over_n_found: Number(bestRatio.toFixed(8)),
      mean_alpha_over_n: Number((sumRatio / samplesPerN).toFixed(8)),
      max_alpha_over_n_found: Number(worstRatio.toFixed(8)),
      sample_alpha_values_first20: sampleAlphas,
    });
  }

  const payload = {
    problem: 'EP-1066',
    script: 'ep1066.mjs',
    method: 'deep_exact_independent_set_sampling_on_triangular_lattice_induced_subgraphs',
    warning: 'Induced-subgraph model gives finite proxy evidence, not worst-case unit-distance extremal proof.',
    params: { depth, patch: [W, H], nList, samplesPerN },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
