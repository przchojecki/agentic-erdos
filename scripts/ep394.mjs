#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveSpf(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i += 1) {
    if (spf[i]) continue;
    spf[i] = i;
    if (i * i <= n) {
      for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
    }
  }
  return spf;
}

function factorPrimePowers(n, spf) {
  const out = [];
  let x = n;
  while (x > 1) {
    const p = spf[x];
    let pp = 1;
    while (x % p === 0) {
      x = Math.floor(x / p);
      pp *= p;
    }
    out.push(pp);
  }
  return out;
}

function egcd(a, b) {
  if (b === 0) return [a, 1, 0];
  const [g, x1, y1] = egcd(b, a % b);
  return [g, y1, x1 - Math.floor(a / b) * y1];
}

function modInv(a, mod) {
  const [g, x] = egcd(a, mod);
  if (g !== 1) return null;
  return ((x % mod) + mod) % mod;
}

function crtZeroMinusOne(a, b) {
  if (a === 1) return b - 1;
  if (b === 1) return a;
  const inv = modInv(a % b, b);
  const t = ((-inv) % b + b) % b;
  const m = a * t;
  return m === 0 ? a * b : m;
}

function t2Exact(n, spf) {
  const parts = factorPrimePowers(n, spf);
  let best = n;
  const W = parts.length;
  const total = 1 << W;

  for (let mask = 0; mask < total; mask += 1) {
    let a = 1;
    let b = 1;
    for (let i = 0; i < W; i += 1) {
      if ((mask >> i) & 1) a *= parts[i];
      else b *= parts[i];
    }
    const m = crtZeroMinusOne(a, b);
    if (m < best) best = m;
  }

  return best;
}

function factorCounts(x, spf) {
  const m = new Map();
  let n = x;
  while (n > 1) {
    const p = spf[n];
    m.set(p, (m.get(p) || 0) + 1);
    n = Math.floor(n / p);
  }
  return m;
}

function hasAllReq(win, req) {
  for (const [p, e] of req) if ((win.get(p) || 0) < e) return false;
  return true;
}

function addFactors(win, n, spf, scale) {
  let x = n;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    const v = (win.get(p) || 0) + scale * e;
    if (v === 0) win.delete(p);
    else win.set(p, v);
  }
}

function tKBySliding(n, k, spf) {
  if (k === 2) return t2Exact(n, spf);
  const req = factorCounts(n, spf);
  const win = new Map();
  for (let t = 1; t <= k; t += 1) addFactors(win, t, spf, +1);

  for (let m = 1; m <= n; m += 1) {
    if (hasAllReq(win, req)) return m;
    addFactors(win, m, spf, -1);
    addFactors(win, m + k, spf, +1);
  }
  return n;
}

const N2 = Number(process.env.N2 || 200000);
const N34 = Number(process.env.N34 || 10000);
const MILESTONES = (process.env.MILESTONES || '1000,5000,10000,50000,100000,200000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const spf = sieveSpf(Math.max(N2, N34 + 5));
const mset = new Set(MILESTONES);

let sum2 = 0;
let sum3 = 0;
let sum4 = 0;
const rows2 = [];
const rows34 = [];

for (let n = 1; n <= N2; n += 1) {
  const v2 = t2Exact(n, spf);
  sum2 += v2;
  if (mset.has(n)) {
    rows2.push({ n, sum_t2_up_to_n: sum2, avg_t2: Number((sum2 / n).toPrecision(8)) });
  }
}

for (let n = 1; n <= N34; n += 1) {
  const v3 = tKBySliding(n, 3, spf);
  const v4 = tKBySliding(n, 4, spf);
  sum3 += v3;
  sum4 += v4;
  if (mset.has(n)) {
    rows34.push({
      n,
      sum_t3_up_to_n: sum3,
      sum_t4_up_to_n: sum4,
      ratio_sum_t4_over_t3: Number((sum4 / sum3).toPrecision(8)),
      ratio_sum_t3_over_t2_prefix: Number((sum3 / rows2.find((r) => r.n === n).sum_t2_up_to_n).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-394',
  script: path.basename(process.argv[1]),
  method: 'exact_prefix_sums_for_t2_and_finite_prefix_for_t3_t4',
  params: { N2, N34, MILESTONES },
  sum_t2_up_to_N2: sum2,
  sum_t3_up_to_N34: sum3,
  sum_t4_up_to_N34: sum4,
  rows_t2: rows2,
  rows_t3_t4: rows34,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
