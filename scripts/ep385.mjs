#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveSpf(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i += 1) if (!spf[i]) {
    spf[i] = i;
    if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
  }
  return spf;
}

const N = Number(process.env.N || 3000000);
const MILESTONES = (process.env.MILESTONES || '10000,50000,100000,500000,1000000,2000000,3000000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const spf = sieveSpf(N);
const mset = new Set(MILESTONES);

let best = -1;
let countNonPos = 0;
let maxGap = -1;
let argMaxGap = -1;
const rows = [];

for (let n = 3; n <= N; n += 1) {
  const m = n - 1;
  if (m > 3 && spf[m] !== m) {
    const cand = m + spf[m];
    if (cand > best) best = cand;
  }
  const g = best - n;
  if (g <= 0) countNonPos += 1;
  if (g > maxGap) {
    maxGap = g;
    argMaxGap = n;
  }
  if (mset.has(n)) rows.push({ n, F_n_est: best, F_minus_n: g, count_indices_le_n_with_F_le_n: countNonPos, max_F_minus_n_so_far: maxGap, argmax_n_so_far: argMaxGap });
}

const out = {
  problem: 'EP-385',
  script: path.basename(process.argv[1]),
  method: 'large_scale_profile_of_F_n_from_least_prime_factor_function',
  params: { N, MILESTONES },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
