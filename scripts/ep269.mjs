#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function pSmoothNumbers(primes, limit) {
  const set = new Set([1]);
  const arr = [1];
  for (let i = 0; i < arr.length; i += 1) {
    const x = arr[i];
    for (const p of primes) {
      const y = x * p;
      if (y <= limit && !set.has(y)) {
        set.add(y);
        arr.push(y);
      }
    }
  }
  arr.sort((a, b) => a - b);
  return arr;
}

function gcd(a, b) {
  while (b) [a, b] = [b, a % b];
  return a;
}

function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

function partialSeries(primes, terms, limitSmooth) {
  const A = pSmoothNumbers(primes, limitSmooth).slice(0, terms);
  let L = 1;
  let s = 0;
  for (const a of A) {
    L = lcm(L, a);
    s += 1 / L;
  }
  return { A, sum: s };
}

function bestApprox(x, qmax) {
  let best = { q: 1, err: Math.abs(x - Math.round(x)) };
  for (let q = 1; q <= qmax; q += 1) {
    const p = Math.round(x * q);
    const err = Math.abs(x - p / q);
    if (err < best.err) best = { q, err };
  }
  return best;
}

const P_CASES = (process.env.P_CASES || '2,3;2,5;2,3,5;2,3,7').split(';').map((s) => s.split(',').map((x) => Number(x.trim())).filter(Number.isFinite));
const TERMS = Number(process.env.TERMS || 140);
const LIMIT_SMOOTH = Number(process.env.LIMIT_SMOOTH || 500000);
const QMAX = Number(process.env.QMAX || 30000);
const OUT = process.env.OUT || '';

const rows = [];
for (const P of P_CASES) {
  const { A, sum } = partialSeries(P, TERMS, LIMIT_SMOOTH);
  const best = bestApprox(sum, QMAX);
  rows.push({
    primes_P: P,
    terms_used: A.length,
    max_a_n: A[A.length - 1],
    best_q: best.q,
    best_err: Number(best.err.toExponential(6)),
    q2_err: Number((best.err * best.q * best.q).toExponential(6)),
    a_prefix: A.slice(0, 15),
  });
}

const out = {
  problem: 'EP-269',
  script: path.basename(process.argv[1]),
  method: 'finite_P_smooth_lcm_series_rational_approx_scan',
  params: { P_CASES, TERMS, LIMIT_SMOOTH, QMAX },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
