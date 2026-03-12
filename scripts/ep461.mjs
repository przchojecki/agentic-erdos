#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveSpf(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i += 1) if (!spf[i]) {
    spf[i] = i;
    if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
  }
  return spf;
}

function tSmoothComponent(m, t, spf) {
  let x = m;
  let out = 1;
  while (x > 1) {
    const p = spf[x];
    let pe = 1;
    while (x % p === 0) {
      x = Math.floor(x / p);
      pe *= p;
    }
    if (p < t) out *= pe;
  }
  return out;
}

const T_LIST = (process.env.T_LIST || '100,200,400,800,1200,1800').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const NMAX = Number(process.env.NMAX || 80000);
const STEP = Number(process.env.STEP || 25);
const OUT = process.env.OUT || '';

const MMAX = NMAX + Math.max(...T_LIST) + 5;
const spf = sieveSpf(MMAX);

const rows = [];
for (const t of T_LIST) {
  let minRatio = 1;
  let maxRatio = 0;
  let minRow = null;
  let maxRow = null;
  let sumRatio = 0;
  let cnt = 0;

  for (let n = 0; n <= NMAX; n += STEP) {
    const s = new Set();
    for (let m = n + 1; m <= n + t; m += 1) s.add(tSmoothComponent(m, t, spf));
    const f = s.size;
    const ratio = f / t;
    sumRatio += ratio;
    cnt += 1;

    if (ratio < minRatio) {
      minRatio = ratio;
      minRow = { n, f };
    }
    if (ratio > maxRatio) {
      maxRatio = ratio;
      maxRow = { n, f };
    }
  }

  rows.push({
    t,
    scanned_n_count: cnt,
    min_ratio_f_over_t: Number(minRatio.toPrecision(8)),
    min_witness: minRow,
    mean_ratio_f_over_t: Number((sumRatio / cnt).toPrecision(8)),
    max_ratio_f_over_t: Number(maxRatio.toPrecision(8)),
    max_witness: maxRow,
    baseline_t_over_logt_ratio: Number((t / Math.log(t)).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-461',
  script: path.basename(process.argv[1]),
  method: 'deep_scan_of_distinct_t_smooth_components_in_short_intervals',
  params: { T_LIST, NMAX, STEP },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
