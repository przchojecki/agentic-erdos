#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function gcd(a, b) {
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return Math.abs(a);
}

function ratioSetSize(A) {
  const S = new Set();
  for (const a of A) {
    for (const b of A) S.add(a / gcd(a, b));
  }
  return S.size;
}

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function randomSet(n, maxV, rng) {
  const S = new Set();
  while (S.size < n) S.add(1 + Math.floor(rng() * maxV));
  return [...S].sort((a, b) => a - b);
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 539);
const configs = [
  { n: 10, maxV: 120, trials: 4000 },
  { n: 14, maxV: 200, trials: 3500 },
  { n: 18, maxV: 300, trials: 3000 },
  { n: 24, maxV: 500, trials: 2600 },
];

const rows = [];
for (const cfg of configs) {
  let best = Infinity;
  let bestA = [];
  let avg = 0;

  for (let t = 0; t < cfg.trials; t += 1) {
    let A;
    if (t % 4 === 0) {
      // structured candidate: divisors of a smooth number windowed.
      const base = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128, 192, 256, 384, 512].filter((x) => x <= cfg.maxV);
      A = base.slice(0, cfg.n);
      while (A.length < cfg.n) A.push(1 + A.length);
    } else {
      A = randomSet(cfg.n, cfg.maxV, rng);
    }
    const v = ratioSetSize(A);
    avg += v;
    if (v < best) {
      best = v;
      bestA = A.slice();
    }
  }

  rows.push({
    n: cfg.n,
    maxV: cfg.maxV,
    trials: cfg.trials,
    best_ratio_set_size_found: best,
    avg_ratio_set_size: Number((avg / cfg.trials).toPrecision(10)),
    best_over_sqrt_n: Number((best / Math.sqrt(cfg.n)).toPrecision(10)),
    best_over_n_pow_0_8: Number((best / (cfg.n ** 0.8)).toPrecision(10)),
    best_set_example: bestA,
  });
}

const out = {
  problem: 'EP-539',
  script: path.basename(process.argv[1]),
  method: 'random_structured_search_for_small_ratio_set_size_h_n_proxy',
  params: { configs },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
