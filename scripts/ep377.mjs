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

function noCarryDoubleInBase(n, b) {
  let x = n;
  while (x > 0) {
    if ((x % b) * 2 >= b) return false;
    x = Math.floor(x / b);
  }
  return true;
}

const N = Number(process.env.N || 50000);
const MILESTONES = (process.env.MILESTONES || '1000,5000,10000,20000,30000,40000,50000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const primes = sieve(N);
const mset = new Set(MILESTONES);
const rows = [];
let sumAll = 0;
let maxF = -1;
let argMax = -1;

for (let n = 1; n <= N; n += 1) {
  let f = 0;
  for (const p of primes) {
    if (p > n) break;
    if (noCarryDoubleInBase(n, p)) f += 1 / p;
  }
  sumAll += f;
  if (f > maxF) {
    maxF = f;
    argMax = n;
  }
  if (mset.has(n)) rows.push({ X: n, avg_f_up_to_X: Number((sumAll / n).toPrecision(8)), max_f_up_to_X: Number(maxF.toPrecision(8)), argmax_n_up_to_X: argMax });
}

const out = {
  problem: 'EP-377',
  script: path.basename(process.argv[1]),
  method: 'extended_profile_of_harmonic_prime_sum_nondividing_central_binomial',
  params: { N, MILESTONES },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
