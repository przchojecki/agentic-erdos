#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function gcd(a, b) {
  while (b !== 0n) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

function M(n, k) {
  let v = 1n;
  for (let i = 1; i <= k; i += 1) v = lcm(v, BigInt(n + i));
  return v;
}

const t0 = Date.now();
const sameKRows = [];
const crossRows = [];

const NMAX = 1600;
const KMAX = 10;

for (let k = 2; k <= KMAX; k += 1) {
  const seen = new Map();
  const hits = [];
  for (let n = 1; n <= NMAX; n += 1) {
    const v = M(n, k).toString();
    if (!seen.has(v)) seen.set(v, []);
    const prev = seen.get(v);
    for (const m0 of prev) {
      const a = Math.min(m0, n);
      const b = Math.max(m0, n);
      if (b >= a + k) hits.push({ k, n: a, m: b, digits: v.length });
    }
    prev.push(n);
  }
  sameKRows.push({
    k,
    n_scan_limit: NMAX,
    same_k_collision_count: hits.length,
    first_10: hits.slice(0, 10),
  });
}

const CROSS_N = 600;
const CROSS_K = 8;
const vals = [];
for (let k = 2; k <= CROSS_K; k += 1) {
  for (let n = 1; n <= CROSS_N; n += 1) vals.push({ n, k, v: M(n, k).toString() });
}
const byV = new Map();
for (const r of vals) {
  if (!byV.has(r.v)) byV.set(r.v, []);
  byV.get(r.v).push(r);
}

const hits = [];
for (const arr of byV.values()) {
  if (arr.length < 2) continue;
  for (let i = 0; i < arr.length; i += 1) {
    for (let j = i + 1; j < arr.length; j += 1) {
      let a = arr[i], b = arr[j];
      if (a.k < b.k) {
        const t = a; a = b; b = t;
      }
      if (b.k >= a.k) continue;
      if (b.n >= a.n + a.k) hits.push({ n: a.n, k: a.k, m: b.n, l: b.k });
    }
  }
}

crossRows.push({
  n_scan_limit: CROSS_N,
  k_scan_limit: CROSS_K,
  cross_k_collision_count: hits.length,
  first_20: hits.slice(0, 20),
});

const out = {
  problem: 'EP-677',
  script: path.basename(process.argv[1]),
  method: 'deeper_finite_collision_scan_for_interval_lcm_values',
  params: { NMAX, KMAX, CROSS_N, CROSS_K },
  same_k_rows: sameKRows,
  cross_k_rows: crossRows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
