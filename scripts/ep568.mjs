#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function edgeIndex(N) {
  const idx = Array.from({ length: N }, () => Array(N).fill(-1));
  let e = 0;
  for (let i = 0; i < N; i += 1) for (let j = i + 1; j < N; j += 1) idx[i][j] = idx[j][i] = e++;
  return idx;
}

function randomMask(E, rng) {
  let m = 0n;
  for (let e = 0; e < E; e += 1) if (rng() < 0.5) m |= 1n << BigInt(e);
  return m;
}

function sampleContainsGraph(mask, N, idx, G, rng, samples = 2200) {
  const verts = Array.from({ length: N }, (_, i) => i);
  for (let s = 0; s < samples; s += 1) {
    for (let i = 0; i < G.v; i += 1) {
      const j = i + Math.floor(rng() * (N - i));
      const t = verts[i]; verts[i] = verts[j]; verts[j] = t;
    }
    const map = verts;
    let ok = true;
    for (const [a,b] of G.edges) {
      const red = ((mask >> BigInt(idx[map[a]][map[b]])) & 1n) === 1n;
      if (!red) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
}

function blueMatchingNumber(mask, N, idx) {
  const memo = new Map();
  function dfs(maskV) {
    if (memo.has(maskV)) return memo.get(maskV);
    if (maskV === 0) return 0;
    let v = 0;
    while (((maskV >> v) & 1) === 0) v += 1;
    let best = dfs(maskV & ~(1 << v));
    for (let u = v + 1; u < N; u += 1) {
      if (((maskV >> u) & 1) === 0) continue;
      const isRed = ((mask >> BigInt(idx[v][u])) & 1n) === 1n;
      if (!isRed) {
        const cand = 1 + dfs(maskV & ~(1 << v) & ~(1 << u));
        if (cand > best) best = cand;
      }
    }
    memo.set(maskV, best);
    return best;
  }
  return dfs((1 << N) - 1);
}

const G_LIST = [
  { name: 'C5', v: 5, edges: [[0,1],[1,2],[2,3],[3,4],[4,0]] },
  { name: 'K2,3', v: 5, edges: [[0,2],[0,3],[0,4],[1,2],[1,3],[1,4]] },
  { name: 'H5_subdiv_K4_edge', v: 5, edges: [[0,2],[0,3],[1,2],[1,3],[2,3],[0,4],[1,4]] },
];

const t0 = Date.now();
const rng = makeRng(20260312 ^ 568);
const rows = [];

for (const G of G_LIST) {
  for (const [m, Nvals, trials] of [[3, [10,12,14], 180], [4, [12,14,16], 160], [5, [14,16,18], 140]]) {
    let zeroAt = null;
    for (const N of Nvals) {
      const idx = edgeIndex(N);
      const E = (N * (N - 1)) / 2;
      let avoid = 0;
      for (let t = 0; t < trials; t += 1) {
        const mask = randomMask(E, rng);
        if (sampleContainsGraph(mask, N, idx, G, rng, 2000)) continue;
        if (blueMatchingNumber(mask, N, idx) < m) avoid += 1;
      }
      rows.push({ G: G.name, G_edges: G.edges.length, m, N, trials, avoiding_hits: avoid });
      if (zeroAt === null && avoid === 0) zeroAt = N;
    }
    rows.push({ G: G.name, m, heuristic_zero_avoid_threshold_N: zeroAt, threshold_over_m: zeroAt ? Number((zeroAt / m).toPrecision(8)) : null });
  }
}

const out = {
  problem: 'EP-568',
  script: path.basename(process.argv[1]),
  method: 'finite_linear_ramsey_size_proxy_for_representative_G_vs_mK2',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
