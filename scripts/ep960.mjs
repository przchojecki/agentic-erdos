#!/usr/bin/env node

function makeRng(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function lineKey(p1, p2) {
  const [x1, y1] = p1;
  const [x2, y2] = p2;
  let A = y2 - y1;
  let B = x1 - x2;
  let C = -(A * x1 + B * y1);
  const g = gcd(gcd(A, B), C) || 1;
  A /= g;
  B /= g;
  C /= g;
  if (A < 0 || (A === 0 && B < 0) || (A === 0 && B === 0 && C < 0)) {
    A = -A;
    B = -B;
    C = -C;
  }
  return `${A},${B},${C}`;
}

function maxCollinear(points) {
  const n = points.length;
  let best = 2;
  for (let i = 0; i < n; i += 1) {
    const slopes = new Map();
    for (let j = i + 1; j < n; j += 1) {
      let dx = points[j][0] - points[i][0];
      let dy = points[j][1] - points[i][1];
      if (dx === 0) dy = 1;
      else if (dy === 0) dx = 1;
      else {
        const g = gcd(dx, dy);
        dx /= g;
        dy /= g;
        if (dx < 0) {
          dx = -dx;
          dy = -dy;
        }
      }
      const key = `${dx},${dy}`;
      const v = (slopes.get(key) || 0) + 1;
      slopes.set(key, v);
      if (v + 1 > best) best = v + 1;
    }
  }
  return best;
}

function analyzeSet(points, r) {
  const n = points.length;
  const linePairCount = new Map();
  const pairs = [];

  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const key = lineKey(points[i], points[j]);
      linePairCount.set(key, (linePairCount.get(key) || 0) + 1);
      pairs.push([i, j, key]);
    }
  }

  let ordinaryLines = 0;
  for (const c of linePairCount.values()) if (c === 1) ordinaryLines += 1;

  const adj = Array.from({ length: n }, () => new Set());
  for (const [i, j, key] of pairs) {
    if (linePairCount.get(key) === 1) {
      adj[i].add(j);
      adj[j].add(i);
    }
  }

  function hasCliqueFrom(cands, need) {
    if (need === 0) return true;
    if (cands.length < need) return false;
    for (let idx = 0; idx < cands.length; idx += 1) {
      const v = cands[idx];
      const next = [];
      for (let j = idx + 1; j < cands.length; j += 1) {
        const u = cands[j];
        if (adj[v].has(u)) next.push(u);
      }
      if (hasCliqueFrom(next, need - 1)) return true;
    }
    return false;
  }

  const verts = Array.from({ length: n }, (_, i) => i);
  const hasCliqueR = hasCliqueFrom(verts, r);

  return { ordinaryLines, hasCliqueR };
}

function randomPointSet(n, side, rng) {
  const pts = [];
  const seen = new Set();
  while (pts.length < n) {
    const x = Math.floor(rng() * side);
    const y = Math.floor(rng() * side);
    const key = `${x},${y}`;
    if (seen.has(key)) continue;
    seen.add(key);
    pts.push([x, y]);
  }
  return pts;
}

function triadHeavySet(n, rng) {
  const pts = [];
  let y = 0;
  while (pts.length + 3 <= n) {
    const x0 = Math.floor(rng() * (5 * n));
    pts.push([x0, y], [x0 + 1, y], [x0 + 2, y]);
    y += 1;
  }
  while (pts.length < n) {
    pts.push([Math.floor(rng() * (6 * n)), y + pts.length]);
  }
  return pts;
}

function main() {
  const seed = Number(process.env.SEED || process.argv[2] || 20260307);
  const samplesPerN = Number(process.env.SAMPLES || process.argv[3] || 3000);
  const r = Number(process.env.R || process.argv[4] || 4);
  const k = Number(process.env.K || process.argv[5] || 4);
  const nList = (process.env.N_LIST || process.argv[6] || '10,12,14,16,18')
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isFinite(x) && x >= r + 1);

  const rng = makeRng(seed >>> 0);
  const rows = [];

  for (const n of nList) {
    const accepted = [];
    let sampled = 0;

    while (accepted.length < samplesPerN && sampled < samplesPerN * 12) {
      sampled += 1;
      const pts = (accepted.length % 2 === 0)
        ? randomPointSet(n, 8 * n, rng)
        : triadHeavySet(n, rng);
      if (maxCollinear(pts) >= k) continue;
      const a = analyzeSet(pts, r);
      accepted.push(a);
    }

    const vals = accepted.map((x) => x.ordinaryLines);
    vals.sort((a, b) => a - b);
    const maxOrd = vals.length ? vals[vals.length - 1] : 0;

    let forcingThreshold = null;
    let witnessNonForcing = null;
    for (let t = 0; t <= maxOrd; t += 1) {
      let any = false;
      let allClique = true;
      for (const row of accepted) {
        if (row.ordinaryLines >= t) {
          any = true;
          if (!row.hasCliqueR) {
            allClique = false;
            witnessNonForcing = row.ordinaryLines;
            break;
          }
        }
      }
      if (any && allClique) {
        forcingThreshold = t;
        break;
      }
    }

    let withClique = 0;
    for (const row of accepted) if (row.hasCliqueR) withClique += 1;

    rows.push({
      n,
      sampled_attempts: sampled,
      accepted_samples_no_k_collinear: accepted.length,
      empirical_forcing_threshold_ordinary_lines: forcingThreshold,
      max_ordinary_lines_seen: maxOrd,
      fraction_with_r_clique_in_ordinary_graph: Number((withClique / Math.max(1, accepted.length)).toPrecision(8)),
      highest_ordinary_lines_seen_without_r_clique: witnessNonForcing,
    });

    process.stderr.write(`n=${n}, accepted=${accepted.length}, threshold~${forcingThreshold}, maxOrd=${maxOrd}\n`);
  }

  const out = {
    problem: 'EP-960',
    method: 'standalone_finite_sampling_of_ordinary_line_threshold_for_r_clique_in_ordinary_graph',
    params: { seed, samples_per_n: samplesPerN, r, k, n_list: nList },
    rows,
    generated_utc: new Date().toISOString(),
  };

  process.stdout.write(`${JSON.stringify(out, null, 2)}\n`);
}

main();
