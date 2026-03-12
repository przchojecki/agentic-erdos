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

function sampleSAWDistance(d, n, rng) {
  const dirs = [];
  for (let i = 0; i < d; i += 1) {
    const a = Array(d).fill(0); a[i] = 1; dirs.push(a);
    const b = Array(d).fill(0); b[i] = -1; dirs.push(b);
  }

  const pos = Array(d).fill(0);
  const visited = new Set(['0'.repeat(d)]);

  for (let step = 0; step < n; step += 1) {
    const options = [];
    for (const mv of dirs) {
      for (let i = 0; i < d; i += 1) pos[i] += mv[i];
      const k = pos.join(',');
      if (!visited.has(k)) options.push([mv, k]);
      for (let i = 0; i < d; i += 1) pos[i] -= mv[i];
    }
    if (!options.length) return null;
    const [mv, k] = options[Math.floor(rng() * options.length)];
    for (let i = 0; i < d; i += 1) pos[i] += mv[i];
    visited.add(k);
  }

  let r2 = 0;
  for (let i = 0; i < d; i += 1) r2 += pos[i] * pos[i];
  return Math.sqrt(r2);
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 529);
const tasks = [
  { d: 2, n: 40, samples: 18000 },
  { d: 2, n: 80, samples: 12000 },
  { d: 2, n: 120, samples: 9000 },
  { d: 3, n: 40, samples: 15000 },
  { d: 3, n: 80, samples: 10000 },
  { d: 4, n: 40, samples: 12000 },
  { d: 4, n: 80, samples: 8000 },
];

const rows = [];
for (const task of tasks) {
  let used = 0;
  let sum = 0;
  for (let s = 0; s < task.samples; s += 1) {
    const d = sampleSAWDistance(task.d, task.n, rng);
    if (d === null) continue;
    used += 1;
    sum += d;
  }
  const mean = used ? sum / used : 0;
  rows.push({
    d: task.d,
    n: task.n,
    samples_attempted: task.samples,
    samples_used: used,
    expected_distance_proxy: Number(mean.toPrecision(8)),
    over_sqrt_n: Number((mean / Math.sqrt(task.n)).toPrecision(8)),
    over_n_pow_0_75: Number((mean / (task.n ** 0.75)).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-529',
  script: path.basename(process.argv[1]),
  method: 'kinetic_growth_monte_carlo_proxy_for_saw_displacement',
  params: { tasks },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
