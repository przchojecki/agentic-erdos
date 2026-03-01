#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function buildDivisorsUpToT(N, tMax) {
  const divs = Array.from({ length: N + 1 }, () => []);
  for (let d = 1; d <= tMax; d += 1) {
    for (let m = d; m <= N; m += d) divs[m].push(d);
  }
  return divs;
}

function canRepresentTWithDistinctDivisors(divList, t) {
  // bit i indicates sum i achievable.
  let mask = 1n; // sum 0
  const limitMask = (1n << BigInt(t + 1)) - 1n;
  for (const d of divList) {
    mask |= (mask << BigInt(d));
    mask &= limitMask;
    if (((mask >> BigInt(t)) & 1n) === 1n) return true;
  }
  return false;
}

function subsetSumMask(divList, tMax) {
  let mask = 1n;
  const limitMask = (1n << BigInt(tMax + 1)) - 1n;
  for (const d of divList) {
    mask |= (mask << BigInt(d));
    mask &= limitMask;
  }
  return mask;
}

function scanDensity(N, tList) {
  const tMax = Math.max(...tList);
  const divs = buildDivisorsUpToT(N, tMax);

  const counts = Object.fromEntries(tList.map((t) => [t, 0]));

  for (let n = 1; n <= N; n += 1) {
    const dlist = divs[n];
    const mask = subsetSumMask(dlist, tMax);
    for (const t of tList) {
      if (((mask >> BigInt(t)) & 1n) === 1n) counts[t] += 1;
    }
    if (n % 50000 === 0) process.stderr.write(`n=${n}/${N}\n`);
  }

  const rows = tList.map((t) => ({
    t,
    count: counts[t],
    empirical_density: counts[t] / N,
    baseline_1_over_t: 1 / t,
    ratio_to_1_over_t: (counts[t] / N) * t,
  }));

  return rows;
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep859_density_scan.json');

const tList = [];
for (let t = 2; t <= 200; t += 1) tList.push(t);

const scans = [
  { N: 100000, rows: scanDensity(100000, tList) },
  { N: 300000, rows: scanDensity(300000, tList) },
];

// Simple log-fit on the larger scan: log d_t ~ alpha + beta log log t.
const fitRows = scans[scans.length - 1].rows.filter((r) => r.t >= 3 && r.empirical_density > 0);
const xs = fitRows.map((r) => Math.log(Math.log(r.t)));
const ys = fitRows.map((r) => Math.log(r.empirical_density));

let sX = 0;
let sY = 0;
let sXX = 0;
let sXY = 0;
for (let i = 0; i < xs.length; i += 1) {
  sX += xs[i];
  sY += ys[i];
  sXX += xs[i] * xs[i];
  sXY += xs[i] * ys[i];
}
const n = xs.length;
const beta = (n * sXY - sX * sY) / (n * sXX - sX * sX);
const alpha = (sY - beta * sX) / n;

const out = {
  problem: 'EP-859',
  method: 'finite_empirical_density_scan_via_divisor_subset_sum',
  scans,
  regression_log_density_vs_loglog_t: {
    model: 'log d_t = alpha + beta log log t (finite-range heuristic fit)',
    alpha,
    beta,
    interpreted_as_power_of_log_t: -beta,
  },
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
