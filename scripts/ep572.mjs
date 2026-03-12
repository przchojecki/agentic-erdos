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

function greedyAvoidEvenCycle(n, cycleLen, trials, rng) {
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
      adj[u].add(v);
      adj[v].add(u);
      if (hasCycleLen(adj, n, cycleLen)) {
        adj[u].delete(v);
        adj[v].delete(u);
      } else {
        m += 1;
      }
    }
    if (m > best) best = m;
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 572);
const rows = [];

for (const [k, nVals, trials] of [[3, [34, 44, 54], 32], [4, [40, 50, 60], 22], [5, [46, 56, 66], 16]]) {
  const cycleLen = 2 * k;
  for (const n of nVals) {
    const exlb = greedyAvoidEvenCycle(n, cycleLen, trials, rng);
    rows.push({
      k,
      cycle_length: cycleLen,
      n,
      trials,
      best_edges_found_without_C_2k: exlb,
      normalized_over_n_1_plus_1_over_k: Number((exlb / (n ** (1 + 1 / k))).toPrecision(8)),
      normalized_over_n_1_plus_2_over_3k_minus_3: Number((exlb / (n ** (1 + 2 / (3 * k - 3)))).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-572',
  script: path.basename(process.argv[1]),
  method: 'greedy_extremal_profile_for_even_cycle_free_graphs',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
