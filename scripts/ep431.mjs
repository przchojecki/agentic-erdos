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

function rng(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 0x100000000;
  };
}

function sampleDistinct(M, k, rnd) {
  const arr = Array.from({ length: M }, (_, i) => i + 1);
  for (let i = 0; i < k; i += 1) {
    const j = i + Math.floor(rnd() * (M - i));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr.slice(0, k).sort((a, b) => a - b);
}

const X = Number(process.env.X || 10000);
const M = Number(process.env.M || 1800);
const SIZE = Number(process.env.SIZE || 70);
const TRIALS = Number(process.env.TRIALS || 700);
const OUT = process.env.OUT || '';

const { isPrime, primes } = sievePrime(X);
const primeList = primes;
const rnd = rng(20260312 ^ 431);

function coverage(A, B) {
  const sums = new Uint8Array(X + 1);
  for (const a of A) {
    for (const b of B) {
      const s = a + b;
      if (s <= X) sums[s] = 1;
    }
  }
  let c = 0;
  for (const p of primeList) if (sums[p]) c += 1;
  return c;
}

let best = { c: -1, A: [], B: [] };
let avg = 0;
for (let t = 0; t < TRIALS; t += 1) {
  const A = sampleDistinct(M, SIZE, rnd);
  const B = sampleDistinct(M, SIZE, rnd);
  const c = coverage(A, B);
  avg += c;
  if (c > best.c) best = { c, A, B };
}

// local improvement on best sample
for (let it = 0; it < 140; it += 1) {
  let improved = false;
  for (let side = 0; side < 2; side += 1) {
    const baseSet = side === 0 ? best.A.slice() : best.B.slice();
    for (let rep = 0; rep < 20; rep += 1) {
      const idx = Math.floor(rnd() * SIZE);
      const cand = 1 + Math.floor(rnd() * M);
      if (baseSet.includes(cand)) continue;
      const trial = baseSet.slice();
      trial[idx] = cand;
      trial.sort((a, b) => a - b);
      const A = side === 0 ? trial : best.A;
      const B = side === 0 ? best.B : trial;
      const c = coverage(A, B);
      if (c > best.c) {
        best = { c, A: A.slice(), B: B.slice() };
        improved = true;
      }
    }
  }
  if (!improved) break;
}

const out = {
  problem: 'EP-431',
  script: path.basename(process.argv[1]),
  method: 'random_plus_local_search_prime_sumset_coverage_proxy',
  params: { X, M, SIZE, TRIALS },
  prime_count_up_to_X: primeList.length,
  avg_random_coverage_ratio: Number(((avg / TRIALS) / primeList.length).toPrecision(8)),
  best_coverage_count: best.c,
  best_coverage_ratio: Number((best.c / primeList.length).toPrecision(8)),
  best_A_first_40: best.A.slice(0, 40),
  best_B_first_40: best.B.slice(0, 40),
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
