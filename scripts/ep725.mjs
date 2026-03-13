#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_LIST = (process.env.N_LIST || '4,5,6,7,8').split(',').map((x) => Number(x.trim())).filter(Boolean);
const K_MAX = Number(process.env.K_MAX || 4);

function* permute(arr, l = 0) {
  if (l === arr.length) {
    yield arr.slice();
    return;
  }
  for (let i = l; i < arr.length; i += 1) {
    [arr[l], arr[i]] = [arr[i], arr[l]];
    yield* permute(arr, l + 1);
    [arr[l], arr[i]] = [arr[i], arr[l]];
  }
}

function factorial(n) {
  let x = 1;
  for (let i = 2; i <= n; i += 1) x *= i;
  return x;
}

function countLatinRectangles(k, n) {
  const base = Array.from({ length: n }, (_, i) => i);
  const perms = [...permute(base.slice())];

  // Normalize first row to identity to reduce by factor n!.
  const first = base.slice();
  const usedInCol = Array.from({ length: n }, () => new Set([first[0]]));
  const grid = [first];

  for (let c = 0; c < n; c += 1) usedInCol[c] = new Set([first[c]]);

  let countNorm = 0;
  function dfs(row) {
    if (row === k) {
      countNorm += 1;
      return;
    }
    for (const p of perms) {
      let ok = true;
      for (let c = 0; c < n; c += 1) {
        if (usedInCol[c].has(p[c])) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      for (let c = 0; c < n; c += 1) usedInCol[c].add(p[c]);
      grid.push(p);
      dfs(row + 1);
      grid.pop();
      for (let c = 0; c < n; c += 1) usedInCol[c].delete(p[c]);
    }
  }

  dfs(1);
  return countNorm * factorial(n);
}

const t0 = Date.now();
const rows = [];
for (const n of N_LIST) {
  for (let k = 2; k <= Math.min(K_MAX, n); k += 1) {
    const exact = countLatinRectangles(k, n);
    const approx = Math.exp(-(k * (k - 1)) / 2) * (factorial(n) ** k);
    rows.push({
      n,
      k,
      exact_count: exact,
      asymptotic_template_exp_neg_binom_k2_times_nfact_pow_k: Number(approx.toExponential(8)),
      ratio_exact_over_template: Number((exact / approx).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-725',
  script: path.basename(process.argv[1]),
  method: 'exact_small_latin_rectangle_count_vs_asymptotic_template',
  warning: 'Exact only for small n,k in this computation.',
  params: { N_LIST, K_MAX },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
