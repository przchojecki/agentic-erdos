#!/usr/bin/env node
import fs from 'fs';

// EP-852: finite profile of h(x), longest run of pairwise-distinct consecutive prime gaps.
const OUT = process.env.OUT || 'data/ep852_standalone_deeper.json';
const PRIME_LIMIT = 20_000_000;
const CHECKPOINTS = [1000, 5000, 10000, 50000, 100000, 200000, 400000, 800000, 1200000];

function sieve(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1, 2);
  for (let p = 2; p * p <= limit; p += 1) {
    if (!isPrime[p]) continue;
    for (let q = p * p; q <= limit; q += p) isPrime[q] = 0;
  }
  const primes = [];
  for (let i = 2; i <= limit; i += 1) if (isPrime[i]) primes.push(i);
  return primes;
}

function longestDistinctRun(arr, m) {
  const last = new Map();
  let l = 0;
  let best = 0;
  for (let r = 0; r < m; r += 1) {
    const v = arr[r];
    const prev = last.get(v);
    if (prev !== undefined && prev >= l) l = prev + 1;
    last.set(v, r);
    const len = r - l + 1;
    if (len > best) best = len;
  }
  return best;
}

const t0 = Date.now();
const primes = sieve(PRIME_LIMIT);
const gaps = [];
for (let i = 1; i < primes.length; i += 1) gaps.push(primes[i] - primes[i - 1]);

const rows = [];
for (const x of CHECKPOINTS) {
  if (x >= gaps.length) break;
  const h = longestDistinctRun(gaps, x);
  rows.push({
    x_index: x,
    h_of_x: h,
    h_over_log_x: Number((h / Math.log(x)).toPrecision(8)),
    h_over_sqrt_log_x: Number((h / Math.sqrt(Math.log(x))).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-852',
  script: 'ep852.mjs',
  method: 'prime_gap_distinct_run_profile',
  params: { PRIME_LIMIT, CHECKPOINTS },
  primes_count: primes.length,
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
