#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function maxGapWithWindowDivisor(n, k) {
  const L = n;
  const R = Math.floor(n ** k);
  if (R <= L) return { maxGap: 0, count: 0 };

  const good = [];
  for (let a = L; a <= R; a += 1) {
    let ok = false;
    for (let d = n + 1; d < 2 * n; d += 1) {
      if (a % d === 0) {
        ok = true;
        break;
      }
      if (d * d > a && d > a) break;
    }
    if (ok) good.push(a);
  }

  let maxGap = 0;
  for (let i = 1; i < good.length; i += 1) {
    const g = good[i] - good[i - 1];
    if (g > maxGap) maxGap = g;
  }

  return { maxGap, count: good.length, firstFew: good.slice(0, 12) };
}

const t0 = Date.now();
const rows = [];

for (const [k, ns] of [[2,[40,60,80,100,120,160,200]],[3,[20,30,40,50,60,80]]]) {
  for (const n of ns) {
    const r = maxGapWithWindowDivisor(n, k);
    rows.push({
      k,
      n,
      interval_right_end: Math.floor(n ** k),
      qualifying_count: r.count,
      max_consecutive_gap: r.maxGap,
      max_gap_over_log_n: Number((r.maxGap / Math.log(n)).toPrecision(8)),
      first_values: r.firstFew,
    });
  }
}

const out = {
  problem: 'EP-693',
  script: path.basename(process.argv[1]),
  method: 'direct_gap_scan_for_numbers_in_n_to_nk_with_divisor_in_open_interval_n_2n',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
