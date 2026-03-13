#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const POINTS = Number(process.env.POINTS || 180);
const EPS = Number(process.env.EPS || 0.025);
const MAX_DIM = Number(process.env.MAX_DIM || 8);

function makeRng(seed) {
  let x = seed >>> 0;
  return () => {
    x = (1664525 * x + 1013904223) >>> 0;
    return x / 0x100000000;
  };
}

const rng = makeRng(20260312 ^ 704);

function randn() {
  const u1 = Math.max(1e-12, rng());
  const u2 = rng();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

function randomSpherePoint(dim) {
  const v = Array.from({ length: dim }, () => randn());
  let norm = Math.sqrt(v.reduce((s, x) => s + x * x, 0));
  if (norm === 0) norm = 1;
  return v.map((x) => x / norm);
}

function sqDist(a, b) {
  let s = 0;
  for (let i = 0; i < a.length; i += 1) {
    const d = a[i] - b[i];
    s += d * d;
  }
  return s;
}

function buildGraph(points, eps) {
  const n = points.length;
  const adj = Array.from({ length: n }, () => new Set());
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const d = Math.sqrt(sqDist(points[i], points[j]));
      if (Math.abs(d - 1) <= eps) {
        adj[i].add(j);
        adj[j].add(i);
      }
    }
  }
  return adj;
}

function greedyColorUpper(adj) {
  const n = adj.length;
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => adj[b].size - adj[a].size);
  const color = Array(n).fill(-1);
  let maxColor = -1;
  for (const v of order) {
    const used = new Set();
    for (const u of adj[v]) if (color[u] >= 0) used.add(color[u]);
    let c = 0;
    while (used.has(c)) c += 1;
    color[v] = c;
    if (c > maxColor) maxColor = c;
  }
  return maxColor + 1;
}

function cliqueLowerGreedy(adj) {
  const n = adj.length;
  let best = 1;
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => adj[b].size - adj[a].size);
  for (const seed of order.slice(0, Math.min(50, n))) {
    const clique = [seed];
    let cands = [...adj[seed]].sort((a, b) => adj[b].size - adj[a].size);
    while (cands.length > 0) {
      const v = cands.shift();
      let ok = true;
      for (const u of clique) if (!adj[v].has(u)) { ok = false; break; }
      if (!ok) continue;
      clique.push(v);
      cands = cands.filter((u) => adj[v].has(u));
    }
    if (clique.length > best) best = clique.length;
  }
  return best;
}

const t0 = Date.now();
const rows = [];
for (let dim = 2; dim <= MAX_DIM; dim += 1) {
  const points = Array.from({ length: POINTS }, () => randomSpherePoint(dim));
  const adj = buildGraph(points, EPS);
  let edges = 0;
  for (const s of adj) edges += s.size;
  edges /= 2;

  const lower = cliqueLowerGreedy(adj);
  const upper = greedyColorUpper(adj);

  rows.push({
    dim,
    points: POINTS,
    eps: EPS,
    edges,
    avg_degree: Number((2 * edges / POINTS).toPrecision(8)),
    clique_lower_bound: lower,
    greedy_upper_bound: upper,
    gap_upper_minus_lower: upper - lower,
    lower_base_proxy: Number((Math.log(Math.max(2, lower)) / dim).toPrecision(8)),
    upper_base_proxy: Number((Math.log(Math.max(2, upper)) / dim).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-704',
  script: path.basename(process.argv[1]),
  method: 'random_geometric_unit_distance_slice_bounds',
  warning: 'Finite random model only; these are heuristic slice bounds, not bounds for the full infinite graph G_n.',
  params: { POINTS, EPS, MAX_DIM },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
