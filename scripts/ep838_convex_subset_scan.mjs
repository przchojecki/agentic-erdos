#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function orient(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

function convexHull(points) {
  if (points.length <= 1) return points.slice();
  const pts = points.slice().sort((u, v) => (u[0] === v[0] ? u[1] - v[1] : u[0] - v[0]));
  const lower = [];
  for (const p of pts) {
    while (lower.length >= 2 && orient(lower[lower.length - 2], lower[lower.length - 1], p) <= 0) lower.pop();
    lower.push(p);
  }
  const upper = [];
  for (let i = pts.length - 1; i >= 0; i -= 1) {
    const p = pts[i];
    while (upper.length >= 2 && orient(upper[upper.length - 2], upper[upper.length - 1], p) <= 0) upper.pop();
    upper.push(p);
  }
  lower.pop();
  upper.pop();
  return lower.concat(upper);
}

function countConvexSubsets(points) {
  const n = points.length;
  const total = 1 << n;
  let count = 0;
  for (let mask = 0; mask < total; mask += 1) {
    const bits = mask.toString(2).replaceAll('0', '').length;
    if (bits < 3) continue;
    const sub = [];
    for (let i = 0; i < n; i += 1) if ((mask >> i) & 1) sub.push(points[i]);
    const h = convexHull(sub);
    if (h.length === sub.length) count += 1;
  }
  return count;
}

function randomPoints(n) {
  const pts = [];
  const used = new Set();
  while (pts.length < n) {
    const x = Math.floor(Math.random() * 1000000);
    const y = Math.floor(Math.random() * 1000000);
    const key = `${x},${y}`;
    if (used.has(key)) continue;
    used.add(key);
    pts.push([x, y]);
  }
  return pts;
}

function doubleChain(n) {
  const m = Math.floor(n / 2);
  const pts = [];
  for (let i = 0; i < m; i += 1) pts.push([i, i * i]);
  for (let i = 0; i < n - m; i += 1) pts.push([i + 0.25, -i * i - 0.5]);
  return pts;
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep838_convex_subset_scan.json');

const nList = (process.argv[2] || '10,12,14,16,18').split(',').map((x) => Number(x));
const trials = Number(process.argv[3] || 180);

const rows = [];
for (const n of nList) {
  let bestRandom = Number.POSITIVE_INFINITY;
  let avgRandom = 0;

  for (let t = 0; t < trials; t += 1) {
    const pts = randomPoints(n);
    const c = countConvexSubsets(pts);
    if (c < bestRandom) bestRandom = c;
    avgRandom += c;
  }

  avgRandom /= trials;

  const dc = countConvexSubsets(doubleChain(n));
  const conv = (1 << n) - 1 - n - (n * (n - 1)) / 2;

  rows.push({
    n,
    trials,
    best_random_convex_subset_count: bestRandom,
    avg_random_convex_subset_count: avgRandom,
    double_chain_convex_subset_count: dc,
    fully_convex_position_count: conv,
  });

  process.stderr.write(`n=${n}, bestRand=${bestRandom}, doubleChain=${dc}, convexPos=${conv}\n`);
}

const out = {
  problem: 'EP-838',
  method: 'finite_sampling_of_convex_subset_counts_for_point_sets_in_general_position',
  params: { n_list: nList, trials },
  rows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
