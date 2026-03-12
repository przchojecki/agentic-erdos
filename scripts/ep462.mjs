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

const N = Number(process.env.N || 2000000);
const C_LIST = (process.env.C_LIST || '0.25,0.5,1,2,4').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const X_LIST = (process.env.X_LIST || '20000,50000,100000,200000,500000,1000000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const spf = sieveSpf(N + 5);
const pref = new Float64Array(N + 1);
for (let n = 1; n <= N; n += 1) {
  const val = (n >= 4 && spf[n] !== n) ? (spf[n] / n) : 0;
  pref[n] = pref[n - 1] + val;
}

const rows = [];
for (const C of C_LIST) {
  let minMass = Infinity;
  let maxMass = -Infinity;
  let minW = null;
  let maxW = null;
  for (const x of X_LIST) {
    const L = Math.max(1, Math.floor(C * Math.sqrt(x) * Math.log(x) * Math.log(x)));
    const R = Math.min(N, x + L);
    const mass = pref[R] - pref[x - 1];
    if (mass < minMass) {
      minMass = mass;
      minW = { x, L, R, mass: Number(mass.toPrecision(10)) };
    }
    if (mass > maxMass) {
      maxMass = mass;
      maxW = { x, L, R, mass: Number(mass.toPrecision(10)) };
    }
  }
  rows.push({
    C,
    min_mass_over_tested_x: Number(minMass.toPrecision(10)),
    min_witness: minW,
    max_mass_over_tested_x: Number(maxMass.toPrecision(10)),
    max_witness: maxW,
  });
}

const out = {
  problem: 'EP-462',
  script: path.basename(process.argv[1]),
  method: 'finite_short_window_mass_profile_for_least_prime_factor_sum',
  params: { N, C_LIST, X_LIST },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
