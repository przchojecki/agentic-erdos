#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function isPrime(n) {
  if (n < 2) return false;
  if (n % 2 === 0) return n === 2;
  for (let d = 3; d * d <= n; d += 2) if (n % d === 0) return false;
  return true;
}

function buildKnownRepresentable(NMAX) {
  const rep = new Uint8Array(NMAX + 1);

  for (let n = 1; n * n <= NMAX; n += 1) rep[n * n] = 1;
  for (let n = 1; n * n <= NMAX; n += 1) {
    for (const c of [2, 3, 6]) {
      const v = c * n * n;
      if (v <= NMAX) rep[v] = 1;
    }
  }
  for (let a = 1; a * a <= NMAX; a += 1) {
    for (let b = 1; b * b + a * a <= NMAX; b += 1) rep[a * a + b * b] = 1;
  }
  for (let a = 1; a <= 90; a += 1) {
    for (let b = 1; b <= a; b += 1) {
      const thresh = 3 * Math.ceil((a * a + b * b + a * b - a - b) / (a * b));
      for (let n = Math.max(1, thresh); ; n += 1) {
        const v = n * n * a * b;
        if (v > NMAX) break;
        rep[v] = 1;
      }
    }
  }
  return rep;
}

const t0 = Date.now();
const NMAX = 12000;
const rep = buildKnownRepresentable(NMAX);

const checkpoints = [500, 1000, 2000, 4000, 8000, 12000];
const rows = [];
for (const X of checkpoints) {
  let represented = 0;
  let missing = 0;
  let prime43Missing = 0;
  let prime43Total = 0;
  for (let n = 1; n <= X; n += 1) {
    if (rep[n]) represented += 1;
    else missing += 1;
    if (isPrime(n) && n % 4 === 3) {
      prime43Total += 1;
      if (!rep[n]) prime43Missing += 1;
    }
  }
  rows.push({
    X,
    represented_count: represented,
    represented_density: Number((represented / X).toPrecision(8)),
    missing_count: missing,
    missing_density: Number((missing / X).toPrecision(8)),
    prime_4k_plus_3_missing: prime43Missing,
    prime_4k_plus_3_total: prime43Total,
    prime_4k_plus_3_missing_ratio: prime43Total
      ? Number((prime43Missing / prime43Total).toPrecision(8))
      : 0,
  });
}

const firstMissing = [];
for (let n = 1; n <= NMAX && firstMissing.length < 120; n += 1) if (!rep[n]) firstMissing.push(n);

const focusChecks = {
  contains_7: Boolean(rep[7]),
  contains_11: Boolean(rep[11]),
  contains_19: Boolean(rep[19]),
  contains_23: Boolean(rep[23]),
  contains_27: Boolean(rep[27]),
  contains_31: Boolean(rep[31]),
};

const out = {
  problem: 'EP-634',
  script: path.basename(process.argv[1]),
  method: 'deep_coverage_scan_of_known_congruent_triangle_tiling_families',
  params: { NMAX },
  coverage_rows: rows,
  first_missing_values: firstMissing,
  focus_checks: focusChecks,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
