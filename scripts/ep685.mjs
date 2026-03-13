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

function omegaBinom(n, k, primes) {
  let c = 0;
  for (const p of primes) {
    if (p > n) break;
    const e = vpFact(n, p) - vpFact(k, p) - vpFact(n - k, p);
    if (e > 0) c += 1;
  }
  return c;
}

function harmonicPrimeRange(k, n, primes) {
  let s = 0;
  for (const p of primes) {
    if (p <= k) continue;
    if (p >= n) break;
    s += 1 / p;
  }
  return s;
}

const t0 = Date.now();
const NMAX = 8000;
const primes = sievePrimes(NMAX);
const rows = [];

for (const n of [1200, 1800, 2500, 3200, 5000, 8000]) {
  const epsK = Math.ceil(Math.pow(n, 0.25));
  const ks = [];
  for (let k = epsK; k <= Math.floor(Math.pow(n, 0.8)); k = Math.floor(k * 1.22) + 1) ks.push(k);

  for (const k of ks) {
    const om = omegaBinom(n, k, primes);
    const pred = k * harmonicPrimeRange(k, n, primes);
    rows.push({
      n,
      k,
      omega_binom_n_k: om,
      heuristic_k_sum_1_over_primes_k_to_n: Number(pred.toPrecision(8)),
      ratio_omega_over_heuristic: pred > 0 ? Number((om / pred).toPrecision(8)) : null,
      baseline_log_binom_over_log_n_proxy: Number(((k * Math.log(n / Math.max(1, k))) / Math.log(n)).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-685',
  script: path.basename(process.argv[1]),
  method: 'prime_exponent_count_scan_for_distinct_prime_divisors_of_binomial_coefficients',
  params: { NMAX },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
