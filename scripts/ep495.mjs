#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const N = Number(process.env.N || 8000000);
const OUT = process.env.OUT || '';

const PAIRS = [
  { name: 'sqrt2_sqrt3', alpha: Math.SQRT2, beta: Math.sqrt(3) },
  { name: 'pi_e', alpha: Math.PI, beta: Math.E },
  { name: 'phi_sqrt2', alpha: (1 + Math.sqrt(5)) / 2, beta: Math.SQRT2 },
  { name: 'cuberoot2_cuberoot3', alpha: Math.cbrt(2), beta: Math.cbrt(3) },
  { name: 'sqrt2_2sqrt2', alpha: Math.SQRT2, beta: 2 * Math.SQRT2 },
];

const checkpoints = [20000, 50000, 100000, 200000, 500000, 1000000, 2000000, 5000000, 8000000].filter((x) => x <= N);

function distToNearestInt(x) {
  return Math.abs(x - Math.round(x));
}

function fracPart(x) {
  return x - Math.floor(x);
}

const t0 = Date.now();
const rows = [];

for (const pair of PAIRS) {
  let bestVal = Number.POSITIVE_INFINITY;
  let bestN = -1;
  let bestD1 = 0;
  let bestD2 = 0;
  let idx = 0;
  const profile = [];

  let f1 = 0;
  let f2 = 0;
  const a = fracPart(pair.alpha);
  const b = fracPart(pair.beta);

  for (let n = 1; n <= N; n += 1) {
    f1 += a;
    if (f1 >= 1) f1 -= 1;
    f2 += b;
    if (f2 >= 1) f2 -= 1;

    const d1 = f1 <= 0.5 ? f1 : 1 - f1;
    const d2 = f2 <= 0.5 ? f2 : 1 - f2;
    const v = n * d1 * d2;

    if (v < bestVal) {
      bestVal = v;
      bestN = n;
      bestD1 = d1;
      bestD2 = d2;
    }

    if (idx < checkpoints.length && n === checkpoints[idx]) {
      profile.push({
        N: n,
        min_n_times_dist_product: Number(bestVal.toPrecision(10)),
        witness_n: bestN,
      });
      idx += 1;
    }
  }

  rows.push({
    pair: pair.name,
    alpha: Number(pair.alpha.toPrecision(16)),
    beta: Number(pair.beta.toPrecision(16)),
    search_limit_n: N,
    minimum_n_times_dist_product: Number(bestVal.toPrecision(12)),
    witness_n: bestN,
    witness_dist_alpha: Number(bestD1.toPrecision(12)),
    witness_dist_beta: Number(bestD2.toPrecision(12)),
    profile,
  });
}

const out = {
  problem: 'EP-495',
  script: path.basename(process.argv[1]),
  method: 'deep_littlewood_quantity_scan_for_selected_real_pairs',
  params: {
    N,
    pair_count: PAIRS.length,
  },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
