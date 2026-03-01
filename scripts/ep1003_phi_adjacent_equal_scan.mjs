#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const X_MAX = Number(process.env.X_MAX || 5000000);

const phi = new Int32Array(X_MAX + 2);
for (let i = 0; i <= X_MAX + 1; i++) phi[i] = i;
for (let i = 2; i <= X_MAX + 1; i++) {
  if (phi[i] === i) {
    for (let j = i; j <= X_MAX + 1; j += i) {
      phi[j] -= Math.floor(phi[j] / i);
    }
  }
}

const checkpoints = [100000, 300000, 1000000, 3000000, X_MAX].filter((x, i, a) => x <= X_MAX && a.indexOf(x) === i);
let cpIdx = 0;
let count = 0;
const firstHits = [];
const rows = [];

for (let n = 2; n <= X_MAX; n++) {
  if (phi[n] === phi[n + 1]) {
    count++;
    if (firstHits.length < 100) firstHits.push(n);
  }
  while (cpIdx < checkpoints.length && n >= checkpoints[cpIdx]) {
    rows.push({ x: checkpoints[cpIdx], count_solutions_up_to_x: count, density: Number((count / checkpoints[cpIdx]).toExponential(6)) });
    cpIdx++;
  }
}

const out = {
  script: path.basename(process.argv[1]),
  x_max: X_MAX,
  checkpoints: rows,
  first_hits: firstHits,
  total_count: count,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep1003_phi_adjacent_equal_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, x_max: X_MAX, total_count: count }, null, 2));
