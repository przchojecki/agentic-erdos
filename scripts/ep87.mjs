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
  let edges = 0;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (rng() < p) {
        adj[i][j] = adj[j][i] = 1;
        edges += 1;
      }
    }
  }
  return { adj, n, edges };
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

function logFallingFactorial(N, v) {
  let s = 0;
  for (let i = 0; i < v; i += 1) s += Math.log(N - i);
  return s;
}

function firstMomentLowerBound(v, e, maxN) {
  // E[# monochromatic copies] <= (N)_v * 2^{1-e}; if E<1 then there exists a coloring avoiding monochromatic G.
  let best = v;
  for (let N = v; N <= maxN; N += 1) {
    const logE = logFallingFactorial(N, v) + (1 - e) * Math.log(2);
    if (logE < 0) best = N;
    else break;
  }
  return best;
}

const K_LIST = (process.env.K_LIST || '4,5').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const N_LIST = (process.env.N_LIST || '8,9,10,11').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const P_LIST = (process.env.P_LIST || '0.35,0.45,0.55').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const SAMPLES = Number(process.env.SAMPLES || 220);
const MAX_N_SCAN = Number(process.env.MAX_N_SCAN || 260);
const SEED = Number(process.env.SEED || 8702026);
const OUT = process.env.OUT || '';

const knownR = new Map([[3, 6], [4, 18], [5, 43]]);
const rng = makeRng(SEED);
const rows = [];

for (const k of K_LIST) {
  let best = null;
  for (const n of N_LIST) {
    for (const p of P_LIST) {
      for (let s = 0; s < SAMPLES; s += 1) {
        const g = randomGraph(n, p, rng);
        const chi = chromaticNumberExact(g.adj);
        if (chi !== k) continue;
        const lb = firstMomentLowerBound(g.n, g.edges, MAX_N_SCAN);
        const row = {
          k,
          n: g.n,
          p,
          sample: s,
          edges: g.edges,
          first_moment_lb_R_G: lb,
          ratio_to_known_Rk: knownR.has(k) ? Number((lb / knownR.get(k)).toFixed(4)) : null,
        };
        if (!best || row.first_moment_lb_R_G > best.first_moment_lb_R_G) best = row;
      }
    }
  }
  rows.push(best || { k, note: 'no sampled graph with exact target chromatic number found' });
}

const out = {
  problem: 'EP-87',
  script: path.basename(process.argv[1]),
  method: 'first_moment_ramsey_lb_scan_over_k_chromatic_samples',
  params: { K_LIST, N_LIST, P_LIST, SAMPLES, MAX_N_SCAN, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
