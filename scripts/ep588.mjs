#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function gcd(a, b) {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { const t = a % b; a = b; b = t; }
  return a;
}

function lineKeyFromPoints(p, q) {
  let A = q[1] - p[1];
  let B = p[0] - q[0];
  let C = A * p[0] + B * p[1];
  const g = gcd(gcd(Math.abs(A), Math.abs(B)), Math.abs(C));
  if (g > 0) { A /= g; B /= g; C /= g; }
  if (A < 0 || (A === 0 && B < 0) || (A === 0 && B === 0 && C < 0)) { A = -A; B = -B; C = -C; }
  return `${A},${B},${C}`;
}

function lineStats(points) {
  const n = points.length;
  const mp = new Map();
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const key = lineKeyFromPoints(points[i], points[j]);
      if (!mp.has(key)) mp.set(key, new Set());
      const S = mp.get(key);
      S.add(i); S.add(j);
    }
  }
  let maxCollinear = 1;
  const lineSizes = [];
  for (const S of mp.values()) {
    lineSizes.push(S.size);
    if (S.size > maxCollinear) maxCollinear = S.size;
  }
  return { lineSizes, maxCollinear };
}

function randomDistinctPoints(n, grid, rng) {
  const used = new Set();
  const pts = [];
  while (pts.length < n) {
    const x = Math.floor(rng() * grid);
    const y = Math.floor(rng() * grid);
    const key = `${x},${y}`;
    if (used.has(key)) continue;
    used.add(key);
    pts.push([x, y]);
  }
  return pts;
}

function optimizeForK(n, k, restarts, steps, grid, rng) {
  let best = { linesAtLeastK: -1, linesExactlyK: -1, maxCollinear: 1 };
  for (let r = 0; r < restarts; r += 1) {
    const pts = randomDistinctPoints(n, grid, rng);
    let st = lineStats(pts);
    const score = (x) => ({
      linesAtLeastK: x.lineSizes.filter((t) => t >= k).length,
      linesExactlyK: x.lineSizes.filter((t) => t === k).length,
      maxCollinear: x.maxCollinear,
    });
    let cur = score(st);
    if (cur.maxCollinear <= k && (cur.linesAtLeastK > best.linesAtLeastK
      || (cur.linesAtLeastK === best.linesAtLeastK && cur.linesExactlyK > best.linesExactlyK))) best = { ...cur };

    for (let it = 0; it < steps; it += 1) {
      const idx = Math.floor(rng() * n);
      const used = new Set(pts.map((p) => `${p[0]},${p[1]}`));
      used.delete(`${pts[idx][0]},${pts[idx][1]}`);
      let cand = null;
      for (let tr = 0; tr < 50; tr += 1) {
        const x = Math.floor(rng() * grid);
        const y = Math.floor(rng() * grid);
        if (!used.has(`${x},${y}`)) { cand = [x, y]; break; }
      }
      if (!cand) continue;
      const old = pts[idx];
      pts[idx] = cand;
      const st2 = lineStats(pts);
      const sc2 = score(st2);
      const improve = sc2.maxCollinear <= k && (sc2.linesAtLeastK > cur.linesAtLeastK
        || (sc2.linesAtLeastK === cur.linesAtLeastK && sc2.linesExactlyK >= cur.linesExactlyK));
      if (improve) {
        st = st2;
        cur = sc2;
        if (cur.linesAtLeastK > best.linesAtLeastK
          || (cur.linesAtLeastK === best.linesAtLeastK && cur.linesExactlyK > best.linesExactlyK)) best = { ...cur };
      } else {
        pts[idx] = old;
      }
    }
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 588);
const rows = [];

for (const [k, nList, restarts, steps] of [
  [4, [30, 40, 50], 24, 1400],
  [5, [32, 44], 20, 1200],
]) {
  for (const n of nList) {
    const best = optimizeForK(n, k, restarts, steps, 41, rng);
    rows.push({
      k,
      n,
      restarts,
      steps,
      best_lines_with_at_least_k_points: best.linesAtLeastK,
      best_lines_with_exactly_k_points: best.linesExactlyK,
      max_collinear_constraint: k,
      lines_at_least_k_over_n_sq: Number((best.linesAtLeastK / (n * n)).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-588',
  script: path.basename(process.argv[1]),
  method: 'deeper_heuristic_search_for_k_rich_lines_under_no_k_plus_1_collinear_constraint',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
