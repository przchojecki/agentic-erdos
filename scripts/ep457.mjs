#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sievePrimes(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= n; i += 1) if (isPrime[i]) for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
  const primes = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) primes.push(i);
  return primes;
}

function leastMissingPrime(n, k, primes, bound) {
  for (const p of primes) {
    if (p > bound) break;
    if (p <= k) continue; // must divide product
    const r = n % p;
    if (r <= p - k - 1) return p;
  }
  return null;
}

const N = Number(process.env.N || 2000000);
const CBOUND = Number(process.env.CBOUND || 6);
const OUT = process.env.OUT || '';
const MILESTONES = (process.env.MILESTONES || '100000,300000,500000,1000000,1500000,2000000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);

const maxLog = Math.log(N);
const pBound = Math.ceil(CBOUND * maxLog * maxLog + 200);
const primes = sievePrimes(pBound);

let maxRatio = 0;
let argMax = null;
let countAbove2 = 0;
let countAbove205 = 0;
let checked = 0;
const rows = [];

for (let n = 3; n <= N; n += 1) {
  const k = Math.max(1, Math.floor(Math.log(n)));
  const q = leastMissingPrime(n, k, primes, Math.ceil(CBOUND * Math.log(n) * Math.log(n) + 50));
  if (q === null) continue;
  checked += 1;
  const ratio = q / Math.log(n);
  if (ratio > maxRatio) {
    maxRatio = ratio;
    argMax = { n, k, q, ratio: Number(ratio.toPrecision(8)) };
  }
  if (ratio >= 2) countAbove2 += 1;
  if (ratio >= 2.05) countAbove205 += 1;

  if (MILESTONES.includes(n)) {
    rows.push({
      n,
      checked_up_to_n: checked,
      max_q_over_logn_so_far: Number(maxRatio.toPrecision(8)),
      density_ratio_ge_2: Number((countAbove2 / checked).toPrecision(8)),
      density_ratio_ge_2_05: Number((countAbove205 / checked).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-457',
  script: path.basename(process.argv[1]),
  method: 'deep_profile_for_least_missing_prime_q_n_logn',
  params: { N, CBOUND, pBound, MILESTONES },
  argmax_q_over_logn: argMax,
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
