#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x > 0)
    .sort((a, b) => a - b);
  return out.length ? out : fallback;
}

function isSquareInt(n) {
  const r = Math.floor(Math.sqrt(n));
  return r * r === n;
}

function sievePrimes(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1, 2);
  for (let p = 2; p * p <= limit; p += 1) {
    if (!isPrime[p]) continue;
    for (let q = p * p; q <= limit; q += p) isPrime[q] = 0;
  }
  const out = [];
  for (let x = 2; x <= limit; x += 1) if (isPrime[x]) out.push(x);
  return out;
}

function isPowerfulByTrial(n, primes) {
  let x = n;
  for (let i = 0; i < primes.length; i += 1) {
    const p = primes[i];
    if (p * p > x) break;
    if (x % p !== 0) continue;
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    if (e === 1) return false;
  }
  // leftover prime factor contributes exponent 1
  if (x > 1) return false;
  return true;
}

function buildPowerful(limit, primes) {
  const powerful = new Uint8Array(limit + 2);
  powerful[1] = 1;
  for (let n = 2; n <= limit + 1; n += 1) {
    powerful[n] = isPowerfulByTrial(n, primes) ? 1 : 0;
  }
  return powerful;
}

const LIMIT = Number(process.env.LIMIT || 200000000);
const MILESTONES = parseIntList(process.env.MILESTONES, [1000000, 5000000, 10000000, 25000000, 50000000, 100000000, 150000000, 200000000]);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const primes = sievePrimes(Math.floor(Math.sqrt(LIMIT + 1)) + 1);
const powerful = buildPowerful(LIMIT, primes);

const mset = new Set(MILESTONES);
const rows = [];
let countPairs = 0;
let countBothNonSquare = 0;
const firstPairs = [];
const firstBothNonSquare = [];

for (let n = 1; n <= LIMIT; n += 1) {
  if (powerful[n] && powerful[n + 1]) {
    countPairs += 1;
    const nonSquare = !isSquareInt(n) && !isSquareInt(n + 1);
    if (nonSquare) {
      countBothNonSquare += 1;
      if (firstBothNonSquare.length < 20) firstBothNonSquare.push(n);
    }
    if (firstPairs.length < 40) firstPairs.push(n);
  }
  if (mset.has(n)) {
    const ln = Math.log(n);
    rows.push({
      X: n,
      pair_count_up_to_X: countPairs,
      both_non_square_count_up_to_X: countBothNonSquare,
      pair_count_over_log2: Number((countPairs / (ln * ln)).toFixed(8)),
    });
  }
}

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-365',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_spf_scan_for_consecutive_powerful_pairs',
  params: { LIMIT, MILESTONES },
  first_pair_starts: firstPairs,
  first_both_non_square_pair_starts: firstBothNonSquare,
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
