#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function randomGraph(n, p, rng) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  const neigh = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (rng() < p) {
        adj[i][j] = 1;
        adj[j][i] = 1;
        neigh[i].push(j);
        neigh[j].push(i);
      }
    }
  }
  return { n, adj, neigh };
}

function greedyChiUpper(G, restarts, rng) {
  const n = G.n;
  let best = n;
  for (let r = 0; r < restarts; r += 1) {
    const order = Array.from({ length: n }, (_, i) => i);
    shuffle(order, rng);
    const col = new Int32Array(n).fill(-1);
    let maxColor = -1;
    for (const v of order) {
      const used = new Uint8Array(n);
      for (const u of G.neigh[v]) {
        const c = col[u];
        if (c >= 0) used[c] = 1;
      }
      let c = 0;
      while (used[c]) c += 1;
      col[v] = c;
      if (c > maxColor) maxColor = c;
    }
    const val = maxColor + 1;
    if (val < best) best = val;
  }
  return best;
}

function greedyCliqueLower(G, restarts, rng) {
  const n = G.n;
  let best = 1;
  for (let r = 0; r < restarts; r += 1) {
    const order = Array.from({ length: n }, (_, i) => i);
    shuffle(order, rng);
    order.sort((a, b) => G.neigh[b].length - G.neigh[a].length);
    const clique = [];
    for (const v of order) {
      let ok = true;
      for (const u of clique) {
        if (!G.adj[u][v]) {
          ok = false;
          break;
        }
      }
      if (ok) clique.push(v);
    }
    if (clique.length > best) best = clique.length;
  }
  return best;
}

function cycleGraph(n) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    adj[i][j] = 1;
    adj[j][i] = 1;
  }
  return adj;
}

function mycielski(adj) {
  const n = adj.length;
  const m = 2 * n + 1;
  const out = Array.from({ length: m }, () => new Uint8Array(m));

  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (!adj[i][j]) continue;
      out[i][j] = 1;
      out[j][i] = 1;
      out[i][n + j] = 1;
      out[n + j][i] = 1;
      out[j][n + i] = 1;
      out[n + i][j] = 1;
    }
  }
  const z = 2 * n;
  for (let i = 0; i < n; i += 1) {
    out[n + i][z] = 1;
    out[z][n + i] = 1;
  }
  return out;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 627);

const mycielskiRows = [];
let A = cycleGraph(5);
for (let t = 0; t <= 5; t += 1) {
  const n = A.length;
  const chi = 3 + t;
  const omega = 2;
  const scale = n / (Math.log(n) ** 2);
  mycielskiRows.push({
    construction: t === 0 ? 'C5' : `M^${t}(C5)`,
    n,
    exact_chi: chi,
    exact_omega: omega,
    exact_ratio_chi_over_omega: Number((chi / omega).toPrecision(8)),
    normalized_ratio_over_n_div_log2: Number(((chi / omega) / scale).toPrecision(8)),
  });
  A = mycielski(A);
}

const randomRows = [];
for (const [n, p, trials] of [[120, 0.5, 20], [180, 0.5, 14], [240, 0.5, 10]]) {
  let sumChiU = 0;
  let sumCliqueL = 0;
  let bestProxy = 0;
  for (let t = 0; t < trials; t += 1) {
    const G = randomGraph(n, p, rng);
    const chiU = greedyChiUpper(G, 44, rng);
    const cliqueL = greedyCliqueLower(G, 120, rng);
    const proxy = chiU / Math.max(2, cliqueL);
    sumChiU += chiU;
    sumCliqueL += cliqueL;
    if (proxy > bestProxy) bestProxy = proxy;
  }
  const avgProxy = (sumChiU / trials) / Math.max(2, sumCliqueL / trials);
  randomRows.push({
    n,
    p,
    trials,
    avg_chi_upper: Number((sumChiU / trials).toPrecision(8)),
    avg_clique_lower: Number((sumCliqueL / trials).toPrecision(8)),
    avg_ratio_proxy_chi_upper_over_clique_lower: Number(avgProxy.toPrecision(8)),
    avg_proxy_over_n_div_log2: Number((avgProxy / (n / (Math.log(n) ** 2))).toPrecision(8)),
    best_ratio_proxy_seen: Number(bestProxy.toPrecision(8)),
  });
}

const out = {
  problem: 'EP-627',
  script: path.basename(process.argv[1]),
  method: 'mycielski_exact_lower_bound_family_plus_deep_random_graph_ratio_proxies',
  params: {},
  mycielski_rows: mycielskiRows,
  random_rows: randomRows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
