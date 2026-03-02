#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-420 finite probe:
// Examine log F(f,n) = log tau((n+f)!)-log tau(n!)
// for f=(log n)^C and related scales.

const N_LIST = (process.env.N_LIST || '1000,3000,10000,30000,100000,300000,1000000')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => x >= 10);
const C_LIST = (process.env.C_LIST || '1,1.5,2,3')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => x > 0);

const N_MAX = Math.max(...N_LIST);
const F_MAX = Math.max(...N_LIST.map((n) => Math.floor(Math.pow(Math.log(n), Math.max(...C_LIST)))));

function sievePrimes(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= n; i++) {
    if (!isPrime[i]) continue;
    for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
  }
  const primes = [];
  for (let i = 2; i <= n; i++) if (isPrime[i]) primes.push(i);
  return primes;
}

function vFact(n, p) {
  let s = 0;
  let q = p;
  while (q <= n) {
    s += Math.floor(n / q);
    if (q > Math.floor(n / p)) break;
    q *= p;
  }
  return s;
}

const primes = sievePrimes(N_MAX + F_MAX + 100);

function logTauFact(n) {
  let acc = 0;
  for (const p of primes) {
    if (p > n) break;
    const e = vFact(n, p);
    acc += Math.log(e + 1);
  }
  return acc;
}

const cacheLogTau = new Map();
function getLogTau(n) {
  if (!cacheLogTau.has(n)) cacheLogTau.set(n, logTauFact(n));
  return cacheLogTau.get(n);
}

const rows = [];
for (const n of N_LIST) {
  const base = getLogTau(n);
  const perC = [];
  for (const C of C_LIST) {
    const f = Math.max(1, Math.floor(Math.pow(Math.log(n), C)));
    const logF = getLogTau(n + f) - base;
    perC.push({
      C,
      f,
      logF: Number(logF.toFixed(6)),
      F_approx: Number(Math.exp(Math.min(logF, 50)).toFixed(6)),
    });
  }
  rows.push({ n, values: perC });
}

// Additional profile for f=floor(log n) along a range.
const profile = [];
for (let n = 2000; n <= 200000; n += 4000) {
  const f = Math.max(1, Math.floor(Math.log(n)));
  const logF = getLogTau(n + f) - getLogTau(n);
  profile.push({ n, f, logF: Number(logF.toFixed(6)), F_approx: Number(Math.exp(Math.min(logF, 50)).toFixed(6)) });
}

const out = {
  script: path.basename(process.argv[1]),
  n_list: N_LIST,
  c_list: C_LIST,
  rows,
  log_profile_f_equals_floor_log_n: profile,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep420_factorial_tau_ratio_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, rows: rows.length, profile_rows: profile.length }, null, 2));
