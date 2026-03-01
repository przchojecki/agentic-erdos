#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieve(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let p = 2; p * p <= n; p += 1) {
    if (!isPrime[p]) continue;
    for (let q = p * p; q <= n; q += p) isPrime[q] = 0;
  }
  const primes = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) primes.push(i);
  return primes;
}

function hasRepresentationPrime(n, primes) {
  const lim = Math.floor(Math.sqrt(n));
  for (const p of primes) {
    if (p > lim) break;
    if (n % (p * p) < p) return true;
  }
  return false;
}

function hasRepresentationAnyM(n) {
  const lim = Math.floor(Math.sqrt(n));
  for (let m = 2; m <= lim; m += 1) {
    if (n % (m * m) < m) return true;
  }
  return false;
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep676_representation_scan.json');

const X = Number(process.argv[2] || 1200000);
const Xany = Number(process.argv[3] || 250000);

const primes = sieve(Math.floor(Math.sqrt(X)) + 20);

const excPrime = [];
const checkpoints = [];
for (let n = 2; n <= X; n += 1) {
  if (!hasRepresentationPrime(n, primes)) excPrime.push(n);
  if (n % 100000 === 0) {
    checkpoints.push({ n, exception_count_prime_condition: excPrime.length });
    process.stderr.write(`n=${n}, excPrime=${excPrime.length}\n`);
  }
}

const excAny = [];
for (let n = 2; n <= Xany; n += 1) {
  if (!hasRepresentationAnyM(n)) excAny.push(n);
}

const out = {
  problem: 'EP-676',
  method: 'direct_modular_condition_scan_for_n_eq_a*p^2_plus_b_with_0<=b<p',
  params: { X, Xany },
  prime_condition: {
    exception_count: excPrime.length,
    first_exceptions: excPrime.slice(0, 120),
    last_exceptions: excPrime.slice(Math.max(0, excPrime.length - 120)),
    checkpoints,
  },
  nonprime_variant_up_to_Xany: {
    exception_count: excAny.length,
    first_exceptions: excAny.slice(0, 120),
    last_exceptions: excAny.slice(Math.max(0, excAny.length - 120)),
  },
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
