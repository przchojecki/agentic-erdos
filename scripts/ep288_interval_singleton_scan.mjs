#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-288 finite scan for the hard restricted case |I2|=1:
// find intervals I1=[a,b] and c such that
//   sum_{n=a}^b 1/n + 1/c is an integer.

const MAX_N = Number(process.env.MAX_N || 160);
const SAMPLE_CAP = Number(process.env.SAMPLE_CAP || 200);

if (!Number.isInteger(MAX_N) || MAX_N < 5) throw new Error('MAX_N must be integer >=5');
if (!Number.isInteger(SAMPLE_CAP) || SAMPLE_CAP < 1) throw new Error('SAMPLE_CAP must be positive integer');

function gcd(a, b) {
  let x = a;
  let y = b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x < 0n ? -x : x;
}

function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

let D = 1n;
for (let n = 1; n <= MAX_N; n += 1) D = lcm(D, BigInt(n));

const inv = new Array(MAX_N + 1).fill(0n);
for (let n = 1; n <= MAX_N; n += 1) inv[n] = D / BigInt(n);

const H = new Array(MAX_N + 1).fill(0n); // numerators of harmonic sums with denominator D
for (let n = 1; n <= MAX_N; n += 1) H[n] = H[n - 1] + inv[n];

let count = 0;
let disjointCount = 0;
const samples = [];
const disjointSamples = [];
let maxLen = 0;

for (let a = 1; a <= MAX_N; a += 1) {
  for (let b = a; b <= MAX_N; b += 1) {
    const numI1 = H[b] - H[a - 1];
    for (let c = 1; c <= MAX_N; c += 1) {
      const num = numI1 + inv[c];
      if (num % D === 0n) {
        count += 1;
        const len = b - a + 1;
        if (len > maxLen) maxLen = len;
        const isDisjoint = c < a || c > b;
        if (isDisjoint) disjointCount += 1;
        if (samples.length < SAMPLE_CAP) {
          samples.push({ a, b, c, interval_length: len, integer_value: (num / D).toString() });
        }
        if (isDisjoint && disjointSamples.length < SAMPLE_CAP) {
          disjointSamples.push({ a, b, c, interval_length: len, integer_value: (num / D).toString() });
        }
      }
    }
  }
}

const out = {
  problem: 'EP-288',
  script: path.basename(process.argv[1]),
  method: 'exact_denominator_lcm_scan_restricted_to_singleton_second_interval',
  params: { MAX_N, SAMPLE_CAP },
  denominator_lcm_digits: D.toString().length,
  total_solutions_count: count,
  disjoint_singleton_solutions_count: disjointCount,
  max_interval_length_in_solutions: maxLen,
  samples,
  disjoint_samples: disjointSamples,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep288_interval_singleton_scan.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      outPath,
      total_solutions_count: count,
      disjoint_singleton_solutions_count: disjointCount,
      max_interval_length_in_solutions: maxLen,
      first_disjoint_sample: disjointSamples[0] || null,
    },
    null,
    2
  )
);
