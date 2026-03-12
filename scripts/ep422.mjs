#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const N = Number(process.env.N || 2000000);
const OUT = process.env.OUT || '';
const MILESTONES = (process.env.MILESTONES || '100000,300000,500000,1000000,1500000,2000000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);

const f = new Int32Array(N + 1);
f[1] = 1;
if (N >= 2) f[2] = 1;

let badIndex = null;
for (let n = 3; n <= N; n += 1) {
  const a = n - f[n - 1];
  const b = n - f[n - 2];
  if (a < 1 || b < 1) {
    badIndex = n;
    break;
  }
  f[n] = f[a] + f[b];
}

let maxF = 0;
for (let i = 1; i <= N; i += 1) if (f[i] > maxF) maxF = f[i];
const seen = new Uint8Array(maxF + 1);
for (let n = 1; n <= N; n += 1) {
  if (f[n] >= 0 && f[n] <= maxF) seen[f[n]] = 1;
}
let missed = 0;
const firstMissed = [];
for (let v = 1; v <= maxF; v += 1) {
  if (!seen[v]) {
    missed += 1;
    if (firstMissed.length < 80) firstMissed.push(v);
  }
}

const mset = new Set(MILESTONES);
let runningMax = 1;
const rows = [];
for (let n = 1; n <= N; n += 1) {
  if (f[n] > runningMax) runningMax = f[n];
  if (mset.has(n)) {
    rows.push({ n, f_n: f[n], running_max_f: runningMax, ratio_f_over_n: Number((f[n] / n).toPrecision(8)), ratio_maxf_over_n: Number((runningMax / n).toPrecision(8)) });
  }
}

const out = {
  problem: 'EP-422',
  script: path.basename(process.argv[1]),
  method: 'deep_prefix_analysis_of_hofstadter_conolly_recursion',
  params: { N, MILESTONES },
  first_bad_index_if_any: badIndex,
  max_f_in_prefix: maxF,
  missed_count_up_to_max_f: missed,
  first_80_missed_values: firstMissed,
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
