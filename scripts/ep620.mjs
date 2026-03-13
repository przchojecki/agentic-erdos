#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function allEdges(n) {
  const e = [];
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) e.push([i, j]);
  return e;
}

function makeGraph(n) {
  return { n, adj: Array.from({ length: n }, () => new Uint8Array(n)), m: 0 };
}

function addEdge(G, u, v) {
  if (G.adj[u][v]) return;
  G.adj[u][v] = 1; G.adj[v][u] = 1; G.m += 1;
}

function createsK4(G, u, v) {
  const common = [];
  for (let x = 0; x < G.n; x += 1) if (G.adj[u][x] && G.adj[v][x]) common.push(x);
  for (let i = 0; i < common.length; i += 1) {
    for (let j = i + 1; j < common.length; j += 1) if (G.adj[common[i]][common[j]]) return true;
  }
  return false;
}

function maximalK4Free(n, rng) {
  const G = makeGraph(n);
  const edges = allEdges(n);
  for (let i = edges.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = edges[i]; edges[i] = edges[j]; edges[j] = t;
  }
  for (const [u, v] of edges) {
    if (createsK4(G, u, v)) continue;
    addEdge(G, u, v);
  }
  return G;
}

function largestTriangleFreeInducedHeuristic(G) {
  const n = G.n;
  const alive = Array(n).fill(true);
  while (true) {
    const triCount = Array(n).fill(0);
    let found = false;
    for (let a = 0; a < n; a += 1) {
      if (!alive[a]) continue;
      for (let b = a + 1; b < n; b += 1) {
        if (!alive[b] || !G.adj[a][b]) continue;
        for (let c = b + 1; c < n; c += 1) {
          if (!alive[c]) continue;
          if (G.adj[a][c] && G.adj[b][c]) {
            triCount[a] += 1; triCount[b] += 1; triCount[c] += 1; found = true;
          }
        }
      }
    }
    if (!found) break;
    let bestV = -1; let bestC = -1;
    for (let v = 0; v < n; v += 1) if (alive[v] && triCount[v] > bestC) { bestC = triCount[v]; bestV = v; }
    if (bestV < 0) break;
    alive[bestV] = false;
  }
  let sz = 0;
  for (let v = 0; v < n; v += 1) if (alive[v]) sz += 1;
  return sz;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 620);
const rows = [];

for (const [n, trials] of [[60, 12], [80, 10], [100, 8]]) {
  let best = 0;
  let avg = 0;
  let avgEdges = 0;
  for (let t = 0; t < trials; t += 1) {
    const G = maximalK4Free(n, rng);
    avgEdges += G.m;
    const s = largestTriangleFreeInducedHeuristic(G);
    avg += s;
    if (s > best) best = s;
  }
  avg /= trials;
  avgEdges /= trials;
  rows.push({
    n,
    trials,
    avg_edges_in_random_maximal_K4_free_graph: Number(avgEdges.toPrecision(8)),
    best_triangle_free_induced_size_found: best,
    avg_triangle_free_induced_size_found: Number(avg.toPrecision(8)),
    best_over_sqrt_n: Number((best / Math.sqrt(n)).toPrecision(8)),
    best_over_n_pow_0_6: Number((best / (n ** 0.6)).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-620',
  script: path.basename(process.argv[1]),
  method: 'deeper_random_maximal_K4_free_probe_for_largest_triangle_free_induced_subgraph',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
