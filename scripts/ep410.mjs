#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveSpf(n) {
  const spf = new Int32Array(n + 1);
  const primes = [];
  for (let i = 2; i <= n; i += 1) {
    if (!spf[i]) {
      spf[i] = i;
      primes.push(i);
      if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
    }
  }
  return { spf, primes };
}

function sigmaByFactorization(n, spf, primes, lim) {
  let x = n;
  let res = 1;
  if (x <= lim) {
    while (x > 1) {
      const p = spf[x];
      let pe = 1;
      let sum = 1;
      while (x % p === 0) {
        x = Math.floor(x / p);
        pe *= p;
        sum += pe;
      }
      res *= sum;
      if (!Number.isFinite(res)) return null;
    }
    return res;
  }

  for (const p of primes) {
    if (p * p > x) break;
    if (x % p !== 0) continue;
    let pe = 1;
    let sum = 1;
    while (x % p === 0) {
      x = Math.floor(x / p);
      pe *= p;
      sum += pe;
    }
    res *= sum;
    if (!Number.isFinite(res)) return null;
  }
  if (x > 1) res *= (1 + x);
  return Number.isFinite(res) ? res : null;
}

const SPFLIM = Number(process.env.SPFLIM || 3000000);
const STEPS = Number(process.env.STEPS || 18);
const CAP = Number(process.env.CAP || 1e15);
const SEEDS = (process.env.SEEDS || '2,3,4,5,6,10,12,30,70,210,420,840,1260,2310').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const { spf, primes } = sieveSpf(SPFLIM);
const rows = [];

for (const seed of SEEDS) {
  let x = seed;
  let stopped = false;
  const profile = [];
  for (let k = 1; k <= STEPS; k += 1) {
    const y = sigmaByFactorization(x, spf, primes, SPFLIM);
    if (y === null || !Number.isFinite(y) || y > CAP) {
      stopped = true;
      break;
    }
    x = Math.round(y);
    profile.push({
      k,
      value: x,
      root_k: Number((x ** (1 / k)).toPrecision(8)),
      log_over_k: Number((Math.log(x) / k).toPrecision(8)),
    });
  }

  const monotoneRootFrom6 = profile.length >= 8
    ? profile.slice(5).every((r, i, arr) => i === 0 || r.root_k >= arr[i - 1].root_k)
    : null;

  rows.push({
    seed,
    steps_computed: profile.length,
    stopped_early: stopped,
    last_value: profile.length ? profile[profile.length - 1].value : seed,
    monotone_root_from_k_ge_6: monotoneRootFrom6,
    profile,
  });
}

const out = {
  problem: 'EP-410',
  script: path.basename(process.argv[1]),
  method: 'deeper_growth_profile_for_sigma_iterates',
  params: { SPFLIM, STEPS, CAP, SEEDS },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
