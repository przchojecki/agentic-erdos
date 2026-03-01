#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const N_MAX = Number(process.env.N_MAX || 1000000);

function sievePrimes(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let i = 2; i * i <= n; i++) {
    if (isPrime[i]) {
      for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
    }
  }
  const primes = [];
  for (let i = 2; i <= n; i++) if (isPrime[i]) primes.push(i);
  return primes;
}

const approxPrimeUpper = Math.max(1000, Math.floor(N_MAX * (Math.log(Math.max(3, N_MAX)) + Math.log(Math.log(Math.max(3, N_MAX)))) + 10000));
const primes = sievePrimes(approxPrimeUpper);
const seenEvenGaps = new Set();
const checkpoints = [10000, 30000, 100000, 300000, N_MAX].filter((x, i, a) => x <= N_MAX && a.indexOf(x) === i);
let cpIdx = 0;
const rows = [];

function smallestMissingEven(limit = 10000) {
  for (let t = 2; t <= limit; t += 2) if (!seenEvenGaps.has(t)) return t;
  return limit + 2;
}

for (let i = 0; i + 1 < primes.length && i + 1 <= N_MAX; i++) {
  const p = primes[i];
  const q = primes[i + 1];
  const d = q - p;
  if ((d & 1) === 0) seenEvenGaps.add(d);

  while (cpIdx < checkpoints.length && i + 1 >= checkpoints[cpIdx]) {
    const x = checkpoints[cpIdx]; // index variable in d_n
    const r = smallestMissingEven(20000);
    rows.push({
      x,
      smallest_missing_even_gap_r_x: r,
      r_over_log_x: Number((r / Math.log(x)).toFixed(6)),
      distinct_even_gaps_seen: seenEvenGaps.size,
    });
    cpIdx++;
  }
}

const out = {
  script: path.basename(process.argv[1]),
  n_max: N_MAX,
  checkpoints: rows,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep853_prime_gap_coverage_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, n_max: N_MAX, rows: rows.length }, null, 2));
