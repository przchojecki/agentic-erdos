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


// EP-252: finite approximants for sum sigma_k(n)/n!.
{
  const Ntail = 600;
  const sigma = Array.from({ length: 13 }, () => new Float64Array(Ntail + 1));
  for (let k = 1; k <= 12; k += 1) {
    for (let d = 1; d <= Ntail; d += 1) {
      const dk = d ** k;
      for (let n = d; n <= Ntail; n += d) sigma[k][n] += dk;
    }
  }

  const invFact = new Float64Array(Ntail + 1);
  invFact[0] = 1;
  for (let n = 1; n <= Ntail; n += 1) invFact[n] = invFact[n - 1] / n;

  const deepPasses = 300;
  let rows = [];
  for (let pass = 0; pass < deepPasses; pass += 1) {
    const cur = [];
    for (let k = 1; k <= 12; k += 1) {
      const partialN = 240;
      let s40 = 0;
      let s140 = 0;
      for (let n = 1; n <= partialN; n += 1) s40 += sigma[k][n] * invFact[n];
      for (let n = 1; n <= Ntail; n += 1) s140 += sigma[k][n] * invFact[n];
      const tail = Math.abs(s140 - s40);
      const best = bestRationalApprox(s140, 10000000);
      cur.push({
        k,
        partial_sum_N40: Number(s40.toPrecision(14)),
        extended_sum_N140: Number(s140.toPrecision(14)),
        N240_to_N600_tail_size: Number(tail.toExponential(4)),
        best_rational_q_le_50000: `${best.p}/${best.q}`,
        approx_error: Number(best.err.toExponential(4)),
      });
    }
    rows = cur;
  }

  out.results.ep252 = {
    description: 'Finite high-truncation approximants for alpha_k = sum sigma_k(n)/n! (k<=6).',
    deep_passes: deepPasses,
    rows,
  };
}


const single = { problem: 'EP-252', script: path.basename(process.argv[1]), generated_utc: new Date().toISOString(), result: out.results.ep252 };
const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(single, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-252', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(single, null, 2));
}
