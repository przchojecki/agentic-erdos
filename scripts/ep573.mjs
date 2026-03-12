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

function hasC3(adj, u, v) {
  for (const w of adj[u]) if (adj[v].has(w)) return true;
  return false;
}

function hasC4IfAdd(adj, n, u, v) {
  for (const a of adj[u]) {
    if (a === v) continue;
    for (const b of adj[v]) {
      if (b === u || b === a) continue;
      if (adj[a].has(b)) return true;
    }
  }
  return false;
}

function greedyC3C4free(n, trials, rng) {
  const E0 = allEdges(n);
  let best = 0;
  for (let t = 0; t < trials; t += 1) {
    const edges = E0.slice();
    for (let i = edges.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = edges[i]; edges[i] = edges[j]; edges[j] = tmp;
    }
    const adj = Array.from({ length: n }, () => new Set());
    let m = 0;
    for (const [u, v] of edges) {
      if (hasC3(adj, u, v)) continue;
      if (hasC4IfAdd(adj, n, u, v)) continue;
      adj[u].add(v); adj[v].add(u); m += 1;
    }
    if (m > best) best = m;
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 573);
const rows = [];

for (const [n, trials] of [[60, 280], [80, 220], [100, 170], [120, 130], [140, 100], [160, 80]]) {
  const e = greedyC3C4free(n, trials, rng);
  const ref = (n / 2) ** 1.5;
  rows.push({
    n,
    trials,
    best_edges_found_C3_C4_free: e,
    ratio_over_n_over_2_pow_3_over_2: Number((e / ref).toPrecision(8)),
    ratio_over_n_pow_3_over_2: Number((e / (n ** 1.5)).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-573',
  script: path.basename(process.argv[1]),
  method: 'greedy_extremal_profile_for_C3_C4_free_graphs',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
