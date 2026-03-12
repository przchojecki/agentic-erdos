#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieve(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1);
  isPrime[0] = isPrime[1] = 0;
  for (let i = 2; i * i <= n; i += 1) if (isPrime[i]) for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
  const ps = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) ps.push(i);
  return ps;
}

function isPSmooth(n, p, primes) {
  let x = n;
  for (const q of primes) {
    if (q > p) break;
    if (q * q > x) break;
    while (x % q === 0) x = Math.floor(x / q);
  }
  // if remaining factor > 1, then it is either <=p prime (allowed) or >p (not allowed)
  return x <= p;
}

const PMAX = Number(process.env.PMAX || 80000);
const K_LIST = (process.env.K_LIST || '1,2,3,4,5,6').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const primes = sieve(PMAX + 50);
const primeList = primes.filter((p) => p <= PMAX);
const rows = [];

for (const k of K_LIST) {
  let count = 0;
  const hits = [];
  for (const p of primeList) {
    let ok = true;
    const pp = p * p;
    for (let i = 1; i <= k; i += 1) {
      if (!isPSmooth(pp + i, p, primes)) {
        ok = false;
        break;
      }
    }
    if (ok) {
      count += 1;
      if (hits.length < 30) hits.push(p);
    }
  }
  rows.push({ k, pmax: PMAX, witness_count_up_to_pmax: count, first_witness_primes: hits });
}

const out = {
  problem: 'EP-383',
  script: path.basename(process.argv[1]),
  method: 'prime_parameter_search_for_largest_prime_factor_condition',
  params: { PMAX, K_LIST },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
