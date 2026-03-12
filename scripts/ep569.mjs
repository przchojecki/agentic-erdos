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

function redAdj(mask, N, idx) {
  const adj = Array.from({ length: N }, () => []);
  for (let i = 0; i < N; i += 1) {
    for (let j = i + 1; j < N; j += 1) {
      const red = ((mask >> BigInt(idx[i][j])) & 1n) === 1n;
      if (red) { adj[i].push(j); adj[j].push(i); }
    }
  }
  return adj;
}

function hasOddCycleLen(adj, len) {
  const N = adj.length;
  const vis = new Uint8Array(N);
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
  for (let s = 0; s < N; s += 1) {
    vis.fill(0);
    if (dfs(s, s, 0, -1)) return true;
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

const t0 = Date.now();
const rng = makeRng(20260312 ^ 569);
const rows = [];

for (const k of [2, 3]) {
  const cycleLen = 2 * k + 1;
  for (const [m, Ns, trials] of [[2, [8, 9, 10, 11], 2600], [3, [10, 11, 12, 13], 2200], [4, [12, 13, 14], 1800]]) {
    let zeroAt = null;
    for (const N of Ns) {
      const idx = edgeIndex(N);
      const E = (N * (N - 1)) / 2;
      let avoid = 0;
      for (let t = 0; t < trials; t += 1) {
        const mask = randomMask(E, rng);
        const adj = redAdj(mask, N, idx);
        const redHasCycle = hasOddCycleLen(adj, cycleLen);
        if (redHasCycle) continue;
        const blueMatch = blueMatchingNumber(mask, N, idx);
        if (blueMatch < m) avoid += 1;
      }
      rows.push({ k, cycle_length: cycleLen, m, N, trials, avoiding_hits: avoid });
      if (zeroAt === null && avoid === 0) zeroAt = N;
    }
    rows.push({ k, cycle_length: cycleLen, m, heuristic_zero_avoid_threshold_N: zeroAt, threshold_over_m: zeroAt ? Number((zeroAt / m).toPrecision(8)) : null });
  }
}

const out = {
  problem: 'EP-569',
  script: path.basename(process.argv[1]),
  method: 'finite_ramsey_size_proxy_for_odd_cycles_vs_matchings',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
