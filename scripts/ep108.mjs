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
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (rng() < p) adj[i][j] = adj[j][i] = 1;
    }
  }
  return adj;
}

function chromaticNumberExact(adj, vertices = null) {
  const verts = vertices || Array.from({ length: adj.length }, (_, i) => i);
  const n = verts.length;
  const deg = verts.map((v) => {
    let d = 0;
    for (const u of verts) if (u !== v && adj[v][u]) d += 1;
    return d;
  });
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => deg[b] - deg[a]).map((i) => verts[i]);
  const color = new Map();
  let best = n;

  function dfs(pos, used) {
    if (used >= best) return;
    if (pos === n) {
      best = used;
      return;
    }
    const v = order[pos];
    const blocked = new Uint8Array(used);
    for (const u of verts) {
      const c = color.get(u);
      if (c !== undefined && adj[v][u]) blocked[c] = 1;
    }
    for (let c = 0; c < used; c += 1) {
      if (blocked[c]) continue;
      color.set(v, c);
      dfs(pos + 1, used);
      color.delete(v);
    }
    color.set(v, used);
    dfs(pos + 1, used + 1);
    color.delete(v);
  }

  dfs(0, 0);
  return best;
}

function girthOfInduced(adj, verts) {
  const idx = new Map(verts.map((v, i) => [v, i]));
  const n = verts.length;
  let best = Infinity;

  for (let s = 0; s < n; s += 1) {
    const dist = Array(n).fill(-1);
    const par = Array(n).fill(-1);
    const q = [s];
    dist[s] = 0;
    for (let qi = 0; qi < q.length; qi += 1) {
      const x = q[qi];
      const vx = verts[x];
      for (let y = 0; y < n; y += 1) {
        if (x === y) continue;
        const vy = verts[y];
        if (!adj[vx][vy]) continue;
        if (dist[y] < 0) {
          dist[y] = dist[x] + 1;
          par[y] = x;
          q.push(y);
        } else if (par[x] !== y) {
          const cyc = dist[x] + dist[y] + 1;
          if (cyc < best) best = cyc;
        }
      }
    }
  }
  return Number.isFinite(best) ? best : Infinity;
}

function allSubsetsOfSize(n, m) {
  const out = [];
  const cur = [];
  function rec(start, need) {
    if (need === 0) {
      out.push(cur.slice());
      return;
    }
    for (let v = start; v <= n - need; v += 1) {
      cur.push(v);
      rec(v + 1, need - 1);
      cur.pop();
    }
  }
  rec(0, m);
  return out;
}

const N = Number(process.env.N || 12);
const P_LIST = (process.env.P_LIST || '0.25,0.35,0.45').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const GRAPH_SAMPLES = Number(process.env.GRAPH_SAMPLES || 80);
const SUBSET_SAMPLES = Number(process.env.SUBSET_SAMPLES || 0); // used only in random mode
const SUBSET_SIZE_MIN = Number(process.env.SUBSET_SIZE_MIN || 7);
const SUBSET_SIZE_MAX = Number(process.env.SUBSET_SIZE_MAX || 9);
const R_LIST = (process.env.R_LIST || '4,5').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const SEED = Number(process.env.SEED || 10802026);
const OUT = process.env.OUT || '';

const rng = makeRng(SEED);
const rows = [];

for (const p of P_LIST) {
  let bestHost = null;
  for (let g = 0; g < GRAPH_SAMPLES; g += 1) {
    const adj = randomGraph(N, p, rng);
    const hostChi = chromaticNumberExact(adj);
    if (!bestHost || hostChi > bestHost.host_chromatic) bestHost = { adj, host_chromatic: hostChi, graph_idx: g };
  }

  if (!bestHost) {
    rows.push({ p, note: 'no host graph sampled' });
    continue;
  }

  for (const r of R_LIST) {
    let bestSubChi = null;
    let checked = 0;
    let qualified = 0;
    for (let m = SUBSET_SIZE_MIN; m <= SUBSET_SIZE_MAX; m += 1) {
      const subsets = allSubsetsOfSize(N, m);
      for (const verts of subsets) {
        checked += 1;
        const gir = girthOfInduced(bestHost.adj, verts);
        if (gir < r) continue;
        qualified += 1;
        const chi = chromaticNumberExact(bestHost.adj, verts);
        if (bestSubChi === null || chi > bestSubChi) bestSubChi = chi;
      }
    }
    rows.push({
      p,
      host_graph_idx: bestHost.graph_idx,
      host_chromatic: bestHost.host_chromatic,
      target_girth_r: r,
      best_found_subgraph_chromatic_with_girth_ge_r: bestSubChi,
      subsets_checked: checked,
      girth_qualified_subsets: qualified,
      subset_size_range: [SUBSET_SIZE_MIN, SUBSET_SIZE_MAX],
    });
  }
}

const out = {
  problem: 'EP-108',
  script: path.basename(process.argv[1]),
  method: 'finite_high_chi_to_high_girth_high_chi_subgraph_proxy',
  params: { N, P_LIST, GRAPH_SAMPLES, SUBSET_SAMPLES, SUBSET_SIZE_MIN, SUBSET_SIZE_MAX, R_LIST, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
