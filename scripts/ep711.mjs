#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_LIST = (process.env.N_LIST || '20,30,40,50').split(',').map((x) => Number(x.trim())).filter(Boolean);
const M_SPAN = Number(process.env.M_SPAN || 800);

function hopcroftKarp(adj) {
  const nL = adj.length;
  const nR = Math.max(...adj.flat(), -1) + 1;
  const pairU = Array(nL).fill(-1);
  const pairV = Array(nR).fill(-1);
  const dist = Array(nL).fill(0);

  function bfs() {
    const q = [];
    for (let u = 0; u < nL; u += 1) {
      if (pairU[u] === -1) {
        dist[u] = 0;
        q.push(u);
      } else dist[u] = -1;
    }
    let found = false;
    for (let i = 0; i < q.length; i += 1) {
      const u = q[i];
      for (const v of adj[u]) {
        const u2 = pairV[v];
        if (u2 >= 0 && dist[u2] < 0) {
          dist[u2] = dist[u] + 1;
          q.push(u2);
        }
        if (u2 === -1) found = true;
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
    dist[u] = -1;
    return false;
  }

  let matching = 0;
  while (bfs()) {
    for (let u = 0; u < nL; u += 1) if (pairU[u] === -1 && dfs(u)) matching += 1;
  }
  return matching;
}

function hasFeasible(n, m, L) {
  const adj = Array.from({ length: n }, () => []);
  for (let k = 1; k <= n; k += 1) {
    for (let t = m + 1; t <= m + L; t += 1) if (t % k === 0) adj[k - 1].push(t - (m + 1));
    if (!adj[k - 1].length) return false;
  }
  return hopcroftKarp(adj) === n;
}

function fnm(n, m) {
  let lo = n;
  let hi = 4 * n;
  while (!hasFeasible(n, m, hi)) hi *= 2;
  while (lo < hi) {
    const mid = Math.floor((lo + hi) / 2);
    if (hasFeasible(n, m, mid)) hi = mid;
    else lo = mid + 1;
  }
  return lo;
}

const t0 = Date.now();
const rows = [];

for (const n of N_LIST) {
  const base = fnm(n, n);
  let best = base;
  let bestM = n;
  for (let m = n; m <= n + M_SPAN; m += 1) {
    const v = fnm(n, m);
    if (v > best) {
      best = v;
      bestM = m;
    }
  }
  rows.push({
    n,
    m_span: M_SPAN,
    f_n_n: base,
    sampled_max_f_n_m: best,
    argmax_m_sampled: bestM,
    sampled_gap_max_minus_f_n_n: best - base,
    sampled_ratio_max_over_n: Number((best / n).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-711',
  script: path.basename(process.argv[1]),
  method: 'exact_matching_scan_for_f_n_m_over_wider_m_ranges',
  params: { N_LIST, M_SPAN },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
