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


// EP-263 + EP-264: growth/criterion metrics.
{
  function logA(type, n) {
    if (type === 'pow2pow2') return 2 ** n * Math.log(2); // a_n = 2^(2^n)
    if (type === 'pow2n') return n * Math.log(2); // a_n = 2^n
    if (type === 'factorial') {
      let s = 0;
      for (let i = 2; i <= n; i += 1) s += Math.log(i);
      return s;
    }
    if (type === 'exp_exp_0.6') return Math.exp(0.6 * n);
    if (type === 'exp_exp_0.8') return Math.exp(0.8 * n);
    throw new Error('bad type');
  }

  function criterionApprox(type, n) {
    if (type === 'pow2n') {
      // exact: a_n^2 * sum_{k>n} 1/a_k^2 = sum_{j>=1} 4^{-j} = 1/3
      return 1 / 3;
    }
    const ln = logA(type, n);
    let s = 0;
    for (let k = n + 1; k <= n + 60; k += 1) {
      const tk = 2 * (ln - logA(type, k));
      const term = Math.exp(tk);
      s += term;
      if (term < 1e-16 && k > n + 6) break;
    }
    return s;
  }

  const types = ['pow2pow2', 'pow2n', 'factorial', 'exp_exp_0.6', 'exp_exp_0.8'];

  const rows263 = [];
  for (const type of types) {
    for (const n of [4, 6, 8, 10, 12]) {
      const ln = logA(type, n);
      const lnNext = logA(type, n + 1);
      rows263.push({
        sequence: type,
        n,
        log_a_n: Number(ln.toExponential(6)),
        log_ratio_a_next_over_a_n_sq: Number((lnNext - 2 * ln).toExponential(6)),
        log_a_n_over_2_pow_n: Number((ln / 2 ** n).toExponential(6)),
      });
    }
  }

  const rows264 = [];
  for (const type of types) {
    for (const n of [4, 6, 8, 10, 12]) {
      const v = criterionApprox(type, n);
      rows264.push({
        sequence: type,
        n,
        approx_a_n_sq_times_tail_sum_reciprocal_sq: Number(v.toExponential(6)),
      });
    }
  }

  out.results.ep263 = {
    description: 'Growth-diagnostic metrics relevant to irrationality-sequence criteria (type [263]).',
    rows: rows263,
  };

  out.results.ep264 = {
    description: 'Criterion-profile values a_n^2 * sum_{k>n} 1/a_k^2 for representative sequences (type [264]).',
    rows: rows264,
  };
}


const single={problem:'EP-263',script:path.basename(process.argv[1]),generated_utc:new Date().toISOString(),result:out.results.ep263};
const OUT=process.env.OUT || path.join('data','ep263_standalone_compute.json');
fs.writeFileSync(OUT, JSON.stringify(single,null,2)+'\n');
console.log(JSON.stringify({problem:'EP-263',out:OUT},null,2));
