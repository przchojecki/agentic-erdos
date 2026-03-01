#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function idx(i, j, n) {
  return i * n + j;
}

function triCounts(adj, n) {
  const tri = new Int16Array(n * n);
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (!adj[idx(i, j, n)]) continue;
      let c = 0;
      for (let k = 0; k < n; k += 1) {
        if (k === i || k === j) continue;
        if (adj[idx(i, k, n)] && adj[idx(j, k, n)]) c += 1;
      }
      tri[idx(i, j, n)] = c;
      tri[idx(j, i, n)] = c;
    }
  }
  return tri;
}

function scoreGraph(adj, n, tmax) {
  const tri = triCounts(adj, n);
  let edges = 0;
  let pen = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (!adj[idx(i, j, n)]) continue;
      edges += 1;
      const t = tri[idx(i, j, n)];
      if (t === 0) pen += 200;
      else if (t > tmax) pen += 200 + 20 * (t - tmax);
    }
  }
  return { edges, penalty: pen, score: edges - pen, tri };
}

function localSearch(n, tmax, iters = 120000, restarts = 30) {
  let bestFeasible = { edges: -1, adj: null, tri: null };

  for (let r = 0; r < restarts; r += 1) {
    const adj = new Uint8Array(n * n);

    // init near edge density tuned to tmax
    const p = tmax === 1 ? 0.24 : 0.32;
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        if (Math.random() < p) {
          adj[idx(i, j, n)] = 1;
          adj[idx(j, i, n)] = 1;
        }
      }
    }

    let cur = scoreGraph(adj, n, tmax);
    let temp = 3.0;

    for (let it = 0; it < iters; it += 1) {
      const i = Math.floor(Math.random() * n);
      let j = Math.floor(Math.random() * (n - 1));
      if (j >= i) j += 1;
      const a = idx(i, j, n);
      const b = idx(j, i, n);

      adj[a] ^= 1;
      adj[b] ^= 1;
      const nxt = scoreGraph(adj, n, tmax);
      const d = nxt.score - cur.score;

      if (d >= 0 || Math.random() < Math.exp(d / temp)) {
        cur = nxt;
      } else {
        adj[a] ^= 1;
        adj[b] ^= 1;
      }

      temp *= 0.99997;

      if (cur.penalty === 0 && cur.edges > bestFeasible.edges) {
        bestFeasible = { edges: cur.edges, adj: adj.slice(), tri: cur.tri.slice() };
      }
    }
  }

  return bestFeasible;
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep600_local_search_bounds.json');

const nList = (process.argv[2] || '16,20,24,28,32,36').split(',').map((x) => Number(x));
const tmaxList = (process.argv[3] || '1,2').split(',').map((x) => Number(x));
const iters = Number(process.argv[4] || 70000);
const restarts = Number(process.argv[5] || 18);

const rows = [];
for (const n of nList) {
  for (const tmax of tmaxList) {
    const t0 = Date.now();
    const b = localSearch(n, tmax, iters, restarts);
    rows.push({
      n,
      tmax,
      best_feasible_edges_found: b.edges,
      implied_lower_bound_on_e_n_r: b.edges + 1,
      runtime_ms: Date.now() - t0,
    });
    process.stderr.write(`n=${n}, tmax=${tmax}, edges=${b.edges}\n`);
  }
}

const out = {
  problem: 'EP-600',
  method: 'randomized_local_search_for_dense_graphs_with_per-edge_triangle_count_in_[1,tmax]',
  note: 'For tmax=r-1, any feasible graph with m edges gives lower bound e(n,r)>=m+1.',
  params: { n_list: nList, tmax_list: tmaxList, iters, restarts },
  rows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
