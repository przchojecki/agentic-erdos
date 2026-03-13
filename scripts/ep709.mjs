#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_MAX = Number(process.env.N_MAX || 4);
const M_MAX = Number(process.env.M_MAX || 24);
const CAND_FACTOR_MAX = Number(process.env.CAND_FACTOR_MAX || 6);

function combinations(arr, k, start = 0, cur = [], out = []) {
  if (cur.length === k) {
    out.push(cur.slice());
    return out;
  }
  for (let i = start; i <= arr.length - (k - cur.length); i += 1) {
    cur.push(arr[i]);
    combinations(arr, k, i + 1, cur, out);
    cur.pop();
  }
  return out;
}

function hasDistinctAssignment(A, start, L) {
  const slots = Array.from({ length: L }, (_, i) => start + i);
  const n = A.length;
  const adj = A.map((a) => slots.map((x, idx) => (x % a === 0 ? idx : -1)).filter((x) => x >= 0));
  if (adj.some((v) => v.length === 0)) return false;

  // DFS bipartite matching (small instances).
  const matchR = Array(L).fill(-1);
  function dfs(u, seen) {
    for (const v of adj[u]) {
      if (seen[v]) continue;
      seen[v] = true;
      if (matchR[v] === -1 || dfs(matchR[v], seen)) {
        matchR[v] = u;
        return true;
      }
    }
    return false;
  }
  let m = 0;
  for (let u = 0; u < n; u += 1) {
    const seen = Array(L).fill(false);
    if (dfs(u, seen)) m += 1;
  }
  return m === n;
}

function worksForSet(A, c) {
  const M = Math.max(...A);
  const L = c * M;
  const startMax = 4 * M;
  for (let s = 1; s <= startMax; s += 1) {
    if (!hasDistinctAssignment(A, s, L)) return false;
  }
  return true;
}

function finiteFnEstimate(n, mMax, cMax) {
  const arr = Array.from({ length: mMax }, (_, i) => i + 1);
  const sets = combinations(arr, n).filter((A) => Math.max(...A) === A[A.length - 1]);
  let bestC = 1;
  let witness = null;

  for (const A of sets) {
    let local = null;
    for (let c = 1; c <= cMax; c += 1) {
      if (worksForSet(A, c)) {
        local = c;
        break;
      }
    }
    if (local == null) local = cMax + 1;
    if (local > bestC) {
      bestC = local;
      witness = A.slice();
    }
  }

  return { n, tested_sets: sets.length, finite_estimated_f_n: bestC, witness_set: witness };
}

const t0 = Date.now();
const rows = [];
for (let n = 2; n <= N_MAX; n += 1) rows.push(finiteFnEstimate(n, M_MAX, CAND_FACTOR_MAX));

const out = {
  problem: 'EP-709',
  script: path.basename(process.argv[1]),
  method: 'finite_exhaustive_small_n_estimation_via_distinct_multiples_matching',
  warning: 'This computes finite-range estimates only; not asymptotic f(n).',
  params: { N_MAX, M_MAX, CAND_FACTOR_MAX },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
