#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveMinPrime(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i += 1) if (!spf[i]) {
    spf[i] = i;
    if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
  }
  return spf;
}

const N = Number(process.env.N || 2000000);
const OUT = process.env.OUT || '';
const MILESTONES = (process.env.MILESTONES || '10000,50000,100000,300000,500000,1000000,1500000,2000000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);

const spf = sieveMinPrime(N);
const diff = new Int32Array(N + 3);

for (let m = 4; m <= N; m += 1) {
  if (spf[m] === m) continue;
  const L = m + 1;
  const R = Math.min(N, m + spf[m] - 1);
  if (L <= R) {
    diff[L] += 1;
    diff[R + 1] -= 1;
  }
}

const cover = new Uint8Array(N + 1);
let cur = 0;
for (let n = 1; n <= N; n += 1) {
  cur += diff[n];
  if (cur > 0) cover[n] = 1;
}

const rows = [];
let cntCovered = 0;
for (let n = 1; n <= N; n += 1) {
  if (cover[n]) cntCovered += 1;
  if (MILESTONES.includes(n)) {
    rows.push({ n, covered_n_count_up_to_n: cntCovered, uncovered_count_up_to_n: n - cntCovered, covered_density: Number((cntCovered / n).toPrecision(8)) });
  }
}

const smallUncovered = [];
for (let n = 2; n <= N && smallUncovered.length < 80; n += 1) if (!cover[n]) smallUncovered.push(n);

const out = {
  problem: 'EP-430',
  script: path.basename(process.argv[1]),
  method: 'interval_cover_from_composite_witnesses_via_min_prime_factor',
  params: { N, MILESTONES },
  rows,
  first_80_uncovered_n: smallUncovered,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
