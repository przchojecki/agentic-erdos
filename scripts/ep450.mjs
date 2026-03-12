#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function buildHasDiv(N, n) {
  const arr = new Uint8Array(N + 1);
  for (let d = n + 1; d <= 2 * n - 1; d += 1) {
    for (let m = d; m <= N; m += d) arr[m] = 1;
  }
  return arr;
}

function prefix(arr) {
  const p = new Uint32Array(arr.length);
  for (let i = 1; i < arr.length; i += 1) p[i] = p[i - 1] + arr[i];
  return p;
}

const N_LIST = (process.env.N_LIST || '120,300,700,1200').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const XMAX = Number(process.env.XMAX || 300000);
const OUT = process.env.OUT || '';

const rows = [];
for (const n of N_LIST) {
  const ys = [2 * n, 4 * n, 8 * n, 16 * n, 32 * n];
  const YMAX = Math.max(...ys);
  const arr = buildHasDiv(XMAX + YMAX + 5, n);
  const prefArr = prefix(arr);

  for (const y of ys) {
    let minD = 1;
    let maxD = 0;
    let avgD = 0;
    let argMin = 0;
    const cnt = XMAX + 1;
    for (let x = 0; x <= XMAX; x += 1) {
      const c = prefArr[x + y] - prefArr[x];
      const d = c / y;
      avgD += d;
      if (d < minD) {
        minD = d;
        argMin = x;
      }
      if (d > maxD) maxD = d;
    }
    rows.push({
      n,
      y,
      min_density_over_x: Number(minD.toPrecision(8)),
      argmin_x: argMin,
      max_density_over_x: Number(maxD.toPrecision(8)),
      mean_density_over_x: Number((avgD / cnt).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-450',
  script: path.basename(process.argv[1]),
  method: 'deep_x_window_density_profile_for_divisors_in_n_2n',
  params: { N_LIST, XMAX },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
