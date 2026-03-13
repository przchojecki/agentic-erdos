#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_LIST = (process.env.N_LIST || '40,60,80,100,130,160').split(',').map((x) => Number(x.trim())).filter(Boolean);
const RESTARTS = Number(process.env.RESTARTS || 28);

function makeRng(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 0x100000000);
  };
}
const rng = makeRng(20260313 ^ 713);

function shuffle(a) {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
}

function greedyC4FreeEdges(n, restarts) {
  const all = [];
  for (let u = 0; u < n; u += 1) for (let v = u + 1; v < n; v += 1) all.push([u, v]);
  let best = 0;

  for (let r = 0; r < restarts; r += 1) {
    const neigh = Array.from({ length: n }, () => new Set());
    const adj = Array.from({ length: n }, () => Array(n).fill(false));
    let m = 0;

    const edges = all.slice();
    shuffle(edges);

    for (const [u, v] of edges) {
      let common = false;
      for (const x of neigh[u]) {
        if (adj[v][x]) { common = true; break; }
      }
      if (!common) {
        neigh[u].add(v);
        neigh[v].add(u);
        adj[u][v] = true;
        adj[v][u] = true;
        m += 1;
      }
    }
    if (m > best) best = m;
  }
  return best;
}

const t0 = Date.now();
const rows = [];
const vals = [];
for (const n of N_LIST) {
  const e = greedyC4FreeEdges(n, RESTARTS);
  vals.push([n, e]);
  rows.push({
    n,
    restarts: RESTARTS,
    best_greedy_C4_free_edges: e,
    edges_over_n_pow_1p5: Number((e / (n ** 1.5)).toPrecision(8)),
  });
}

const slopes = [];
for (let i = 1; i < vals.length; i += 1) {
  const [n1, e1] = vals[i - 1];
  const [n2, e2] = vals[i];
  slopes.push({
    from_n: n1,
    to_n: n2,
    local_loglog_slope: Number((Math.log(e2 / e1) / Math.log(n2 / n1)).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-713',
  script: path.basename(process.argv[1]),
  method: 'deeper_greedy_C4_free_exponent_proxy_scan',
  warning: 'Heuristic lower-bound construction data for a model bipartite forbidden graph, not full EP-713 resolution.',
  params: { N_LIST, RESTARTS },
  rows,
  local_loglog_slopes: slopes,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
