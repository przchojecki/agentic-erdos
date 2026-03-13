#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function sqDist(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

function bipDistinctDistances(X, Y) {
  const S = new Set();
  for (const x of X) for (const y of Y) S.add(sqDist(x, y).toFixed(10));
  return S.size;
}

function twoParallelLines(n) {
  const X = [];
  const Y = [];
  for (let i = 0; i < n; i += 1) {
    X.push([i, 0]);
    Y.push([i, 1]);
  }
  return [X, Y];
}

function lineVsGeometricParabola(n) {
  const X = [];
  const Y = [];
  for (let i = 0; i < n; i += 1) {
    X.push([i, 0]);
    Y.push([i * i, 1]);
  }
  return [X, Y];
}

function twoCircles(n, R1, R2) {
  const X = [];
  const Y = [];
  for (let i = 0; i < n; i += 1) {
    const t = (2 * Math.PI * i) / n;
    const u = (2 * Math.PI * (i + 0.37)) / n;
    X.push([R1 * Math.cos(t), R1 * Math.sin(t)]);
    Y.push([R2 * Math.cos(u), R2 * Math.sin(u)]);
  }
  return [X, Y];
}

function gridSplit(n) {
  const m = Math.ceil(Math.sqrt(n));
  const pts = [];
  for (let i = 0; i < m && pts.length < 2 * n; i += 1) {
    for (let j = 0; j < m && pts.length < 2 * n; j += 1) pts.push([i, j]);
  }
  const X = pts.slice(0, n);
  const Y = pts.slice(n, 2 * n);
  return [X, Y];
}

const t0 = Date.now();
const rows = [];

for (const n of [40, 80, 120, 180, 260, 360]) {
  const fam = [];
  fam.push(['two_parallel_lines', ...twoParallelLines(n)]);
  fam.push(['line_vs_parabola', ...lineVsGeometricParabola(n)]);
  fam.push(['two_circles_r1_1_r2_2', ...twoCircles(n, 1, 2)]);
  fam.push(['grid_split', ...gridSplit(n)]);

  for (const [name, X, Y] of fam) {
    const D = bipDistinctDistances(X, Y);
    rows.push({
      family: name,
      n,
      distinct_bipartite_distances: D,
      D_over_n: Number((D / n).toPrecision(8)),
      D_times_sqrt_log_over_n: Number((D * Math.sqrt(Math.log(n)) / n).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-661',
  script: path.basename(process.argv[1]),
  method: 'explicit_bipartite_planar_construction_scan_for_cross_distance_count',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
