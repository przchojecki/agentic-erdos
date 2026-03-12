#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function powMod2(exp, mod) {
  let base = 2n % BigInt(mod);
  let e = BigInt(exp);
  let m = BigInt(mod);
  let res = 1n;
  while (e > 0n) {
    if (e & 1n) res = (res * base) % m;
    base = (base * base) % m;
    e >>= 1n;
  }
  return Number(res);
}

const N = Number(process.env.N || 2000000);
const K_LIST = (process.env.K_LIST || '-1,2,3,4,5,6,7,8,9,10,11,13').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const rows = [];
for (const k of K_LIST) {
  let first = null;
  let count = 0;
  const firstFew = [];
  for (let n = 2; n <= N; n += 1) {
    const r = powMod2(n, n);
    let kk = ((k % n) + n) % n;
    if (r === kk) {
      count += 1;
      if (first === null) first = n;
      if (firstFew.length < 20) firstFew.push(n);
    }
  }
  rows.push({ k, search_limit_n: N, witness_count: count, first_witness: first, first_20_witnesses: firstFew });
}

const out = {
  problem: 'EP-479',
  script: path.basename(process.argv[1]),
  method: 'deep_modular_witness_scan_for_2pow_n_congruence',
  params: { N, K_LIST },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
