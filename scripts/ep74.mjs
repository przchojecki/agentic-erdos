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

function randomGraph(n, p, rng) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  const edges = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (rng() < p) {
        adj[i][j] = 1;
        adj[j][i] = 1;
        edges.push([i, j]);
      }
    }
  }
  return { adj, edges };
}

function chromaticNumberExact(adj) {
  const n = adj.length;
  const deg = Array.from({ length: n }, (_, i) => adj[i].reduce((a, b) => a + b, 0));
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => deg[b] - deg[a]);
  const color = Array(n).fill(-1);
  let best = n;

  function dfs(pos, used) {
    if (used >= best) return;
    if (pos === n) {
      best = used;
      return;
    }
    const v = order[pos];
    const blocked = new Uint8Array(used);
    for (let u = 0; u < n; u += 1) {
      const c = color[u];
      if (c >= 0 && adj[v][u]) blocked[c] = 1;
    }
    for (let c = 0; c < used; c += 1) {
      if (blocked[c]) continue;
      color[v] = c;
      dfs(pos + 1, used);
      color[v] = -1;
    }
    color[v] = used;
    dfs(pos + 1, used + 1);
    color[v] = -1;
  }

  dfs(0, 0);
  return best;
}

function minEdgeDeletionToBipartite(n, edges) {
  // exact via max-cut enumeration on 2^(n-1) cuts
  const totalMasks = 1 << (n - 1);
  let maxCut = 0;
  for (let mask = 0; mask < totalMasks; mask += 1) {
    let cut = 0;
    for (const [u, v] of edges) {
      const su = u === n - 1 ? 0 : ((mask >>> u) & 1);
      const sv = v === n - 1 ? 0 : ((mask >>> v) & 1);
      if (su !== sv) cut += 1;
    }
    if (cut > maxCut) maxCut = cut;
  }
  return edges.length - maxCut;
}

const N_LIST = (process.env.N_LIST || '10,12,14').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const P_LIST = (process.env.P_LIST || '0.12,0.16,0.2,0.24').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const SAMPLES = Number(process.env.SAMPLES || 120);
const TARGET_CHI = Number(process.env.TARGET_CHI || 4);
const SEED = Number(process.env.SEED || 7402026);
const OUT = process.env.OUT || '';

const rng = makeRng(SEED);
const rows = [];
for (const n of N_LIST) {
  for (const p of P_LIST) {
    let best = null;
    for (let s = 0; s < SAMPLES; s += 1) {
      const g = randomGraph(n, p, rng);
      const chi = chromaticNumberExact(g.adj);
      if (chi < TARGET_CHI) continue;
      const del = minEdgeDeletionToBipartite(n, g.edges);
      const item = {
        n,
        p,
        sample: s,
        edges: g.edges.length,
        chi,
        min_edges_to_delete_for_bipartite: del,
        deletion_per_vertex: Number((del / n).toFixed(4)),
      };
      if (!best || del < best.min_edges_to_delete_for_bipartite) best = item;
    }
    rows.push(best || { n, p, note: `no sample with chromatic number >= ${TARGET_CHI}` });
  }
}

const out = {
  problem: 'EP-74',
  script: path.basename(process.argv[1]),
  method: 'finite_high_chromatic_near_bipartite_tradeoff_scan',
  params: { N_LIST, P_LIST, SAMPLES, TARGET_CHI, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
