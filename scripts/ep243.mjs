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


// EP-243: Sylvester-type telescoping identity vs perturbation.
{
  function sylvesterTerms(a1, len) {
    const a = [BigInt(a1)];
    while (a.length < len) {
      const x = a[a.length - 1];
      a.push(x * x - x + 1n);
    }
    return a;
  }

  function telescopingResidual(a) {
    // Sum_i [1/a_i - (1/(a_i-1) - 1/(a_{i+1}-1))]
    let res = [0n, 1n];
    for (let i = 0; i + 1 < a.length; i += 1) {
      const term1 = [1n, a[i]];
      const term2 = fracSub([1n, a[i] - 1n], [1n, a[i + 1] - 1n]);
      const diff = fracSub(term1, term2);
      res = fracAdd(res, diff);
    }
    return res;
  }

  const deepPasses = 10;
  let rows = [];
  for (let pass = 0; pass < deepPasses; pass += 1) {
    const cur = [];
    for (const a1 of [2, 3, 5, 7, 11, 13]) {
      const a = sylvesterTerms(a1, 20);
      const r = telescopingResidual(a);
      cur.push({
        model: 'exact_sylvester',
        a1,
        terms_checked: 20,
        residual_numerator: r[0].toString(),
        residual_denominator: r[1].toString(),
        residual_as_number: fracToNumber(r),
      });

      for (const idx of [3, 5, 7, 9, 11, 13, 15]) {
        const b = [...a];
        b[idx] += 1n;
        const rp = telescopingResidual(b);
        cur.push({
          model: `single_perturbation_at_index${idx + 1}`,
          a1,
          terms_checked: 20,
          residual_numerator: rp[0].toString(),
          residual_denominator: rp[1].toString(),
          residual_as_number: fracToNumber(rp),
        });
      }
    }
    rows = cur;
  }

  out.results.ep243 = {
    description: 'Exact telescoping residual check for Sylvester recurrence and perturbed variants.',
    deep_passes: deepPasses,
    rows,
  };
}


const single = { problem: 'EP-243', script: path.basename(process.argv[1]), generated_utc: new Date().toISOString(), result: out.results.ep243 };
const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(single, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-243', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(single, null, 2));
}
