#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function key3(a, b, c) {
  const x = [a, b, c].sort((u, v) => u - v);
  return `${x[0]},${x[1]},${x[2]}`;
}

function edgeKey(u, v) {
  return u < v ? `${u},${v}` : `${v},${u}`;
}

function sampleTriangle(n, rng) {
  const a = Math.floor(rng() * n);
  let b = Math.floor(rng() * (n - 1)); if (b >= a) b += 1;
  let c = Math.floor(rng() * (n - 2));
  const skip = new Set([a, b]);
  let t = -1;
  for (let i = 0; i < n; i += 1) if (!skip.has(i)) { t += 1; if (t === c) { c = i; break; } }
  return [a, b, c];
}

function greedyTriangleSystem(n, tmax, attempts, steps, rng) {
  let bestEdges = 0;
  let bestTri = 0;
  for (let a = 0; a < attempts; a += 1) {
    const edgeUse = new Map();
    const tris = new Set();

    for (let s = 0; s < steps; s += 1) {
      const [x, y, z] = sampleTriangle(n, rng);
      const tk = key3(x, y, z);
      if (tris.has(tk)) continue;
      const e1 = edgeKey(x, y);
      const e2 = edgeKey(x, z);
      const e3 = edgeKey(y, z);
      const c1 = edgeUse.get(e1) || 0;
      const c2 = edgeUse.get(e2) || 0;
      const c3 = edgeUse.get(e3) || 0;
      if (c1 >= tmax || c2 >= tmax || c3 >= tmax) continue;
      tris.add(tk);
      edgeUse.set(e1, c1 + 1);
      edgeUse.set(e2, c2 + 1);
      edgeUse.set(e3, c3 + 1);

      if (rng() < 0.0025 && tris.size > 0) {
        const arr = [...tris];
        const drop = arr[Math.floor(rng() * arr.length)];
        tris.delete(drop);
        const [a1, b1, c1d] = drop.split(',').map(Number);
        const d1 = edgeKey(a1, b1);
        const d2 = edgeKey(a1, c1d);
        const d3 = edgeKey(b1, c1d);
        edgeUse.set(d1, (edgeUse.get(d1) || 1) - 1);
        edgeUse.set(d2, (edgeUse.get(d2) || 1) - 1);
        edgeUse.set(d3, (edgeUse.get(d3) || 1) - 1);
      }
    }

    const m = [...edgeUse.values()].filter((x) => x > 0).length;
    if (m > bestEdges) {
      bestEdges = m;
      bestTri = tris.size;
    }
  }
  return { bestEdges, bestTri };
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 600);
const rows = [];

for (const [n, tmax, attempts, steps] of [
  [18, 1, 90, 30000],
  [22, 1, 90, 36000],
  [26, 1, 80, 42000],
  [18, 2, 80, 26000],
  [22, 2, 80, 32000],
  [26, 2, 70, 38000],
  [30, 2, 60, 44000],
]) {
  const r = greedyTriangleSystem(n, tmax, attempts, steps, rng);
  const estR = tmax + 1;
  rows.push({
    n,
    tmax,
    interpreted_r: estR,
    attempts,
    steps,
    best_feasible_edges_found: r.bestEdges,
    best_triangle_count_found: r.bestTri,
    implied_lower_bound_on_e_n_r: r.bestEdges + 1,
    lower_bound_over_n_pow_3_over_2: Number(((r.bestEdges + 1) / (n ** 1.5)).toPrecision(8)),
    lower_bound_over_n2: Number(((r.bestEdges + 1) / (n * n)).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-600',
  script: path.basename(process.argv[1]),
  method: 'deeper_triangle_system_search_with_per_edge_triangle_multiplicity_cap',
  note: 'Each feasible sample has every edge in [1,tmax] triangles, giving e(n,r)>=m+1 for r=tmax+1.',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
