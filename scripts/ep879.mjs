#!/usr/bin/env node
import fs from 'fs';

// EP-879 finite proxy:
// exact max sum of pairwise-coprime subsets of [1..n] for moderate n.
const OUT = process.env.OUT || 'data/ep879_standalone_deeper.json';
const N_LIST = [16, 18, 20, 22, 24];

function gcd(a, b) {
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}

function exactMaxPairwiseCoprimeSum(n) {
  const vals = Array.from({ length: n }, (_, i) => n - i); // descending
  let best = 0;
  let bestSet = [];
  const chosen = [];

  const suffix = new Int32Array(vals.length + 1);
  for (let i = vals.length - 1; i >= 0; i -= 1) suffix[i] = suffix[i + 1] + vals[i];

  function dfs(i, sum) {
    if (sum + suffix[i] <= best) return;
    if (i === vals.length) {
      if (sum > best) {
        best = sum;
        bestSet = chosen.slice();
      }
      return;
    }
    const x = vals[i];
    let ok = true;
    for (const y of chosen) if (gcd(x, y) !== 1) {
      ok = false;
      break;
    }
    if (ok) {
      chosen.push(x);
      dfs(i + 1, sum + x);
      chosen.pop();
    }
    dfs(i + 1, sum);
  }
  dfs(0, 0);
  return { best, bestSet: bestSet.sort((a, b) => a - b) };
}

function simpleLowerBound(n) {
  const A = [];
  for (let x = n; x >= 1; x -= 1) {
    let ok = true;
    for (const y of A) if (gcd(x, y) !== 1) {
      ok = false;
      break;
    }
    if (ok) A.push(x);
  }
  const sum = A.reduce((u, v) => u + v, 0);
  return { sum, size: A.length };
}

const t0 = Date.now();
const rows = [];
for (const n of N_LIST) {
  const ex = exactMaxPairwiseCoprimeSum(n);
  const lb = simpleLowerBound(n);
  rows.push({
    n,
    exact_max_sum_pairwise_coprime: ex.best,
    exact_best_set_size: ex.bestSet.length,
    exact_best_set: ex.bestSet,
    greedy_lower_sum: lb.sum,
    greedy_lower_size: lb.size,
    gap_exact_minus_greedy: ex.best - lb.sum,
  });
}

const out = {
  problem: 'EP-879',
  script: 'ep879.mjs',
  method: 'exact_small_n_pairwise_coprime_sum_optimization_proxy',
  warning: 'Finite proxy does not encode all asymptotic conditions from the full problem statement.',
  params: { N_LIST },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
