#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-1096 finite probe:
// For q in (1,2), study sorted finite sums sum_{i=0}^M c_i q^i, c_i in {0,1},
// and examine tail gaps.

const Q_LIST = (process.env.Q_LIST || '1.05,1.1,1.2,1.3,1.3247179572,1.4')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => x > 1 && x < 2);
const M = Number(process.env.M || 18);

function buildSums(q, m) {
  let arr = [0];
  for (let i = 0; i <= m; i++) {
    const qi = Math.pow(q, i);
    const len = arr.length;
    const out = new Array(len * 2);
    for (let j = 0; j < len; j++) {
      const v = arr[j];
      out[j] = v;
      out[j + len] = v + qi;
    }
    arr = out;
  }
  arr.sort((a, b) => a - b);
  return arr;
}

function gapStats(sorted) {
  const n = sorted.length;
  const gaps = new Array(n - 1);
  for (let i = 0; i + 1 < n; i++) gaps[i] = sorted[i + 1] - sorted[i];
  let maxGap = 0;
  for (const g of gaps) if (g > maxGap) maxGap = g;

  const q3Start = Math.floor(0.75 * gaps.length);
  let tailMax = 0;
  let tailAvg = 0;
  for (let i = q3Start; i < gaps.length; i++) {
    const g = gaps[i];
    tailAvg += g;
    if (g > tailMax) tailMax = g;
  }
  tailAvg /= Math.max(1, gaps.length - q3Start);
  return { maxGap, tailMaxGapLastQuartile: tailMax, tailAvgGapLastQuartile: tailAvg };
}

const rows = [];
for (const q of Q_LIST) {
  const sums = buildSums(q, M);
  const stats = gapStats(sums);
  rows.push({
    q,
    m: M,
    count: sums.length,
    max_gap: Number(stats.maxGap.toFixed(12)),
    tail_max_gap_last_quartile: Number(stats.tailMaxGapLastQuartile.toFixed(12)),
    tail_avg_gap_last_quartile: Number(stats.tailAvgGapLastQuartile.toFixed(12)),
    total_span: Number((sums[sums.length - 1] - sums[0]).toFixed(12)),
  });
}

const out = {
  script: path.basename(process.argv[1]),
  q_list: Q_LIST,
  m: M,
  rows,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep1096_q_subset_gap_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, rows: rows.length, m: M }, null, 2));
