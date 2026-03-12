#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const GRID_M = Number(process.env.GRID_M || 4096);
const TRIAL_SCALE = Number(process.env.TRIAL_SCALE || 1);

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function minCosGrid(A, M) {
  let best = Infinity;
  let bestTheta = 0;
  for (let t = 0; t < M; t += 1) {
    const theta = (2 * Math.PI * t) / M;
    let s = 0;
    for (const n of A) s += Math.cos(n * theta);
    if (s < best) {
      best = s;
      bestTheta = theta;
    }
  }
  return { minSum: best, theta: bestTheta };
}

function randomSet(size, maxVal, rng) {
  const S = new Set();
  while (S.size < size) S.add(1 + Math.floor(rng() * maxVal));
  return [...S];
}

function greedySidon(size, Nmax) {
  const A = [];
  const sums = new Set();
  for (let x = 1; x <= Nmax && A.length < size; x += 1) {
    let ok = true;
    for (const a of A) {
      if (sums.has(a + x)) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    for (const a of A) sums.add(a + x);
    sums.add(2 * x);
    A.push(x);
  }
  return A;
}

function diffSet(B) {
  const S = new Set();
  for (const x of B) for (const y of B) S.add(x - y);
  return [...S];
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 510);

const tasks = [
  { N: 80, trials: Math.max(1, Math.floor(180 * TRIAL_SCALE)) },
  { N: 160, trials: Math.max(1, Math.floor(140 * TRIAL_SCALE)) },
  { N: 320, trials: Math.max(1, Math.floor(100 * TRIAL_SCALE)) },
];

const rows = [];
for (const task of tasks) {
  let bestNeg = 0;
  let avgNeg = 0;
  for (let t = 0; t < task.trials; t += 1) {
    const A = randomSet(task.N, 12 * task.N, rng);
    const { minSum } = minCosGrid(A, GRID_M);
    const neg = -minSum;
    avgNeg += neg;
    if (neg > bestNeg) bestNeg = neg;
  }
  rows.push({
    family: 'random',
    N: task.N,
    trials: task.trials,
    grid_M: GRID_M,
    best_negative_min: Number(bestNeg.toPrecision(8)),
    avg_negative_min: Number((avgNeg / task.trials).toPrecision(8)),
    best_over_sqrtN: Number((bestNeg / Math.sqrt(task.N)).toPrecision(8)),
    best_over_N_pow_1_over_7: Number((bestNeg / (task.N ** (1 / 7))).toPrecision(8)),
  });
}

for (const k of [18, 22, 26]) {
  const B = greedySidon(k, 3000);
  const A = diffSet(B);
  const { minSum } = minCosGrid(A, GRID_M);
  const neg = -minSum;
  rows.push({
    family: 'sidon_difference_B_minus_B',
    sidon_size_k: k,
    N: A.length,
    trials: 1,
    grid_M: GRID_M,
    best_negative_min: Number(neg.toPrecision(8)),
    avg_negative_min: Number(neg.toPrecision(8)),
    best_over_sqrtN: Number((neg / Math.sqrt(A.length)).toPrecision(8)),
    best_over_N_pow_1_over_7: Number((neg / (A.length ** (1 / 7))).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-510',
  script: path.basename(process.argv[1]),
  method: 'deep_grid_minimization_profiles_for_cosine_sum_problem',
  params: {
    GRID_M,
    TRIAL_SCALE,
    tasks,
  },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
