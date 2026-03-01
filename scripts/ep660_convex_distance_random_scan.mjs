#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function randOnSphere() {
  const u = Math.random() * 2 - 1;
  const t = 2 * Math.PI * Math.random();
  const s = Math.sqrt(1 - u * u);
  return [s * Math.cos(t), s * Math.sin(t), u];
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
const outPath = path.join(root, 'data', 'ep660_convex_distance_random_scan.json');

const nList = [20, 30, 40, 60, 80, 100, 150, 200];
const trials = Number(process.argv[2] || 120);

const rows = [];
for (const n of nList) {
  let minD = Number.POSITIVE_INFINITY;
  let maxD = -1;
  let sumD = 0;

  for (let t = 0; t < trials; t += 1) {
    const pts = [];
    for (let i = 0; i < n; i += 1) pts.push(randOnSphere());

    const d = distinctDistanceCount(pts);
    if (d < minD) minD = d;
    if (d > maxD) maxD = d;
    sumD += d;
  }

  rows.push({
    n,
    trials,
    min_distinct_distances: minD,
    avg_distinct_distances: sumD / trials,
    max_distinct_distances: maxD,
    min_ratio_over_n: minD / n,
    avg_ratio_over_n: (sumD / trials) / n,
  });

  process.stderr.write(`n=${n}, min=${minD}, avg=${(sumD / trials).toFixed(2)}\n`);
}

const out = {
  problem: 'EP-660',
  method: 'random_points_on_sphere_(convex_position)_distance_count_scan',
  rows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
