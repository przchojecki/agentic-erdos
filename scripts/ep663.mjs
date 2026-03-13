#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function sieve(n) {
  const isPrime = new Uint8Array(n + 1).fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let p = 2; p * p <= n; p += 1) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= n; m += p) isPrime[m] = 0;
  }
  const primes = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) primes.push(i);
  return primes;
}

function leastPrimeNotDividingRun(n, k, primes) {
  for (const p of primes) {
    let dividesSome = false;
    for (let i = 1; i <= k; i += 1) {
      if ((n + i) % p === 0) {
        dividesSome = true;
        break;
      }
    }
    if (!dividesSome) return p;
  }
  return -1;
}

const t0 = Date.now();
const primes = sieve(200000);
const rows = [];

for (const k of [2, 3, 4, 5, 8, 12]) {
  for (const n of [1e4, 3e4, 1e5, 3e5, 1e6]) {
    let maxQ = 0;
    let avgQ = 0;
    const samples = 500;
    for (let t = 0; t < samples; t += 1) {
      const x = Math.floor((n * t) / samples) + n;
      const q = leastPrimeNotDividingRun(x, k, primes);
      if (q > maxQ) maxQ = q;
      avgQ += q;
    }
    avgQ /= samples;
    rows.push({
      k,
      n_base: n,
      samples,
      avg_q: Number(avgQ.toPrecision(8)),
      max_q: maxQ,
      avg_q_over_log_n: Number((avgQ / Math.log(n)).toPrecision(8)),
      max_q_over_log_n: Number((maxQ / Math.log(n)).toPrecision(8)),
      avg_q_over_k_log_n: Number((avgQ / (k * Math.log(n))).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-663',
  script: path.basename(process.argv[1]),
  method: 'sampled_prime_scan_for_least_prime_avoiding_k_consecutive_integers',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
