#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function randomGraph(n, p, rng) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  const neigh = Array.from({ length: n }, () => []);
  let m = 0;
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) {
      if (rng() < p) {
        adj[u][v] = 1;
        adj[v][u] = 1;
        neigh[u].push(v);
        neigh[v].push(u);
        m += 1;
      }
    }
  }
  return { n, adj, neigh, m };
}

function bfsDistAvoidEdge(G, src, banU, banV) {
  const { n, neigh } = G;
  const dist = Array(n).fill(-1);
  const q = [src];
  dist[src] = 0;
  let qi = 0;
  while (qi < q.length) {
    const u = q[qi++];
    for (const v of neigh[u]) {
      if ((u === banU && v === banV) || (u === banV && v === banU)) continue;
      if (dist[v] >= 0) continue;
      dist[v] = dist[u] + 1;
      q.push(v);
    }
  }
  return dist;
}

function approxPairOnCycleAtMostL(G, e1, e2, L) {
  const [a, b] = e1;
  const [c, d] = e2;
  const da = bfsDistAvoidEdge(G, a, a, b);
  const db = bfsDistAvoidEdge(G, b, a, b);
  const cand1 = da[c] >= 0 && db[d] >= 0 ? da[c] + 1 + db[d] : 1e9;
  const cand2 = da[d] >= 0 && db[c] >= 0 ? da[d] + 1 + db[c] : 1e9;
  return Math.min(cand1, cand2) <= L - 1;
}

function adjacentPairInC4(G, e1, e2) {
  const [a, b] = e1;
  const [c, d] = e2;
  let u = -1; let v = -1; let w = -1;
  if (a === c) { u = a; v = b; w = d; }
  else if (a === d) { u = a; v = b; w = c; }
  else if (b === c) { u = b; v = a; w = d; }
  else if (b === d) { u = b; v = a; w = c; }
  else return false;
  for (const x of G.neigh[v]) if (x !== u && x !== w && G.adj[w][x]) return true;
  return false;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 584);
const rows = [];

for (const [delta, trials] of [[0.08, 20], [0.12, 18], [0.16, 16]]) {
  const n = 88;
  const p = Math.min(0.95, 2 * delta);
  let avgM = 0;
  let frac6 = 0;
  let frac8 = 0;
  let fracAdjC4 = 0;
  for (let t = 0; t < trials; t += 1) {
    const G = randomGraph(n, p, rng);
    avgM += G.m;
    const edges = [];
    for (let u = 0; u < n; u += 1) for (const v of G.neigh[u]) if (u < v) edges.push([u, v]);

    const pairSamples = Math.min(600, Math.floor(edges.length / 2));
    let hit6 = 0;
    let hit8 = 0;
    for (let s = 0; s < pairSamples; s += 1) {
      const e1 = edges[Math.floor(rng() * edges.length)];
      const e2 = edges[Math.floor(rng() * edges.length)];
      if (approxPairOnCycleAtMostL(G, e1, e2, 6)) hit6 += 1;
      if (approxPairOnCycleAtMostL(G, e1, e2, 8)) hit8 += 1;
    }
    frac6 += pairSamples ? hit6 / pairSamples : 0;
    frac8 += pairSamples ? hit8 / pairSamples : 0;

    let adjHit = 0;
    let adjCnt = 0;
    for (let s = 0; s < 900; s += 1) {
      const u = Math.floor(rng() * n);
      if (G.neigh[u].length < 2) continue;
      const a = G.neigh[u][Math.floor(rng() * G.neigh[u].length)];
      const b = G.neigh[u][Math.floor(rng() * G.neigh[u].length)];
      if (a === b) continue;
      adjCnt += 1;
      if (adjacentPairInC4(G, [u, a], [u, b])) adjHit += 1;
    }
    fracAdjC4 += adjCnt ? adjHit / adjCnt : 0;
  }
  avgM /= trials;
  frac6 /= trials;
  frac8 /= trials;
  fracAdjC4 /= trials;
  rows.push({
    n,
    delta,
    trials,
    avg_edges: Number(avgM.toPrecision(8)),
    delta_sq_n_sq: Number((delta * delta * n * n).toPrecision(8)),
    delta_cu_n_sq: Number((delta * delta * delta * n * n).toPrecision(8)),
    sampled_pair_fraction_cycle_len_le_6_approx: Number(frac6.toPrecision(8)),
    sampled_pair_fraction_cycle_len_le_8_approx: Number(frac8.toPrecision(8)),
    sampled_adjacent_pair_fraction_on_C4: Number(fracAdjC4.toPrecision(8)),
  });
}

const out = {
  problem: 'EP-584',
  script: path.basename(process.argv[1]),
  method: 'deeper_short_cycle_pair_connectivity_sampling_in_dense_graphs',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
