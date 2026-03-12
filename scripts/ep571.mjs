#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function gcd(a, b) {
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return Math.abs(a);
}

function addRat(set, num, den) {
  const g = gcd(num, den);
  set.add(`${num / g}/${den / g}`);
}

const t0 = Date.now();
const known = new Set();

for (let s = 2; s <= 320; s += 1) {
  addRat(known, 3 * s - 1, 2 * s);
  addRat(known, 4 * s - 1, 3 * s);
  addRat(known, 5 * s - 1, 4 * s);
}
for (let b = 2; b <= 600; b += 1) addRat(known, 2 * b, 2 * b + 1);

for (let a = 1; a <= 70; a += 1) {
  for (let b = a * a + 1; b <= 700; b += 1) addRat(known, a + b, b);
}
for (let a = 1; a <= 90; a += 1) {
  for (let b = Math.max(a + 1, (a - 1) * (a - 1)); b <= 700; b += 1) addRat(known, 2 * b - a, b);
}
for (let a = 1; a <= 120; a += 1) {
  for (let b = a + 1; b <= 1000; b += 1) {
    if (b % a === 1 || b % a === a - 1) addRat(known, 2 * b - a, b);
  }
}

const rows = [];
for (const denBound of [120, 180, 240]) {
  const all = [];
  const hit = [];
  const miss = [];
  for (let den = 2; den <= denBound; den += 1) {
    for (let num = den; num < 2 * den; num += 1) {
      if (gcd(num, den) !== 1) continue;
      const key = `${num}/${den}`;
      all.push(key);
      if (known.has(key)) hit.push(key); else miss.push(key);
    }
  }
  rows.push({
    denominator_bound: denBound,
    total_reduced_rationals_in_1_2: all.length,
    covered_count: hit.length,
    covered_ratio: Number((hit.length / all.length).toPrecision(8)),
    sample_uncovered_first_25: miss.slice(0, 25),
  });
}

const out = {
  problem: 'EP-571',
  script: path.basename(process.argv[1]),
  method: 'deeper_coverage_map_for_known_turan_exponent_families_in_1_2',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
