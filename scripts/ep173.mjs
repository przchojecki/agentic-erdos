#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function pointsGrid(L) {
  const pts = [];
  for (let x = 0; x < L; x += 1) for (let y = 0; y < L; y += 1) pts.push([x, y]);
  return pts;
}

function triType(a, b, c) {
  const d2 = [
    (a[0] - b[0]) ** 2 + (a[1] - b[1]) ** 2,
    (a[0] - c[0]) ** 2 + (a[1] - c[1]) ** 2,
    (b[0] - c[0]) ** 2 + (b[1] - c[1]) ** 2,
  ].sort((u, v) => u - v);
  if (d2[0] === 0) return null;
  const area2 = Math.abs((b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]));
  if (area2 === 0) return null;
  return d2.join(',');
}

function enumerateTriangles(pts) {
  const tris = [];
  const types = new Set();
  for (let i = 0; i < pts.length; i += 1) {
    for (let j = i + 1; j < pts.length; j += 1) {
      for (let k = j + 1; k < pts.length; k += 1) {
        const t = triType(pts[i], pts[j], pts[k]);
        if (!t) continue;
        tris.push([i, j, k, t]);
        types.add(t);
      }
    }
  }
  return { tris, types: [...types] };
}

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function randomColoring(n, rng) {
  const c = new Uint8Array(n);
  for (let i = 0; i < n; i += 1) c[i] = rng() < 0.5 ? 0 : 1;
  return c;
}

const L = Number(process.env.L || 6);
const SAMPLES = Number(process.env.SAMPLES || 5000);
const SEED = Number(process.env.SEED || 17302026);
const OUT = process.env.OUT || '';

const pts = pointsGrid(L);
const { tris, types } = enumerateTriangles(pts);
const typeId = new Map(types.map((t, i) => [t, i]));

const rng = makeRng(SEED);
let bestMissing = -1;
let bestStats = null;
for (let s = 0; s < SAMPLES; s += 1) {
  const col = randomColoring(pts.length, rng);
  const hasMono = new Uint8Array(types.length);
  for (const [i, j, k, t] of tris) {
    if (col[i] === col[j] && col[j] === col[k]) hasMono[typeId.get(t)] = 1;
  }
  let missing = 0;
  for (let i = 0; i < hasMono.length; i += 1) if (!hasMono[i]) missing += 1;
  if (missing > bestMissing) {
    bestMissing = missing;
    bestStats = { sample: s, missing_triangle_types: missing, total_triangle_types: types.length };
  }
}

const out = {
  problem: 'EP-173',
  script: path.basename(process.argv[1]),
  method: 'finite_grid_two_coloring_triangle_type_monochromatic_coverage',
  params: { L, SAMPLES, SEED },
  points: pts.length,
  triangle_instances: tris.length,
  triangle_congruence_types: types.length,
  best_missing_type_count_found: bestMissing,
  best_sample_stats: bestStats,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
