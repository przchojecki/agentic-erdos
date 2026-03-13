#!/usr/bin/env node
import fs from 'fs';

// EP-824: deeper finite scan of
// h(x)=#{1<=a<b<x : gcd(a,b)=1 and sigma(a)=sigma(b)}.

const OUT = process.env.OUT || 'data/ep824_standalone_deeper.json';
const X_LIST = [10_000, 20_000, 30_000, 40_000, 50_000];
const MAXX = X_LIST[X_LIST.length - 1];

function gcd(a, b) {
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

const t0 = Date.now();
const sigma = new Uint32Array(MAXX + 1);
for (let d = 1; d <= MAXX; d += 1) {
  for (let m = d; m <= MAXX; m += d) sigma[m] += d;
}

function hOfX(x) {
  const buckets = new Map();
  for (let a = 1; a < x; a += 1) {
    const s = sigma[a];
    let arr = buckets.get(s);
    if (!arr) {
      arr = [];
      buckets.set(s, arr);
    }
    arr.push(a);
  }

  let h = 0;
  let tested_pairs = 0;
  for (const arr of buckets.values()) {
    const k = arr.length;
    if (k < 2) continue;
    for (let i = 0; i < k; i += 1) {
      const ai = arr[i];
      for (let j = i + 1; j < k; j += 1) {
        tested_pairs += 1;
        if (gcd(ai, arr[j]) === 1) h += 1;
      }
    }
  }
  return { h, tested_pairs };
}

const rows = [];
for (const x of X_LIST) {
  const { h, tested_pairs } = hOfX(x);
  rows.push({
    x,
    h_x: h,
    tested_pairs_with_equal_sigma: tested_pairs,
    h_over_x: Number((h / x).toPrecision(7)),
    h_over_x_pow_1p5: Number((h / (x ** 1.5)).toPrecision(7)),
    log_h_over_log_x: h > 0 ? Number((Math.log(h) / Math.log(x)).toPrecision(7)) : null,
  });
}

const out = {
  problem: 'EP-824',
  script: 'ep824.mjs',
  method: 'coprime_equal_sigma_pair_count_deepened',
  params: { X_LIST },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
