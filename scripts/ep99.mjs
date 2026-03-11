#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function randomPoints(n, rng) {
  const pts = [];
  for (let i = 0; i < n; i += 1) pts.push([rng() * 4 - 2, rng() * 4 - 2]);
  return pts;
}

function geomStats(pts) {
  let minD = Infinity;
  let maxD = 0;
  for (let i = 0; i < pts.length; i += 1) {
    for (let j = i + 1; j < pts.length; j += 1) {
      const dx = pts[i][0] - pts[j][0];
      const dy = pts[i][1] - pts[j][1];
      const d = Math.hypot(dx, dy);
      if (d < minD) minD = d;
      if (d > maxD) maxD = d;
    }
  }
  return { minD, diameter: maxD };
}

function unitEquilateralCount(pts, target, tol = 1e-2) {
  let c = 0;
  for (let i = 0; i < pts.length; i += 1) {
    for (let j = i + 1; j < pts.length; j += 1) {
      for (let k = j + 1; k < pts.length; k += 1) {
        const dij = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
        const dik = Math.hypot(pts[i][0] - pts[k][0], pts[i][1] - pts[k][1]);
        const djk = Math.hypot(pts[j][0] - pts[k][0], pts[j][1] - pts[k][1]);
        if (Math.abs(dij - target) < tol && Math.abs(dik - target) < tol && Math.abs(djk - target) < tol) c += 1;
      }
    }
  }
  return c;
}

function optimize(n, restarts, iters, seed) {
  const rng = makeRng(seed);
  let best = null;

  for (let r = 0; r < restarts; r += 1) {
    const pts = randomPoints(n, rng);
    let st = geomStats(pts);

    for (let t = 0; t < iters; t += 1) {
      const i = Math.floor(rng() * n);
      const old = [pts[i][0], pts[i][1]];
      const step = 0.15 * Math.exp(-2 * t / iters);
      pts[i][0] += (rng() - 0.5) * step;
      pts[i][1] += (rng() - 0.5) * step;
      const ns = geomStats(pts);

      const penMin = Math.max(0, 1 - ns.minD);
      const curPenMin = Math.max(0, 1 - st.minD);
      const score = st.diameter + 100 * curPenMin * curPenMin;
      const nscore = ns.diameter + 100 * penMin * penMin;

      if (nscore <= score || rng() < Math.exp((score - nscore) / 0.2)) {
        st = ns;
      } else {
        pts[i] = old;
      }
    }

    const scale = 1 / st.minD;
    const scaled = pts.map(([x, y]) => [x * scale, y * scale]);
    const scaledStats = geomStats(scaled);
    const tri = unitEquilateralCount(scaled, 1, 0.02);
    const row = {
      n,
      est_min_distance: Number(scaledStats.minD.toFixed(4)),
      est_diameter: Number(scaledStats.diameter.toFixed(4)),
      unit_equilateral_count_tol_0p02: tri,
    };

    if (!best || row.est_diameter < best.est_diameter) best = row;
  }
  return best;
}

const N_LIST = (process.env.N_LIST || '8,10,12,14,16').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const RESTARTS = Number(process.env.RESTARTS || 30);
const ITERS = Number(process.env.ITERS || 2200);
const SEED = Number(process.env.SEED || 9902026);
const OUT = process.env.OUT || '';

const rows = N_LIST.map((n, i) => optimize(n, RESTARTS, ITERS, SEED ^ (n * 809 + i * 37)));

const out = {
  problem: 'EP-99',
  script: path.basename(process.argv[1]),
  method: 'minimum_diameter_packing_proxy_with_equilateral_detection',
  params: { N_LIST, RESTARTS, ITERS, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
