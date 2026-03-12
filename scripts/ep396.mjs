#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveSpf(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i += 1) {
    if (spf[i]) continue;
    spf[i] = i;
    if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
  }
  return spf;
}

function primesFromSpf(spf) {
  const ps = [];
  for (let i = 2; i < spf.length; i += 1) if (spf[i] === i) ps.push(i);
  return ps;
}

function vpFact(n, p) {
  let s = 0;
  let pp = p;
  while (pp <= n) {
    s += Math.floor(n / pp);
    pp *= p;
  }
  return s;
}

function vpCentralBinom(n, p) {
  return vpFact(2 * n, p) - 2 * vpFact(n, p);
}

function factorizeInt(x, spf) {
  const out = [];
  let n = x;
  while (n > 1) {
    const p = spf[n];
    let e = 0;
    while (n % p === 0) {
      n = Math.floor(n / p);
      e += 1;
    }
    out.push([p, e]);
  }
  return out;
}

const N = Number(process.env.N || 30000);
const KMAX = Number(process.env.KMAX || 12);
const MILESTONES = (process.env.MILESTONES || '5000,10000,15000,20000,25000,30000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const spf = sieveSpf(2 * N + 10);
const primes = primesFromSpf(spf);

const firstN = Array(KMAX + 1).fill(null);
const hitCounts = Array(KMAX + 1).fill(0);
const mset = new Set(MILESTONES);
const rows = [];

for (let n = 2; n <= N; n += 1) {
  const vp = new Map();
  for (const p of primes) {
    if (p > n) break;
    const e = vpCentralBinom(n, p);
    if (e > 0) vp.set(p, e);
  }

  const acc = new Map();
  const lim = Math.min(KMAX, n - 1);
  for (let k = 0; k <= lim; k += 1) {
    const factors = factorizeInt(n - k, spf);
    for (const [p, e] of factors) acc.set(p, (acc.get(p) || 0) + e);

    let ok = true;
    for (const [p, e] of acc.entries()) {
      if ((vp.get(p) || 0) < e) {
        ok = false;
        break;
      }
    }

    if (ok) {
      hitCounts[k] += 1;
      if (firstN[k] === null) firstN[k] = n;
    }
  }

  if (mset.has(n)) {
    rows.push({
      n,
      first_n_found_up_to_kmax: firstN.map((v) => v),
      hit_counts_up_to_kmax: hitCounts.map((v) => v),
    });
  }
}

const out = {
  problem: 'EP-396',
  script: path.basename(process.argv[1]),
  method: 'extended_search_descending_product_divides_central_binomial',
  params: { N, KMAX, MILESTONES },
  rows_by_k: Array.from({ length: KMAX + 1 }, (_, k) => ({ k, first_n_found: firstN[k], hit_count_in_range: hitCounts[k] })),
  milestone_rows: rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
