#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function edgeListComplete(N) {
  const e = [];
  for (let i = 0; i < N; i += 1) for (let j = i + 1; j < N; j += 1) e.push([i, j]);
  return e;
}

function graphBitHelpers(N) {
  const edges = edgeListComplete(N);
  const idx = Array.from({ length: N }, () => Array(N).fill(-1));
  edges.forEach(([u, v], i) => { idx[u][v] = i; idx[v][u] = i; });
  return { edges, idx };
}

function embeddingEdgeMasks(G, N, idx) {
  const out = [];
  const used = Array(N).fill(false);
  const map = Array(G.v).fill(-1);

  function dfs(i) {
    if (i === G.v) {
      let m = 0n;
      for (const [a, b] of G.edges) m |= 1n << BigInt(idx[map[a]][map[b]]);
      out.push(m);
      return;
    }
    for (let x = 0; x < N; x += 1) {
      if (used[x]) continue;
      used[x] = true;
      map[i] = x;
      dfs(i + 1);
      used[x] = false;
    }
  }
  dfs(0);
  return out;
}

function hasMonoFromMasks(mask, edgeMasks) {
  for (const em of edgeMasks) {
    if ((mask & em) === em) return true;
    if ((mask & em) === 0n) return true;
  }
  return false;
}

function ramseyDiagonalExact(G, capN = 7) {
  for (let N = G.v; N <= capN; N += 1) {
    const { edges, idx } = graphBitHelpers(N);
    const E = edges.length;
    const edgeMasks = embeddingEdgeMasks(G, N, idx);
    const total = 1n << BigInt(E);
    let foundAvoid = false;
    for (let m = 0n; m < total; m += 1n) {
      if (!hasMonoFromMasks(m, edgeMasks)) {
        foundAvoid = true;
        break;
      }
    }
    if (!foundAvoid) return N;
  }
  return null;
}

const t0 = Date.now();
const graphs = [
  { name: 'P3', m: 2, v: 3, edges: [[0, 1], [1, 2]] },
  { name: '2K2', m: 2, v: 4, edges: [[0, 1], [2, 3]] },
  { name: 'K3', m: 3, v: 3, edges: [[0, 1], [0, 2], [1, 2]] },
  { name: 'P4', m: 3, v: 4, edges: [[0, 1], [1, 2], [2, 3]] },
  { name: 'K1,3', m: 3, v: 4, edges: [[0, 1], [0, 2], [0, 3]] },
];

const rows = graphs.map((G) => ({
  graph: G.name,
  m_edges: G.m,
  R_diag_exact_cap7: ramseyDiagonalExact(G, 7),
}));

const out = {
  problem: 'EP-545',
  script: path.basename(process.argv[1]),
  method: 'expanded_exact_small_graph_diagonal_ramsey_profile',
  params: { capN: 7 },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
