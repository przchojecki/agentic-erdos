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


// EP-261: structured subset-offset representations.
{
  function generatedNByOffsetSubsets(L, Nmax) {
    const denBase = 1 << L;
    const hit = new Uint8Array(Nmax + 1);
    const totalMasks = 1 << L;
    for (let mask = 1; mask < totalMasks; mask += 1) {
      let bits = 0;
      let C1 = 0;
      let C0 = 0;
      for (let i = 1; i <= L; i += 1) {
        if (((mask >>> (i - 1)) & 1) === 0) continue;
        bits += 1;
        const w = 1 << (L - i);
        C1 += w;
        C0 += i * w;
      }
      if (bits < 2) continue;
      const den = denBase - C1;
      if (den <= 0) continue;
      if (C0 % den !== 0) continue;
      const n = C0 / den;
      if (n >= 1 && n <= Nmax) hit[n] = 1;
    }
    return hit;
  }

  const Nmax = 12000;
  const deepPasses = 60;
  let rows = [];
  let unionCount = 0;
  let unionMx = 0;
  for (let pass = 0; pass < deepPasses; pass += 1) {
    const curRows = [];
    const union = new Uint8Array(Nmax + 1);
    for (const L of [8, 10, 12, 15, 20, 22]) {
      const h = generatedNByOffsetSubsets(L, Nmax);
      let c = 0;
      let mx = 0;
      for (let n = 1; n <= Nmax; n += 1) {
        if (h[n]) {
          c += 1;
          mx = n;
          union[n] = 1;
        }
      }
      curRows.push({
        offset_window_L: L,
        represented_n_count_up_to_Nmax: c,
        density_up_to_Nmax: Number((c / Nmax).toFixed(6)),
        largest_represented_n_up_to_Nmax: mx,
      });
    }

    let cU = 0;
    let mU = 0;
    for (let n = 1; n <= Nmax; n += 1) {
      if (union[n]) {
        cU += 1;
        mU = n;
      }
    }
    rows = curRows;
    unionCount = cU;
    unionMx = mU;
  }

  out.results.ep261 = {
    description: 'Finite coverage profile from subset-offset representation ansatz a_i = n + i.',
    Nmax,
    deep_passes: deepPasses,
    rows,
    union_over_L_up_to_20: {
      represented_count: unionCount,
      represented_density: Number((unionCount / Nmax).toFixed(6)),
      largest_represented_n: unionMx,
    },
  };
}


const single = { problem: 'EP-261', script: path.basename(process.argv[1]), generated_utc: new Date().toISOString(), result: out.results.ep261 };
const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(single, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-261', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(single, null, 2));
}
