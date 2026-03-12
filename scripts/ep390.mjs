#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function factorialBig(n) {
  let v = 1n;
  for (let i = 2n; i <= BigInt(n); i += 1n) v *= i;
  return v;
}

function minimalMBySubsetProduct(n, mMax) {
  const target = factorialBig(n);
  let reachable = new Set([1n]);

  for (let m = n + 1; m <= mMax; m += 1) {
    const bm = BigInt(m);
    if (target % bm !== 0n) continue;

    const next = new Set(reachable);
    for (const r of reachable) {
      const t = r * bm;
      if (t > target) continue;
      if (target % t === 0n) next.add(t);
    }
    reachable = next;

    if (reachable.has(target)) return { m, reached: true, states: reachable.size };
  }

  return { m: null, reached: false, states: reachable.size };
}

const NMAX = Number(process.env.NMAX || 22);
const EXTRA = Number(process.env.EXTRA || 80);
const OUT = process.env.OUT || '';

const rows = [];
let solved = 0;

for (let n = 2; n <= NMAX; n += 1) {
  const mMax = 2 * n + EXTRA;
  const res = minimalMBySubsetProduct(n, mMax);
  if (res.reached) solved += 1;

  const ratio = res.m === null ? null : (res.m - 2 * n) / (n / Math.log(n));
  rows.push({
    n,
    m_found: res.m,
    search_cap_m: mMax,
    reached_within_cap: res.reached,
    dp_state_count_last: res.states,
    normalized_shift_estimate: ratio === null ? null : Number(ratio.toPrecision(6)),
  });
}

const out = {
  problem: 'EP-390',
  script: path.basename(process.argv[1]),
  method: 'exact_subset_product_dp_for_small_n_profile_of_f_n',
  params: { NMAX, EXTRA },
  solved_within_cap: solved,
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
