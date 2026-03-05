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


// EP-222: gaps between sums of two squares.
{
  function sumsOfTwoSquaresMask(X) {
    const mark = new Uint8Array(X + 1);
    const r = Math.floor(Math.sqrt(X));
    for (let a = 0; a <= r; a += 1) {
      const aa = a * a;
      for (let b = a; aa + b * b <= X; b += 1) {
        mark[aa + b * b] = 1;
      }
    }
    return mark;
  }

  const rows = [];
  for (const X of [200000, 500000, 1000000, 2000000, 5000000]) {
    const mark = sumsOfTwoSquaresMask(X);
    let prev = -1;
    let maxGap = 0;
    let start = 0;
    for (let n = 0; n <= X; n += 1) {
      if (!mark[n]) continue;
      if (prev >= 0) {
        const g = n - prev;
        if (g > maxGap) {
          maxGap = g;
          start = prev;
        }
      }
      prev = n;
    }
    rows.push({
      X,
      max_gap_observed: maxGap,
      gap_starts_at: start,
      max_gap_over_log_start: Number((maxGap / Math.log(Math.max(3, start))).toFixed(6)),
      max_gap_over_log_div_sqrtloglog: Number((maxGap / (Math.log(Math.max(3, start)) / Math.sqrt(Math.log(Math.log(Math.max(5, start)))))).toFixed(6)),
    });
  }

  out.results.ep222 = {
    description: 'Finite max-gap profile for integers representable as a sum of two squares.',
    rows,
  };
}


const single={problem:'EP-222',script:path.basename(process.argv[1]),generated_utc:new Date().toISOString(),result:out.results.ep222};
const OUT=process.env.OUT || path.join('data','ep222_standalone_compute.json');
fs.writeFileSync(OUT, JSON.stringify(single,null,2)+'\n');
console.log(JSON.stringify({problem:'EP-222',out:OUT},null,2));
