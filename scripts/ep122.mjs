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

function divisorCount(n, spf) {
  let x = n;
  let ans = 1;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x /= p;
      e += 1;
    }
    ans *= e + 1;
  }
  return ans;
}

function omegaCount(n, spf) {
  let x = n;
  let c = 0;
  while (x > 1) {
    const p = spf[x];
    c += 1;
    while (x % p === 0) x /= p;
  }
  return c;
}

function phi(n, spf) {
  let x = n;
  let res = n;
  while (x > 1) {
    const p = spf[x];
    res -= Math.floor(res / p);
    while (x % p === 0) x /= p;
  }
  return res;
}

function sigma(n, spf) {
  let x = n;
  let ans = 1;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x /= p;
      e += 1;
    }
    ans *= (p ** (e + 1) - 1) / (p - 1);
  }
  return ans;
}

function scanFunction(name, fvals, X_LIST, gamma) {
  const rows = [];
  for (const x of X_LIST) {
    const F = Math.max(1, Math.floor(x ** gamma));
    const hits = new Int32Array(F + 1);
    const maxN = x + F;
    for (let n = 1; n <= maxN; n += 1) {
      const y = n + fvals[n];
      if (y > x && y <= x + F) hits[y - x] += 1;
    }
    let mx = 0;
    for (let t = 1; t <= F; t += 1) if (hits[t] > mx) mx = hits[t];
    rows.push({
      x,
      F,
      max_local_occupancy_in_shifted_window: mx,
      occupancy_over_F: Number((mx / F).toFixed(6)),
    });
  }
  return { function_name: name, gamma_for_F: gamma, rows };
}

const X_LIST = (process.env.X_LIST || '5000,10000,20000,40000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const GAMMAS = (process.env.GAMMAS || '0.7,0.8,0.9').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const MAXX = Math.max(...X_LIST);
const LIMIT = Math.floor(MAXX + MAXX ** Math.max(...GAMMAS) + 5);
const OUT = process.env.OUT || '';

const spf = sieveSpf(LIMIT);
const dvals = new Int32Array(LIMIT + 1);
const ovals = new Int32Array(LIMIT + 1);
const pvals = new Int32Array(LIMIT + 1);
const svals = new Float64Array(LIMIT + 1);
for (let n = 1; n <= LIMIT; n += 1) {
  dvals[n] = divisorCount(n, spf);
  ovals[n] = omegaCount(n, spf);
  pvals[n] = phi(n, spf);
  svals[n] = sigma(n, spf);
}

const rows = [];
for (const g of GAMMAS) {
  rows.push(scanFunction('d(n)', dvals, X_LIST, g));
  rows.push(scanFunction('omega(n)', ovals, X_LIST, g));
  rows.push(scanFunction('phi(n)', pvals, X_LIST, g));
  rows.push(scanFunction('sigma(n)', svals, X_LIST, g));
}

const out = {
  problem: 'EP-122',
  script: path.basename(process.argv[1]),
  method: 'local_repeat_shifted_value_overcrowding_scan',
  params: { X_LIST, GAMMAS, LIMIT },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
