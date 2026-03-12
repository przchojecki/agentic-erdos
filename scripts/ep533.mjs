#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function edgeKey(u, v) {
  return u < v ? `${u},${v}` : `${v},${u}`;
}

function hasEdge(adj, u, v) {
  return adj[u].has(v);
}

function createsK5IfAdd(adj, u, v) {
  const common = [];
  for (const x of adj[u]) if (adj[v].has(x)) common.push(x);
  const m = common.length;
  if (m < 3) return false;
  for (let i = 0; i < m; i += 1) {
    for (let j = i + 1; j < m; j += 1) {
      const a = common[i];
      const b = common[j];
      if (!hasEdge(adj, a, b)) continue;
      for (let k = j + 1; k < m; k += 1) {
        const c = common[k];
        if (hasEdge(adj, a, c) && hasEdge(adj, b, c)) return true;
      }
    }
  }
  return false;
}

function randomDenseK5free(n, rng) {
  const adj = Array.from({ length: n }, () => new Set());
  const edges = [];
  for (let u = 0; u < n; u += 1) for (let v = u + 1; v < n; v += 1) edges.push([u, v]);
  for (let i = edges.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = edges[i]; edges[i] = edges[j]; edges[j] = t;
  }

  let added = 0;
  for (const [u, v] of edges) {
    if (!createsK5IfAdd(adj, u, v)) {
      adj[u].add(v);
      adj[v].add(u);
      added += 1;
    }
  }
  return { adj, edges_added: added };
}

function triangleList(adj) {
  const n = adj.length;
  const tri = [];
  for (let a = 0; a < n; a += 1) {
    for (const b of adj[a]) {
      if (b <= a) continue;
      for (const c of adj[b]) {
        if (c <= b) continue;
        if (adj[a].has(c)) tri.push([a, b, c]);
      }
    }
  }
  return tri;
}

function greedyTriangleFreeSubset(adj, restarts, rng) {
  const n = adj.length;
  const tri = triangleList(adj);
  const byV = Array.from({ length: n }, () => []);
  for (let i = 0; i < tri.length; i += 1) {
    const [a, b, c] = tri[i];
    byV[a].push(i); byV[b].push(i); byV[c].push(i);
  }

  let best = 0;
  for (let t = 0; t < restarts; t += 1) {
    const ord = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = ord[i]; ord[i] = ord[j]; ord[j] = tmp;
    }

    const chosen = new Uint8Array(n);
    let cur = 0;
    for (const v of ord) {
      let ok = true;
      chosen[v] = 1;
      for (const ti of byV[v]) {
        const [a, b, c] = tri[ti];
        if (chosen[a] && chosen[b] && chosen[c]) { ok = false; break; }
      }
      if (ok) cur += 1;
      else chosen[v] = 0;
    }
    if (cur > best) best = cur;
  }
  return { best_size_found: best, triangle_count: tri.length };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 533);
const tasks = [
  { n: 40, graph_trials: 20, subset_restarts: 900 },
  { n: 50, graph_trials: 16, subset_restarts: 900 },
  { n: 60, graph_trials: 12, subset_restarts: 900 },
];

const rows = [];
for (const task of tasks) {
  let bestSubset = 0;
  let avgSubset = 0;
  let avgDensity = 0;
  let avgTriangles = 0;

  for (let t = 0; t < task.graph_trials; t += 1) {
    const { adj, edges_added } = randomDenseK5free(task.n, rng);
    const possible = (task.n * (task.n - 1)) / 2;
    avgDensity += edges_added / possible;

    const res = greedyTriangleFreeSubset(adj, task.subset_restarts, rng);
    avgTriangles += res.triangle_count;
    avgSubset += res.best_size_found;
    if (res.best_size_found > bestSubset) bestSubset = res.best_size_found;
  }

  rows.push({
    n: task.n,
    graph_trials: task.graph_trials,
    subset_restarts: task.subset_restarts,
    avg_edge_density: Number((avgDensity / task.graph_trials).toPrecision(8)),
    avg_triangle_count: Number((avgTriangles / task.graph_trials).toPrecision(8)),
    avg_best_induced_triangle_free_subset_size_found: Number((avgSubset / task.graph_trials).toPrecision(8)),
    best_induced_triangle_free_subset_size_found: bestSubset,
    best_ratio_over_n: Number((bestSubset / task.n).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-533',
  script: path.basename(process.argv[1]),
  method: 'dense_random_K5_free_generation_plus_induced_triangle_free_subset_search',
  params: { tasks },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
