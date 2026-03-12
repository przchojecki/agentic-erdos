#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function shuffledEdges(n, rng) {
  const e = [];
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) e.push([i, j]);
  for (let i = e.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = e[i]; e[i] = e[j]; e[j] = t;
  }
  return e;
}

function addEdge(adj, u, v) {
  adj[u].add(v);
  adj[v].add(u);
}

function removeEdge(adj, u, v) {
  adj[u].delete(v);
  adj[v].delete(u);
}

function createsMonoK3(adj, u, v) {
  for (const w of adj[u]) if (adj[v].has(w)) return true;
  return false;
}

function hasPathLen4(adj, src, dst) {
  // path src-a-b-c-dst with distinct internal vertices
  for (const a of adj[src]) {
    if (a === dst) continue;
    for (const b of adj[a]) {
      if (b === src || b === dst || b === a) continue;
      for (const c of adj[b]) {
        if (c === src || c === dst || c === a || c === b) continue;
        if (adj[c].has(dst)) return true;
      }
    }
  }
  return false;
}

function createsMonoC5(adj, u, v) {
  // adding uv closes a C5 iff there is a length-4 path u..v
  return hasPathLen4(adj, u, v);
}

function greedyAvoidOnce(k, n, H, rng) {
  const edges = shuffledEdges(n, rng);
  const adjs = Array.from({ length: k }, () => Array.from({ length: n }, () => new Set()));

  for (const [u, v] of edges) {
    const good = [];
    for (let c = 0; c < k; c += 1) {
      const adj = adjs[c];
      let bad = false;
      if (H === 'K3') {
        if (createsMonoK3(adj, u, v)) bad = true;
      } else {
        addEdge(adj, u, v);
        bad = createsMonoC5(adj, u, v);
        removeEdge(adj, u, v);
      }
      if (!bad) good.push(c);
    }
    if (!good.length) return false;
    const c = good[Math.floor(rng() * good.length)];
    addEdge(adjs[c], u, v);
  }
  return true;
}

function greedySuccesses(k, n, H, restarts, rng) {
  let s = 0;
  for (let t = 0; t < restarts; t += 1) if (greedyAvoidOnce(k, n, H, rng)) s += 1;
  return s;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 554);
const rows = [];

for (const [k, Ns, restarts] of [[3, [10,12,14,16,18,20], 220], [4, [16,20,24,28,32], 180]]) {
  let bestK3 = 0;
  let bestC5 = 0;
  const detail = [];

  for (const n of Ns) {
    const sK3 = greedySuccesses(k, n, 'K3', restarts, rng);
    const sC5 = greedySuccesses(k, n, 'C5', restarts, rng);
    if (sK3 > 0) bestK3 = Math.max(bestK3, n);
    if (sC5 > 0) bestC5 = Math.max(bestC5, n);
    detail.push({ n, restarts, greedy_successes_K3: sK3, greedy_successes_C5: sC5 });
  }

  rows.push({
    k,
    best_n_with_greedy_success_K3: bestK3,
    best_n_with_greedy_success_C5: bestC5,
    ratio_best_C5_over_best_K3: (bestK3 > 0 && bestC5 > 0) ? Number((bestC5 / bestK3).toPrecision(8)) : null,
    detail,
  });
}

const out = {
  problem: 'EP-554',
  script: path.basename(process.argv[1]),
  method: 'greedy_multicolor_avoidance_profile_for_C5_vs_K3',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
