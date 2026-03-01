#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const M_MAX = Number(process.env.M_MAX || 10); // use 1!,...,M_MAX!

const facts = [1n];
for (let i = 1; i <= M_MAX; i++) facts[i] = facts[i - 1] * BigInt(i);

function isPerfectPower(x) {
  if (x <= 1n) return false;
  const v = Number(x);
  const out = [];
  for (let k = 2; k <= 10; k++) {
    const r = Math.round(v ** (1 / k));
    if (r >= 2 && BigInt(r) ** BigInt(k) === x) out.push(k);
  }
  return out;
}

function isPowerfulByTrial(x) {
  if (x <= 1n) return false;
  let n = x;
  let p = 2n;
  while (p * p <= n) {
    if (n % p === 0n) {
      let e = 0;
      while (n % p === 0n) {
        n /= p;
        e++;
      }
      if (e < 2) return false;
    }
    p = p === 2n ? 3n : p + 2n;
  }
  // leftover prime factor has exponent 1
  if (n > 1n) return false;
  return true;
}

const powerful = [];
const perfectPowers = [];
let total = 0;

for (let mask = 1; mask < (1 << M_MAX); mask++) {
  let s = 0n;
  for (let i = 0; i < M_MAX; i++) if ((mask >> i) & 1) s += facts[i + 1];
  total++;

  const pp = isPerfectPower(s);
  if (pp.length) perfectPowers.push({ mask, value: s.toString(), exponents: pp });

  if (isPowerfulByTrial(s)) powerful.push({ mask, value: s.toString() });
}

const out = {
  script: path.basename(process.argv[1]),
  m_max: M_MAX,
  total_subset_sums_scanned: total,
  powerful_count: powerful.length,
  perfect_power_count: perfectPowers.length,
  powerful_examples: powerful.slice(0, 100),
  perfect_power_examples: perfectPowers.slice(0, 100),
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep1108_factorial_subset_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, total, powerful: powerful.length, perfectPowers: perfectPowers.length }, null, 2));
