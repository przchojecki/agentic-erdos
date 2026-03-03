#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Build explicit constructive lower bound on represented even gaps for each k:
// For even t, if there are at least t/2-1 odd primes among first k that exceed t,
// then the distinct-large-prime CRT construction applies.
// This yields guaranteed represented even gaps at least:
//   2,4,...,T_k  where T_k is max even t satisfying condition.

const KMAX = Number(process.env.KMAX || 40);
const SCAN_PATH = process.env.SCAN_PATH || 'data/ep854_primorial_gap_scan.json';

function firstPrimes(k) {
  const out = [];
  let n = 2;
  while (out.length < k) {
    let ok = true;
    for (let d = 2; d * d <= n; d += 1) {
      if (n % d === 0) {
        ok = false;
        break;
      }
    }
    if (ok) out.push(n);
    n += 1;
  }
  return out;
}

const primes = firstPrimes(KMAX);
let scan = null;
if (fs.existsSync(SCAN_PATH)) {
  scan = JSON.parse(fs.readFileSync(SCAN_PATH, 'utf8'));
}

const rows = [];
for (let k = 1; k <= KMAX; k += 1) {
  const pk = primes[k - 1];
  let Tk = 0;
  for (let t = 2; t <= pk; t += 2) {
    const need = t / 2 - 1;
    let have = 0;
    for (let i = 0; i < k; i += 1) {
      const p = primes[i];
      if (p > t && p % 2 === 1) have += 1;
    }
    if (have >= need) Tk = t;
  }
  rows.push({
    k,
    p_k: pk,
    guaranteed_even_gaps_count: Tk / 2,
    guaranteed_max_even_gap: Tk,
  });
}

if (scan && Array.isArray(scan.rows)) {
  const byK = new Map(scan.rows.map((r) => [r.k, r]));
  for (const r of rows) {
    const s = byK.get(r.k);
    if (!s) continue;
    r.observed_max_gap = s.max_gap;
    r.observed_represented_even_count = s.represented_even_gap_count_up_to_max;
    if (s.max_gap > 0) {
      r.guaranteed_count_over_observed_max = r.guaranteed_even_gaps_count / s.max_gap;
      r.observed_count_over_observed_max = s.represented_even_gap_count_up_to_max / s.max_gap;
    }
  }
}

const out = {
  problem: 'EP-854',
  script: path.basename(process.argv[1]),
  method: 'explicit_distinct_large_prime_construction_lower_bound_profile',
  params: { kmax: KMAX, scan_path: SCAN_PATH },
  rows,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep854_constructive_lower_bound_profile.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ outPath, rows: rows.length }, null, 2));
