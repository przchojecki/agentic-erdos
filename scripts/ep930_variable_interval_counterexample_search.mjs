#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-930 targeted search for r=2:
// For each k, search disjoint intervals I1, I2 with lengths in [k, k+lenExtra]
// and endpoints <= Nmax such that product(I1)*product(I2) is a perfect power.

const NMAX = Number(process.env.NMAX || 1200);
const KMIN = Number(process.env.KMIN || 4);
const KMAX = Number(process.env.KMAX || 8);
const LEN_EXTRA = Number(process.env.LEN_EXTRA || 4);

function buildSpf(limit) {
  const spf = new Uint32Array(limit + 1);
  for (let i = 2; i <= limit; i += 1) {
    if (spf[i] !== 0) continue;
    spf[i] = i;
    if (i <= Math.floor(limit / i)) {
      for (let j = i * i; j <= limit; j += i) {
        if (spf[j] === 0) spf[j] = i;
      }
    }
  }
  return spf;
}

function gcd(a, b) {
  let x = a;
  let y = b;
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return Math.abs(x);
}

function addMap(dst, src) {
  for (const [p, e] of src.entries()) dst.set(p, (dst.get(p) || 0) + e);
}

function subMap(dst, src) {
  for (const [p, e] of src.entries()) {
    const v = (dst.get(p) || 0) - e;
    if (v === 0) dst.delete(p);
    else dst.set(p, v);
  }
}

function isPerfectPowerFromExpMap(m) {
  let g = 0;
  for (const e of m.values()) {
    g = g === 0 ? e : gcd(g, e);
    if (g === 1) return false;
  }
  return g >= 2;
}

function factorMap(x, spf) {
  const m = new Map();
  let v = x;
  while (v > 1) {
    const p = spf[v];
    let e = 0;
    while (v % p === 0) {
      v = Math.floor(v / p);
      e += 1;
    }
    m.set(p, (m.get(p) || 0) + e);
  }
  return m;
}

const spf = buildSpf(NMAX + 5);
const numberFactor = Array(NMAX + 1);
numberFactor[0] = new Map();
numberFactor[1] = new Map();
for (let i = 2; i <= NMAX; i += 1) numberFactor[i] = factorMap(i, spf);

const prefix = Array(NMAX + 1);
prefix[0] = new Map();
for (let i = 1; i <= NMAX; i += 1) {
  const m = new Map(prefix[i - 1]);
  addMap(m, numberFactor[i]);
  prefix[i] = m;
}

function intervalExp(l, r) {
  const out = new Map(prefix[r]);
  subMap(out, prefix[l - 1]);
  return out;
}

const rows = [];
for (let k = KMIN; k <= KMAX; k += 1) {
  const intervals = [];
  const lmax = k + LEN_EXTRA;

  for (let len = k; len <= lmax; len += 1) {
    for (let a = 1; a + len - 1 <= NMAX; a += 1) {
      const b = a + len - 1;
      intervals.push({ a, b, len, exp: intervalExp(a, b) });
    }
  }
  intervals.sort((x, y) => (x.a - y.a) || (x.b - y.b));

  let found = null;
  let checks = 0;
  for (let i = 0; i < intervals.length && !found; i += 1) {
    const I1 = intervals[i];
    for (let j = i + 1; j < intervals.length; j += 1) {
      const I2 = intervals[j];
      if (I2.a <= I1.b) continue; // not disjoint
      checks += 1;
      const merged = new Map(I1.exp);
      addMap(merged, I2.exp);
      if (isPerfectPowerFromExpMap(merged)) {
        found = {
          I1: [I1.a, I1.b],
          I2: [I2.a, I2.b],
          lengths: [I1.len, I2.len],
        };
        break;
      }
    }
  }

  rows.push({
    k,
    search_params: { nmax: NMAX, len_min: k, len_max: lmax },
    checks,
    r2_counterexample_found: found,
  });

  process.stderr.write(`k=${k}: ${found ? 'found' : 'none'} after ${checks} checks\n`);
}

const out = {
  problem: 'EP-930',
  script: path.basename(process.argv[1]),
  method: 'exact_exponent_gcd_search_for_r2_with_variable_interval_lengths',
  params: { nmax: NMAX, kmin: KMIN, kmax: KMAX, len_extra: LEN_EXTRA },
  rows,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep930_variable_interval_counterexample_search.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ outPath, nmax: NMAX, kmin: KMIN, kmax: KMAX }, null, 2));
