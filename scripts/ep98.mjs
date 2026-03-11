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
  for (let i = 0; i < n; i += 1) pts.push([rng() * 2 - 1, rng() * 2 - 1]);
  return pts;
}

function distinctDistanceCount(pts) {
  const vals = [];
  for (let i = 0; i < pts.length; i += 1) {
    for (let j = i + 1; j < pts.length; j += 1) {
      const dx = pts[i][0] - pts[j][0];
      const dy = pts[i][1] - pts[j][1];
      vals.push(Math.round(Math.hypot(dx, dy) * 1e6));
    }
  }
  vals.sort((a, b) => a - b);
  let c = 0;
  for (let i = 0; i < vals.length; i += 1) if (i === 0 || vals[i] !== vals[i - 1]) c += 1;
  return c;
}

function penaltyGeneralPosition(pts) {
  const n = pts.length;
  let p = 0;

  // no 3 collinear
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      for (let k = j + 1; k < n; k += 1) {
        const ax = pts[j][0] - pts[i][0];
        const ay = pts[j][1] - pts[i][1];
        const bx = pts[k][0] - pts[i][0];
        const by = pts[k][1] - pts[i][1];
        const area2 = Math.abs(ax * by - ay * bx);
        if (area2 < 1e-5) p += (1e-5 - area2) * 1e6;
      }
    }
  }

  // no 4 cocircular (sampled quadruples for cost control)
  const QMAX = 4000;
  let q = 0;
  for (let a = 0; a < n && q < QMAX; a += 1) {
    for (let b = a + 1; b < n && q < QMAX; b += 1) {
      for (let c = b + 1; c < n && q < QMAX; c += 1) {
        const x1 = pts[a][0], y1 = pts[a][1];
        const x2 = pts[b][0], y2 = pts[b][1];
        const x3 = pts[c][0], y3 = pts[c][1];
        const d = 2 * (x1 * (y2 - y3) + x2 * (y3 - y1) + x3 * (y1 - y2));
        if (Math.abs(d) < 1e-8) continue;
        const ux = ((x1 * x1 + y1 * y1) * (y2 - y3) + (x2 * x2 + y2 * y2) * (y3 - y1) + (x3 * x3 + y3 * y3) * (y1 - y2)) / d;
        const uy = ((x1 * x1 + y1 * y1) * (x3 - x2) + (x2 * x2 + y2 * y2) * (x1 - x3) + (x3 * x3 + y3 * y3) * (x2 - x1)) / d;
        const r2 = (x1 - ux) ** 2 + (y1 - uy) ** 2;
        for (let e = c + 1; e < n && q < QMAX; e += 1) {
          q += 1;
          const de = Math.abs((pts[e][0] - ux) ** 2 + (pts[e][1] - uy) ** 2 - r2);
          if (de < 1e-5) p += (1e-5 - de) * 1e4;
        }
      }
    }
  }
  return p;
}

function optimize(n, restarts, iters, seed) {
  const rng = makeRng(seed);
  let best = null;

  for (let r = 0; r < restarts; r += 1) {
    const pts = randomPoints(n, rng);
    let curDist = distinctDistanceCount(pts);
    let curPen = penaltyGeneralPosition(pts);

    for (let t = 0; t < iters; t += 1) {
      const i = Math.floor(rng() * n);
      const old = [pts[i][0], pts[i][1]];
      const step = 0.12 * Math.exp(-2 * t / iters);
      pts[i][0] += (rng() - 0.5) * step;
      pts[i][1] += (rng() - 0.5) * step;
      const nd = distinctDistanceCount(pts);
      const np = penaltyGeneralPosition(pts);
      const curScore = curDist + 1e6 * curPen;
      const newScore = nd + 1e6 * np;
      if (newScore <= curScore || rng() < Math.exp((curScore - newScore) / 2)) {
        curDist = nd;
        curPen = np;
      } else {
        pts[i] = old;
      }
    }

    if (!best || curPen < best.penalty || (curPen === best.penalty && curDist < best.distinct)) {
      best = { n, distinct: curDist, penalty: curPen };
    }
  }
  return {
    n,
    best_distinct_distances: best.distinct,
    general_position_penalty: Number(best.penalty.toExponential(3)),
    ratio_h_over_n: Number((best.distinct / n).toFixed(4)),
  };
}

const N_LIST = (process.env.N_LIST || '10,12,14,16,18').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const RESTARTS = Number(process.env.RESTARTS || 24);
const ITERS = Number(process.env.ITERS || 1800);
const SEED = Number(process.env.SEED || 9802026);
const OUT = process.env.OUT || '';

const rows = N_LIST.map((n, i) => optimize(n, RESTARTS, ITERS, SEED ^ (n * 1009 + i * 29)));

const out = {
  problem: 'EP-98',
  script: path.basename(process.argv[1]),
  method: 'general_position_low_distinct_distance_annealing_proxy',
  params: { N_LIST, RESTARTS, ITERS, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
