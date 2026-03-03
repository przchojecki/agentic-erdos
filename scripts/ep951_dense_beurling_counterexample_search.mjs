#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-951 exploratory search:
// try dense sequences (#{a_i <= x} > pi(x)) and test a finite truncation of
// the separation condition:
//   |prod a_i^{k_i} - prod a_i^{l_i}| >= 1
// over all generated products <= PRODUCT_BOUND.

const X_VALUES = (process.env.X_VALUES || '30,40,50')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => Number.isFinite(x) && x >= 5);
const PRODUCT_BOUND = Number(process.env.PRODUCT_BOUND || 1_000_000);
const MAX_PRODUCTS = Number(process.env.MAX_PRODUCTS || 250_000);
const RANDOM_FAMILIES = Number(process.env.RANDOM_FAMILIES || 40);
const SEED = Number(process.env.SEED || 20260302);

function sievePi(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1);
  isPrime[0] = 0;
  if (n >= 1) isPrime[1] = 0;
  for (let p = 2; p * p <= n; p += 1) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= n; m += p) isPrime[m] = 0;
  }
  const pi = new Int32Array(n + 1);
  for (let i = 1; i <= n; i += 1) pi[i] = pi[i - 1] + (isPrime[i] ? 1 : 0);
  return pi;
}

function makeRng(seed) {
  let x = (seed >>> 0) || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function shiftedIntegers(theta, xMax) {
  const out = [];
  const lastInt = Math.floor(xMax - theta + 1e-12);
  for (let n = 2; n <= lastInt; n += 1) out.push(n + theta);
  return out;
}

function monotoneShiftedIntegers(xMax, rng) {
  // a_n = n + d_n, where d_n is nondecreasing in [0,1), so gaps are >= 1.
  const out = [];
  let d = 0.02 + 0.3 * rng();
  for (let n = 2; ; n += 1) {
    d = Math.min(0.98, d + 0.08 * rng());
    const v = n + d;
    if (v > xMax + 1e-12) break;
    out.push(v);
  }
  return out;
}

function enumerateProducts(values, bound, maxProducts) {
  const logs = values.map((v) => Math.log(v));
  const logBound = Math.log(bound);
  const out = [];
  let overflow = false;

  function dfs(i, cur, logCur) {
    if (overflow) return;
    if (i === values.length) {
      out.push(cur);
      if (out.length > maxProducts) overflow = true;
      return;
    }

    // e = 0
    dfs(i + 1, cur, logCur);
    if (overflow) return;

    let e = 1;
    let nextVal = cur * values[i];
    let nextLog = logCur + logs[i];
    while (nextLog <= logBound + 1e-12 && Number.isFinite(nextVal)) {
      dfs(i + 1, nextVal, nextLog);
      if (overflow) return;
      e += 1;
      nextVal *= values[i];
      nextLog += logs[i];
      if (e > 128) break;
    }
  }

  dfs(0, 1, 0);
  return { products: out, overflow };
}

function checkMinGap(products) {
  const arr = products.slice().sort((a, b) => a - b);
  let minGap = Number.POSITIVE_INFINITY;
  let witness = null;
  for (let i = 1; i < arr.length; i += 1) {
    const gap = arr[i] - arr[i - 1];
    if (gap < minGap) {
      minGap = gap;
      witness = { left: arr[i - 1], right: arr[i], gap };
    }
  }
  return { minGap, witness };
}

function evaluateFamily(name, values, xMax, piX) {
  const count = values.filter((v) => v <= xMax + 1e-12).length;
  const denseVsPi = count - piX;

  // Singleton test implied by the condition.
  let singletonGapOk = true;
  let singletonWitness = null;
  for (let i = 1; i < values.length; i += 1) {
    const gap = values[i] - values[i - 1];
    if (gap < 1 - 1e-12) {
      singletonGapOk = false;
      singletonWitness = { left: values[i - 1], right: values[i], gap };
      break;
    }
  }
  if (values.length && values[0] < 2 - 1e-12) {
    singletonGapOk = false;
    singletonWitness = { left: 1, right: values[0], gap: values[0] - 1 };
  }

  if (!singletonGapOk) {
    return {
      family: name,
      x_max: xMax,
      count_le_x: count,
      pi_x: piX,
      dense_vs_pi: denseVsPi,
      singleton_gap_ok: false,
      singleton_gap_witness: singletonWitness,
      tested_product_bound: PRODUCT_BOUND,
      generated_products: 0,
      product_enum_overflow: false,
      min_gap_products: null,
      passes_truncated_check: false,
    };
  }

  const { products, overflow } = enumerateProducts(values, PRODUCT_BOUND, MAX_PRODUCTS);
  const { minGap, witness } = checkMinGap(products);
  const pass = !overflow && minGap >= 1 - 1e-12;
  return {
    family: name,
    x_max: xMax,
    count_le_x: count,
    pi_x: piX,
    dense_vs_pi: denseVsPi,
    singleton_gap_ok: true,
    tested_product_bound: PRODUCT_BOUND,
    generated_products: products.length,
    product_enum_overflow: overflow,
    min_gap_products: minGap,
    min_gap_witness: witness,
    passes_truncated_check: pass,
  };
}

const pi = sievePi(Math.max(...X_VALUES.map((x) => Math.ceil(x))) + 5);
const rng = makeRng(SEED);
const rows = [];

for (const xMax of X_VALUES) {
  const piX = pi[Math.floor(xMax)];

  // Deterministic shifted-integer families.
  for (let t = 1; t <= 19; t += 1) {
    const theta = t / 20;
    const vals = shiftedIntegers(theta, xMax);
    if (vals.length <= piX) continue;
    rows.push(evaluateFamily(`shifted_integers_theta_${theta.toFixed(2)}`, vals, xMax, piX));
  }

  // Random monotone-shifted families.
  for (let r = 0; r < RANDOM_FAMILIES; r += 1) {
    const vals = monotoneShiftedIntegers(xMax, rng);
    if (vals.length <= piX) continue;
    rows.push(evaluateFamily(`random_monotone_shift_family_${r + 1}`, vals, xMax, piX));
  }
}

let bestDense = null;
for (const row of rows) {
  if (bestDense == null || row.dense_vs_pi > bestDense.dense_vs_pi) bestDense = row;
}
const truncatedPasses = rows.filter((r) => r.passes_truncated_check);

const out = {
  problem: 'EP-951',
  script: path.basename(process.argv[1]),
  method: 'dense_real_sequence_search_with_truncated_product_separation_check',
  params: {
    x_values: X_VALUES,
    product_bound: PRODUCT_BOUND,
    max_products: MAX_PRODUCTS,
    random_families: RANDOM_FAMILIES,
    seed: SEED,
  },
  tested_family_count: rows.length,
  truncated_pass_count: truncatedPasses.length,
  best_dense_family: bestDense,
  rows,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep951_dense_beurling_counterexample_search.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      outPath,
      tested_family_count: rows.length,
      truncated_pass_count: truncatedPasses.length,
      best_dense_vs_pi: bestDense ? bestDense.dense_vs_pi : null,
    },
    null,
    2
  )
);
