#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function evalPoly(coeffs, x) {
  let s = 0n;
  let p = 1n;
  const bx = BigInt(x);
  for (const c of coeffs) {
    s += BigInt(c) * p;
    p *= bx;
  }
  return s;
}

function checkDistinctPairSums(coeffs, B) {
  const vals = Array.from({ length: B + 1 }, (_, x) => evalPoly(coeffs, x));
  const seen = new Map();
  let collisions = 0;
  let first = null;
  for (let a = 0; a <= B; a += 1) {
    for (let b = a + 1; b <= B; b += 1) {
      const s = vals[a] + vals[b];
      const key = s.toString();
      if (seen.has(key)) {
        collisions += 1;
        if (!first) first = { pair1: seen.get(key), pair2: [a, b], sum: key };
      } else {
        seen.set(key, [a, b]);
      }
    }
  }
  return { B, pair_count: (B * (B + 1)) / 2, collisions, first_collision: first };
}

const CASES = [
  { name: 'x^5', coeffs: [0, 0, 0, 0, 0, 1] },
  { name: 'x^6', coeffs: [0, 0, 0, 0, 0, 0, 1] },
  { name: 'x^5+x', coeffs: [0, 1, 0, 0, 0, 1] },
  { name: 'x^5+x^2', coeffs: [0, 0, 1, 0, 0, 1] },
];
const B_LIST = (process.env.B_LIST || '800,1200,1600,2200').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const rows = [];
for (const cs of CASES) {
  const perB = [];
  for (const B of B_LIST) perB.push({ B, ...checkDistinctPairSums(cs.coeffs, B) });
  rows.push({ polynomial: cs.name, coeffs: cs.coeffs, checks: perB });
}

const out = {
  problem: 'EP-324',
  script: path.basename(process.argv[1]),
  method: 'pair_sum_collision_search_for_integer_polynomials',
  params: { B_LIST },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
