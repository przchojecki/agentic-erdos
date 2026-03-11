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

function evalPacking(pts) {
  let minD = Infinity;
  let maxD = 0;
  for (let i = 0; i < pts.length; i += 1) {
    for (let j = i + 1; j < pts.length; j += 1) {
      const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
      if (d < minD) minD = d;
      if (d > maxD) maxD = d;
    }
  }
  return { minD, maxD };
}

function signature(pts) {
  const ds = [];
  for (let i = 0; i < pts.length; i += 1) {
    for (let j = i + 1; j < pts.length; j += 1) {
      ds.push(Math.round(Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]) * 1000));
    }
  }
  ds.sort((a, b) => a - b);
  return ds.join(',');
}

function runForN(n, restarts, iters, seed) {
  const rng = makeRng(seed);
  let bestDiameter = Infinity;
  const nearOptSigs = new Set();

  for (let r = 0; r < restarts; r += 1) {
    const pts = randomPoints(n, rng);
    let cur = evalPacking(pts);

    for (let t = 0; t < iters; t += 1) {
      const i = Math.floor(rng() * n);
      const old = [pts[i][0], pts[i][1]];
      const step = 0.16 * Math.exp(-2 * t / iters);
      pts[i][0] += (rng() - 0.5) * step;
      pts[i][1] += (rng() - 0.5) * step;
      const nxt = evalPacking(pts);
      const curScore = cur.maxD + 120 * Math.max(0, 1 - cur.minD) ** 2;
      const nxtScore = nxt.maxD + 120 * Math.max(0, 1 - nxt.minD) ** 2;
      if (nxtScore <= curScore || rng() < Math.exp((curScore - nxtScore) / 0.25)) {
        cur = nxt;
      } else {
        pts[i] = old;
      }
    }

    const scale = 1 / cur.minD;
    const scaled = pts.map(([x, y]) => [x * scale, y * scale]);
    const st = evalPacking(scaled);
    if (st.maxD < bestDiameter) bestDiameter = st.maxD;
  }

  const threshold = bestDiameter * 1.01;
  // second pass to collect many near-opt signatures
  for (let r = 0; r < restarts; r += 1) {
    const pts = randomPoints(n, rng);
    let cur = evalPacking(pts);
    for (let t = 0; t < Math.floor(iters * 0.6); t += 1) {
      const i = Math.floor(rng() * n);
      const old = [pts[i][0], pts[i][1]];
      const step = 0.16 * Math.exp(-2 * t / iters);
      pts[i][0] += (rng() - 0.5) * step;
      pts[i][1] += (rng() - 0.5) * step;
      const nxt = evalPacking(pts);
      const curScore = cur.maxD + 120 * Math.max(0, 1 - cur.minD) ** 2;
      const nxtScore = nxt.maxD + 120 * Math.max(0, 1 - nxt.minD) ** 2;
      if (nxtScore <= curScore || rng() < Math.exp((curScore - nxtScore) / 0.25)) cur = nxt;
      else pts[i] = old;
    }
    const scale = 1 / cur.minD;
    const scaled = pts.map(([x, y]) => [x * scale, y * scale]);
    const st = evalPacking(scaled);
    if (st.maxD <= threshold) nearOptSigs.add(signature(scaled));
  }

  return {
    n,
    best_diameter_est: Number(bestDiameter.toFixed(6)),
    near_opt_signature_count_within_1pct: nearOptSigs.size,
  };
}

const N_LIST = (process.env.N_LIST || '8,9,10,11,12').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const RESTARTS = Number(process.env.RESTARTS || 36);
const ITERS = Number(process.env.ITERS || 1600);
const SEED = Number(process.env.SEED || 10302026);
const OUT = process.env.OUT || '';

const rows = N_LIST.map((n, i) => runForN(n, RESTARTS, ITERS, SEED ^ (n * 997 + i * 41)));

const out = {
  problem: 'EP-103',
  script: path.basename(process.argv[1]),
  method: 'near_min_diameter_signature_multiplicity_proxy',
  params: { N_LIST, RESTARTS, ITERS, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
