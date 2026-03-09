#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntEnv(name, fallback) {
  const v = Number(process.env[name] || fallback);
  if (!Number.isInteger(v) || v < 3) throw new Error(`${name} must be integer >= 3`);
  return v;
}

function parseXList(value, fallback) {
  const src = value || fallback;
  const xs = src
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x > 0)
    .sort((a, b) => a - b);
  if (!xs.length) throw new Error('X_LIST must contain positive integers');
  return [...new Set(xs)];
}

function kthPowersUpTo(k, xMax) {
  const vals = [];
  for (let a = 0; ; a += 1) {
    const v = a ** k;
    if (v > xMax) break;
    vals.push(v);
  }
  return vals;
}

function buildRepresentedSums(k, xMax) {
  const vals = kthPowersUpTo(k, xMax);
  const m = vals.length;
  const sums = [];
  for (let i = 0; i < m; i += 1) {
    const ai = vals[i];
    for (let j = i; j < m; j += 1) {
      const aij = ai + vals[j];
      if (aij > xMax) break;
      for (let t = j; t < m; t += 1) {
        const s = aij + vals[t];
        if (s > xMax) break;
        sums.push(s);
      }
    }
  }
  sums.sort((a, b) => a - b);
  const unique = [];
  let prev = -1;
  for (const s of sums) {
    if (s !== prev) unique.push(s);
    prev = s;
  }
  return {
    basis_size: m,
    generated_triples_unordered: sums.length,
    represented: unique,
  };
}

function summarizeGaps(represented, sampleCap = 25) {
  let maxGapLen = 0;
  let maxGapStart = -1;
  let maxGapEnd = -1;
  const firstMissing = [];
  for (let i = 1; i < represented.length; i += 1) {
    const a = represented[i - 1];
    const b = represented[i];
    const gap = b - a - 1;
    if (gap > 0) {
      if (gap > maxGapLen) {
        maxGapLen = gap;
        maxGapStart = a + 1;
        maxGapEnd = b - 1;
      }
      if (firstMissing.length < sampleCap) {
        for (let x = a + 1; x < b && firstMissing.length < sampleCap; x += 1) {
          firstMissing.push(x);
        }
      }
    }
  }
  return {
    max_missing_gap_len: maxGapLen,
    max_missing_gap_start: maxGapStart,
    max_missing_gap_end: maxGapEnd,
    first_missing_samples: firstMissing,
  };
}

const K = parseIntEnv('K', 4);
const X_LIST = parseXList(process.env.X_LIST, '1000000,10000000,100000000');
const OUT = process.env.OUT || '';
const xMax = X_LIST[X_LIST.length - 1];

const t0 = Date.now();
const built = buildRepresentedSums(K, xMax);
const represented = built.represented;

const rows = [];
let ptr = 0;
for (const X of X_LIST) {
  while (ptr < represented.length && represented[ptr] <= X) ptr += 1;
  const f = ptr;
  rows.push({
    k: K,
    X,
    f_k3_X: f,
    ratio_over_X_pow_3_over_k: Number((f / (X ** (3 / K))).toFixed(8)),
    gamma_hat_log_ratio: Number((Math.log(f) / Math.log(X)).toFixed(8)),
    density_over_integers: Number((f / X).toFixed(12)),
  });
}

const out = {
  problem: 'EP-325',
  script: path.basename(process.argv[1]),
  method: 'exact_sparse_unordered_triples_kth_powers',
  params: { K, X_LIST },
  basis_size: built.basis_size,
  generated_triples_unordered: built.generated_triples_unordered,
  represented_distinct_up_to_xmax: represented.length,
  rows,
  diagnostics: summarizeGaps(represented),
  runtime_seconds: Number(((Date.now() - t0) / 1000).toFixed(3)),
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
