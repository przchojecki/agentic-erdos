#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function omegaSieve(n) {
  const omega = new Uint8Array(n + 1);
  for (let p = 2; p <= n; p += 1) {
    if (omega[p] !== 0) continue;
    for (let j = p; j <= n; j += p) omega[j] += 1;
  }
  return omega;
}

const X_LIST = (process.env.X_LIST || '20000,50000,100000,200000,500000,1000000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';
const XMAX = Math.max(...X_LIST);

const omega = omegaSieve(2 * XMAX + 5);

function longestRunInInterval(lo, hi, pred) {
  let best = 0;
  let bestStart = null;
  let cur = 0;
  let curStart = lo;
  for (let n = lo; n <= hi; n += 1) {
    if (pred(n)) {
      if (cur === 0) curStart = n;
      cur += 1;
      if (cur > best) {
        best = cur;
        bestStart = curStart;
      }
    } else {
      cur = 0;
    }
  }
  return { len: best, start: bestStart };
}

const rows = [];
for (const X of X_LIST) {
  const thr = Math.log(Math.log(X));
  const run = longestRunInInterval(X, 2 * X, (n) => omega[n] > thr);
  const baseline = Math.log(X) / (Math.log(Math.log(X)) ** 2);
  rows.push({
    X,
    threshold_loglogX: Number(thr.toPrecision(8)),
    longest_run_len: run.len,
    run_start: run.start,
    run_over_baseline: Number((run.len / baseline).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-452',
  script: path.basename(process.argv[1]),
  method: 'deep_longest_run_profile_for_omega_above_loglog',
  params: { X_LIST },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
