#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function validPair(a, b, t) {
  const d = b - a;
  if (d < t) return true;
  return b % d !== 0;
}

function maxSetForNT(N, t) {
  const cur = [];
  let best = [];

  function canAdd(x) {
    for (const a of cur) {
      const lo = Math.min(a, x);
      const hi = Math.max(a, x);
      if (!validPair(lo, hi, t)) return false;
    }
    return true;
  }

  function dfs(x) {
    if (x > N) {
      if (cur.length > best.length) best = cur.slice();
      return;
    }
    if (cur.length + (N - x + 1) <= best.length) return;

    if (canAdd(x)) {
      cur.push(x);
      dfs(x + 1);
      cur.pop();
    }
    dfs(x + 1);
  }

  dfs(1);
  return best;
}

const t0 = Date.now();
const rows = [];

for (const t of [1, 2, 3, 4]) {
  const maxN = t <= 2 ? 34 : 30;
  for (let N = 10; N <= maxN; N += 2) {
    const best = maxSetForNT(N, t);
    rows.push({
      t,
      N,
      max_size_exact: best.length,
      ratio_over_N: Number((best.length / N).toPrecision(8)),
      witness_prefix: best.slice(0, 20),
    });
  }
}

const summary = [];
for (const t of [1, 2, 3, 4]) {
  const part = rows.filter((r) => r.t === t);
  const last = part[part.length - 1];
  summary.push({
    t,
    largest_N_checked: last.N,
    max_size_at_largest_N: last.max_size_exact,
    ratio_at_largest_N: last.ratio_over_N,
  });
}

const out = {
  problem: 'EP-635',
  script: path.basename(process.argv[1]),
  method: 'exact_branch_and_bound_for_maximum_set_avoiding_large_divisor_differences',
  params: {},
  rows,
  summary,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
