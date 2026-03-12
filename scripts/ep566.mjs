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

function generate3DegenerateLikeGraph(v, edgeBudget, rng) {
  const verts = Array.from({ length: v }, (_, i) => i);
  for (let i = verts.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = verts[i]; verts[i] = verts[j]; verts[j] = t;
  }
  const pos = Array(v).fill(0);
  for (let i = 0; i < v; i += 1) pos[verts[i]] = i;

  const edges = [];
  for (let x = 0; x < v; x += 1) {
    const later = verts.filter((u) => pos[u] > pos[x]);
    for (let take = 0; take < Math.min(3, later.length); take += 1) {
      if (edges.length >= edgeBudget) break;
      const u = later[Math.floor(rng() * later.length)];
      const a = Math.min(x, u);
      const b = Math.max(x, u);
      if (!edges.some(([p, q]) => p === a && q === b)) edges.push([a, b]);
    }
    if (edges.length >= edgeBudget) break;
  }
  return { v, edges };
}

function sampleContainsGraph(mask, N, idx, G, rng, samples = 1800) {
  const verts = Array.from({ length: N }, (_, i) => i);
  for (let s = 0; s < samples; s += 1) {
    for (let i = 0; i < G.v; i += 1) {
      const j = i + Math.floor(rng() * (N - i));
      const t = verts[i]; verts[i] = verts[j]; verts[j] = t;
    }
    const map = verts;
    let ok = true;
    for (const [a, b] of G.edges) {
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

const t0 = Date.now();
const rng = makeRng(20260312 ^ 566);
const rows = [];

for (const [m, Nvals, trials] of [[3, [9,10,11], 160], [4, [10,12,14], 140], [5, [12,14,16], 120]]) {
  let zeroAvoidAt = null;
  for (const N of Nvals) {
    const idx = edgeIndex(N);
    const E = (N * (N - 1)) / 2;
    const G = generate3DegenerateLikeGraph(Math.min(8, N), 2 * Math.min(8, N) - 3, rng);

    let avoid = 0;
    for (let t = 0; t < trials; t += 1) {
      const mask = randomMask(E, rng);
      const redHasG = sampleContainsGraph(mask, N, idx, G, rng, 1600);
      if (redHasG) continue;
      const blueMatch = blueMatchingNumber(mask, N, idx);
      if (blueMatch < m) avoid += 1;
    }

    rows.push({ m, N, trials, red_graph_vertices: G.v, red_graph_edges: G.edges.length, avoiding_hits: avoid });
    if (zeroAvoidAt === null && avoid === 0) zeroAvoidAt = N;
  }
  rows.push({ m, heuristic_zero_avoid_threshold_N: zeroAvoidAt, threshold_over_m: zeroAvoidAt ? Number((zeroAvoidAt / m).toPrecision(8)) : null });
}

const out = {
  problem: 'EP-566',
  script: path.basename(process.argv[1]),
  method: 'finite_ramsey_size_proxy_for_3_degenerate_red_graphs_vs_matchings',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
