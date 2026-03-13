#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function circlePoints(n) {
  const pts = [];
  for (let i = 0; i < n; i += 1) {
    const t = (2 * Math.PI * i) / n;
    pts.push([Math.cos(t), Math.sin(t)]);
  }
  return pts;
}

function sqDist(a, b) {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

function distinctPairDistances(pts) {
  const n = pts.length;
  const S = new Set();
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) S.add(sqDist(pts[i], pts[j]).toFixed(14));
  }
  return S.size;
}

function centeredCircleConditionHolds(pts) {
  const n = pts.length;
  for (let i = 0; i < n; i += 1) {
    const cnt = new Map();
    for (let j = 0; j < n; j += 1) {
      if (i === j) continue;
      const d = sqDist(pts[i], pts[j]).toFixed(14);
      cnt.set(d, (cnt.get(d) || 0) + 1);
      if (cnt.get(d) >= 3) return false;
    }
  }
  return true;
}

const t0 = Date.now();
const rows = [];
for (const n of [30, 60, 120, 240, 480, 960]) {
  const pts = circlePoints(n);
  const D = distinctPairDistances(pts);
  const cond = centeredCircleConditionHolds(pts);
  rows.push({
    n,
    condition_no_centered_circle_through_three_other_points: cond,
    distinct_distances_total: D,
    distinct_over_n: Number((D / n).toPrecision(8)),
    target_threshold_n_over_2: n / 2,
    target_ratio_required_for_conjecture: '> 0.5 + c',
  });
}

const out = {
  problem: 'EP-655',
  script: path.basename(process.argv[1]),
  method: 'regular_n_gon_counterexample_verification_for_as_written_conjecture',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
