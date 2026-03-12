#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function edgeList(n) {
  const edges = [];
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) edges.push([i, j]);
  return edges;
}

function hasMonoTriangle(adj, n) {
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) {
      for (let c = b + 1; c < n; c += 1) {
        const ab = adj[a][b];
        const ac = adj[a][c];
        const bc = adj[b][c];
        if (ab === ac && ac === bc) return true;
      }
    }
  }
  return false;
}

function countColoringsNoMonoTriangle(n) {
  const edges = edgeList(n);
  const adj = Array.from({ length: n }, () => Array(n).fill(-1));
  let count = 0;

  function safe(u, v, color) {
    for (let w = 0; w < n; w += 1) {
      if (w === u || w === v) continue;
      if (adj[u][w] === color && adj[v][w] === color) return false;
    }
    return true;
  }

  function dfs(i) {
    if (i === edges.length) {
      count += 1;
      return;
    }
    const [u, v] = edges[i];
    for (const c of [0, 1]) {
      if (!safe(u, v, c)) continue;
      adj[u][v] = c;
      adj[v][u] = c;
      dfs(i + 1);
      adj[u][v] = -1;
      adj[v][u] = -1;
    }
  }

  dfs(0);
  return count;
}

const t0 = Date.now();
const rows = [];
let inferredR33 = null;
for (const n of [3, 4, 5, 6]) {
  const cnt = countColoringsNoMonoTriangle(n);
  rows.push({ n, colorings_without_monochromatic_triangle: cnt });
  if (inferredR33 === null && cnt === 0) inferredR33 = n;
}

const out = {
  problem: 'EP-591',
  script: path.basename(process.argv[1]),
  method: 'exact_exhaustive_toy_partition_relation_proxy_via_ramsey_33',
  params: {},
  rows,
  inferred_R_3_3: inferredR33,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
