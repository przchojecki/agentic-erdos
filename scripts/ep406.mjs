#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function hasOnlyDigitsFromSetBase(v, base, allowed) {
  let x = v;
  if (x === 0n) return allowed.has('0');
  const b = BigInt(base);
  while (x > 0n) {
    const d = (x % b).toString();
    if (!allowed.has(d)) return false;
    x /= b;
  }
  return true;
}

const NEXP = Number(process.env.NEXP || 120000);
const MILESTONES = (process.env.MILESTONES || '100,1000,10000,50000,80000,120000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const allow01 = new Set(['0', '1']);
const allow12 = new Set(['1', '2']);

let v = 1n;
const hits01 = [];
const hits12 = [];
const rows = [];
const mset = new Set(MILESTONES);

for (let n = 0; n <= NEXP; n += 1) {
  if (hasOnlyDigitsFromSetBase(v, 3, allow01)) hits01.push(n);
  if (hasOnlyDigitsFromSetBase(v, 3, allow12)) hits12.push(n);

  if (mset.has(n)) {
    rows.push({ n, count_hits_01_up_to_n: hits01.length, count_hits_12_up_to_n: hits12.length });
  }

  v <<= 1n;
}

const out = {
  problem: 'EP-406',
  script: path.basename(process.argv[1]),
  method: 'extended_ternary_digit_scan_for_powers_of_two',
  params: { NEXP, MILESTONES },
  exponents_with_only_digits_0_1: hits01,
  exponents_with_only_digits_1_2: hits12,
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
