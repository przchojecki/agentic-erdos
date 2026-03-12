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

function approxRootsInInterval(coeff, L, R, grid) {
  const xs = new Float64Array(grid + 1);
  const vs = new Float64Array(grid + 1);
  for (let i = 0; i <= grid; i += 1) {
    const x = L + ((R - L) * i) / grid;
    xs[i] = x;
    vs[i] = evalPoly(coeff, x);
  }
  let cnt = 0;
  const eps = 1e-12;
  for (let i = 1; i <= grid; i += 1) {
    const a = vs[i - 1];
    const b = vs[i];
    if (Math.abs(a) < eps || Math.abs(b) < eps || a * b < 0) cnt += 1;
  }
  return cnt;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 521);
const tasks = [
  { n: 200, trials: 220, grid: 1800 },
  { n: 400, trials: 170, grid: 1800 },
  { n: 800, trials: 120, grid: 1800 },
  { n: 1200, trials: 90, grid: 1800 },
];

const rows = [];
for (const task of tasks) {
  let sum = 0;
  let maxr = 0;
  for (let t = 0; t < task.trials; t += 1) {
    const coeff = Array.from({ length: task.n + 1 }, () => (rng() < 0.5 ? -1 : 1));
    const r = approxRootsInInterval(coeff, -1, 1, task.grid);
    sum += r;
    if (r > maxr) maxr = r;
  }
  const avg = sum / task.trials;
  rows.push({
    n: task.n,
    trials: task.trials,
    grid: task.grid,
    approx_avg_roots_in_minus1_1: Number(avg.toPrecision(8)),
    approx_avg_over_log_n: Number((avg / Math.log(task.n)).toPrecision(8)),
    approx_max_roots_in_minus1_1: maxr,
  });
}

const out = {
  problem: 'EP-521',
  script: path.basename(process.argv[1]),
  method: 'deep_grid_sign_change_proxy_for_real_roots_in_minus1_1',
  params: { tasks },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
