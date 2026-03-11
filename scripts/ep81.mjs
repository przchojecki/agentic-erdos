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

function buildSplitGraph(nClique, nIndep, pCross, rng) {
  const n = nClique + nIndep;
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < nClique; i += 1) {
    for (let j = i + 1; j < nClique; j += 1) adj[i][j] = adj[j][i] = 1;
  }
  for (let i = 0; i < nClique; i += 1) {
    for (let j = nClique; j < n; j += 1) if (rng() < pCross) adj[i][j] = adj[j][i] = 1;
  }
  return adj;
}

function edgesList(adj) {
  const n = adj.length;
  const e = [];
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) if (adj[i][j]) e.push([i, j]);
  return e;
}

function isClique(adj, verts) {
  for (let i = 0; i < verts.length; i += 1) {
    for (let j = i + 1; j < verts.length; j += 1) if (!adj[verts[i]][verts[j]]) return false;
  }
  return true;
}

function allCliques(adj) {
  const n = adj.length;
  const out = [];
  const total = 1 << n;
  for (let mask = 0; mask < total; mask += 1) {
    const verts = [];
    for (let i = 0; i < n; i += 1) if ((mask >>> i) & 1) verts.push(i);
    if (verts.length < 2) continue;
    if (isClique(adj, verts)) out.push(verts);
  }
  return out;
}

function edgeCliquePartitionNumber(adj) {
  const edges = edgesList(adj);
  const m = edges.length;
  if (m === 0) return 0;
  const cliques = allCliques(adj);

  const edgeId = new Map();
  for (let i = 0; i < m; i += 1) edgeId.set(`${edges[i][0]},${edges[i][1]}`, i);

  const cliqueMasks = [];
  for (const C of cliques) {
    let mask = 0n;
    for (let i = 0; i < C.length; i += 1) {
      for (let j = i + 1; j < C.length; j += 1) {
        const a = C[i];
        const b = C[j];
        const key = a < b ? `${a},${b}` : `${b},${a}`;
        const idx = edgeId.get(key);
        if (idx !== undefined) mask |= (1n << BigInt(idx));
      }
    }
    if (mask !== 0n) cliqueMasks.push(mask);
  }

  const byEdge = Array.from({ length: m }, () => []);
  for (const cm of cliqueMasks) {
    for (let e = 0; e < m; e += 1) if ((cm >> BigInt(e)) & 1n) byEdge[e].push(cm);
  }

  const full = (1n << BigInt(m)) - 1n;
  let best = m;

  function lowerBound(remMask) {
    let rem = 0;
    for (let e = 0; e < m; e += 1) if ((remMask >> BigInt(e)) & 1n) rem += 1;
    let maxCliqueCover = 1;
    for (const cm of cliqueMasks) {
      let c = 0;
      const inter = cm & remMask;
      for (let e = 0; e < m; e += 1) if ((inter >> BigInt(e)) & 1n) c += 1;
      if (c > maxCliqueCover) maxCliqueCover = c;
    }
    return Math.ceil(rem / maxCliqueCover);
  }

  function dfs(remMask, used) {
    if (remMask === 0n) {
      if (used < best) best = used;
      return;
    }
    if (used + lowerBound(remMask) >= best) return;

    let e0 = 0;
    while (((remMask >> BigInt(e0)) & 1n) === 0n) e0 += 1;

    for (const cm of byEdge[e0]) {
      if ((cm & remMask) !== cm) continue;
      dfs(remMask ^ cm, used + 1);
    }
  }

  dfs(full, 0);
  return best;
}

const CASES = Number(process.env.CASES || 18);
const N_LIST = (process.env.N_LIST || '10,12,14').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const P_LIST = (process.env.P_LIST || '0.25,0.4,0.55').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const SEED = Number(process.env.SEED || 8102026);
const OUT = process.env.OUT || '';

const rng = makeRng(SEED);
const rows = [];
for (const n of N_LIST) {
  const nClique = Math.floor(n / 3);
  const nIndep = n - nClique;
  for (const p of P_LIST) {
    let best = null;
    for (let t = 0; t < CASES; t += 1) {
      const g = buildSplitGraph(nClique, nIndep, p, rng);
      const ec = edgeCliquePartitionNumber(g);
      const target = (n * n) / 6;
      const item = {
        n,
        n_clique_part: nClique,
        n_independent_part: nIndep,
        p_cross: p,
        case_idx: t,
        edge_clique_partition_number: ec,
        n2_over_6: Number(target.toFixed(4)),
        gap_vs_n2_over_6: Number((ec - target).toFixed(4)),
      };
      if (!best || ec > best.edge_clique_partition_number) best = item;
    }
    rows.push(best);
  }
}

const out = {
  problem: 'EP-81',
  script: path.basename(process.argv[1]),
  method: 'exact_edge_clique_partition_on_split_graph_samples',
  params: { CASES, N_LIST, P_LIST, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
