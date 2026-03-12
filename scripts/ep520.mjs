#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N = Number(process.env.N || 2000000);
const TRIALS = Number(process.env.TRIALS || 64);

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function sieveSPF(n) {
  const spf = new Int32Array(n + 1);
  const primes = [];
  for (let i = 2; i <= n; i += 1) {
    if (spf[i] === 0) {
      spf[i] = i;
      primes.push(i);
    }
    for (const p of primes) {
      const v = i * p;
      if (v > n) break;
      spf[v] = p;
      if (p === spf[i]) break;
    }
  }
  return { spf, primes };
}

const t0 = Date.now();
const { spf, primes } = sieveSPF(N);
const rng = makeRng(20260312 ^ 520);
const primeList = primes;
const milestones = [100000, 300000, 500000, 1000000, 1500000, 2000000].filter((x) => x <= N);

const trialRows = [];
let samplePath = [];
for (let tr = 0; tr < TRIALS; tr += 1) {
  const sign = new Int8Array(N + 1);
  for (const p of primeList) sign[p] = rng() < 0.5 ? -1 : 1;

  const f = new Int8Array(N + 1);
  f[1] = 1;
  let S = 0;
  let limsupLIL = -Infinity;
  let limsupQuarter = -Infinity;

  for (let n = 1; n <= N; n += 1) {
    if (n > 1) {
      const p = spf[n];
      const m = Math.floor(n / p);
      if (m % p === 0) f[n] = 0;
      else f[n] = f[m] * sign[p];
    }
    S += f[n];
    if (n >= 30) {
      const ll = Math.log(Math.log(n));
      const a = S / Math.sqrt(n * ll);
      const b = Math.abs(S) / (Math.sqrt(n) * (ll ** 0.25));
      if (a > limsupLIL) limsupLIL = a;
      if (b > limsupQuarter) limsupQuarter = b;
    }
    if (tr === 0 && milestones.includes(n)) {
      const ll = Math.log(Math.log(n));
      samplePath.push({
        n,
        S_n: S,
        S_over_sqrt_n_loglog_n: Number((S / Math.sqrt(n * ll)).toPrecision(8)),
        absS_over_sqrt_n_loglog_quarter: Number((Math.abs(S) / (Math.sqrt(n) * (ll ** 0.25))).toPrecision(8)),
      });
    }
  }

  trialRows.push({ trial: tr + 1, limsup_lil_norm: limsupLIL, limsup_quarter_norm: limsupQuarter });
}

function q(arr, p) {
  const b = [...arr].sort((x, y) => x - y);
  const i = Math.max(0, Math.min(b.length - 1, Math.floor((b.length - 1) * p)));
  return b[i];
}

const lil = trialRows.map((r) => r.limsup_lil_norm);
const qua = trialRows.map((r) => r.limsup_quarter_norm);

const out = {
  problem: 'EP-520',
  script: path.basename(process.argv[1]),
  method: 'deep_monte_carlo_limsup_profile_for_random_multiplicative_partial_sums',
  params: { N, TRIALS, milestones },
  summary: {
    lil_mean: Number((lil.reduce((a, b) => a + b, 0) / lil.length).toPrecision(8)),
    lil_median: Number(q(lil, 0.5).toPrecision(8)),
    lil_q90: Number(q(lil, 0.9).toPrecision(8)),
    quarter_mean: Number((qua.reduce((a, b) => a + b, 0) / qua.length).toPrecision(8)),
    quarter_median: Number(q(qua, 0.5).toPrecision(8)),
    quarter_q90: Number(q(qua, 0.9).toPrecision(8)),
  },
  trial_rows: trialRows,
  sample_path_trial_1: samplePath,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
