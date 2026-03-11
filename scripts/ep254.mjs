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

function setByMode(mode, count, primePool) {
  const A = [];
  if (mode === 'primes') return primePool.slice(0, count);
  if (mode === 'nlogn') {
    for (let n = 2; A.length < count; n += 1) {
      const v = Math.floor(n * Math.log(n));
      if (v > 1 && (A.length === 0 || v > A[A.length - 1])) A.push(v);
    }
    return A;
  }
  if (mode === 'squares') {
    for (let n = 1; A.length < count; n += 1) A.push(n * n);
    return A;
  }
  if (mode === 'near_linear') {
    let cur = 2;
    for (let n = 1; A.length < count; n += 1) {
      cur += 1 + Math.floor(Math.log(Math.max(3, n)));
      A.push(cur);
    }
    return A;
  }
  return A;
}

function subsetSumCoverage(A, maxSum) {
  const can = new Uint8Array(maxSum + 1);
  can[0] = 1;
  for (const a of A) {
    if (a > maxSum) continue;
    for (let s = maxSum; s >= a; s -= 1) if (can[s - a]) can[s] = 1;
  }
  let largestMissing = -1;
  for (let s = 1; s <= maxSum; s += 1) if (!can[s]) largestMissing = s;

  let tailStart = null;
  let okTail = true;
  for (let s = maxSum; s >= 1; s -= 1) {
    if (!can[s]) okTail = false;
    if (okTail) tailStart = s;
  }
  let covered = 0;
  for (let s = 1; s <= maxSum; s += 1) if (can[s]) covered += 1;
  return { maxSum, covered_ratio: Number((covered / maxSum).toFixed(6)), largestMissing, tailStart };
}

const MODES = (process.env.MODES || 'primes,nlogn,squares,near_linear').split(',').map((x) => x.trim()).filter(Boolean);
const COUNT = Number(process.env.COUNT || 140);
const PRIME_LIMIT = Number(process.env.PRIME_LIMIT || 70000);
const MAX_SUM_CAP = Number(process.env.MAX_SUM_CAP || 180000);
const OUT = process.env.OUT || '';

const primes = sieve(PRIME_LIMIT);
const rows = [];
for (const mode of MODES) {
  const A = setByMode(mode, COUNT, primes);
  const sumA = A.reduce((u, v) => u + v, 0);
  const maxSum = Math.min(sumA, MAX_SUM_CAP);
  const cov = subsetSumCoverage(A, maxSum);
  rows.push({
    mode,
    count: A.length,
    first_terms: A.slice(0, 12),
    max_term: A[A.length - 1],
    sum_A: sumA,
    coverage: cov,
  });
}

const out = {
  problem: 'EP-254',
  script: path.basename(process.argv[1]),
  method: 'finite_distinct_subset_sum_tail_coverage_profiles',
  params: { MODES, COUNT, PRIME_LIMIT, MAX_SUM_CAP },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
