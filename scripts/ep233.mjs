#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 7:
// EP-184, EP-188, EP-195, EP-202, EP-208, EP-212, EP-213, EP-222, EP-233, EP-236.

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

function isPerfectSquare(n) {
  const r = Math.floor(Math.sqrt(n));
  return r * r === n;
}

const rng = makeRng(20260303 ^ 709);
const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};


// EP-233: second moment of prime gaps.
{
  const Nmax = 500000;
  const lim = 8000000;
  const { primes } = sieve(lim);

  const rows = [];
  let S = 0;
  let ptr = 1;
  const checkpoints = new Set([10000, 50000, 100000, 200000, 500000]);

  while (ptr <= Nmax && ptr < primes.length) {
    const d = primes[ptr] - primes[ptr - 1];
    S += d * d;
    if (checkpoints.has(ptr)) {
      const N = ptr;
      const pN = primes[ptr - 1];
      rows.push({
        N,
        p_N: pN,
        sum_d_n_sq: S,
        ratio_over_N_logN_sq: Number((S / (N * Math.log(N) ** 2)).toFixed(6)),
        ratio_over_N_logpN_sq: Number((S / (N * Math.log(pN) ** 2)).toFixed(6)),
      });
    }
    ptr += 1;
  }

  out.results.ep233 = {
    description: 'Finite profile for sum_{n<=N} (p_{n+1}-p_n)^2.',
    sieve_limit: lim,
    rows,
  };
}


const single={problem:'EP-233',script:path.basename(process.argv[1]),generated_utc:new Date().toISOString(),result:out.results.ep233};
const OUT=process.env.OUT || path.join('data','ep233_standalone_compute.json');
fs.writeFileSync(OUT, JSON.stringify(single,null,2)+'\n');
console.log(JSON.stringify({problem:'EP-233',out:OUT},null,2));
