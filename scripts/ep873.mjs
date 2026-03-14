#!/usr/bin/env node
import fs from 'fs';

const OUT = process.env.OUT || 'data/ep873_standalone_deeper.json';
const X_LIST = [1e3, 3e3, 1e4, 3e4, 1e5, 3e5, 1e6].map((x) => Math.floor(x));
const K_LIST = [3, 4, 5, 6];
const M = 2500;

function gcd(a, b) {
  while (b !== 0n) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}
function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

function primesUpToCount(cnt) {
  const arr = [];
  let x = 2;
  while (arr.length < cnt) {
    let p = true;
    for (let d = 2; d * d <= x; d += 1) if (x % d === 0) {
      p = false;
      break;
    }
    if (p) arr.push(x);
    x += 1;
  }
  return arr;
}

const seqs = {
  naturals: Array.from({ length: M + 10 }, (_, i) => i + 1),
  odds: Array.from({ length: M + 10 }, (_, i) => 2 * i + 1),
  primes: primesUpToCount(M + 10),
  powers2: Array.from({ length: M + 10 }, (_, i) => (i < 50 ? 2 ** i : 2 ** 50)),
};

function Fof(seq, X, k) {
  const BX = BigInt(X);
  let cnt = 0;
  for (let i = 0; i + k <= M; i += 1) {
    let cur = 1n;
    for (let j = i; j < i + k; j += 1) {
      cur = lcm(cur, BigInt(seq[j]));
      if (cur >= BX) break;
    }
    if (cur < BX) cnt += 1;
  }
  return cnt;
}

function slope(rows) {
  const pts = rows.filter((r) => r.F > 0);
  if (pts.length < 2) return null;
  const x1 = Math.log(pts[0].X), y1 = Math.log(pts[0].F);
  const x2 = Math.log(pts[pts.length - 1].X), y2 = Math.log(pts[pts.length - 1].F);
  return Number(((y2 - y1) / (x2 - x1)).toPrecision(8));
}

const t0 = Date.now();
const rows = [];
for (const [name, seq] of Object.entries(seqs)) {
  for (const k of K_LIST) {
    const r = X_LIST.map((X) => ({ X, F: Fof(seq, X, k) }));
    rows.push({
      sequence: name,
      k,
      values: r,
      endpoint_loglog_slope: slope(r),
    });
  }
}

const out = {
  problem: 'EP-873',
  script: 'ep873.mjs',
  method: 'empirical_profile_of_FAXk_for_multiple_sequences_and_k',
  warning: 'Finite sequence/finite X empirics only.',
  params: { X_LIST, K_LIST, M, sequences: Object.keys(seqs) },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
