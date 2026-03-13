#!/usr/bin/env node
import fs from 'fs';

// EP-825: deeper weird-number abundancy scan in finite range.
// Statement asks for absolute C forcing semiperfectness from high abundancy.
const OUT = process.env.OUT || 'data/ep825_standalone_deeper.json';
const N = 80_000;

const t0 = Date.now();
const properDivs = Array.from({ length: N + 1 }, () => []);
const sigma = new Uint32Array(N + 1);

for (let d = 1; d <= N; d += 1) {
  for (let m = d; m <= N; m += d) {
    sigma[m] += d;
    if (m !== d) properDivs[m].push(d);
  }
}

function canRepresentAsDistinctSum(target, arr) {
  const bits = new Uint8Array(target + 1);
  bits[0] = 1;
  for (const v of arr) {
    for (let s = target; s >= v; s -= 1) if (bits[s - v]) bits[s] = 1;
    if (bits[target]) return true;
  }
  return bits[target] === 1;
}

const weirds = [];
let abundantCount = 0;
let maxWeirdAbund = 0;
for (let n = 2; n <= N; n += 1) {
  if (sigma[n] <= 2 * n) continue;
  abundantCount += 1;
  if (!canRepresentAsDistinctSum(n, properDivs[n])) {
    const abund = sigma[n] / n;
    weirds.push({ n, abundancy: Number(abund.toPrecision(9)) });
    if (abund > maxWeirdAbund) maxWeirdAbund = abund;
  }
}

let finiteThreshold = 2.0;
for (let c100 = 201; c100 <= 600; c100 += 1) {
  const C = c100 / 100;
  let bad = false;
  for (const w of weirds) {
    if (w.abundancy > C) {
      bad = true;
      break;
    }
  }
  if (!bad) {
    finiteThreshold = C;
    break;
  }
}

const out = {
  problem: 'EP-825',
  script: 'ep825.mjs',
  method: 'deeper_weird_number_scan_with_subset_sum_semiperfectness_test',
  params: { N, threshold_grid_min: 2.01, threshold_grid_max: 6.0, threshold_grid_step: 0.01 },
  abundant_count: abundantCount,
  weird_count: weirds.length,
  first_30_weirds: weirds.slice(0, 30).map((x) => x.n),
  max_weird_abundancy_in_range: Number(maxWeirdAbund.toPrecision(8)),
  finite_C_threshold_without_counterexample_in_range: finiteThreshold,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
