#!/usr/bin/env node
import fs from 'fs';

// EP-849: deeper finite multiplicity scan in Pascal triangle interior.
const OUT = process.env.OUT || 'data/ep849_standalone_deeper.json';
const NMAX = 1500;

const t0 = Date.now();
const map = new Map();
for (let n = 1; n <= NMAX; n += 1) {
  let c = 1n;
  for (let k = 1; k <= Math.floor(n / 2); k += 1) {
    c = (c * BigInt(n - k + 1)) / BigInt(k);
    const key = c.toString();
    map.set(key, (map.get(key) || 0) + 1);
  }
}

let maxMult = 0;
let argmaxValue = '';
const heavy = [];
for (const [a, m] of map.entries()) {
  if (m > maxMult) {
    maxMult = m;
    argmaxValue = a;
  }
  if (m >= 4) heavy.push({ a, m, digits: a.length });
}
heavy.sort((x, y) => y.m - x.m || x.digits - y.digits);

const countByT = {};
for (const m of map.values()) countByT[m] = (countByT[m] || 0) + 1;

const out = {
  problem: 'EP-849',
  script: 'ep849.mjs',
  method: 'deep_pascal_interior_multiplicity_scan',
  params: { NMAX },
  max_multiplicity_found: maxMult,
  argmax_value: argmaxValue,
  multiplicity_histogram: countByT,
  values_with_multiplicity_at_least_4_count: heavy.length,
  sample_values_with_multiplicity_at_least_4: heavy.slice(0, 40),
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
