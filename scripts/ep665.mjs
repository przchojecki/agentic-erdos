#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function primePowersUpTo(n) {
  const out = [];
  const isPrime = new Uint8Array(n + 1).fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let p = 2; p * p <= n; p += 1) {
    if (!isPrime[p]) continue;
    for (let m = p * p; m <= n; m += p) isPrime[m] = 0;
  }
  for (let p = 2; p <= n; p += 1) {
    if (!isPrime[p]) continue;
    let x = p;
    while (x <= n) {
      out.push(x);
      if (x > Math.floor(n / p)) break;
      x *= p;
    }
  }
  out.sort((a, b) => a - b);
  return [...new Set(out)];
}

const t0 = Date.now();
const qVals = primePowersUpTo(1000);
const rows = [];

for (const q of qVals) {
  const n = q * q + q + 1;
  const minBlock = q + 1;
  const gap = Math.sqrt(n) - minBlock;
  rows.push({
    projective_plane_order_q: q,
    n_points: n,
    min_block_size: minBlock,
    sqrt_n: Number(Math.sqrt(n).toPrecision(10)),
    sqrt_n_minus_min_block: Number(gap.toPrecision(10)),
    ratio_min_block_over_sqrt_n: Number((minBlock / Math.sqrt(n)).toPrecision(10)),
  });
}

const checkpoints = [100, 300, 1000, 3000, 10000, 30000, 100000];
const gapRows = [];
for (const N of checkpoints) {
  const root = Math.floor(Math.sqrt(N));
  let bestQ = 2;
  for (const q of qVals) {
    if (q <= root + 40 && q > bestQ) bestQ = q;
  }
  const n = bestQ * bestQ + bestQ + 1;
  gapRows.push({
    target_n_scale: N,
    selected_projective_n: n,
    q: bestQ,
    resulting_h_proxy: Number((Math.sqrt(n) - (bestQ + 1)).toPrecision(10)),
  });
}

const out = {
  problem: 'EP-665',
  script: path.basename(process.argv[1]),
  method: 'projective_plane_parameter_sweep_for_block_size_gap_to_sqrt_n',
  params: {},
  projective_rows: rows,
  scale_gap_rows: gapRows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
