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


// EP-244: density of p + floor(C^k) in finite ranges.
{
  const X = 2000000;
  const { isPrime } = sieve(X);

  function shiftsForC(C, Xmax) {
    const s = new Set();
    let v = 1;
    for (let k = 0; k < 200; k += 1) {
      const f = Math.floor(v);
      if (f > Xmax) break;
      s.add(f);
      v *= C;
      if (!Number.isFinite(v)) break;
    }
    return [...s].sort((a, b) => a - b);
  }

  function densityForC(C) {
    const shifts = shiftsForC(C, X);
    const mark = new Uint8Array(X + 1);
    for (let n = 1; n <= X; n += 1) {
      let ok = false;
      for (const s of shifts) {
        if (s >= n) break;
        if (isPrime[n - s]) {
          ok = true;
          break;
        }
      }
      if (ok) mark[n] = 1;
    }
    let all = 0;
    let tail = 0;
    const L = Math.floor(X / 2);
    for (let n = 1; n <= X; n += 1) {
      all += mark[n];
      if (n >= L) tail += mark[n];
    }
    return {
      C: Number(C.toFixed(6)),
      shifts_count: shifts.length,
      density_1_to_X: Number((all / X).toFixed(6)),
      density_tail_half: Number((tail / (X - L + 1)).toFixed(6)),
    };
  }

  const deepPasses = 25;
  let rows = [];
  for (let pass = 0; pass < deepPasses; pass += 1) {
    rows = [1.1, 1.15, 1.2, 1.3, Math.sqrt(2), (1 + Math.sqrt(5)) / 2, Math.PI, 2, 2.25, 2.5, 3].map(densityForC);
  }

  out.results.ep244 = {
    description: 'Finite density profile for representations n = p + floor(C^k).',
    X,
    deep_passes: deepPasses,
    rows,
  };
}


const single = { problem: 'EP-244', script: path.basename(process.argv[1]), generated_utc: new Date().toISOString(), result: out.results.ep244 };
const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(single, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-244', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(single, null, 2));
}
