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

function primesFromSpf(n, spf) {
  const ps = [];
  for (let i = 2; i <= n; i += 1) if (spf[i] === i) ps.push(i);
  return ps;
}

function valuationInFactorialQuotient(v, u, p) {
  let s = 0;
  let pp = p;
  while (pp <= v) {
    s += Math.floor(v / pp) - Math.floor((u - 1) / pp);
    pp *= p;
  }
  return s;
}

function largestPrimeFactorInIntervalProduct(u, v, primes) {
  for (let i = primes.length - 1; i >= 0; i -= 1) {
    const p = primes[i];
    if (p > v) continue;
    if (Math.floor(v / p) - Math.floor((u - 1) / p) > 0) return p;
  }
  return 1;
}

function isBadInterval(u, v, primes) {
  const p = largestPrimeFactorInIntervalProduct(u, v, primes);
  if (p <= 1) return false;
  return valuationInFactorialQuotient(v, u, p) >= 2;
}

const X_LIST = (process.env.X_LIST || '500,1000,1500,2000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const WINDOW_MAX = Number(process.env.WINDOW_MAX || 300);
const OUT = process.env.OUT || '';

const XMAX = Math.max(...X_LIST);
const spf = sieveSpf(XMAX);
const primes = primesFromSpf(XMAX, spf);

const rows = [];
for (const X of X_LIST) {
  let maxGap = 0;
  let witness = null;
  let badCount = 0;
  for (let u = 1; u <= X; u += 1) {
    for (let v = u; v <= Math.min(X, u + WINDOW_MAX); v += 1) {
      if (!isBadInterval(u, v, primes)) continue;
      badCount += 1;
      const g = v - u;
      if (g > maxGap) {
        maxGap = g;
        witness = { u, v, gap: g };
      }
    }
  }
  rows.push({ X, window_scanned: WINDOW_MAX, bad_interval_count: badCount, max_gap_found: maxGap, witness });
}

const out = {
  problem: 'EP-382',
  script: path.basename(process.argv[1]),
  method: 'finite_bad_interval_max_gap_profile',
  params: { X_LIST, WINDOW_MAX },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
