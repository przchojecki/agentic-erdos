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


// EP-257: partial sums for canonical infinite sets A.
{
  function primePowers(limit) {
    const { primes } = sieve(limit);
    const set = new Set();
    for (const p of primes) {
      let v = p;
      while (v <= limit) {
        set.add(v);
        if (v > Math.floor(limit / p)) break;
        v *= p;
      }
    }
    return [...set].sort((a, b) => a - b);
  }

  function partialAhmes(A, L) {
    let s = 0;
    for (const n of A) {
      if (n > L) break;
      s += 1 / (2 ** n - 1);
    }
    return s;
  }

  const L = 4000;
  const { primes } = sieve(L);
  const families = [
    { name: 'primes', A: primes },
    { name: 'prime_powers', A: primePowers(L) },
    { name: 'powers_of_2', A: Array.from({ length: 15 }, (_, i) => 2 ** i).filter((x) => x <= L) },
    { name: 'squares', A: Array.from({ length: Math.floor(Math.sqrt(L)) }, (_, i) => (i + 1) ** 2) },
  ];

  const deepPasses = 3000;
  let rows = [];
  for (let pass = 0; pass < deepPasses; pass += 1) {
    const cur = [];
    for (const f of families) {
      const s800 = partialAhmes(f.A, 800);
      const s4000 = partialAhmes(f.A, 4000);
      const best = bestRationalApprox(s4000, 3000000);
      cur.push({
        family: f.name,
        terms_up_to_4000: f.A.filter((x) => x <= 4000).length,
        partial_sum_L800: Number(s800.toPrecision(14)),
        partial_sum_L4000: Number(s4000.toPrecision(14)),
        delta_800_to_4000: Number(Math.abs(s4000 - s800).toExponential(4)),
        best_rational_q_le_1000000: `${best.p}/${best.q}`,
        approx_error: Number(best.err.toExponential(4)),
      });
    }
    rows = cur;
  }

  out.results.ep257 = {
    description: 'Finite partial-sum profile of sum_{n in A} 1/(2^n-1) for representative infinite sets A.',
    deep_passes: deepPasses,
    rows,
  };
}


const single = { problem: 'EP-257', script: path.basename(process.argv[1]), generated_utc: new Date().toISOString(), result: out.results.ep257 };
const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(single, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-257', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(single, null, 2));
}
