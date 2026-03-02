#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const N_MAX = Number(process.env.N_MAX || 30000);
const K_MAX = Number(process.env.K_MAX || 60);
const SHOW_EXAMPLES = Number(process.env.SHOW_EXAMPLES || 40);

function sievePrimes(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= n; i++) {
    if (!isPrime[i]) continue;
    for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
  }
  const out = [];
  for (let i = 2; i <= n; i++) if (isPrime[i]) out.push(i);
  return out;
}

function largestPrimeFactorTable(n) {
  const lpf = new Int32Array(n + 1);
  for (let p = 2; p <= n; p++) {
    if (lpf[p] !== 0) continue;
    for (let j = p; j <= n; j += p) lpf[j] = p;
  }
  lpf[1] = 1;
  return lpf;
}

function vFact(n, p) {
  let s = 0;
  let q = p;
  while (q <= n) {
    s += Math.floor(n / q);
    if (q > Math.floor(n / p)) break;
    q *= p;
  }
  return s;
}

function binomDivByPrimeLEk(n, k, primesPrefix) {
  for (const p of primesPrefix[k]) {
    const v = vFact(n, p) - vFact(k, p) - vFact(n - k, p);
    if (v > 0) return true;
  }
  return false;
}

const primes = sievePrimes(K_MAX);
const primesPrefix = Array.from({ length: K_MAX + 1 }, () => []);
for (let k = 2; k <= K_MAX; k++) primesPrefix[k] = primes.filter((p) => p <= k);

const lpf = largestPrimeFactorTable(N_MAX);

const examples = [];
const counts = new Map();
let totalDefined = 0;

for (let k = 2; k <= K_MAX; k++) {
  for (let n = 2 * k; n <= N_MAX; n++) {
    if (binomDivByPrimeLEk(n, k, primesPrefix)) continue; // deficiency undefined
    totalDefined++;

    let def = 0;
    for (let i = 0; i < k; i++) {
      if (lpf[n - i] <= k) def++;
    }

    counts.set(def, (counts.get(def) || 0) + 1);
    if (def >= 1 && examples.length < SHOW_EXAMPLES) examples.push({ n, k, deficiency: def });
  }
}

const countRows = [...counts.entries()]
  .sort((a, b) => a[0] - b[0])
  .map(([deficiency, count]) => ({ deficiency, count }));

const highDefExamples = examples.filter((x) => x.deficiency > 1);

const out = {
  script: path.basename(process.argv[1]),
  n_max: N_MAX,
  k_max: K_MAX,
  total_defined_cases: totalDefined,
  deficiency_counts: countRows,
  sample_defined_with_deficiency_ge_1: examples,
  sample_with_deficiency_gt_1: highDefExamples,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep1093_deficiency_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(
  JSON.stringify(
    {
      outPath,
      n_max: N_MAX,
      k_max: K_MAX,
      total_defined: totalDefined,
      count_def_gt_1: countRows.filter((r) => r.deficiency > 1).reduce((s, r) => s + r.count, 0),
    },
    null,
    2
  )
);
