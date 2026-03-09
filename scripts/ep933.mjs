#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const xs = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x >= 2)
    .sort((a, b) => a - b);
  return xs.length ? xs : fallback;
}

function buildValuationArray(limit, prime) {
  const arr = new Int16Array(limit + 1);
  for (let n = 1; n <= limit; n += 1) {
    if (n % prime === 0) arr[n] = arr[Math.floor(n / prime)] + 1;
  }
  return arr;
}

const NMAX = Number(process.env.NMAX || 120000000);
const MILESTONES = parseIntList(
  process.env.MILESTONES,
  [1000000, 5000000, 10000000, 20000000, 40000000, 80000000, 120000000],
);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const v2 = buildValuationArray(NMAX + 1, 2);
const v3 = buildValuationArray(NMAX + 1, 3);
const mset = new Set(MILESTONES);

let best = { n: 2, ratio_over_nlogn: -1, k: 0, l: 0 };
const tailBest = {
  10: { n: null, ratio: -1 },
  100: { n: null, ratio: -1 },
  1000: { n: null, ratio: -1 },
  10000: { n: null, ratio: -1 },
  100000: { n: null, ratio: -1 },
};
const milestoneRows = [];
const topRows = [];

function pushTop(row, keep = 30) {
  topRows.push(row);
  topRows.sort((a, b) => b.ratio_over_nlogn - a.ratio_over_nlogn);
  if (topRows.length > keep) topRows.length = keep;
}

for (let n = 2; n <= NMAX; n += 1) {
  const k = v2[n] + v2[n + 1];
  const l = v3[n] + v3[n + 1];
  const logSmooth = k * Math.log(2) + l * Math.log(3);
  const ratio = Math.exp(logSmooth - Math.log(n) - Math.log(Math.log(n)));
  if (ratio > best.ratio_over_nlogn) best = { n, k, l, ratio_over_nlogn: ratio };

  for (const t of [10, 100, 1000, 10000, 100000]) {
    if (n >= t && ratio > tailBest[t].ratio) tailBest[t] = { n, ratio };
  }
  if (ratio >= 3.5) pushTop({ n, k, l, ratio_over_nlogn: ratio });

  if (mset.has(n)) {
    milestoneRows.push({
      n,
      best_n_up_to_here: best.n,
      best_ratio_up_to_here: Number(best.ratio_over_nlogn.toPrecision(10)),
      best_ratio_for_n_ge_100000: Number(tailBest[100000].ratio.toPrecision(10)),
    });
  }
}

const out = {
  problem: 'EP-933',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_scan_of_6-smooth_part_ratio_for_n_nplus1',
  params: { NMAX, MILESTONES },
  best_record: best,
  best_records_for_n_ge: tailBest,
  milestone_rows: milestoneRows,
  top_ratio_rows: topRows,
  runtime_seconds: Number(((Date.now() - t0) / 1000).toFixed(3)),
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
