#!/usr/bin/env node
import fs from 'fs';

// EP-884 direct finite scan of the divisor-gap inequality ratio.
const OUT = process.env.OUT || 'data/ep884_standalone_deeper.json';
const N = 200000;

function divisors(n) {
  const lo = [];
  const hi = [];
  const r = Math.floor(Math.sqrt(n));
  for (let d = 1; d <= r; d += 1) {
    if (n % d !== 0) continue;
    lo.push(d);
    const e = n / d;
    if (e !== d) hi.push(e);
  }
  hi.reverse();
  return lo.concat(hi);
}

const t0 = Date.now();
let maxRatio = 0;
let argN = 1;
const rows = [];
for (let n = 2; n <= N; n += 1) {
  const d = divisors(n);
  if (d.length < 3) continue;
  let sAll = 0;
  for (let i = 0; i < d.length; i += 1) {
    for (let j = i + 1; j < d.length; j += 1) sAll += 1 / (d[j] - d[i]);
  }
  let sAdj = 0;
  for (let i = 0; i + 1 < d.length; i += 1) sAdj += 1 / (d[i + 1] - d[i]);
  const ratio = sAll / sAdj;
  if (ratio > maxRatio) {
    maxRatio = ratio;
    argN = n;
  }
  if (n % 40000 === 0) rows.push({ upto_n: n, current_max_ratio: Number(maxRatio.toPrecision(10)), witness_n: argN });
}

const out = {
  problem: 'EP-884',
  script: 'ep884.mjs',
  method: 'direct_finite_ratio_scan_for_divisor_gap_inequality',
  params: { N },
  max_ratio_found: Number(maxRatio.toPrecision(12)),
  witness_n: argN,
  progress_checkpoints: rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
