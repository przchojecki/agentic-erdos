#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function prodConsecutive(start, k) {
  let v = 1n;
  for (let i = 1; i <= k; i += 1) v *= BigInt(start + i);
  return v;
}

const t0 = Date.now();
const NMAX = 500;
const KMAX = 9;
const NSCAN = 260;

const representable = new Map();
const rows = [];

for (let k = 2; k <= KMAX; k += 1) {
  const vals = [];
  for (let n = 1; n <= NSCAN; n += 1) vals.push(prodConsecutive(n, k));

  let hit = 0;
  for (let n = 1; n <= NSCAN; n += 1) {
    const den = vals[n - 1];
    for (let m = n + k; m <= NSCAN; m += 1) {
      const num = vals[m - 1];
      if (num % den !== 0n) continue;
      const q = num / den;
      if (q < 2n || q > BigInt(NMAX)) continue;
      const N = Number(q);
      if (!representable.has(N)) representable.set(N, []);
      if (representable.get(N).length < 4) representable.get(N).push({ n, m, k });
      hit += 1;
    }
  }

  rows.push({
    k,
    scan_n_up_to: NSCAN,
    representable_hits_in_range: hit,
  });
}

const missing = [];
for (let N = 2; N <= NMAX; N += 1) if (!representable.has(N)) missing.push(N);

const out = {
  problem: 'EP-686',
  script: path.basename(process.argv[1]),
  method: 'expanded_exact_search_for_integer_ratios_of_equal_length_consecutive_products',
  params: { NMAX, KMAX, NSCAN },
  k_rows: rows,
  representable_count_up_to_NMAX: NMAX - 1 - missing.length,
  missing_count_up_to_NMAX: missing.length,
  first_80_missing_values: missing.slice(0, 80),
  sample_witnesses: Object.fromEntries(
    [...representable.entries()]
      .slice(0, 40)
      .map(([N, w]) => [String(N), w])
  ),
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
