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

function uniquePrimeDivisors(n, spf) {
  const ps = [];
  let x = n;
  let last = 0;
  while (x > 1) {
    const p = spf[x];
    if (p !== last) ps.push(p);
    last = p;
    x = Math.floor(x / p);
  }
  return ps;
}

function divisorsFromFactorMap(fac) {
  let divs = [1];
  for (const [p, e] of fac.entries()) {
    const prev = divs.slice();
    let mul = 1;
    for (let i = 1; i <= e; i += 1) {
      mul *= p;
      for (const d of prev) divs.push(d * mul);
    }
  }
  divs.sort((a, b) => a - b);
  return divs;
}

function longestPrimeChainLength(primes) {
  if (primes.length === 0) return 0;
  const dp = Array(primes.length).fill(1);
  let best = 1;
  for (let j = 0; j < primes.length; j += 1) {
    for (let i = 0; i < j; i += 1) {
      if (primes[j] % primes[i] === 1) dp[j] = Math.max(dp[j], dp[i] + 1);
    }
    if (dp[j] > best) best = dp[j];
  }
  return best;
}

function longestDivisorChainLength(divs) {
  const vals = divs.filter((d) => d > 1);
  if (vals.length === 0) return 0;
  const dp = Array(vals.length).fill(1);
  let best = 1;
  for (let j = 0; j < vals.length; j += 1) {
    for (let i = 0; i < j; i += 1) {
      if (vals[j] % vals[i] === 1) dp[j] = Math.max(dp[j], dp[i] + 1);
    }
    if (dp[j] > best) best = dp[j];
  }
  return best;
}

const t0 = Date.now();
const N = Number(process.env.N || 25000);
const spf = spfSieve(N);

const stats = [];
let sumH = 0;
let sumBigH = 0;
let cntRatioGt1 = 0;
let bestGap = { n: 2, h: 1, H: 1, gap: 0, ratio: 1 };
const milestoneBase = [1000, 5000, 10000, 20000, 25000, 50000, 80000, 100000];
const milestones = new Set(milestoneBase.filter((x) => x <= N).concat([N]));

for (let n = 2; n <= N; n += 1) {
  const ps = uniquePrimeDivisors(n, spf);
  const h = longestPrimeChainLength(ps);
  const fac = factorize(n, spf);
  const divs = divisorsFromFactorMap(fac);
  const H = longestDivisorChainLength(divs);

  sumH += h;
  sumBigH += H;
  if (H > h) cntRatioGt1 += 1;

  const gap = H - h;
  const ratio = h > 0 ? H / h : null;
  if (gap > bestGap.gap || (gap === bestGap.gap && ratio != null && ratio > bestGap.ratio)) {
    bestGap = { n, h, H, gap, ratio: ratio == null ? null : Number(ratio.toPrecision(8)) };
  }

  if (milestones.has(n)) {
    stats.push({
      upto_n: n,
      mean_h: Number((sumH / (n - 1)).toPrecision(8)),
      mean_H: Number((sumBigH / (n - 1)).toPrecision(8)),
      fraction_H_gt_h: Number((cntRatioGt1 / (n - 1)).toPrecision(8)),
      best_gap_record: bestGap,
    });
  }
}

const topExamples = [];
for (let n = 2; n <= N; n += 1) {
  const ps = uniquePrimeDivisors(n, spf);
  const h = longestPrimeChainLength(ps);
  const H = longestDivisorChainLength(divisorsFromFactorMap(factorize(n, spf)));
  if (h > 0 && H / h >= 2) {
    topExamples.push({ n, h, H, ratio_H_over_h: Number((H / h).toPrecision(8)) });
    if (topExamples.length >= 20) break;
  }
}

const out = {
  problem: 'EP-696',
  script: path.basename(process.argv[1]),
  method: 'exact_chain_lengths_over_divisors_and_prime_divisors',
  params: { N },
  stats,
  first_examples_ratio_ge_2: topExamples,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
