#!/usr/bin/env node
import fs from 'fs';

const OUT = process.env.OUT || 'data/ep857_standalone_deeper.json';
const CASES = [
  [8, 120],
  [9, 100],
  [10, 80],
  [11, 60],
  [12, 40],
];

function makeRng(seed = 857_2026) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
const rng = makeRng();

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function isSunflower3(a, b, c) {
  const core = a & b & c;
  return (a & b) === core && (a & c) === core && (b & c) === core;
}

function greedyFamily(n, restarts) {
  const total = 1 << n;
  const all = Array.from({ length: total }, (_, i) => i);
  let best = [];
  for (let r = 0; r < restarts; r += 1) {
    const order = all.slice();
    shuffle(order);
    const F = [];
    for (const s of order) {
      let ok = true;
      for (let i = 0; i < F.length && ok; i += 1) {
        for (let j = i + 1; j < F.length; j += 1) {
          if (isSunflower3(F[i], F[j], s)) {
            ok = false;
            break;
          }
        }
      }
      if (ok) F.push(s);
    }
    if (F.length > best.length) best = F;
  }
  return best;
}

const t0 = Date.now();
const rows = [];
const base = 3 / (2 ** (2 / 3));
for (const [n, restarts] of CASES) {
  const best = greedyFamily(n, restarts);
  rows.push({
    n,
    restarts,
    best_3sunflower_free_family_size_found: best.length,
    ratio_over_base_pow_n: Number((best.length / (base ** n)).toPrecision(8)),
    ratio_over_2_pow_n: Number((best.length / (2 ** n)).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-857',
  script: 'ep857.mjs',
  method: 'deeper_random_greedy_lower_bound_profile_for_weak_sunflowers_k3',
  params: { CASES },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
