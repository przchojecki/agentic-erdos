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


// EP-256: max-product profile for candidate exponent sets.
{
  function maxLogProduct(exponents, grid = 2048) {
    let best = -Infinity;
    for (let t = 1; t <= grid; t += 1) {
      const theta = (2 * Math.PI * t) / (grid + 1);
      let s = 0;
      for (const a of exponents) {
        const v = Math.abs(2 * Math.sin((a * theta) / 2));
        s += Math.log(Math.max(v, 1e-15));
      }
      if (s > best) best = s;
    }
    return best;
  }

  function randomSet(n, m) {
    const arr = Array.from({ length: m }, (_, i) => i + 1);
    shuffle(arr, rng);
    return arr.slice(0, n).sort((a, b) => a - b);
  }

  const rows = [];
  for (const n of [8, 12, 16, 20, 24]) {
    const consec = Array.from({ length: n }, (_, i) => i + 1);
    const p2 = Array.from({ length: n }, (_, i) => 2 ** i);

    const lc = maxLogProduct(consec);
    const lp2 = maxLogProduct(p2);

    let bestRnd = Infinity;
    for (let t = 0; t < 60; t += 1) {
      const ex = randomSet(n, 6 * n);
      const v = maxLogProduct(ex, 1536);
      if (v < bestRnd) bestRnd = v;
    }

    rows.push({
      n,
      log_max_product_consecutive: Number(lc.toFixed(6)),
      log_max_product_powers_of_2: Number(lp2.toFixed(6)),
      min_log_max_product_random_60: Number(bestRnd.toFixed(6)),
    });
  }

  out.results.ep256 = {
    description: 'Grid-based finite profile for log max_{|z|=1} prod_i |1-z^{a_i}| over candidate exponent sets.',
    rows,
  };
}


const single={problem:'EP-256',script:path.basename(process.argv[1]),generated_utc:new Date().toISOString(),result:out.results.ep256};
const OUT=process.env.OUT || path.join('data','ep256_standalone_compute.json');
fs.writeFileSync(OUT, JSON.stringify(single,null,2)+'\n');
console.log(JSON.stringify({problem:'EP-256',out:OUT},null,2));
