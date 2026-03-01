#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function bipyramidPoints(m, h = 1.0) {
  const pts = [];
  for (let j = 0; j < m; j += 1) {
    const t = (2 * Math.PI * j) / m;
    pts.push([Math.cos(t), Math.sin(t), 0]);
  }
  pts.push([0, 0, h]);
  pts.push([0, 0, -h]);
  return pts;
}

function antiprismPoints(m, h = 0.7, r1 = 1.0, r2 = 1.0) {
  const pts = [];
  for (let j = 0; j < m; j += 1) {
    const t1 = (2 * Math.PI * j) / m;
    const t2 = (2 * Math.PI * (j + 0.5)) / m;
    pts.push([r1 * Math.cos(t1), r1 * Math.sin(t1), h]);
    pts.push([r2 * Math.cos(t2), r2 * Math.sin(t2), -h]);
  }
  return pts;
}

function d2(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return dx * dx + dy * dy + dz * dz;
}

function distinctDistanceCount(points, tol = 1e-10) {
  const vals = [];
  const n = points.length;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) vals.push(d2(points[i], points[j]));
  }
  vals.sort((a, b) => a - b);
  let cnt = 0;
  let last = null;
  for (const v of vals) {
    if (last == null || Math.abs(v - last) > tol) {
      cnt += 1;
      last = v;
    }
  }
  return cnt;
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep660_constructed_polyhedra_scan.json');

const mList = [8, 10, 12, 16, 20, 30, 40, 60, 80, 100];
const rows = [];

for (const m of mList) {
  const bp = bipyramidPoints(m, 1.0);
  const ap = antiprismPoints(m, 0.7, 1.0, 1.0);

  const db = distinctDistanceCount(bp);
  const da = distinctDistanceCount(ap);

  rows.push({
    m,
    bipyramid_n: m + 2,
    bipyramid_distinct_distances: db,
    bipyramid_ratio_over_n: db / (m + 2),
    antiprism_n: 2 * m,
    antiprism_distinct_distances: da,
    antiprism_ratio_over_n: da / (2 * m),
  });

  process.stderr.write(`m=${m}, bipyramid ${db}/${m + 2}, antiprism ${da}/${2 * m}\n`);
}

const out = {
  problem: 'EP-660',
  method: 'explicit_convex_polyhedron_families_(bipyramids_and_antiprisms)',
  rows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
