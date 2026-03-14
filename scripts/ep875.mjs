#!/usr/bin/env node
import fs from 'fs';

const OUT = process.env.OUT || 'data/ep875_standalone_deeper.json';
const CASES = [
  { R: 5, terms: 24, maxTryStep: 5000 },
  { R: 6, terms: 22, maxTryStep: 6000 },
  { R: 7, terms: 20, maxTryStep: 8000 },
];

function subsetSumsBySize(A, R) {
  const S = Array.from({ length: R + 1 }, () => new Set());
  const n = A.length;
  function dfs(i, taken, sum) {
    if (taken <= R) S[taken].add(sum);
    if (i === n || taken === R) return;
    dfs(i + 1, taken, sum);
    dfs(i + 1, taken + 1, sum + A[i]);
  }
  dfs(0, 0, 0);
  return S;
}

function disjointBySize(S, R) {
  for (let r = 1; r <= R; r += 1) {
    for (let s = r + 1; s <= R; s += 1) {
      for (const v of S[r]) if (S[s].has(v)) return false;
    }
  }
  return true;
}

function greedyAdmissible(R, terms, maxTryStep) {
  const A = [1];
  let cur = 1;
  while (A.length < terms) {
    let found = false;
    for (let step = 1; step <= maxTryStep; step += 1) {
      const x = cur + step;
      const B = A.concat([x]);
      const S = subsetSumsBySize(B, R);
      if (disjointBySize(S, R)) {
        A.push(x);
        cur = x;
        found = true;
        break;
      }
    }
    if (!found) break;
  }
  return A;
}

const t0 = Date.now();
const rows = [];
for (const C of CASES) {
  const A = greedyAdmissible(C.R, C.terms, C.maxTryStep);
  const ratios = [];
  for (let i = 0; i + 1 < A.length; i += 1) ratios.push(A[i + 1] / A[i]);
  const avgRatio = ratios.length ? ratios.reduce((u, v) => u + v, 0) / ratios.length : null;
  const maxGap = A.length > 1 ? Math.max(...A.slice(1).map((v, i) => v - A[i])) : 0;
  rows.push({
    R: C.R,
    target_terms: C.terms,
    built_terms: A.length,
    last_term: A[A.length - 1],
    max_gap: maxGap,
    avg_ratio: avgRatio ? Number(avgRatio.toPrecision(8)) : null,
    sample_prefix: A.slice(0, 20),
  });
}

const out = {
  problem: 'EP-875',
  script: 'ep875.mjs',
  method: 'finite_horizon_greedy_construction_with_disjoint_sum_levels',
  warning: 'Checks disjointness only up to level R and finite prefix length.',
  params: { CASES },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
