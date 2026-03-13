#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function lineKey(a, b) {
  const x1 = a[0], y1 = a[1], x2 = b[0], y2 = b[1];
  let A = y2 - y1;
  let B = x1 - x2;
  let C = -(A * x1 + B * y1);

  const g = gcd3(Math.abs(A), Math.abs(B), Math.abs(C));
  if (g > 0) {
    A /= g; B /= g; C /= g;
  }
  if (A < 0 || (A === 0 && B < 0) || (A === 0 && B === 0 && C < 0)) {
    A = -A; B = -B; C = -C;
  }
  return `${A},${B},${C}`;
}

function gcd(a, b) {
  while (b) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

function gcd3(a, b, c) {
  return gcd(gcd(a, b), c);
}

function countRichLines(points, k) {
  const n = points.length;
  const lines = new Map();

  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const key = lineKey(points[i], points[j]);
      if (!lines.has(key)) lines.set(key, new Set());
      const S = lines.get(key);
      S.add(i);
      S.add(j);
    }
  }

  let atLeast = 0;
  let exactly = 0;
  for (const S of lines.values()) {
    if (S.size >= k) atLeast += 1;
    if (S.size === k) exactly += 1;
  }
  return { atLeast, exactly };
}

function squareGrid(m) {
  const pts = [];
  for (let x = 0; x < m; x += 1) for (let y = 0; y < m; y += 1) pts.push([x, y]);
  return pts;
}

function nearOrchardLike(n) {
  const pts = [];
  for (let i = 0; i < n; i += 1) {
    const t = (2 * Math.PI * i) / n;
    const r = 1000 + (i % 5);
    pts.push([Math.round(r * Math.cos(t)), Math.round(r * Math.sin(t))]);
  }
  return pts;
}

const t0 = Date.now();
const rows = [];

for (const n of [49, 64, 81, 100, 121]) {
  const m = Math.round(Math.sqrt(n));
  const grid = squareGrid(m);
  for (const k of [3, 4, 5]) {
    const r = countRichLines(grid, k);
    rows.push({
      family: 'square_grid',
      n: grid.length,
      k,
      F_k_proxy_at_least_k: r.atLeast,
      f_k_proxy_exactly_k: r.exactly,
      F_k_over_n2: Number((r.atLeast / (grid.length * grid.length)).toPrecision(8)),
      f_k_over_n2: Number((r.exactly / (grid.length * grid.length)).toPrecision(8)),
    });
  }
}

for (const n of [60, 90, 120, 150, 180]) {
  const pts = nearOrchardLike(n);
  for (const k of [3, 4, 5]) {
    const r = countRichLines(pts, k);
    rows.push({
      family: 'near_orchard_like_perturbed_circle',
      n,
      k,
      F_k_proxy_at_least_k: r.atLeast,
      f_k_proxy_exactly_k: r.exactly,
      F_k_over_n2: Number((r.atLeast / (n * n)).toPrecision(8)),
      f_k_over_n2: Number((r.exactly / (n * n)).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-669',
  script: path.basename(process.argv[1]),
  method: 'rich_line_count_profiles_for_explicit_point_families',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
