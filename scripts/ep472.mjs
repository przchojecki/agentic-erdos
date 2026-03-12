#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sievePrimes(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= n; i += 1) if (isPrime[i]) for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
  const primes = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) primes.push(i);
  return { isPrime, primes };
}

function isPrimeTrial(n, primes) {
  if (n < 2) return false;
  for (const p of primes) {
    if (p * p > n) break;
    if (n % p === 0) return false;
  }
  return true;
}

function runSeed(seed, limitTerms, maxPrime, primes) {
  const q = seed.slice();
  while (q.length < limitTerms) {
    const cur = q[q.length - 1];
    let found = null;
    for (const s of q) {
      const cand = cur + s - 1;
      if (cand > maxPrime) continue;
      if (isPrimeTrial(cand, primes)) {
        if (found === null || cand < found) found = cand;
      }
    }
    if (found === null) return { terminated: true, terms: q.length, last: q[q.length - 1] };
    q.push(found);
  }
  return { terminated: false, terms: q.length, last: q[q.length - 1], last_12: q.slice(-12) };
}

const LIMIT_TERMS = Number(process.env.LIMIT_TERMS || 1500);
const MAXP = Number(process.env.MAXP || 2000000);
const OUT = process.env.OUT || '';

const { primes } = sievePrimes(Math.floor(Math.sqrt(MAXP)) + 1000);
const seeds = [
  [3, 5],
  [3, 7],
  [3, 5, 7],
  [5, 7],
  [3, 11],
  [5, 11],
  [3, 5, 11],
  [3, 5, 13],
  [3, 5, 17],
  [3, 7, 11],
];

const rows = seeds.map((seed) => ({ seed, ...runSeed(seed, LIMIT_TERMS, MAXP, primes) }));

const out = {
  problem: 'EP-472',
  script: path.basename(process.argv[1]),
  method: 'multi_seed_growth_and_termination_profile_for_ulam_prime_recurrence',
  params: { LIMIT_TERMS, MAXP, seed_count: seeds.length },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
