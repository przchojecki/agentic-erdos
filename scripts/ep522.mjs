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

function windingInside(coeff, M = 4096) {
  let total = 0;
  let prevArg = null;
  let unstable = false;
  for (let i = 0; i <= M; i += 1) {
    const t = (2 * Math.PI * i) / M;
    const ct = Math.cos(t);
    const st = Math.sin(t);
    let re = 0;
    let im = 0;
    for (let k = coeff.length - 1; k >= 0; k -= 1) {
      const nre = re * ct - im * st + coeff[k];
      const nim = re * st + im * ct;
      re = nre;
      im = nim;
    }
    const mag = Math.hypot(re, im);
    if (mag < 1e-10) unstable = true;
    const arg = Math.atan2(im, re);
    if (prevArg !== null) {
      let d = arg - prevArg;
      while (d <= -Math.PI) d += 2 * Math.PI;
      while (d > Math.PI) d -= 2 * Math.PI;
      total += d;
    }
    prevArg = arg;
  }
  return { rootsInside: Math.round(total / (2 * Math.PI)), unstable };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 522);
const tasks = [
  { n: 100, trials: 120, M: 4096 },
  { n: 200, trials: 100, M: 4096 },
  { n: 400, trials: 80, M: 4096 },
];
const rows = [];
for (const task of tasks) {
  let sum = 0;
  let sumSq = 0;
  let unstable = 0;
  for (let t = 0; t < task.trials; t += 1) {
    const coeff = Array.from({ length: task.n + 1 }, () => (rng() < 0.5 ? -1 : 1));
    const r = windingInside(coeff, task.M);
    if (r.unstable) unstable += 1;
    sum += r.rootsInside;
    sumSq += r.rootsInside * r.rootsInside;
  }
  const mean = sum / task.trials;
  const varr = Math.max(0, sumSq / task.trials - mean * mean);
  rows.push({
    n: task.n,
    trials: task.trials,
    M: task.M,
    unstable_trials: unstable,
    avg_roots_inside_disk: Number(mean.toPrecision(8)),
    std_roots_inside_disk: Number(Math.sqrt(varr).toPrecision(8)),
    ratio_avg_over_n_over_2: Number((mean / (task.n / 2)).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-522',
  script: path.basename(process.argv[1]),
  method: 'deep_argument_principle_monte_carlo_for_roots_inside_unit_disk',
  params: { tasks },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
