#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function gcdBig(a, b) {
  let x = a;
  let y = b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x < 0n ? -x : x;
}

function gcdInt(a, b) {
  let x = a;
  let y = b;
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return Math.abs(x);
}

function lcmInt(a, b) {
  return (a / gcdInt(a, b)) * b;
}

function sievePrimes(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let p = 2; p * p <= n; p += 1) {
    if (!isPrime[p]) continue;
    for (let q = p * p; q <= n; q += p) isPrime[q] = 0;
  }
  const out = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) out.push(i);
  return out;
}

function buildSpf(n) {
  const spf = new Uint32Array(n + 1);
  for (let i = 2; i <= n; i += 1) {
    if (spf[i] === 0) {
      spf[i] = i;
      if (i <= Math.floor(n / i)) {
        for (let j = i * i; j <= n; j += i) {
          if (spf[j] === 0) spf[j] = i;
        }
      }
    }
  }
  return spf;
}

function factorDistinct(n, spf) {
  const out = [];
  let x = n;
  while (x > 1) {
    const p = spf[x];
    out.push(p);
    while (x % p === 0) x = Math.floor(x / p);
  }
  return out;
}

function modPow(base, exp, mod) {
  let b = BigInt(base % mod);
  let e = BigInt(exp);
  let m = BigInt(mod);
  let r = 1n;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return Number(r);
}

function orderModWithFactors(a, p, factors) {
  if (gcdInt(a, p) !== 1) return 0;
  let ord = p - 1;
  for (const q of factors) {
    while (ord % q === 0) {
      const cand = ord / q;
      if (modPow(a, cand, p) === 1) ord = cand;
      else break;
    }
  }
  return ord;
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep820_order_moduli_covering_metrics_fast.json');

const N = Number(process.argv[2] || 12000);
const pCutoffs = (process.argv[3] || '100,200,500,1000,2000,3000').split(',').map((x) => Number(x));
const pMax = Math.max(...pCutoffs);

const primes = sievePrimes(pMax).filter((p) => p > 3);
const spf = buildSpf(pMax + 10);

const factorsCache = new Map();
for (const p of primes) factorsCache.set(p, factorDistinct(p - 1, spf));

// exact H3 indicator
const isH3 = new Uint8Array(N + 1);
let hitCount = 0;
let a = 1n;
let b = 2n;
for (let n = 1; n <= N; n += 1) {
  if (gcdBig(a, b) === 1n) {
    isH3[n] = 1;
    hitCount += 1;
  }
  a = 2n * a + 1n;
  b = 3n * b + 2n;
}

const missCount = N - hitCount;

const mRows = [];
for (const p of primes) {
  const fac = factorsCache.get(p);
  const o2 = orderModWithFactors(2, p, fac);
  const o3 = orderModWithFactors(3, p, fac);
  mRows.push({ p, m: lcmInt(o2, o3) });
}

const cutoffRows = [];
for (const pc of pCutoffs) {
  const moduli = [...new Set(mRows.filter((r) => r.p <= pc).map((r) => r.m))].sort((u, v) => u - v);
  const covered = new Uint8Array(N + 1);
  for (const m of moduli) {
    for (let n = m; n <= N; n += m) covered[n] = 1;
  }

  let predictedMiss = 0;
  let explainedActualMiss = 0;
  let unexplainedActualMiss = 0;
  for (let n = 1; n <= N; n += 1) {
    if (covered[n]) predictedMiss += 1;
    if (isH3[n] === 0 && covered[n]) explainedActualMiss += 1;
    if (isH3[n] === 0 && !covered[n]) unexplainedActualMiss += 1;
  }

  cutoffRows.push({
    p_cutoff: pc,
    distinct_moduli_count: moduli.length,
    max_modulus: moduli.length ? moduli[moduli.length - 1] : null,
    predicted_miss_density: predictedMiss / N,
    implied_good_density: 1 - predictedMiss / N,
    actual_h3_density: hitCount / N,
    miss_explained_fraction: missCount > 0 ? explainedActualMiss / missCount : 1,
    unexplained_actual_misses: unexplainedActualMiss,
  });
}

const out = {
  problem: 'EP-820',
  method: 'exact_h3_vs_finite_order_moduli_coverings_fast',
  params: { N, p_cutoffs: pCutoffs },
  exact_h3: {
    count: hitCount,
    density: hitCount / N,
    miss_count: missCount,
  },
  cutoff_rows: cutoffRows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
