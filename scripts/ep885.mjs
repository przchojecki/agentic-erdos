#!/usr/bin/env node
import fs from 'fs';

const OUT = process.env.OUT || 'data/ep885_standalone_deeper.json';
const N = 120000;
const K_LIST = [2, 3, 4, 5, 6];
const MAX_DIFFS = 400;
const TIME_LIMIT_MS = 12000;

function intersectSortedArrays(a, b) {
  let i = 0, j = 0;
  const out = [];
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { out.push(a[i]); i += 1; j += 1; }
    else if (a[i] < b[j]) i += 1;
    else j += 1;
  }
  return out;
}

const t0 = Date.now();
const diffToNs = new Map();
for (let n = 1; n <= N; n += 1) {
  const s = new Set();
  const lim = Math.floor(Math.sqrt(n));
  for (let a = 1; a <= lim; a += 1) {
    if (n % a !== 0) continue;
    const b = Math.floor(n / a);
    s.add(Math.abs(b - a));
  }
  for (const d of s) {
    let arr = diffToNs.get(d);
    if (!arr) {
      arr = [];
      diffToNs.set(d, arr);
    }
    arr.push(n);
  }
}

function findWitness(k) {
  const cands = [];
  for (const [d, ns] of diffToNs.entries()) if (ns.length >= k) cands.push({ d, ns });
  cands.sort((a, b) => b.ns.length - a.ns.length || a.d - b.d);
  const arr = cands.slice(0, MAX_DIFFS);

  let answer = null;
  const st = Date.now();
  function dfs(start, depth, curNs, chosen) {
    if (Date.now() - st > TIME_LIMIT_MS) return;
    if (depth === k) {
      if (curNs.length >= k) {
        answer = {
          k,
          common_differences: chosen.slice(),
          witness_N_values: curNs.slice(0, k),
          support_size: curNs.length,
        };
      }
      return;
    }
    for (let i = start; i < arr.length; i += 1) {
      if (arr.length - i < k - depth) break;
      const nextNs = curNs === null ? arr[i].ns : intersectSortedArrays(curNs, arr[i].ns);
      if (nextNs.length < k) continue;
      chosen.push(arr[i].d);
      dfs(i + 1, depth + 1, nextNs, chosen);
      chosen.pop();
      if (answer) return;
    }
  }
  dfs(0, 0, null, []);
  return {
    k,
    found: !!answer,
    witness: answer,
    top_diff_supports: arr.slice(0, 15).map((x) => ({ d: x.d, support: x.ns.length })),
    elapsed_ms: Date.now() - st,
    hit_time_limit: Date.now() - st > TIME_LIMIT_MS - 5,
  };
}

const rows = K_LIST.map((k) => findWitness(k));
const out = {
  problem: 'EP-885',
  script: 'ep885.mjs',
  method: 'deeper_finite_search_for_common_factor_difference_intersections',
  params: { N, K_LIST, MAX_DIFFS, TIME_LIMIT_MS },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
