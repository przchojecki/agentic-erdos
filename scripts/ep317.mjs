#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function lcm(a, b) {
  return Math.floor((a / gcd(a, b)) * b);
}

function enumerateSums(coeffs) {
  const out = [];
  function dfs(i, s) {
    if (i === coeffs.length) {
      out.push(s);
      return;
    }
    const c = coeffs[i];
    dfs(i + 1, s);
    dfs(i + 1, s + c);
    dfs(i + 1, s - c);
  }
  dfs(0, 0);
  return out;
}

function lowerBound(arr, x) {
  let lo = 0;
  let hi = arr.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] < x) lo = mid + 1;
    else hi = mid;
  }
  return lo;
}

function minNonzeroAbsSignedSumNumerator(coeffs) {
  const mid = Math.floor(coeffs.length / 2);
  const left = coeffs.slice(0, mid);
  const right = coeffs.slice(mid);

  const rightSums = enumerateSums(right).sort((a, b) => a - b);
  const leftSums = enumerateSums(left);

  let best = Number.POSITIVE_INFINITY;
  for (const sL of leftSums) {
    const target = -sL;
    const idx = lowerBound(rightSums, target);
    for (const j of [idx - 1, idx, idx + 1]) {
      if (j < 0 || j >= rightSums.length) continue;
      const v = Math.abs(sL + rightSums[j]);
      if (v !== 0 && v < best) best = v;
    }
    if (best === 1) break;
  }
  return best;
}

const N_MAX = Number(process.env.N_MAX || 28);
const deepPasses = 3;
let rows = [];
let summary = { first_n_with_strict_gt_1_over_lcm: null, first_n_with_equal_1_over_lcm: null };
for (let pass = 0; pass < deepPasses; pass += 1) {
  const cur = [];
  let D = 1;
  for (let n = 1; n <= N_MAX; n += 1) {
    D = lcm(D, n);
    if (n < 3) continue;
    const coeffs = [];
    for (let k = 1; k <= n; k += 1) coeffs.push(Math.floor(D / k));
    const t0 = Date.now();
    const minNum = minNonzeroAbsSignedSumNumerator(coeffs);
    const runtimeMs = Date.now() - t0;
    cur.push({
      n,
      lcm_1_to_n: D,
      min_nonzero_numerator: minNum,
      min_nonzero_value: `${minNum}/${D}`,
      strict_gt_1_over_lcm_holds: minNum > 1,
      equals_1_over_lcm: minNum === 1,
      scaled_by_2_pow_n: Number(((minNum * (2 ** n)) / D).toFixed(12)),
      runtime_ms: runtimeMs,
    });
  }
  rows = cur;
  summary = {
    first_n_with_strict_gt_1_over_lcm: rows.find((r) => r.strict_gt_1_over_lcm_holds)?.n ?? null,
    first_n_with_equal_1_over_lcm: rows.find((r) => r.equals_1_over_lcm)?.n ?? null,
  };
}

const out = {
  problem: 'EP-317',
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  result: {
    method: 'exact_meet_in_the_middle_signed_harmonic_minimum',
    n_max: N_MAX,
    deep_passes: deepPasses,
    rows,
    summary,
  },
};

const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-317', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(out, null, 2));
}
