#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function isqrt(n) {
  if (n < 0n) throw new Error('negative');
  if (n < 2n) return n;
  let x = n;
  let y = (x + 1n) >> 1n;
  while (y < x) {
    x = y;
    y = (x + n / x) >> 1n;
  }
  return x;
}

function isSquare(n) {
  if (n < 0n) return false;
  const r = isqrt(n);
  return r * r === n;
}

function multiplyConsecutive(x, len) {
  let v = 1n;
  for (let i = 0n; i < BigInt(len); i += 1n) v *= (x + i);
  return v;
}

function findConsecutiveRoot(target, len) {
  let lo = 1n;
  let hi = 2n;
  while (multiplyConsecutive(hi, len) < target) hi *= 2n;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1n;
    const val = multiplyConsecutive(mid, len);
    if (val === target) return mid;
    if (val < target) lo = mid + 1n;
    else hi = mid - 1n;
  }
  return null;
}

const N2 = Number(process.env.N2 || 2000);
const N3 = Number(process.env.N3 || 600);
const N4 = Number(process.env.N4 || 260);
const OUT = process.env.OUT || '';

let fact = 1n;
const two = [];
const three = [];
const four = [];

for (let n = 1; n <= Math.max(N2, N3, N4); n += 1) {
  fact *= BigInt(n);

  if (n <= N2 && n >= 2) {
    const D = 1n + 4n * fact;
    if (isSquare(D)) {
      const r = isqrt(D);
      if ((r - 1n) % 2n === 0n) {
        const x = (r - 1n) / 2n;
        if (x * (x + 1n) === fact) two.push({ n, x: x.toString() });
      }
    }
  }

  if (n <= N3 && n >= 3) {
    const x = findConsecutiveRoot(fact, 3);
    if (x !== null) three.push({ n, x: x.toString() });
  }

  if (n <= N4 && n >= 4) {
    const x = findConsecutiveRoot(fact, 4);
    if (x !== null) four.push({ n, x: x.toString() });
  }
}

const out = {
  problem: 'EP-393',
  script: path.basename(process.argv[1]),
  method: 'extended_exact_search_for_factorial_equal_consecutive_products',
  params: { N2, N3, N4 },
  two_consecutive_solutions: two,
  three_consecutive_solutions: three,
  four_consecutive_solutions: four,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
