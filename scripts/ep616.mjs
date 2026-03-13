#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function combs(arr, k) {
  const out = [];
  const cur = [];
  function dfs(i, left) {
    if (left === 0) { out.push(cur.slice()); return; }
    for (let j = i; j <= arr.length - left; j += 1) {
      cur.push(arr[j]); dfs(j + 1, left - 1); cur.pop();
    }
  }
  dfs(0, k);
  return out;
}

function randomRUniformHypergraph(n, r, m, rng) {
  const verts = Array.from({ length: n }, (_, i) => i);
  const edges = [];
  const used = new Set();
  let tries = 0;
  while (edges.length < m && tries < 500000) {
    tries += 1;
    const v = verts.slice();
    for (let i = v.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const t = v[i]; v[i] = v[j]; v[j] = t;
    }
    const e = v.slice(0, r).sort((a, b) => a - b);
    const k = e.join(',');
    if (used.has(k)) continue;
    used.add(k);
    edges.push(e);
  }
  return edges;
}

function tauExactOnUniverse(U, edgesInU) {
  if (edgesInU.length === 0) return 0;
  for (let k = 1; k <= U.length; k += 1) {
    const subs = combs(U, k);
    for (const S of subs) {
      const H = new Set(S);
      let ok = true;
      for (const e of edgesInU) {
        if (!e.some((x) => H.has(x))) { ok = false; break; }
      }
      if (ok) return k;
    }
  }
  return U.length;
}

function localTauLeKProperty(n, r, edges, kLocal) {
  const maxU = 3 * r - 3;
  const verts = Array.from({ length: n }, (_, i) => i);
  for (let sz = r; sz <= Math.min(maxU, n); sz += 1) {
    const subs = combs(verts, sz);
    for (const U of subs) {
      const inU = edges.filter((e) => e.every((x) => U.includes(x)));
      if (inU.length <= 1) continue;
      const tau = tauExactOnUniverse(U, inU);
      if (tau > kLocal) return false;
    }
  }
  return true;
}

function tauExact(n, edges) {
  const U = Array.from({ length: n }, (_, i) => i);
  return tauExactOnUniverse(U, edges);
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 616);
const rows = [];

for (const [r, n, m, trials] of [[3, 10, 12, 180], [3, 11, 14, 150], [4, 12, 16, 120]]) {
  let accepted = 0;
  let bestTau = 0;
  let sumTau = 0;
  for (let t = 0; t < trials; t += 1) {
    const E = randomRUniformHypergraph(n, r, m, rng);
    if (E.length < m) continue;
    if (!localTauLeKProperty(n, r, E, 2)) continue;
    accepted += 1;
    const tau = tauExact(n, E);
    sumTau += tau;
    if (tau > bestTau) bestTau = tau;
  }
  rows.push({
    r,
    n,
    target_edges_m: m,
    trials,
    accepted_local_tau_le_2_instances: accepted,
    max_tau_over_accepted: accepted ? bestTau : null,
    avg_tau_over_accepted: accepted ? Number((sumTau / accepted).toPrecision(8)) : null,
    max_tau_over_r: accepted ? Number((bestTau / r).toPrecision(8)) : null,
  });
}

const out = {
  problem: 'EP-616',
  script: path.basename(process.argv[1]),
  method: 'exact_small_n_hypergraph_search_under_local_tau_le_2_proxy',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
