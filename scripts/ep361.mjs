#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Exact DP over reachable-sum bitmasks up to n.
function maxSubsetNoSumN(n, c) {
  const M = Math.floor(c * n);
  const capMask = (1n << BigInt(n + 1)) - 1n;
  let states = new Map();
  states.set(1n, 0); // only sum 0 reachable

  for (let x = 1; x <= M; x += 1) {
    const next = new Map(states);
    for (const [mask, sz] of states) {
      const shifted = (mask << BigInt(x)) & capMask;
      const nm = mask | shifted;
      if (((nm >> BigInt(n)) & 1n) === 1n) continue; // forbid representing n
      const old = next.get(nm);
      if (old === undefined || old < sz + 1) next.set(nm, sz + 1);
    }
    states = next;
  }

  let best = 0;
  for (const v of states.values()) if (v > best) best = v;
  return { n, c, M, max_size: best, states_count: states.size };
}

const N_LIST = (process.env.N_LIST || '20,25,30,35,40').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const C_LIST = (process.env.C_LIST || '1.0,1.25,1.5,1.75,2.0').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const rows = [];
for (const n of N_LIST) {
  for (const c of C_LIST) rows.push(maxSubsetNoSumN(n, c));
}

const out = {
  problem: 'EP-361',
  script: path.basename(process.argv[1]),
  method: 'exact_subset_sum_forbidden_target_extremal_size_dp',
  params: { N_LIST, C_LIST },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
