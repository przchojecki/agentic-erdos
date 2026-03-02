#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-50 finite empirical probe:
// estimate CDF of phi(n)/n and local finite-difference slope profile.

const N_MAX = Number(process.env.N_MAX || 300000);
const GRID_STEP = Number(process.env.GRID_STEP || 0.0025);

function phiTable(n) {
  const phi = new Float64Array(n + 1);
  for (let i = 0; i <= n; i++) phi[i] = i;
  for (let p = 2; p <= n; p++) {
    if (phi[p] !== p) continue;
    for (let j = p; j <= n; j += p) phi[j] -= phi[j] / p;
  }
  return phi;
}

const phi = phiTable(N_MAX);
const vals = [];
for (let n = 1; n <= N_MAX; n++) vals.push(phi[n] / n);
vals.sort((a, b) => a - b);

function cdfAt(x) {
  // upper_bound
  let lo = 0;
  let hi = vals.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (vals[mid] <= x) lo = mid + 1;
    else hi = mid;
  }
  return lo / vals.length;
}

const grid = [];
const slopes = [];
for (let c = 0; c <= 1 + 1e-12; c += GRID_STEP) {
  const cc = Number(Math.min(1, c).toFixed(10));
  grid.push({ c: cc, F: Number(cdfAt(cc).toFixed(6)) });
}
for (let i = 0; i + 1 < grid.length; i++) {
  const dF = grid[i + 1].F - grid[i].F;
  const slope = dF / GRID_STEP;
  slopes.push({
    c_left: grid[i].c,
    c_right: grid[i + 1].c,
    slope: Number(slope.toFixed(6)),
    dF: Number(dF.toFixed(6)),
  });
}

const sortedSlopes = [...slopes].sort((a, b) => b.slope - a.slope);
const out = {
  script: path.basename(process.argv[1]),
  n_max: N_MAX,
  grid_step: GRID_STEP,
  slope_summary: {
    max_slope: sortedSlopes[0]?.slope ?? 0,
    median_slope: sortedSlopes[Math.floor(sortedSlopes.length / 2)]?.slope ?? 0,
    positive_slope_bins: slopes.filter((s) => s.slope > 0).length,
    total_bins: slopes.length,
  },
  top_slope_bins: sortedSlopes.slice(0, 20),
  sample_grid: grid.filter((_, i) => i % Math.max(1, Math.floor(grid.length / 25)) === 0),
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep50_phi_distribution_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, n_max: N_MAX, bins: slopes.length }, null, 2));
