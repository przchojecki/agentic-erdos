#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sievePrime(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= n; i += 1) if (isPrime[i]) for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
  const primes = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) primes.push(i);
  return { isPrime, primes };
}

const N = Number(process.env.N || 300000);
const X_LIST = (process.env.X_LIST || '200,500,1000,2000,5000,10000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const { isPrime, primes } = sievePrime(N);
const pi = new Uint32Array(N + 1);
for (let i = 1; i <= N; i += 1) pi[i] = pi[i - 1] + (isPrime[i] ? 1 : 0);

const rows = [];
for (const X of X_LIST) {
  let bestN = null;
  let bestCnt = -1;
  for (let n = X + 2; n <= N; n += 1) {
    let c = 0;
    for (let a = 1; a <= X; a += 1) if (isPrime[n - a]) c += 1;
    if (c > bestCnt) {
      bestCnt = c;
      bestN = n;
    }
  }
  const pix = pi[X];
  rows.push({
    X,
    pi_X: pix,
    best_n_in_scan: bestN,
    best_count_AcapX: bestCnt,
    best_ratio_over_piX: Number((bestCnt / pix).toPrecision(8)),
    best_ratio_over_X: Number((bestCnt / X).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-428',
  script: path.basename(process.argv[1]),
  method: 'finite_best_shift_profile_for_prime_difference_sets',
  params: { N, X_LIST },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
