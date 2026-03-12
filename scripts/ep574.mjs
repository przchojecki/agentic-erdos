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

function hasCycleLen(adj, n, len) {
  const vis = new Uint8Array(n);
  function dfs(start, v, depth, parent) {
    if (depth === len) return v === start;
    if (depth > len) return false;
    vis[v] = 1;
    for (const u of adj[v]) {
      if (u === parent) continue;
      if (depth + 1 < len && vis[u]) continue;
      if (dfs(start, u, depth + 1, v)) return true;
    }
    vis[v] = 0;
    return false;
  }
  for (let s = 0; s < n; s += 1) {
    vis.fill(0);
    if (dfs(s, s, 0, -1)) return true;
  }
  return false;
}

function greedyAvoidPair(n, l1, l2, trials, rng) {
  const edges0 = allEdges(n);
  let best = 0;
  for (let t = 0; t < trials; t += 1) {
    const edges = edges0.slice();
    for (let i = edges.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = edges[i]; edges[i] = edges[j]; edges[j] = tmp;
    }
    const adj = Array.from({ length: n }, () => new Set());
    let m = 0;
    for (const [u, v] of edges) {
      adj[u].add(v); adj[v].add(u);
      if (hasCycleLen(adj, n, l1) || hasCycleLen(adj, n, l2)) {
        adj[u].delete(v); adj[v].delete(u);
      } else {
        m += 1;
      }
    }
    if (m > best) best = m;
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 574);
const rows = [];

for (const [k, nVals, trials] of [[2, [40, 56, 72], 40], [3, [46, 62, 78], 16]]) {
  const oddLen = 2 * k - 1;
  const evenLen = 2 * k;
  for (const n of nVals) {
    const e = greedyAvoidPair(n, oddLen, evenLen, trials, rng);
    const scale = (n / 2) ** (1 + 1 / k);
    rows.push({
      k,
      forbidden: [`C${oddLen}`, `C${evenLen}`],
      n,
      trials,
      best_edges_found: e,
      ratio_over_n_over_2_pow_1_plus_1_over_k: Number((e / scale).toPrecision(8)),
      ratio_over_n_pow_1_plus_1_over_k: Number((e / (n ** (1 + 1 / k))).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-574',
  script: path.basename(process.argv[1]),
  method: 'greedy_extremal_profile_for_C_2k_minus_1_and_C_2k_free_graphs',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
