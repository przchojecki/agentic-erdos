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

function shuffle(a, rng) {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
}

function hopcroftKarp(adj, nLeft, nRight) {
  const INF = 1 << 30;
  const pairU = new Int32Array(nLeft).fill(-1);
  const pairV = new Int32Array(nRight).fill(-1);
  const dist = new Int32Array(nLeft);

  function bfs() {
    const q = [];
    for (let u = 0; u < nLeft; u += 1) {
      if (pairU[u] === -1) {
        dist[u] = 0;
        q.push(u);
      } else dist[u] = INF;
    }
    let found = false;
    for (let qi = 0; qi < q.length; qi += 1) {
      const u = q[qi];
      for (const v of adj[u]) {
        const u2 = pairV[v];
        if (u2 === -1) found = true;
        else if (dist[u2] === INF) {
          dist[u2] = dist[u] + 1;
          q.push(u2);
        }
      }
    }
    return found;
  }

  function dfs(u) {
    for (const v of adj[u]) {
      const u2 = pairV[v];
      if (u2 === -1 || (dist[u2] === dist[u] + 1 && dfs(u2))) {
        pairU[u] = v;
        pairV[v] = u;
        return true;
      }
    }
    dist[u] = INF;
    return false;
  }

  let matching = 0;
  while (bfs()) {
    for (let u = 0; u < nLeft; u += 1) {
      if (pairU[u] === -1 && dfs(u)) matching += 1;
    }
  }
  return matching;
}

function windowMatching(A, start, N) {
  const L = start;
  const R = start + 2 * N - 1;
  const Bvals = [];
  for (let b = L; b <= R; b += 1) Bvals.push(b);

  const adj = [];
  for (let i = 0; i < A.length; i += 1) {
    const a = A[i];
    const row = [];
    const first = Math.ceil(L / a) * a;
    for (let b = first; b <= R; b += a) row.push(b - L);
    adj.push(row);
  }
  return hopcroftKarp(adj, A.length, Bvals.length);
}

function scoreA(A, N, sampleWindows) {
  let best = Infinity;
  for (let s = 1; s <= sampleWindows; s += 1) {
    const mm = windowMatching(A, s, N);
    if (mm < best) best = mm;
  }
  return best;
}

function randomA(N, m, rng) {
  const arr = Array.from({ length: N }, (_, i) => i + 1);
  shuffle(arr, rng);
  return arr.slice(0, m).sort((a, b) => a - b);
}

function optimizeA(N, m, rng, restarts, steps) {
  let bestA = null;
  let best = -1;
  const sampleWindows = Math.min(4 * N, 1400);
  for (let r = 0; r < restarts; r += 1) {
    const A = randomA(N, m, rng);
    let cur = scoreA(A, N, sampleWindows);
    if (cur > best) {
      best = cur;
      bestA = A.slice();
    }
    for (let it = 0; it < steps; it += 1) {
      const pos = Math.floor(rng() * m);
      const used = new Set(A);
      let cand = 1 + Math.floor(rng() * N);
      let tries = 0;
      while (used.has(cand) && tries < 20) {
        cand = 1 + Math.floor(rng() * N);
        tries += 1;
      }
      if (used.has(cand)) continue;
      const old = A[pos];
      A[pos] = cand;
      A.sort((a, b) => a - b);
      const nxt = scoreA(A, N, sampleWindows);
      if (nxt >= cur || rng() < 0.002) {
        cur = nxt;
        if (cur > best) {
          best = cur;
          bestA = A.slice();
        }
      } else {
        A[pos] = old;
        A.sort((a, b) => a - b);
      }
    }
  }
  return { best, bestA, sampleWindows };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 650);
const rows = [];

for (const [N, m, restarts, steps] of [
  [160, 16, 16, 160],
  [240, 24, 12, 140],
  [320, 32, 10, 120],
  [400, 40, 8, 100],
  [600, 50, 6, 90],
]) {
  const res = optimizeA(N, m, rng, restarts, steps);
  rows.push({
    N,
    m,
    restarts,
    steps,
    sampled_window_count: res.sampleWindows,
    best_min_distinct_divisible_hits_over_sampled_windows: res.best,
    ratio_over_sqrt_m: Number((res.best / Math.sqrt(m)).toPrecision(8)),
    ratio_over_m: Number((res.best / m).toPrecision(8)),
    witness_prefix: res.bestA.slice(0, 20),
  });
}

const out = {
  problem: 'EP-650',
  script: path.basename(process.argv[1]),
  method: 'window_bipartite_matching_proxy_for_distinct_divisible_hits_with_local_search_over_A',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
