#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function isPrimeInt(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false;
  return true;
}

function gcdInt(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function lucasSeq(a0, a1, len) {
  const a = [a0, a1];
  for (let i = 2; i < len; i += 1) {
    const next = a[i - 1] + a[i - 2];
    if (!Number.isSafeInteger(next) || next <= 0) return a;
    a.push(next);
  }
  return a;
}

function compositePrefixLen(arr) {
  let t = 0;
  while (t < arr.length && !isPrimeInt(arr[t])) t += 1;
  return t;
}

const compositeSeeds = [];
for (let x = 4; x <= 400; x += 1) if (!isPrimeInt(x)) compositeSeeds.push(x);

const deepPasses = 24;
let bestAny = null;
let bestGcd1 = null;
for (let pass = 0; pass < deepPasses; pass += 1) {
  let curBestAny = null;
  let curBestGcd1 = null;
  for (const a0 of compositeSeeds) {
    for (const a1 of compositeSeeds) {
      const seq = lucasSeq(a0, a1, 48);
      if (seq.length < 12) continue;
      const t = compositePrefixLen(seq);
      if (t < 8) continue;
      let g = 0;
      for (let i = 0; i < t; i += 1) g = gcdInt(g, seq[i]);
      const rec = {
        a0,
        a1,
        composite_prefix_len: t,
        gcd_prefix: g,
        prefix_tail_value: seq[t - 1],
      };
      if (!curBestAny || t > curBestAny.composite_prefix_len || (t === curBestAny.composite_prefix_len && rec.gcd_prefix < curBestAny.gcd_prefix)) curBestAny = rec;
      if (g === 1 && (!curBestGcd1 || t > curBestGcd1.composite_prefix_len)) curBestGcd1 = rec;
    }
  }
  bestAny = curBestAny;
  bestGcd1 = curBestGcd1;
}

const out = {
  problem: 'EP-276',
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  result: {
    description: 'Deep small-seed Lucas scan for long initial composite runs and gcd behavior.',
    deep_passes: deepPasses,
    seed_range: [4, 400],
    terms_tested: 48,
    best_overall: bestAny,
    best_with_prefix_gcd_1: bestGcd1,
  },
};

const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-276', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(out, null, 2));
}
