#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function sievePrimes(n) {
  const isPrime = new Uint8Array(n + 1).fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let p = 2; p * p <= n; p += 1) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= n; m += p) isPrime[m] = 0;
  }
  const out = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) out.push(i);
  return out;
}

function vpFact(n, p) {
  let s = 0;
  while (n > 0) {
    n = Math.floor(n / p);
    s += n;
  }
  return s;
}

function logUSmallPrimePart(n, k, primes) {
  let s = 0;
  for (const p of primes) {
    if (p > k) break;
    const e = vpFact(n, p) - vpFact(k, p) - vpFact(n - k, p);
    if (e > 0) s += e * Math.log(p);
  }
  return s;
}

const t0 = Date.now();
const NMAX = 2400;
const primes = sievePrimes(NMAX);
const rows = [];

for (const n of [120, 180, 240, 320, 420, 560, 720, 900, 1200, 1600, 2000, 2400]) {
  const target = 2 * Math.log(n);
  let f = -1;
  let bestLogU = -1;
  for (let k = 2; k <= Math.floor(n / 2); k += 1) {
    const lu = logUSmallPrimePart(n, k, primes);
    if (lu > bestLogU) bestLogU = lu;
    if (lu > target) {
      f = k;
      break;
    }
  }
  rows.push({
    n,
    f_n_first_k_with_u_gt_n2: f,
    found: f > 0,
    f_over_log_n: f > 0 ? Number((f / Math.log(n)).toPrecision(8)) : null,
    max_log_u_over_2logn_in_scanned_k: Number((bestLogU / target).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-684',
  script: path.basename(process.argv[1]),
  method: 'prime_exponent_scan_for_first_k_where_small_prime_part_of_binomial_exceeds_n2',
  params: { NMAX },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
