#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x >= 2);
  return out.length ? out : fallback;
}

function parseFracList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isFinite(x) && x > 0 && x <= 1);
  return out.length ? out : fallback;
}

function parseKXMap(value, fallback) {
  const src = value || fallback;
  const mp = new Map();
  for (const part of src.split(',')) {
    const s = part.trim();
    if (!s) continue;
    const [kStr, xStr] = s.split(':');
    const k = Number(kStr);
    const x = Number(xStr);
    if (Number.isInteger(k) && Number.isInteger(x) && k >= 2 && x > 0) mp.set(k, x);
  }
  return mp;
}

function parseKXListMap(value, fallback) {
  const src = value || fallback;
  const mp = new Map();
  for (const part of src.split(',')) {
    const s = part.trim();
    if (!s) continue;
    const [kStr, listStr] = s.split(':');
    const k = Number(kStr);
    if (!Number.isInteger(k) || k < 2 || !listStr) continue;
    const xs = listStr
      .split('+')
      .map((v) => Number(v.trim()))
      .filter((x) => Number.isInteger(x) && x > 0)
      .sort((a, b) => a - b);
    if (xs.length) mp.set(k, [...new Set(xs)]);
  }
  return mp;
}

function kthPowers(k, xMax) {
  const vals = [];
  for (let a = 0; ; a += 1) {
    const v = a ** k;
    if (v > xMax) break;
    vals.push(v);
  }
  return vals;
}

function profileFk3(k, xMax, fracMilestones) {
  const vals = kthPowers(k, xMax);
  const m = vals.length;
  const mark = new Uint8Array(xMax + 1);

  for (let i = 0; i < m; i += 1) {
    const ai = vals[i];
    for (let j = i; j < m; j += 1) {
      const aij = ai + vals[j];
      if (aij > xMax) break;
      for (let t = j; t < m; t += 1) {
        const s = aij + vals[t];
        if (s > xMax) break;
        mark[s] = 1;
      }
    }
  }

  const milestones = [...new Set(fracMilestones.map((f) => Math.max(1, Math.floor(xMax * f))))]
    .sort((a, b) => a - b);
  const rows = [];
  let ptr = 0;
  let covered = 0;
  for (let x = 1; x <= xMax && ptr < milestones.length; x += 1) {
    if (mark[x]) covered += 1;
    while (ptr < milestones.length && x === milestones[ptr]) {
      const X = milestones[ptr];
      rows.push({
        k,
        X,
        x_max_used: xMax,
        basis_size: m,
        f_k3_X: covered,
        ratio_over_X_pow_3_over_k: Number((covered / (X ** (3 / k))).toFixed(8)),
        density: Number((covered / X).toFixed(8)),
      });
      ptr += 1;
    }
  }
  return rows;
}

const K_LIST = parseIntList(process.env.K_LIST, [3, 4, 5, 6]);
const K_XMAX = parseKXMap(process.env.K_XMAX, '3:220000000,4:140000000,5:120000000,6:100000000');
const K_XMAX_LIST = parseKXListMap(
  process.env.K_XMAX_LIST,
  '3:60000000+80000000+100000000+120000000+150000000+180000000+220000000+280000000+340000000+400000000,4:50000000+70000000+90000000+120000000+150000000+190000000+240000000+280000000,5:40000000+60000000+80000000+110000000+150000000+200000000,6:30000000+50000000+70000000+100000000+140000000',
);
const FRACTIONS = parseFracList(process.env.FRACTIONS, [0.05, 0.1, 0.2, 0.35, 0.5, 0.7, 1.0]);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const k of K_LIST) {
  const list = K_XMAX_LIST.get(k) || (K_XMAX.get(k) ? [K_XMAX.get(k)] : []);
  for (const xMax of list) {
    const t1 = Date.now();
    const sub = profileFk3(k, xMax, FRACTIONS);
    rows.push(
      ...sub.map((r) => ({
        ...r,
        run_runtime_ms_for_k: Date.now() - t1,
      })),
    );
  }
}
const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));

const out = {
  problem: 'EP-325',
  script: path.basename(process.argv[1]),
  method: 'standalone_exact_profile_f_k_3_up_to_large_x',
  params: {
    K_LIST,
    K_XMAX: Object.fromEntries(K_XMAX),
    K_XMAX_LIST: Object.fromEntries([...K_XMAX_LIST.entries()].map(([k, xs]) => [String(k), xs])),
    FRACTIONS,
  },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
