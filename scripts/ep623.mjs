#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function subsetsOf(setArr) {
  const out = [];
  const n = setArr.length;
  for (let mask = 0; mask < (1 << n); mask += 1) {
    const sub = [];
    for (let i = 0; i < n; i += 1) if ((mask >> i) & 1) sub.push(setArr[i]);
    out.push(sub);
  }
  return out;
}

function randomSetMapping(n, rng) {
  const all = Array.from({ length: n }, (_, i) => i);
  const map = new Map();
  const subs = subsetsOf(all);
  for (const A of subs) {
    const key = A.join(',');
    const ban = new Set(A);
    const choices = all.filter((x) => !ban.has(x));
    const v = choices[Math.floor(rng() * choices.length)];
    map.set(key, v);
  }
  return map;
}

function isIndependentSubset(Y, map) {
  const subs = subsetsOf(Y);
  const Yset = new Set(Y);
  for (const B of subs) {
    const v = map.get(B.join(','));
    if (Yset.has(v)) return false;
  }
  return true;
}

function maxIndependentSize(n, map) {
  const all = Array.from({ length: n }, (_, i) => i);
  let best = 0;
  for (let mask = 0; mask < (1 << n); mask += 1) {
    let sz = 0;
    const Y = [];
    for (let i = 0; i < n; i += 1) if ((mask >> i) & 1) { sz += 1; Y.push(all[i]); }
    if (sz <= best) continue;
    if (isIndependentSubset(Y, map)) best = sz;
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 623);
const rows = [];

for (const [n, trials] of [[9, 120], [10, 100], [11, 70], [12, 50]]) {
  let best = 0;
  let worst = n;
  let sum = 0;
  for (let t = 0; t < trials; t += 1) {
    const map = randomSetMapping(n, rng);
    const mx = maxIndependentSize(n, map);
    if (mx > best) best = mx;
    if (mx < worst) worst = mx;
    sum += mx;
  }
  rows.push({
    n,
    trials,
    max_independent_size_best: best,
    max_independent_size_worst: worst,
    max_independent_size_avg: Number((sum / trials).toPrecision(8)),
    avg_over_log2_n: Number(((sum / trials) / Math.log2(n)).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-623',
  script: path.basename(process.argv[1]),
  method: 'finite_set_mapping_independence_proxy_exact_max_independent_subset_size',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
