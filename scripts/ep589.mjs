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
  for (const S of mp.values()) if (S.size > maxCollinear) maxCollinear = S.size;
  return { lineMap: mp, maxCollinear };
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

function buildNo4Set(n, grid, rng) {
  const pts = randomDistinctPoints(n, grid, rng);
  for (let it = 0; it < 3000; it += 1) {
    const st = lineStats(pts);
    if (st.maxCollinear <= 3) return pts;
    let badPts = null;
    for (const S of st.lineMap.values()) {
      if (S.size >= 4) { badPts = [...S]; break; }
    }
    if (!badPts) return pts;
    const idx = badPts[Math.floor(rng() * badPts.length)];
    const used = new Set(pts.map((p) => `${p[0]},${p[1]}`));
    used.delete(`${pts[idx][0]},${pts[idx][1]}`);
    for (let tr = 0; tr < 60; tr += 1) {
      const x = Math.floor(rng() * grid);
      const y = Math.floor(rng() * grid);
      const key = `${x},${y}`;
      if (used.has(key)) continue;
      pts[idx] = [x, y];
      break;
    }
  }
  return pts;
}

function maxNo3SubsetHeuristic(points) {
  const n = points.length;
  const st = lineStats(points);
  const triples = [];
  for (const S of st.lineMap.values()) {
    const arr = [...S];
    if (arr.length === 3) triples.push(arr);
    if (arr.length > 3) {
      for (let i = 0; i < arr.length; i += 1) {
        for (let j = i + 1; j < arr.length; j += 1) {
          for (let k = j + 1; k < arr.length; k += 1) triples.push([arr[i], arr[j], arr[k]]);
        }
      }
    }
  }
  const alive = Array(n).fill(true);
  const deg = Array(n).fill(0);
  function recompute() {
    deg.fill(0);
    for (const [a, b, c] of triples) if (alive[a] && alive[b] && alive[c]) { deg[a] += 1; deg[b] += 1; deg[c] += 1; }
  }
  recompute();
  while (true) {
    let bad = false;
    for (const [a, b, c] of triples) if (alive[a] && alive[b] && alive[c]) { bad = true; break; }
    if (!bad) break;
    let vBest = -1; let dBest = -1;
    for (let v = 0; v < n; v += 1) if (alive[v] && deg[v] > dBest) { dBest = deg[v]; vBest = v; }
    if (vBest < 0) break;
    alive[vBest] = false;
    recompute();
  }
  let sz = 0;
  for (let v = 0; v < n; v += 1) if (alive[v]) sz += 1;
  return { size: sz, numTriples: triples.length, maxCollinearOriginal: st.maxCollinear };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 589);
const rows = [];

for (const n of [30, 40, 50, 60]) {
  let best = { size: 0, numTriples: 0, maxCollinearOriginal: 0 };
  for (let r = 0; r < 48; r += 1) {
    const pts = buildNo4Set(n, 53, rng);
    const cur = maxNo3SubsetHeuristic(pts);
    if (cur.size > best.size) best = cur;
  }
  rows.push({
    n,
    best_no3_subset_size_from_no4_instance: best.size,
    ratio_over_sqrt_n: Number((best.size / Math.sqrt(n)).toPrecision(8)),
    ratio_over_n: Number((best.size / n).toPrecision(8)),
    triples_in_source_instance: best.numTriples,
    source_max_collinear: best.maxCollinearOriginal,
  });
}

const out = {
  problem: 'EP-589',
  script: path.basename(process.argv[1]),
  method: 'deeper_no4_collinear_construction_and_no3_subset_extraction_heuristic',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
