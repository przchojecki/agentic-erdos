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
  return {
    n,
    adj: Array.from({ length: n }, () => new Uint8Array(n)),
    neigh: Array.from({ length: n }, () => []),
    m: 0,
  };
}

function addEdge(G, u, v) {
  if (G.adj[u][v]) return;
  G.adj[u][v] = 1; G.adj[v][u] = 1;
  G.neigh[u].push(v); G.neigh[v].push(u);
  G.m += 1;
}

function removeEdge(G, u, v) {
  if (!G.adj[u][v]) return;
  G.adj[u][v] = 0; G.adj[v][u] = 0;
  G.neigh[u] = G.neigh[u].filter((x) => x !== v);
  G.neigh[v] = G.neigh[v].filter((x) => x !== u);
  G.m -= 1;
}

function hasTwoEdgeDisjointCyclesSameVertexSet(G) {
  const { n, neigh } = G;
  const edgePos = Array.from({ length: n }, () => Array(n).fill(-1));
  let e = 0;
  for (let u = 0; u < n; u += 1) for (let v = u + 1; v < n; v += 1) edgePos[u][v] = edgePos[v][u] = e++;

  const byMask = new Map();
  const seen = new Set();

  for (let s = 0; s < n; s += 1) {
    const vis = Array(n).fill(false);
    const path = [s];
    vis[s] = true;
    function dfs(u) {
      for (const v of neigh[u]) {
        if (v === s) {
          if (path.length >= 3) {
            let vm = 0;
            let em = 0n;
            for (const x of path) vm |= 1 << x;
            for (let i = 0; i < path.length; i += 1) {
              const a = path[i];
              const b = path[(i + 1) % path.length];
              em |= 1n << BigInt(edgePos[a][b]);
            }
            const key = em.toString();
            if (!seen.has(key)) {
              seen.add(key);
              if (!byMask.has(vm)) byMask.set(vm, []);
              byMask.get(vm).push(em);
            }
          }
          continue;
        }
        if (v < s || vis[v]) continue;
        vis[v] = true; path.push(v); dfs(v); path.pop(); vis[v] = false;
      }
    }
    dfs(s);
  }

  for (const arr of byMask.values()) {
    for (let i = 0; i < arr.length; i += 1) {
      for (let j = i + 1; j < arr.length; j += 1) {
        if ((arr[i] & arr[j]) === 0n) return true;
      }
    }
  }
  return false;
}

function shuffle(a, rng) {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = a[i]; a[i] = a[j]; a[j] = t;
  }
}

function greedyMaxEdgesNoViolation(n, restarts, rng) {
  const E0 = allEdges(n);
  let best = 0;
  for (let r = 0; r < restarts; r += 1) {
    const G = makeGraph(n);
    const edges = E0.slice();
    shuffle(edges, rng);
    for (const [u, v] of edges) {
      addEdge(G, u, v);
      if (hasTwoEdgeDisjointCyclesSameVertexSet(G)) removeEdge(G, u, v);
    }
    if (G.m > best) best = G.m;
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 585);
const rows = [];

for (const [n, restarts] of [[8, 80], [9, 55], [10, 35], [11, 20]]) {
  const best = greedyMaxEdgesNoViolation(n, restarts, rng);
  rows.push({
    n,
    restarts,
    best_edges_found_no_two_edge_disjoint_same_vertex_set_cycles: best,
    best_over_n_loglogn: Number((best / Math.max(1, n * Math.log(Math.log(Math.max(4, n))))).toPrecision(8)),
    best_over_n_logn: Number((best / Math.max(1, n * Math.log(n))).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-585',
  script: path.basename(process.argv[1]),
  method: 'deeper_exact_cycle_mask_search_with_greedy_maximization',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
