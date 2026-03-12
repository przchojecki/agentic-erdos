#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const X = Number(process.env.X || 30000000);
const OUT = process.env.OUT || '';
const checkpoints = (process.env.CHECKPOINTS || '200000,500000,1000000,2000000,5000000,10000000,20000000,30000000')
  .split(',')
  .map((s) => Number(s.trim()))
  .filter((v) => Number.isFinite(v) && v >= 10 && v <= X)
  .sort((a, b) => a - b);

function squarefreeMask(limit) {
  const sf = new Uint8Array(limit + 1);
  sf.fill(1, 1);
  const r = Math.floor(Math.sqrt(limit));
  for (let p = 2; p <= r; p += 1) {
    const sq = p * p;
    for (let v = sq; v <= limit; v += sq) sf[v] = 0;
  }
  sf[0] = 0;
  return sf;
}

const t0 = Date.now();
const sf = squarefreeMask(X);

let prev = -1;
let squarefreeCount = 0;
let gapCount = 0;
let sumGap = 0;
let sumGap2 = 0;
let maxGap = 0;
let maxGapStart = null;

const targetSet = new Set(checkpoints);
const rows = [];

for (let n = 1; n <= X; n += 1) {
  if (!sf[n]) {
    if (targetSet.has(n)) {
      rows.push({
        X: n,
        squarefree_count: squarefreeCount,
        density: Number((squarefreeCount / n).toPrecision(8)),
        mean_gap: gapCount > 0 ? Number((sumGap / gapCount).toPrecision(8)) : null,
        second_moment_gap: gapCount > 0 ? Number((sumGap2 / gapCount).toPrecision(8)) : null,
        max_gap: maxGap,
        max_gap_start: maxGapStart,
      });
    }
    continue;
  }

  squarefreeCount += 1;
  if (prev >= 0) {
    const g = n - prev;
    gapCount += 1;
    sumGap += g;
    sumGap2 += g * g;
    if (g > maxGap) {
      maxGap = g;
      maxGapStart = prev;
    }
  }
  prev = n;

  if (targetSet.has(n)) {
    rows.push({
      X: n,
      squarefree_count: squarefreeCount,
      density: Number((squarefreeCount / n).toPrecision(8)),
      mean_gap: gapCount > 0 ? Number((sumGap / gapCount).toPrecision(8)) : null,
      second_moment_gap: gapCount > 0 ? Number((sumGap2 / gapCount).toPrecision(8)) : null,
      max_gap: maxGap,
      max_gap_start: maxGapStart,
    });
  }
}

const out = {
  problem: 'EP-489',
  script: path.basename(process.argv[1]),
  method: 'squarefree_gap_second_moment_profile_for_model_A_eq_{p^2}',
  params: {
    X,
    checkpoints,
    reference_density_6_over_pi2: 6 / (Math.PI * Math.PI),
    reference_mean_gap_pi2_over_6: (Math.PI * Math.PI) / 6,
  },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
