#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function latticePoints(B) {
  const pts = [];
  for (let x = -B; x <= B; x += 1) for (let y = -B; y <= B; y += 1) pts.push([x, y]);
  return pts;
}

function area2(a, b, c) {
  return (b[0] - a[0]) * (c[1] - a[1]) - (b[1] - a[1]) * (c[0] - a[0]);
}

function circleThrough3(a, b, c) {
  const x1 = a[0], y1 = a[1];
  const x2 = b[0], y2 = b[1];
  const x3 = c[0], y3 = c[1];
  const d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
  if (d === 0) return null;
  const ux = ((x1 * x1 + y1 * y1) * (y2 - y3) + (x2 * x2 + y2 * y2) * (y3 - y1) + (x3 * x3 + y3 * y3) * (y1 - y2)) / d;
  const uy = ((x1 * x1 + y1 * y1) * (x3 - x2) + (x2 * x2 + y2 * y2) * (x1 - x3) + (x3 * x3 + y3 * y3) * (x2 - x1)) / d;
  const r2 = (x1 - ux) ** 2 + (y1 - uy) ** 2;
  return [ux, uy, r2];
}

function inGeneralPosition(pts) {
  const n = pts.length;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      for (let k = j + 1; k < n; k += 1) {
        if (area2(pts[i], pts[j], pts[k]) === 0) return false;
      }
    }
  }
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      for (let k = j + 1; k < n; k += 1) {
        const c = circleThrough3(pts[i], pts[j], pts[k]);
        if (!c) continue;
        const [ux, uy, r2] = c;
        for (let t = k + 1; t < n; t += 1) {
          const d = (pts[t][0] - ux) ** 2 + (pts[t][1] - uy) ** 2;
          if (Math.abs(d - r2) < 1e-9) return false;
        }
      }
    }
  }
  return true;
}

function isSquare(n) {
  const r = Math.floor(Math.sqrt(n));
  return r * r === n;
}

function buildIntegerDistanceAdj(pts) {
  const n = pts.length;
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const dx = pts[i][0] - pts[j][0];
      const dy = pts[i][1] - pts[j][1];
      const d2 = dx * dx + dy * dy;
      if (isSquare(d2)) adj[i][j] = adj[j][i] = 1;
    }
  }
  return adj;
}

function cliqueNumber(adj) {
  const n = adj.length;
  let best = 0;
  const total = 1 << n;
  for (let mask = 1; mask < total; mask += 1) {
    const sz = mask.toString(2).replace(/0/g, '').length;
    if (sz <= best) continue;
    let ok = true;
    for (let i = 0; i < n && ok; i += 1) {
      if (!((mask >>> i) & 1)) continue;
      for (let j = i + 1; j < n; j += 1) {
        if (!((mask >>> j) & 1)) continue;
        if (!adj[i][j]) {
          ok = false;
          break;
        }
      }
    }
    if (ok) best = sz;
  }
  return best;
}

function chromaticNumber(adj) {
  const n = adj.length;
  const deg = Array.from({ length: n }, (_, i) => adj[i].reduce((a, b) => a + b, 0));
  const order = Array.from({ length: n }, (_, i) => i).sort((a, b) => deg[b] - deg[a]);
  const col = Array(n).fill(-1);
  let best = n;
  function dfs(pos, used) {
    if (used >= best) return;
    if (pos === n) {
      best = used;
      return;
    }
    const v = order[pos];
    const blocked = new Uint8Array(used);
    for (let u = 0; u < n; u += 1) {
      const c = col[u];
      if (c >= 0 && adj[v][u]) blocked[c] = 1;
    }
    for (let c = 0; c < used; c += 1) {
      if (blocked[c]) continue;
      col[v] = c;
      dfs(pos + 1, used);
      col[v] = -1;
    }
    col[v] = used;
    dfs(pos + 1, used + 1);
    col[v] = -1;
  }
  dfs(0, 0);
  return best;
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

function randomSubset(arr, k, rng) {
  const a = arr.slice();
  for (let i = 0; i < k; i += 1) {
    const j = i + Math.floor(rng() * (a.length - i));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a.slice(0, k);
}

const B = Number(process.env.B || 5);
const N = Number(process.env.N || 10);
const TRIALS = Number(process.env.TRIALS || 3000);
const SEED = Number(process.env.SEED || 13002026);
const OUT = process.env.OUT || '';

const rng = makeRng(SEED);
const pool = latticePoints(B);
let best = null;
let gpFound = 0;

for (let t = 0; t < TRIALS; t += 1) {
  const pts = randomSubset(pool, N, rng);
  if (!inGeneralPosition(pts)) continue;
  gpFound += 1;
  const adj = buildIntegerDistanceAdj(pts);
  const omega = cliqueNumber(adj);
  const chi = chromaticNumber(adj);
  const edges = adj.reduce((s, row) => s + row.reduce((a, b) => a + b, 0), 0) / 2;
  const score = chi * 100 + omega * 10 + edges;
  if (!best || score > best.score) {
    best = { score, omega, chi, edges, points: pts };
  }
}

const out = {
  problem: 'EP-130',
  script: path.basename(process.argv[1]),
  method: 'finite_general_position_integer_distance_graph_search',
  params: { B, N, TRIALS, SEED },
  general_position_samples_found: gpFound,
  best_found: best
    ? {
        clique_number: best.omega,
        chromatic_number: best.chi,
        edges: best.edges,
        points: best.points,
      }
    : null,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
