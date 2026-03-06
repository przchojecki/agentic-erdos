#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function makeRng(seed) {
  let x = (seed >>> 0) || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x >= 2);
  return out.length ? out : fallback;
}

function area2(p, q, r) {
  const [x1, y1] = p;
  const [x2, y2] = q;
  const [x3, y3] = r;
  return Math.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
}

function buildInstance(m) {
  const pts = [];
  for (let x = 0; x <= m; x += 1) for (let y = 0; y <= m; y += 1) pts.push([x, y]);
  const n = pts.length;
  const pairsWithPoint = Array.from({ length: n }, () => []);
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      for (let k = j + 1; k < n; k += 1) {
        if (area2(pts[i], pts[j], pts[k]) !== 2) continue;
        pairsWithPoint[i].push([j, k]);
        pairsWithPoint[j].push([i, k]);
        pairsWithPoint[k].push([i, j]);
      }
    }
  }
  return { n, pairsWithPoint };
}

function bestAvoidArea1(inst, restarts, seed) {
  const { n, pairsWithPoint } = inst;
  const rng = makeRng(seed ^ (n * 1009));
  let best = 0;
  for (let r = 0; r < restarts; r += 1) {
    const ord = Array.from({ length: n }, (_, i) => i);
    for (let i = n - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const t = ord[i];
      ord[i] = ord[j];
      ord[j] = t;
    }
    const chosen = new Uint8Array(n);
    let c = 0;
    for (const v of ord) {
      let bad = false;
      for (const [a, b] of pairsWithPoint[v]) {
        if (chosen[a] && chosen[b]) {
          bad = true;
          break;
        }
      }
      if (!bad) {
        chosen[v] = 1;
        c += 1;
      }
    }
    if (c > best) best = c;
  }
  return best;
}

const M_LIST = parseIntList(process.env.M_LIST, [16, 18, 20]);
const RESTARTS = Number(process.env.RESTARTS || 15000);
const SEED = Number(process.env.SEED || 3522026);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const m of M_LIST) {
  const t1 = Date.now();
  const inst = buildInstance(m);
  const best = bestAvoidArea1(inst, RESTARTS, SEED);
  rows.push({
    grid_m: m,
    total_points: inst.n,
    restarts: RESTARTS,
    best_area1_free_subset_size: best,
    density: Number((best / inst.n).toFixed(8)),
    runtime_ms: Date.now() - t1,
  });
}
const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));

const out = {
  problem: 'EP-352',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_lattice_subset_search_avoiding_area1_triangles',
  params: { M_LIST, RESTARTS, SEED },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
