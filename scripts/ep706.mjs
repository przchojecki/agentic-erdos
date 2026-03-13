#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const R_MAX = Number(process.env.R_MAX || 5);
const POINTS = Number(process.env.POINTS || 120);
const TRIALS_PER_R = Number(process.env.TRIALS_PER_R || 28);
const EPS = Number(process.env.EPS || 0.02);

function makeRng(seed) {
  let x = seed >>> 0;
  return () => {
    x = (1664525 * x + 1013904223) >>> 0;
    return x / 0x100000000;
  };
}
const rng = makeRng(20260312 ^ 706);

function pointsInSquare(n) {
  const pts = [];
  for (let i = 0; i < n; i += 1) pts.push([rng(), rng()]);
  return pts;
}

function dist(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return Math.hypot(dx, dy);
}

function greedyColorUpper(adj) {
  const n = adj.length;
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => adj[b].length - adj[a].length);
  const col = Array(n).fill(-1);
  let usedMax = -1;
  for (const v of order) {
    const used = new Set();
    for (const u of adj[v]) if (col[u] >= 0) used.add(col[u]);
    let c = 0;
    while (used.has(c)) c += 1;
    col[v] = c;
    if (c > usedMax) usedMax = c;
  }
  return usedMax + 1;
}

function cliqueLowerGreedy(adj) {
  const n = adj.length;
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => adj[b].length - adj[a].length);
  let best = 1;
  for (const seed of order.slice(0, Math.min(40, n))) {
    const clique = [seed];
    let cands = adj[seed].slice().sort((a, b) => adj[b].length - adj[a].length);
    while (cands.length) {
      const v = cands.shift();
      let ok = true;
      for (const u of clique) if (!adj[v].includes(u)) { ok = false; break; }
      if (!ok) continue;
      clique.push(v);
      cands = cands.filter((u) => adj[v].includes(u));
    }
    if (clique.length > best) best = clique.length;
  }
  return best;
}

function sampleDistanceSet(r) {
  // keep separated targets in (0.05,1.2)
  const ds = [];
  while (ds.length < r) {
    const x = 0.05 + 1.15 * rng();
    if (ds.every((y) => Math.abs(y - x) > 0.08)) ds.push(x);
  }
  ds.sort((a, b) => a - b);
  return ds;
}

const t0 = Date.now();
const rows = [];

for (let r = 1; r <= R_MAX; r += 1) {
  let bestUpper = 0;
  let bestLower = 0;
  let meanUpper = 0;
  let meanLower = 0;
  for (let t = 0; t < TRIALS_PER_R; t += 1) {
    const pts = pointsInSquare(POINTS);
    const D = sampleDistanceSet(r);
    const adj = Array.from({ length: POINTS }, () => []);
    for (let i = 0; i < POINTS; i += 1) {
      for (let j = i + 1; j < POINTS; j += 1) {
        const d = dist(pts[i], pts[j]);
        if (D.some((x) => Math.abs(d - x) <= EPS)) {
          adj[i].push(j);
          adj[j].push(i);
        }
      }
    }
    const up = greedyColorUpper(adj);
    const lo = cliqueLowerGreedy(adj);
    meanUpper += up;
    meanLower += lo;
    if (up > bestUpper) bestUpper = up;
    if (lo > bestLower) bestLower = lo;
  }

  rows.push({
    r,
    trials: TRIALS_PER_R,
    points: POINTS,
    eps: EPS,
    max_greedy_upper: bestUpper,
    max_greedy_clique_lower: bestLower,
    mean_greedy_upper: Number((meanUpper / TRIALS_PER_R).toPrecision(8)),
    mean_clique_lower: Number((meanLower / TRIALS_PER_R).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-706',
  script: path.basename(process.argv[1]),
  method: 'finite_random_planar_multi_distance_graph_coloring_slices',
  warning: 'Finite random proxy only; this does not establish asymptotic bounds for L(r).',
  params: { R_MAX, POINTS, TRIALS_PER_R, EPS },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
