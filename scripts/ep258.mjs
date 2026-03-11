#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function tauUpTo(n) {
  const tau = new Int32Array(n + 1);
  for (let d = 1; d <= n; d += 1) for (let k = d; k <= n; k += d) tau[k] += 1;
  return tau;
}

function seq(mode, N) {
  const a = [];
  if (mode === 'monotone_linear') for (let n = 1; n <= N; n += 1) a.push(n + 1);
  if (mode === 'monotone_slow') for (let n = 1; n <= N; n += 1) a.push(2 + Math.floor(Math.log2(n + 1)));
  if (mode === 'nonmonotone_blocks') for (let n = 1; n <= N; n += 1) a.push(2 + ((n % 7) === 0 ? Math.floor(Math.sqrt(n)) : Math.floor(Math.log2(n + 1))));
  if (mode === 'oscillatory_growth') for (let n = 1; n <= N; n += 1) a.push(2 + Math.floor(Math.log(n + 2)) + (n % 5));
  return a;
}

function partialSum(tau, a) {
  let prod = 1;
  let s = 0;
  for (let n = 1; n <= a.length; n += 1) {
    prod *= a[n - 1];
    s += tau[n] / prod;
  }
  return s;
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

const MODES = (process.env.MODES || 'monotone_linear,monotone_slow,nonmonotone_blocks,oscillatory_growth').split(',').map((x) => x.trim()).filter(Boolean);
const N = Number(process.env.N || 60);
const QMAX = Number(process.env.QMAX || 20000);
const OUT = process.env.OUT || '';

const tau = tauUpTo(N + 5);
const rows = [];
for (const mode of MODES) {
  const a = seq(mode, N);
  const x = partialSum(tau, a);
  const best = bestApprox(x, QMAX);
  rows.push({
    mode,
    N,
    best_q: best.q,
    best_err: Number(best.err.toExponential(6)),
    q2_err: Number((best.err * best.q * best.q).toExponential(6)),
    sequence_prefix: a.slice(0, 15),
  });
}

const out = {
  problem: 'EP-258',
  script: path.basename(process.argv[1]),
  method: 'irrationality_stress_via_rational_approx_for_tau_over_product_series',
  params: { MODES, N, QMAX },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
