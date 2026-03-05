#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 8:
// EP-241, EP-243, EP-244, EP-252, EP-256, EP-257, EP-261, EP-263, EP-264, EP-265.

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function sieve(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= limit; i += 1) {
    if (!isPrime[i]) continue;
    for (let j = i * i; j <= limit; j += i) isPrime[j] = 0;
  }
  const primes = [];
  for (let i = 2; i <= limit; i += 1) if (isPrime[i]) primes.push(i);
  return { isPrime, primes };
}

function bestRationalApprox(x, qMax) {
  let best = { p: 0, q: 1, err: Math.abs(x) };
  for (let q = 1; q <= qMax; q += 1) {
    const p = Math.round(x * q);
    const err = Math.abs(x - p / q);
    if (err < best.err) best = { p, q, err };
  }
  return best;
}

function gcdBig(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function fracAdd([a, b], [c, d]) {
  const num = a * d + c * b;
  const den = b * d;
  const g = gcdBig(num, den);
  return [num / g, den / g];
}

function fracSub([a, b], [c, d]) {
  const num = a * d - c * b;
  const den = b * d;
  const g = gcdBig(num, den);
  return [num / g, den / g];
}

function fracToNumber([a, b]) {
  return Number(a) / Number(b);
}

const rng = makeRng(20260303 ^ 809);
const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};


// EP-241: B3-set finite profiles.
{
  function tryAddB3(A, sumSet, x) {
    const newSums = new Set();

    const s0 = 3 * x;
    if (sumSet.has(s0)) return false;
    newSums.add(s0);

    for (const a of A) {
      const s = 2 * x + a;
      if (sumSet.has(s) || newSums.has(s)) return false;
      newSums.add(s);
    }

    for (let i = 0; i < A.length; i += 1) {
      for (let j = i; j < A.length; j += 1) {
        const s = x + A[i] + A[j];
        if (sumSet.has(s) || newSums.has(s)) return false;
        newSums.add(s);
      }
    }

    A.push(x);
    for (const s of newSums) sumSet.add(s);
    return true;
  }

  function greedyB3UpTo(N) {
    const A = [];
    const sumSet = new Set();
    for (let x = 1; x <= N; x += 1) tryAddB3(A, sumSet, x);
    return A.length;
  }

  function randomGreedyB3(N, trials) {
    const base = Array.from({ length: N }, (_, i) => i + 1);
    let best = 0;
    for (let t = 0; t < trials; t += 1) {
      const ord = [...base];
      shuffle(ord, rng);
      const A = [];
      const sumSet = new Set();
      for (const x of ord) tryAddB3(A, sumSet, x);
      if (A.length > best) best = A.length;
    }
    return best;
  }

  const rows = [];
  for (const N of [5000, 10000, 20000, 50000]) {
    const g = greedyB3UpTo(N);
    const r = randomGreedyB3(N, 20);
    rows.push({
      N,
      greedy_size: g,
      random_best_of_20: r,
      greedy_over_N_pow_1_over_3: Number((g / N ** (1 / 3)).toFixed(6)),
      random_over_N_pow_1_over_3: Number((r / N ** (1 / 3)).toFixed(6)),
    });
  }

  out.results.ep241 = {
    description: 'Finite greedy profiles for B3-type sets with distinct triple sums.',
    rows,
  };
}


const single={problem:'EP-241',script:path.basename(process.argv[1]),generated_utc:new Date().toISOString(),result:out.results.ep241};
const OUT=process.env.OUT || path.join('data','ep241_standalone_compute.json');
fs.writeFileSync(OUT, JSON.stringify(single,null,2)+'\n');
console.log(JSON.stringify({problem:'EP-241',out:OUT},null,2));
