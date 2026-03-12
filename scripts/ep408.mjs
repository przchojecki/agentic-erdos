#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sievePhiSpf(n) {
  const spf = new Int32Array(n + 1);
  const phi = new Int32Array(n + 1);
  phi[1] = 1;
  for (let i = 2; i <= n; i += 1) {
    if (!spf[i]) {
      spf[i] = i;
      phi[i] = i - 1;
      if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
    }
    if (!phi[i]) {
      const p = spf[i];
      const m = Math.floor(i / p);
      phi[i] = m % p === 0 ? phi[m] * p : phi[m] * (p - 1);
    }
  }
  return { phi, spf };
}

function lpfOf(x, spf) {
  let n = x;
  let p = 1;
  while (n > 1) {
    p = spf[n];
    while (n % p === 0) n = Math.floor(n / p);
  }
  return p;
}

const N = Number(process.env.N || 1000000);
const MILESTONES = (process.env.MILESTONES || '10000,50000,100000,300000,600000,1000000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const { phi, spf } = sievePhiSpf(N);
const f = new Int32Array(N + 1);
for (let n = 2; n <= N; n += 1) f[n] = f[phi[n]] + 1;

const rows = [];
const mset = new Set(MILESTONES);
let sumRatio = 0;
let sumSqRatio = 0;
let cnt = 0;
let frac01 = 0;
let frac005 = 0;
let frac002 = 0;

for (let n = 3; n <= N; n += 1) {
  const ratio = f[n] / Math.log(n);
  sumRatio += ratio;
  sumSqRatio += ratio * ratio;
  cnt += 1;

  const k = Math.max(1, Math.floor(Math.log(Math.log(n))));
  let x = n;
  for (let t = 0; t < k; t += 1) x = phi[x];
  const lp = lpfOf(x, spf);
  if (lp <= n ** 0.1) frac01 += 1;
  if (lp <= n ** 0.05) frac005 += 1;
  if (lp <= n ** 0.02) frac002 += 1;

  if (mset.has(n)) {
    const mean = sumRatio / cnt;
    const varr = Math.max(0, sumSqRatio / cnt - mean * mean);
    rows.push({
      X: n,
      mean_f_over_log: Number(mean.toPrecision(8)),
      std_f_over_log: Number(Math.sqrt(varr).toPrecision(8)),
      fraction_lpf_phi_loglog_le_n_pow_0_1: Number((frac01 / cnt).toPrecision(7)),
      fraction_lpf_phi_loglog_le_n_pow_0_05: Number((frac005 / cnt).toPrecision(7)),
      fraction_lpf_phi_loglog_le_n_pow_0_02: Number((frac002 / cnt).toPrecision(7)),
    });
  }
}

const out = {
  problem: 'EP-408',
  script: path.basename(process.argv[1]),
  method: 'deep_iterated_totient_depth_and_lpf_profile',
  params: { N, MILESTONES },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
