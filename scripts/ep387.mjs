#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveSpf(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i += 1) if (!spf[i]) {
    spf[i] = i;
    if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
  }
  return spf;
}

function vpFact(n, p) {
  let s = 0;
  while (n > 0) {
    n = Math.floor(n / p);
    s += n;
  }
  return s;
}

function dividesBinom(n, k, d, spf) {
  let x = d;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    const v = vpFact(n, p) - vpFact(k, p) - vpFact(n - k, p);
    if (v < e) return false;
  }
  return true;
}

const N = Number(process.env.N || 900);
const KMAX = Number(process.env.KMAX || 30);
const C_LIST = (process.env.C_LIST || '0.4,0.5,0.6').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const spf = sieveSpf(N);
let total = 0;
let failNK = 0;
const failC = new Map(C_LIST.map((c) => [c, 0]));
let minRatio = 1;
let minWitness = null;

for (let n = 2; n <= N; n += 1) {
  for (let k = 1; k <= Math.min(KMAX, n - 1); k += 1) {
    total += 1;
    let hasNK = false;
    for (let d = n; d > n - k; d -= 1) {
      if (dividesBinom(n, k, d, spf)) {
        hasNK = true;
        break;
      }
    }
    if (!hasNK) failNK += 1;

    for (const c of C_LIST) {
      let has = false;
      const lo = Math.floor(c * n);
      for (let d = n; d > lo; d -= 1) {
        if (dividesBinom(n, k, d, spf)) {
          has = true;
          break;
        }
      }
      if (!has) failC.set(c, failC.get(c) + 1);
    }

    let bestD = 1;
    for (let d = n; d >= 1; d -= 1) {
      if (dividesBinom(n, k, d, spf)) {
        bestD = d;
        break;
      }
    }
    const ratio = bestD / n;
    if (ratio < minRatio) {
      minRatio = ratio;
      minWitness = { n, k, best_divisor: bestD };
    }
  }
}

const out = {
  problem: 'EP-387',
  script: path.basename(process.argv[1]),
  method: 'extended_divisor_in_interval_profile_for_binomial_coefficients',
  params: { N, KMAX, C_LIST },
  total_pairs_checked: total,
  fail_count_interval_n_minus_k: failNK,
  fail_rates_c_intervals: C_LIST.map((c) => ({ c, fail_count: failC.get(c), fail_rate: Number((failC.get(c) / total).toExponential(6)) })),
  global_min_best_divisor_ratio: Number(minRatio.toFixed(6)),
  global_min_best_divisor_witness: minWitness,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
