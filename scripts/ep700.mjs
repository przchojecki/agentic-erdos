#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function spfSieve(n) {
  const spf = Array.from({ length: n + 1 }, (_, i) => i);
  spf[0] = 0;
  spf[1] = 1;
  for (let i = 2; i * i <= n; i += 1) {
    if (spf[i] !== i) continue;
    for (let j = i * i; j <= n; j += i) if (spf[j] === j) spf[j] = i;
  }
  return spf;
}

function factorize(n, spf) {
  const fac = new Map();
  let x = n;
  while (x > 1) {
    const p = spf[x];
    fac.set(p, (fac.get(p) || 0) + 1);
    x = Math.floor(x / p);
  }
  return fac;
}

function vFact(n, p) {
  let x = n;
  let e = 0;
  while (x > 0) {
    x = Math.floor(x / p);
    e += x;
  }
  return e;
}

function vBinom(n, k, p) {
  return vFact(n, p) - vFact(k, p) - vFact(n - k, p);
}

function isComposite(n, spf) {
  return n >= 4 && spf[n] !== n;
}

const t0 = Date.now();
const N = Number(process.env.N || 3000);
const spf = spfSieve(N);
const milestoneBase = [200, 500, 1000, 2000, 3000, 5000, 8000, 10000];
const milestones = new Set(milestoneBase.filter((x) => x <= N).concat([N]));

let compositeCount = 0;
let eqCount = 0;
let largeCount = 0;
let maxRatio = { n: 4, ratio: 0, f: 0, n_over_P: 0 };
const stats = [];
const examplesEq = [];
const examplesLarge = [];

for (let n = 4; n <= N; n += 1) {
  if (!isComposite(n, spf)) continue;
  compositeCount += 1;

  const fac = factorize(n, spf);
  const primes = [...fac.keys()].sort((a, b) => a - b);
  const Pn = primes[primes.length - 1];
  const baseline = n / Pn;

  let f = Number.POSITIVE_INFINITY;
  for (let k = 2; k <= Math.floor(n / 2); k += 1) {
    let g = 1;
    for (const p of primes) {
      const eN = fac.get(p);
      const eB = vBinom(n, k, p);
      const e = Math.min(eN, eB);
      if (e > 0) g *= p ** e;
    }
    if (g < f) f = g;
    if (f === 1) break;
  }

  if (f === baseline) {
    eqCount += 1;
    if (examplesEq.length < 20) examplesEq.push({ n, f, n_over_P: baseline });
  }
  if (f > Math.sqrt(n)) {
    largeCount += 1;
    if (examplesLarge.length < 20) examplesLarge.push({ n, f, sqrt_n: Number(Math.sqrt(n).toPrecision(8)) });
  }

  const ratio = f / baseline;
  if (ratio > maxRatio.ratio) maxRatio = { n, ratio: Number(ratio.toPrecision(8)), f, n_over_P: baseline };

  if (milestones.has(n)) {
    stats.push({
      upto_n: n,
      composite_count: compositeCount,
      fraction_f_eq_n_over_P: Number((eqCount / compositeCount).toPrecision(8)),
      fraction_f_gt_sqrt_n: Number((largeCount / compositeCount).toPrecision(8)),
      max_ratio_f_over_n_over_P: maxRatio,
    });
  }
}

const out = {
  problem: 'EP-700',
  script: path.basename(process.argv[1]),
  method: 'exact_gcd_scan_of_binomial_coefficients_for_composite_n',
  params: { N },
  stats,
  first_examples_f_eq_n_over_P: examplesEq,
  first_examples_f_gt_sqrt_n: examplesLarge,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
