#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function squarefreeFlags(n) {
  const sf = new Uint8Array(n + 1).fill(1);
  sf[0] = 0;
  for (let p = 2; p * p <= n; p += 1) {
    const q = p * p;
    for (let m = q; m <= n; m += q) sf[m] = 0;
  }
  return sf;
}

function minimalShiftForPrefix(sf, n, tMax) {
  for (let t = 1; t <= tMax; t += 1) {
    let ok = true;
    for (let a = 1; a <= n; a += 1) {
      if (sf[a] !== sf[a + t]) {
        ok = false;
        break;
      }
    }
    if (ok) return t;
  }
  return -1;
}

const t0 = Date.now();
const NMAX = 120;
const TMAX = 120000;
const sf = squarefreeFlags(NMAX + TMAX + 5);
const rows = [];

for (const n of [10, 15, 20, 25, 30, 36, 42, 50, 60, 72, 84, 96, 108, 120]) {
  const t = minimalShiftForPrefix(sf, n, TMAX);
  rows.push({
    n,
    minimal_shift_t_n_found_up_to_bound: t,
    found_within_bound: t > 0,
    log_t_over_n: t > 0 ? Number((Math.log(t) / n).toPrecision(8)) : null,
    t_over_exp_sqrt_n: t > 0 ? Number((t / Math.exp(Math.sqrt(n))).toPrecision(8)) : null,
  });
}

const out = {
  problem: 'EP-675',
  script: path.basename(process.argv[1]),
  method: 'direct_search_for_minimal_translation_shifts_in_squarefree_indicator_prefixes',
  params: { NMAX, TMAX },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
