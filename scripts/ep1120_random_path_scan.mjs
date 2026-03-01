#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function randInUnitDisk() {
  const u = Math.random();
  const r = Math.sqrt(u);
  const t = 2 * Math.PI * Math.random();
  return [r * Math.cos(t), r * Math.sin(t)];
}

function polyAbsAt(zx, zy, roots) {
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

function shortestPathLength(roots, h = 0.03, R = 1.2) {
  const n = Math.floor((2 * R) / h) + 1;
  const pass = new Uint8Array(n * n);
  const xs = new Float64Array(n);
  for (let i = 0; i < n; i += 1) xs[i] = -R + i * h;

  let start = -1;
  const targets = [];

  for (let i = 0; i < n; i += 1) {
    const x = xs[i];
    for (let j = 0; j < n; j += 1) {
      const y = xs[j];
      const idx = i * n + j;
      const inside = polyAbsAt(x, y, roots) <= 1.0;
      if (!inside) continue;
      pass[idx] = 1;
      const rr = Math.hypot(x, y);
      if (Math.abs(x) <= h / 2 && Math.abs(y) <= h / 2) start = idx;
      if (rr >= 1.0 && rr <= 1.08) targets.push(idx);
    }
  }

  if (start < 0 || pass[start] === 0 || targets.length === 0) return null;

  const dist = new Float64Array(n * n);
  dist.fill(Number.POSITIVE_INFINITY);
  dist[start] = 0;

  // Simple Dijkstra over a coarse grid.
  const used = new Uint8Array(n * n);
  const neigh = [
    [-1, 0, h],
    [1, 0, h],
    [0, -1, h],
    [0, 1, h],
    [-1, -1, h * Math.SQRT2],
    [-1, 1, h * Math.SQRT2],
    [1, -1, h * Math.SQRT2],
    [1, 1, h * Math.SQRT2],
  ];

  for (let iter = 0; iter < n * n; iter += 1) {
    let v = -1;
    let best = Number.POSITIVE_INFINITY;
    for (let t = 0; t < n * n; t += 1) {
      if (used[t] || pass[t] === 0) continue;
      if (dist[t] < best) {
        best = dist[t];
        v = t;
      }
    }
    if (v < 0 || !Number.isFinite(best)) break;
    used[v] = 1;
    if (targets.includes(v)) return dist[v];

    const i = Math.floor(v / n);
    const j = v % n;
    for (const [di, dj, w] of neigh) {
      const ni = i + di;
      const nj = j + dj;
      if (ni < 0 || ni >= n || nj < 0 || nj >= n) continue;
      const u = ni * n + nj;
      if (pass[u] === 0 || used[u]) continue;
      const nd = dist[v] + w;
      if (nd < dist[u]) dist[u] = nd;
    }
  }

  return null;
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep1120_random_path_scan.json');

const trials = Number(process.argv[2] || 120);
const degrees = [2, 4, 6, 8, 10, 12];

const rows = [];
for (const deg of degrees) {
  let ok = 0;
  let best = 0;
  let sum = 0;

  for (let t = 0; t < trials; t += 1) {
    const roots = [];
    for (let i = 0; i < deg; i += 1) roots.push(randInUnitDisk());

    const len = shortestPathLength(roots);
    if (len == null) continue;
    ok += 1;
    sum += len;
    if (len > best) best = len;
  }

  rows.push({
    degree: deg,
    trials,
    successful_grid_paths: ok,
    avg_shortest_path_length: ok > 0 ? sum / ok : null,
    max_shortest_path_length: ok > 0 ? best : null,
  });

  process.stderr.write(`deg=${deg}, ok=${ok}/${trials}, max=${best.toFixed(3)}\n`);
}

const out = {
  problem: 'EP-1120',
  method: 'random_root_model_with_grid_shortest_path_proxy',
  rows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
