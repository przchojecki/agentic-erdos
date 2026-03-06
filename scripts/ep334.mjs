#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x >= 1000);
  return out.length ? out : fallback;
}

function sieveSpf(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i += 1) {
    if (spf[i] !== 0) continue;
    spf[i] = i;
    if (i * i > n) continue;
    for (let j = i * i; j <= n; j += i) if (spf[j] === 0) spf[j] = i;
  }
  return spf;
}

function buildLargestPrimeFactor(n, spf) {
  const lp = new Int32Array(n + 1);
  lp[1] = 1;
  for (let x = 2; x <= n; x += 1) {
    let t = x;
    let m = 1;
    while (t > 1) {
      const p = spf[t];
      if (p > m) m = p;
      while (t % p === 0) t = Math.floor(t / p);
    }
    lp[x] = m;
  }
  return lp;
}

function minYProfile(nMax, lp) {
  const bestY = new Int32Array(nMax + 1);
  bestY[2] = 1;
  for (let n = 3; n <= nMax; n += 1) {
    let best = 1 << 30;
    const half = Math.floor(n / 2);
    for (let a = 1; a <= half; a += 1) {
      const y = lp[a] > lp[n - a] ? lp[a] : lp[n - a];
      if (y < best) best = y;
      if (best <= 2) break;
    }
    bestY[n] = best;
  }
  return bestY;
}

const N_MAX = Number(process.env.N_MAX || 120000);
const CHECKPOINTS = parseIntList(process.env.CHECKPOINTS, [20000, 40000, 60000, 80000, 100000, 120000])
  .filter((x) => x <= N_MAX);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const spf = sieveSpf(N_MAX + 5);
const lp = buildLargestPrimeFactor(N_MAX, spf);
const bestY = minYProfile(N_MAX, lp);

const checkpoints = [];
for (const N of CHECKPOINTS) {
  let maxY = 0;
  let arg = -1;
  let sumAlpha = 0;
  for (let n = 3; n <= N; n += 1) {
    const y = bestY[n];
    if (y > maxY) {
      maxY = y;
      arg = n;
    }
    sumAlpha += Math.log(y) / Math.log(n);
  }
  checkpoints.push({
    N,
    max_min_smoothness_up_to_N: maxY,
    argmax_n: arg,
    max_log_ratio_logY_over_logN: Number((Math.log(maxY) / Math.log(N)).toFixed(6)),
    mean_log_ratio: Number((sumAlpha / (N - 2)).toFixed(6)),
  });
}

const hard_instances_sample = [];
for (let n = 3; n <= N_MAX; n += 1) {
  if (bestY[n] >= 29 && hard_instances_sample.length < 200) {
    hard_instances_sample.push({ n, best_y: bestY[n] });
  }
}

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-334',
  script: path.basename(process.argv[1]),
  method: 'standalone_exact_scan_min_y_in_n_equals_a_plus_b_with_y_smooth_parts',
  params: { N_MAX, CHECKPOINTS },
  checkpoints,
  hard_instances_sample,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
