#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function gcdBig(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function lcmBig(a, b) {
  return (a / gcdBig(a, b)) * b;
}

function reduceFrac(num, den) {
  const g = gcdBig(num, den);
  return [num / g, den / g];
}

const deepPasses = 220;
let rows = [];
let firstCoprime = null;
let firstNontrivial = null;
for (let pass = 0; pass < deepPasses; pass += 1) {
  let num = 0n;
  let den = 1n;
  let L = 1n;
  let coprimeCount = 0;
  let nontrivialCount = 0;
  const milestones = new Set([200, 400, 600, 800, 1000]);
  const cur = [];

  for (let n = 1; n <= 1000; n += 1) {
    const bn = BigInt(n);
    [num, den] = reduceFrac(num * bn + den, den * bn);
    L = lcmBig(L, bn);
    const a = num * (L / den);
    const g = gcdBig(a, L);

    if (g === 1n) {
      coprimeCount += 1;
      if (firstCoprime === null) firstCoprime = n;
    } else {
      nontrivialCount += 1;
      if (firstNontrivial === null) firstNontrivial = n;
    }

    if (milestones.has(n)) {
      cur.push({
        n,
        coprime_count_up_to_n: coprimeCount,
        nontrivial_count_up_to_n: nontrivialCount,
        coprime_density: Number((coprimeCount / n).toPrecision(7)),
      });
    }
  }
  rows = cur;
}

const out = {
  problem: 'EP-291',
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  result: {
    description: 'Deep exact BigInt profile of gcd(a_n, L_n) with harmonic numerator scaling.',
    deep_passes: deepPasses,
    first_n_with_gcd_eq_1: firstCoprime,
    first_n_with_gcd_gt_1: firstNontrivial,
    rows,
  },
};

const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-291', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(out, null, 2));
}
