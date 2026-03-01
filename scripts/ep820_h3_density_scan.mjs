#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

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

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep820_h3_density_scan.json');

const N = Number(process.argv[2] || 20000);
const checkpoints = [1000, 2000, 5000, 10000, 15000, 20000].filter((x) => x <= N);

let a = 1n; // 2^1 - 1
let b = 2n; // 3^1 - 1
let count = 0;
let lastHit = 0;
let maxGap = 0;

const rows = [];
for (let n = 1; n <= N; n += 1) {
  if (gcd(a, b) === 1n) {
    count += 1;
    if (lastHit > 0 && n - lastHit > maxGap) maxGap = n - lastHit;
    lastHit = n;
  }

  if (checkpoints.includes(n)) {
    rows.push({ upto: n, h3_count: count, h3_density: count / n });
  }

  a = 2n * a + 1n;
  b = 3n * b + 2n;

  if (n % 2000 === 0) process.stderr.write(`n=${n}/${N}\n`);
}

const out = {
  problem: 'EP-820',
  method: 'exact_recurrence_scan_for_h3_indicator',
  N,
  final: {
    count,
    density: count / N,
    max_gap_between_h3_hits: maxGap,
    last_hit: lastHit,
  },
  rows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
