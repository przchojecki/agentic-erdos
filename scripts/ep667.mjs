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

function combinations(arr, k) {
  const out = [];
  const cur = [];
  function dfs(i) {
    if (cur.length === k) {
      out.push(cur.slice());
      return;
    }
    for (let j = i; j < arr.length; j += 1) {
      cur.push(arr[j]);
      dfs(j + 1);
      cur.pop();
    }
  }
  dfs(0);
  return out;
}

function degree(adj, v) {
  let d = 0;
  for (let u = 0; u < adj.length; u += 1) d += adj[v][u] ? 1 : 0;
  return d;
}

function maxCliqueGreedy(adj) {
  const n = adj.length;
  const verts = Array.from({ length: n }, (_, i) => i);
  verts.sort((a, b) => degree(adj, b) - degree(adj, a));
  const clq = [];
  for (const v of verts) {
    let ok = true;
    for (const u of clq) if (!adj[u][v]) { ok = false; break; }
    if (ok) clq.push(v);
  }
  return Math.max(1, clq.length);
}

function localConditionHolds(adj, p, q) {
  const n = adj.length;
  const V = Array.from({ length: n }, (_, i) => i);
  for (const S of combinations(V, p)) {
    let e = 0;
    for (let i = 0; i < p; i += 1) {
      for (let j = i + 1; j < p; j += 1) if (adj[S[i]][S[j]]) e += 1;
    }
    if (e < q) return false;
  }
  return true;
}

function randomGraph(n, edgeProb, rng) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (rng() < edgeProb) {
        adj[i][j] = 1;
        adj[j][i] = 1;
      }
    }
  }
  return adj;
}

function searchH(n, p, q, trials, rng) {
  let bestClique = Infinity;
  let feasibleCount = 0;
  const m = (p * (p - 1)) / 2;

  for (let t = 0; t < trials; t += 1) {
    const probs = [
      Math.min(0.98, 0.15 + 0.85 * (q / m)),
      Math.min(0.98, 0.25 + 0.75 * (q / m)),
      Math.min(0.98, 0.35 + 0.65 * (q / m)),
      0.92,
    ];
    const pEdge = probs[t % probs.length];
    const G = randomGraph(n, pEdge, rng);
    if (!localConditionHolds(G, p, q)) continue;
    feasibleCount += 1;
    const w = maxCliqueGreedy(G);
    if (w < bestClique) bestClique = w;
  }
  if (!Number.isFinite(bestClique)) return { H: null, feasibleCount };
  return { H: bestClique, feasibleCount };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 667);
const rows = [];
const p = 5;

for (const q of [1, 2, 3, 4, 5, 6, 7]) {
  for (const n of [10, 12, 14, 16, 18, 20]) {
    const res = searchH(n, p, q, 420, rng);
    rows.push({
      p,
      q,
      n,
      feasible_graphs_found_in_trials: res.feasibleCount,
      sampled_H_proxy_min_forced_clique: res.H === null ? -1 : res.H,
      log_ratio_proxy: res.H && res.H > 1 ? Number((Math.log(res.H) / Math.log(n)).toPrecision(8)) : null,
    });
  }
}

const out = {
  problem: 'EP-667',
  script: path.basename(process.argv[1]),
  method: 'sampled_graph_search_for_forced_clique_under_local_p_q_density_constraints',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
