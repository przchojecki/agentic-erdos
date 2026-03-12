#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const STEP = Number(process.env.STEP || 0.05);
const BOX = Number(process.env.BOX || 2.2);

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function randomRoot(rng) {
  const r = 1.6 * Math.sqrt(rng());
  const t = 2 * Math.PI * rng();
  return [r * Math.cos(t), r * Math.sin(t)];
}

function absPolyAt(zx, zy, roots) {
  let re = 1;
  let im = 0;
  for (const [rx, ry] of roots) {
    const ar = zx - rx;
    const ai = zy - ry;
    const nr = re * ar - im * ai;
    const ni = re * ai + im * ar;
    re = nr;
    im = ni;
  }
  return Math.hypot(re, im);
}

function ritterRadius(points) {
  if (points.length === 0) return 0;
  let cx = points[0][0];
  let cy = points[0][1];
  let r = 0;
  for (const [x, y] of points) {
    const d = Math.hypot(x - cx, y - cy);
    if (d > r) {
      const nr = (r + d) / 2;
      const t = (d - r) / (2 * d);
      cx += (x - cx) * t;
      cy += (y - cy) * t;
      r = nr;
    }
  }
  return r;
}

function components(points, cols, rows, mask) {
  const vis = new Uint8Array(points.length);
  const comps = [];
  const dirs = [[1, 0], [-1, 0], [0, 1], [0, -1]];

  for (let idx = 0; idx < points.length; idx += 1) {
    if (!mask[idx] || vis[idx]) continue;
    const q = [idx];
    vis[idx] = 1;
    const comp = [];

    for (let qi = 0; qi < q.length; qi += 1) {
      const v = q[qi];
      comp.push(points[v]);
      const x = v % cols;
      const y = Math.floor(v / cols);
      for (const [dx, dy] of dirs) {
        const nx = x + dx;
        const ny = y + dy;
        if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) continue;
        const ni = ny * cols + nx;
        if (!mask[ni] || vis[ni]) continue;
        vis[ni] = 1;
        q.push(ni);
      }
    }

    comps.push(comp);
  }
  return comps;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 509);

const xs = [];
for (let x = -BOX; x <= BOX + 1e-12; x += STEP) xs.push(Number(x.toFixed(12)));
const ys = [];
for (let y = -BOX; y <= BOX + 1e-12; y += STEP) ys.push(Number(y.toFixed(12)));
const cols = xs.length;
const rowsN = ys.length;
const gridPts = [];
for (let j = 0; j < rowsN; j += 1) for (let i = 0; i < cols; i += 1) gridPts.push([xs[i], ys[j]]);

const tasks = [
  { degree: 3, instances: 140 },
  { degree: 5, instances: 120 },
  { degree: 8, instances: 90 },
  { degree: 12, instances: 60 },
];

const rows = [];
for (const task of tasks) {
  let sumRad = 0;
  let bestRad = Number.POSITIVE_INFINITY;
  let worstRad = 0;
  let countLe2 = 0;
  let countNonEmpty = 0;

  for (let it = 0; it < task.instances; it += 1) {
    const roots = Array.from({ length: task.degree }, () => randomRoot(rng));
    const mask = new Uint8Array(gridPts.length);

    for (let i = 0; i < gridPts.length; i += 1) {
      const [x, y] = gridPts[i];
      if (absPolyAt(x, y, roots) <= 1) mask[i] = 1;
    }

    const comps = components(gridPts, cols, rowsN, mask);
    if (comps.length === 0) continue;
    countNonEmpty += 1;

    let radSum = 0;
    for (const comp of comps) radSum += ritterRadius(comp);

    sumRad += radSum;
    if (radSum < bestRad) bestRad = radSum;
    if (radSum > worstRad) worstRad = radSum;
    if (radSum <= 2) countLe2 += 1;
  }

  rows.push({
    degree: task.degree,
    instances: task.instances,
    nonempty_lemniscate_instances: countNonEmpty,
    mean_component_circle_radius_sum: countNonEmpty > 0 ? Number((sumRad / countNonEmpty).toPrecision(8)) : null,
    best_radius_sum_found: Number(bestRad.toPrecision(8)),
    worst_radius_sum_found: Number(worstRad.toPrecision(8)),
    fraction_with_radius_sum_le_2: countNonEmpty > 0 ? Number((countLe2 / countNonEmpty).toPrecision(8)) : null,
  });
}

const out = {
  problem: 'EP-509',
  script: path.basename(process.argv[1]),
  method: 'grid_component_cover_heuristic_for_random_monic_polynomial_lemniscates',
  params: {
    box: BOX,
    step: STEP,
    grid_points: gridPts.length,
    tasks,
  },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
