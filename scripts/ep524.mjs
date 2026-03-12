#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function evalPoly(coeff, x) {
  let v = 0;
  for (let i = coeff.length - 1; i >= 0; i -= 1) v = v * x + coeff[i];
  return v;
}

function maxOnInterval(coeff, grid = 5000) {
  let best = 0;
  for (let i = 0; i <= grid; i += 1) {
    const x = -1 + (2 * i) / grid;
    const v = Math.abs(evalPoly(coeff, x));
    if (v > best) best = v;
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 524);
const tasks = [
  { n: 200, trials: 240 },
  { n: 400, trials: 180 },
  { n: 800, trials: 130 },
  { n: 1200, trials: 90 },
];

const rows = [];
for (const task of tasks) {
  let sum = 0;
  let best = 0;
  for (let t = 0; t < task.trials; t += 1) {
    const coeff = Array.from({ length: task.n + 1 }, () => (rng() < 0.5 ? -1 : 1));
    const m = maxOnInterval(coeff, 5000);
    sum += m;
    if (m > best) best = m;
  }
  const avg = sum / task.trials;
  rows.push({
    n: task.n,
    trials: task.trials,
    avg_M_n: Number(avg.toPrecision(8)),
    max_M_n_seen: Number(best.toPrecision(8)),
    avg_over_sqrt_n: Number((avg / Math.sqrt(task.n)).toPrecision(8)),
    avg_over_sqrt_n_over_loglog_n: Number((avg / Math.sqrt(task.n / Math.log(Math.log(task.n)))).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-524',
  script: path.basename(process.argv[1]),
  method: 'deep_monte_carlo_profile_for_sup_norm_of_random_sign_polynomials_on_minus1_1',
  params: { tasks },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
