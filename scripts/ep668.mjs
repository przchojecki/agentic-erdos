#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function shuffle(a, rng) {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
}

function unitEdgeCount(pts) {
  let c = 0;
  for (let i = 0; i < pts.length; i += 1) {
    for (let j = i + 1; j < pts.length; j += 1) {
      const dx = pts[i][0] - pts[j][0];
      const dy = pts[i][1] - pts[j][1];
      if (dx * dx + dy * dy === 1) c += 1;
    }
  }
  return c;
}

function distanceMultisetSignature(pts) {
  const D = [];
  for (let i = 0; i < pts.length; i += 1) {
    for (let j = i + 1; j < pts.length; j += 1) {
      const dx = pts[i][0] - pts[j][0];
      const dy = pts[i][1] - pts[j][1];
      D.push(dx * dx + dy * dy);
    }
  }
  D.sort((a, b) => a - b);
  return D.join(',');
}

function unitGraphSignature(pts) {
  const n = pts.length;
  const deg = Array(n).fill(0);
  const tri = Array(n).fill(0);
  let edges = 0;

  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const dx = pts[i][0] - pts[j][0];
      const dy = pts[i][1] - pts[j][1];
      if (dx * dx + dy * dy === 1) {
        adj[i][j] = 1;
        adj[j][i] = 1;
        deg[i] += 1;
        deg[j] += 1;
        edges += 1;
      }
    }
  }
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (!adj[i][j]) continue;
      for (let k = j + 1; k < n; k += 1) {
        if (adj[i][k] && adj[j][k]) {
          tri[i] += 1;
          tri[j] += 1;
          tri[k] += 1;
        }
      }
    }
  }
  const profile = deg.map((d, i) => `${d}:${tri[i]}`).sort().join('|');
  return `m=${edges};${profile}`;
}

function randomPointSetFromLattice(n, side, rng) {
  const all = [];
  for (let x = 0; x < side; x += 1) for (let y = 0; y < side; y += 1) all.push([x, y]);
  shuffle(all, rng);
  return all.slice(0, n);
}

function improve(pts, side, iters, rng) {
  let bestU = unitEdgeCount(pts);
  const used = new Set(pts.map(([x, y]) => `${x},${y}`));

  for (let it = 0; it < iters; it += 1) {
    const i = Math.floor(rng() * pts.length);
    const old = pts[i];
    used.delete(`${old[0]},${old[1]}`);

    let nx = Math.floor(rng() * side);
    let ny = Math.floor(rng() * side);
    let key = `${nx},${ny}`;
    let g = 0;
    while (used.has(key) && g < 40) {
      nx = Math.floor(rng() * side);
      ny = Math.floor(rng() * side);
      key = `${nx},${ny}`;
      g += 1;
    }
    if (used.has(key)) {
      used.add(`${old[0]},${old[1]}`);
      continue;
    }

    pts[i] = [nx, ny];
    used.add(key);
    const u = unitEdgeCount(pts);
    if (u >= bestU || rng() < 0.002) {
      if (u > bestU) bestU = u;
    } else {
      used.delete(key);
      pts[i] = old;
      used.add(`${old[0]},${old[1]}`);
    }
  }
  return bestU;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 668);
const rows = [];

for (const [n, side, restarts, steps] of [
  [4, 6, 8000, 120],
  [5, 7, 10000, 150],
  [6, 8, 12000, 180],
  [7, 9, 14000, 220],
  [8, 10, 16000, 260],
]) {
  let best = -1;
  const distSig = new Set();
  const graphSig = new Set();

  for (let r = 0; r < restarts; r += 1) {
    const pts = randomPointSetFromLattice(n, side, rng);
    const u = improve(pts, side, steps, rng);
    const uu = unitEdgeCount(pts);
    if (uu !== u) continue;
    if (u > best) {
      best = u;
      distSig.clear();
      graphSig.clear();
      distSig.add(distanceMultisetSignature(pts));
      graphSig.add(unitGraphSignature(pts));
    } else if (u === best) {
      distSig.add(distanceMultisetSignature(pts));
      graphSig.add(unitGraphSignature(pts));
    }
  }

  rows.push({
    n,
    lattice_side: side,
    restarts,
    local_search_steps: steps,
    best_unit_edges_found: best,
    distinct_distance_multiset_signatures_at_best: distSig.size,
    distinct_unit_graph_signatures_at_best: graphSig.size,
  });
}

const out = {
  problem: 'EP-668',
  script: path.basename(process.argv[1]),
  method: 'deep_lattice_search_for_unit_distance_maximizers_and_signature_multiplicity',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
