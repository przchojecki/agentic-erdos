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

function makeGraph(n) {
  return { n, adj: Array.from({ length: n }, () => new Uint8Array(n)), neigh: Array.from({ length: n }, () => []), m: 0 };
}

function addEdge(G, u, v) {
  if (G.adj[u][v]) return;
  G.adj[u][v] = 1;
  G.adj[v][u] = 1;
  G.neigh[u].push(v);
  G.neigh[v].push(u);
  G.m += 1;
}

function removeEdge(G, u, v) {
  if (!G.adj[u][v]) return;
  G.adj[u][v] = 0;
  G.adj[v][u] = 0;
  G.neigh[u] = G.neigh[u].filter((x) => x !== v);
  G.neigh[v] = G.neigh[v].filter((x) => x !== u);
  G.m -= 1;
}

function allEdges(n) {
  const e = [];
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) e.push([i, j]);
  return e;
}

function shuffle(a, rng) {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
}

function hasViolation(G) {
  const n = G.n;
  const seenMask = new Map();

  function checkCycle(path) {
    let mask = 0;
    for (const v of path) mask |= 1 << v;
    if (seenMask.has(mask)) return seenMask.get(mask);

    let mS = 0;
    for (let i = 0; i < path.length; i += 1) {
      for (let j = i + 1; j < path.length; j += 1) {
        if (G.adj[path[i]][path[j]]) mS += 1;
      }
    }
    const viol = mS - path.length >= path.length;
    seenMask.set(mask, viol);
    return viol;
  }

  for (let s = 0; s < n; s += 1) {
    const visited = Array(n).fill(false);
    const path = [s];
    visited[s] = true;

    function dfs(u) {
      for (const v of G.neigh[u]) {
        if (v < s) continue;
        if (v === s) {
          if (path.length >= 3) {
            const second = path[1];
            const last = u;
            if (second < last && checkCycle(path)) return true;
          }
          continue;
        }
        if (visited[v]) continue;
        visited[v] = true;
        path.push(v);
        const bad = dfs(v);
        path.pop();
        visited[v] = false;
        if (bad) return true;
      }
      return false;
    }

    if (dfs(s)) return true;
  }
  return false;
}

function greedyMaxNoViolation(n, restarts, rng) {
  let best = 0;
  for (let r = 0; r < restarts; r += 1) {
    const G = makeGraph(n);
    const edges = allEdges(n);
    shuffle(edges, rng);
    for (const [u, v] of edges) {
      addEdge(G, u, v);
      if (hasViolation(G)) removeEdge(G, u, v);
    }
    if (G.m > best) best = G.m;
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 642);
const rows = [];
for (const [n, restarts] of [[8, 40], [9, 34], [10, 28], [11, 20], [12, 14]]) {
  const best = greedyMaxNoViolation(n, restarts, rng);
  rows.push({
    n,
    restarts,
    best_edges_found: best,
    best_over_n: Number((best / n).toPrecision(8)),
    best_over_n_log_n: Number((best / (n * Math.log(n))).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-642',
  script: path.basename(process.argv[1]),
  method: 'deeper_greedy_extremal_search_under_cycle_more_vertices_than_diagonals_constraint',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
