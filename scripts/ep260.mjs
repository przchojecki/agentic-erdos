#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function seq(mode, N) {
  const a = [];
  if (mode === 'nlogn') for (let n = 2; a.length < N; n += 1) { const v = Math.floor(n * Math.log(n)); if (!a.length || v > a[a.length - 1]) a.push(v); }
  if (mode === 'n1p2') for (let n = 1; a.length < N; n += 1) { const v = Math.floor(n ** 1.2); if (!a.length || v > a[a.length - 1]) a.push(v); }
  if (mode === 'n_sqrtlog') for (let n = 3; a.length < N; n += 1) { const v = Math.floor(n * Math.sqrt(Math.log(n))); if (!a.length || v > a[a.length - 1]) a.push(v); }
  if (mode === 'piecewise_jumps') {
    let cur = 2;
    for (let n = 1; a.length < N; n += 1) {
      cur += 1 + Math.floor(Math.log(n + 2)) + (n % 11 === 0 ? 5 : 0);
      a.push(cur);
    }
  }
  return a;
}

function partialNumerator(a) {
  const Amax = a[a.length - 1];
  let num = 0n;
  for (const x of a) num += BigInt(x) << BigInt(Amax - x);
  return { num, Amax };
}

function nearestError(num, Amax, q) {
  const den = 1n << BigInt(Amax);
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

const MODES = (process.env.MODES || 'nlogn,n1p2,n_sqrtlog,piecewise_jumps').split(',').map((x) => x.trim()).filter(Boolean);
const N = Number(process.env.N || 70);
const QMAX = Number(process.env.QMAX || 12000);
const OUT = process.env.OUT || '';

const rows = [];
for (const mode of MODES) {
  const a = seq(mode, N);
  const { num, Amax } = partialNumerator(a);
  let best = { q: 1, err: Infinity };
  for (let q = 1; q <= QMAX; q += 1) {
    const err = nearestError(num, Amax, q);
    if (err < best.err) best = { q, err };
  }
  rows.push({
    mode,
    N: a.length,
    aN_over_N: Number((a[a.length - 1] / a.length).toFixed(4)),
    best_q: best.q,
    best_err: Number(best.err.toExponential(6)),
    q2_err: Number((best.err * best.q * best.q).toExponential(6)),
    sequence_prefix: a.slice(0, 15),
  });
}

const out = {
  problem: 'EP-260',
  script: path.basename(process.argv[1]),
  method: 'dyadic_series_rational_approx_stress_for_superlinear_exponents',
  params: { MODES, N, QMAX },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
