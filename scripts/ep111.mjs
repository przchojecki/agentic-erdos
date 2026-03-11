#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function mycielski(adj) {
  const n = adj.length;
  const m = 2 * n + 1;
  const out = Array.from({ length: m }, () => new Uint8Array(m));
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (!adj[i][j]) continue;
      out[i][j] = out[j][i] = 1;
      out[i][j + n] = out[j + n][i] = 1;
      out[j][i + n] = out[i + n][j] = 1;
    }
  }
  const z = 2 * n;
  for (let i = 0; i < n; i += 1) out[i + n][z] = out[z][i + n] = 1;
  return out;
}

function cycle5() {
  const n = 5;
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    adj[i][j] = adj[j][i] = 1;
  }
  return adj;
}

function randomSubset(n, m, rng) {
  const arr = Array.from({ length: n }, (_, i) => i);
  for (let i = 0; i < m; i += 1) {
    const j = i + Math.floor(rng() * (n - i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, m);
}

function minEdgeDeletionToBipartiteOnSubset(adj, verts) {
  const m = verts.length;
  const edges = [];
  for (let i = 0; i < m; i += 1) {
    for (let j = i + 1; j < m; j += 1) {
      if (adj[verts[i]][verts[j]]) edges.push([i, j]);
    }
  }
  const totalMasks = 1 << (m - 1);
  let maxCut = 0;
  for (let mask = 0; mask < totalMasks; mask += 1) {
    let cut = 0;
    for (const [u, v] of edges) {
      const su = u === m - 1 ? 0 : ((mask >>> u) & 1);
      const sv = v === m - 1 ? 0 : ((mask >>> v) & 1);
      if (su !== sv) cut += 1;
    }
    if (cut > maxCut) maxCut = cut;
  }
  return edges.length - maxCut;
}

const LEVELS = Number(process.env.LEVELS || 3);
const M_LIST = (process.env.M_LIST || '8,10,12').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const SUBSET_SAMPLES = Number(process.env.SUBSET_SAMPLES || 240);
const SEED = Number(process.env.SEED || 11102026);
const OUT = process.env.OUT || '';

let g = cycle5();
for (let t = 0; t < LEVELS; t += 1) g = mycielski(g);
const n = g.length;

const rng = makeRng(SEED);
const rows = [];
for (const m of M_LIST) {
  let best = 0;
  for (let s = 0; s < SUBSET_SAMPLES; s += 1) {
    const verts = randomSubset(n, m, rng);
    const del = minEdgeDeletionToBipartiteOnSubset(g, verts);
    if (del > best) best = del;
  }
  rows.push({
    m,
    subset_samples: SUBSET_SAMPLES,
    max_deletions_observed_to_bipartite: best,
    ratio_h_over_n_proxy: Number((best / m).toFixed(4)),
  });
}

const out = {
  problem: 'EP-111',
  script: path.basename(process.argv[1]),
  method: 'finite_proxy_hg_n_on_high_chromatic_mycielski_graph',
  params: { LEVELS, M_LIST, SUBSET_SAMPLES, SEED },
  host_graph_vertices: n,
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
