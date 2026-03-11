#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function firstPrimes(n) {
  const out = [];
  let x = 2;
  while (out.length < n) {
    let ok = true;
    for (let d = 2; d * d <= x; d += 1) if (x % d === 0) {
      ok = false;
      break;
    }
    if (ok) out.push(x);
    x += 1;
  }
  return out;
}

function partialNumerator(primes, N) {
  let num = 0n;
  for (let n = 1; n <= N; n += 1) {
    num += BigInt(primes[n - 1]) << BigInt(N - n);
  }
  return num;
}

function nearestError(num, N, q) {
  const den = 1n << BigInt(N);
  const qn = BigInt(q);
  const t = qn * num;
  const p0 = t / den;
  const cands = [p0, p0 + 1n];
  let best = null;
  for (const p of cands) {
    const e = t > p * den ? t - p * den : p * den - t;
    if (best === null || e < best) best = e;
  }
  return Number(best) / (q * Number(den));
}

const N_LIST = (process.env.N_LIST || '120,180,240').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const QMAX = Number(process.env.QMAX || 8000);
const OUT = process.env.OUT || '';

const primes = firstPrimes(Math.max(...N_LIST));
const rows = [];
for (const N of N_LIST) {
  const num = partialNumerator(primes, N);
  let best = { q: 1, err: Infinity };
  for (let q = 1; q <= QMAX; q += 1) {
    const err = nearestError(num, N, q);
    if (err < best.err) best = { q, err };
  }
  rows.push({
    N,
    qmax_scanned: QMAX,
    best_rational_approx_error: Number(best.err.toExponential(6)),
    best_q: best.q,
    q2_times_error: Number((best.err * best.q * best.q).toExponential(6)),
  });
}

const out = {
  problem: 'EP-251',
  script: path.basename(process.argv[1]),
  method: 'dyadic_partial_sum_rational_approximation_scan',
  params: { N_LIST, QMAX },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
