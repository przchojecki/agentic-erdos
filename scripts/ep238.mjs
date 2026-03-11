#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieve(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1);
  isPrime[0] = isPrime[1] = 0;
  for (let i = 2; i * i <= limit; i += 1) if (isPrime[i]) for (let j = i * i; j <= limit; j += i) isPrime[j] = 0;
  const p = [];
  for (let i = 2; i <= limit; i += 1) if (isPrime[i]) p.push(i);
  return p;
}

function runsWithGapGT(primes, c2) {
  if (primes.length === 0) return [];
  const runs = [];
  let cur = 1;
  for (let i = 0; i + 1 < primes.length; i += 1) {
    const g = primes[i + 1] - primes[i];
    if (g > c2) cur += 1;
    else {
      runs.push(cur);
      cur = 1;
    }
  }
  runs.push(cur);
  return runs;
}

const X_LIST = (process.env.X_LIST || '200000,500000,1000000,2000000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const C1_LIST = (process.env.C1_LIST || '0.2,0.4,0.6').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const C2_LIST = (process.env.C2_LIST || '2,4,6,10').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const maxX = Math.max(...X_LIST);
const allPrimes = sieve(maxX + 100);
const rows = [];
for (const x of X_LIST) {
  const ps = allPrimes.filter((p) => p <= x);
  for (const c2 of C2_LIST) {
    const runs = runsWithGapGT(ps, c2);
    const maxRun = runs.reduce((a, b) => Math.max(a, b), 0);
    const rec = { x, primes_up_to_x: ps.length, c2, max_run_len: maxRun, counts_over_c1_logx: {} };
    for (const c1 of C1_LIST) {
      const th = c1 * Math.log(x);
      const cnt = runs.filter((r) => r > th).length;
      rec.counts_over_c1_logx[`c1_${c1}`] = { threshold: Number(th.toFixed(4)), run_count: cnt };
    }
    rows.push(rec);
  }
}

const out = {
  problem: 'EP-238',
  script: path.basename(process.argv[1]),
  method: 'large_prime_gap_run_statistics',
  params: { X_LIST, C1_LIST, C2_LIST },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
