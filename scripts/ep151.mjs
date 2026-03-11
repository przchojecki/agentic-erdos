#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function edgesFromMask(n, mask) {
  const edges = [];
  let b = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if ((mask >>> b) & 1) edges.push([i, j]);
      b += 1;
    }
  }
  return edges;
}

function buildAdj(n, edges) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  for (const [u, v] of edges) adj[u][v] = adj[v][u] = 1;
  return adj;
}

function hasTriangle(adj) {
  const n = adj.length;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (!adj[i][j]) continue;
      for (let k = j + 1; k < n; k += 1) if (adj[i][k] && adj[j][k]) return true;
    }
  }
  return false;
}

function alphaNumber(adj) {
  const n = adj.length;
  const total = 1 << n;
  let best = 0;
  for (let mask = 1; mask < total; mask += 1) {
    const sz = mask.toString(2).replace(/0/g, '').length;
    if (sz <= best) continue;
    let ok = true;
    for (let i = 0; i < n && ok; i += 1) {
      if (!((mask >>> i) & 1)) continue;
      for (let j = i + 1; j < n; j += 1) {
        if (((mask >>> j) & 1) && adj[i][j]) {
          ok = false;
          break;
        }
      }
    }
    if (ok) best = sz;
  }
  return best;
}

function maximalCliquesMasks(adj) {
  const n = adj.length;
  const total = 1 << n;
  const cliques = [];
  for (let mask = 1; mask < total; mask += 1) {
    const sz = mask.toString(2).replace(/0/g, '').length;
    if (sz < 2) continue;
    let clique = true;
    for (let i = 0; i < n && clique; i += 1) {
      if (!((mask >>> i) & 1)) continue;
      for (let j = i + 1; j < n; j += 1) {
        if (((mask >>> j) & 1) && !adj[i][j]) {
          clique = false;
          break;
        }
      }
    }
    if (!clique) continue;
    let maximal = true;
    for (let v = 0; v < n && maximal; v += 1) {
      if ((mask >>> v) & 1) continue;
      let canAdd = true;
      for (let u = 0; u < n; u += 1) {
        if (((mask >>> u) & 1) && !adj[v][u]) {
          canAdd = false;
          break;
        }
      }
      if (canAdd) maximal = false;
    }
    if (maximal) cliques.push(mask);
  }
  return cliques;
}

function tauCliqueTransversal(adj) {
  const n = adj.length;
  const cliques = maximalCliquesMasks(adj);
  if (!cliques.length) return 0;
  const total = 1 << n;
  let best = n;
  for (let mask = 0; mask < total; mask += 1) {
    const sz = mask.toString(2).replace(/0/g, '').length;
    if (sz >= best) continue;
    let ok = true;
    for (const c of cliques) {
      if ((mask & c) === 0) {
        ok = false;
        break;
      }
    }
    if (ok) best = sz;
  }
  return best;
}

function exactH(n) {
  // exact only for n<=7 (2^(n choose 2) manageable)
  const m = (n * (n - 1)) / 2;
  const total = 1 << m;
  let h = n;
  for (let mask = 0; mask < total; mask += 1) {
    const adj = buildAdj(n, edgesFromMask(n, mask));
    if (hasTriangle(adj)) continue;
    const a = alphaNumber(adj);
    if (a < h) h = a;
  }
  return h;
}

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
  const edges = [];
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) if (rng() < p) edges.push([i, j]);
  return buildAdj(n, edges);
}

const N_LIST = (process.env.N_LIST || '5,6,7').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const SAMPLES = Number(process.env.SAMPLES || 2400);
const P_LIST = (process.env.P_LIST || '0.25,0.4,0.55,0.7').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const SEED = Number(process.env.SEED || 15102026);
const OUT = process.env.OUT || '';

const hExact = new Map();
for (const n of N_LIST) hExact.set(n, exactH(n));

const rng = makeRng(SEED);
const rows = [];
for (const n of N_LIST) {
  const h = hExact.get(n);
  let worstGap = -Infinity;
  let witness = null;
  for (const p of P_LIST) {
    for (let s = 0; s < SAMPLES; s += 1) {
      const g = randomGraph(n, p, rng);
      const tau = tauCliqueTransversal(g);
      const rhs = n - h;
      const gap = tau - rhs;
      if (gap > worstGap) {
        worstGap = gap;
        witness = { n, p, sample: s, tau, n_minus_h_n: rhs, gap_tau_minus_n_minus_h: gap };
      }
    }
  }
  rows.push({ n, H_n_exact: h, worst_gap_observed: worstGap, witness });
}

const out = {
  problem: 'EP-151',
  script: path.basename(process.argv[1]),
  method: 'exact_small_n_h_n_plus_random_tau_search',
  params: { N_LIST, SAMPLES, P_LIST, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
