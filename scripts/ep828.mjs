#!/usr/bin/env node
import fs from 'fs';

// EP-828: deeper finite profile for solutions of phi(n) | n+a.
const OUT = process.env.OUT || 'data/ep828_standalone_deeper.json';
const N = 2_000_000;
const A_LIST = [-16, -12, -8, -4, -1, 0, 1, 2, 3, 5, 8, 12, 16];

const t0 = Date.now();
const phi = new Uint32Array(N + 1);
for (let i = 0; i <= N; i += 1) phi[i] = i;
for (let p = 2; p <= N; p += 1) {
  if (phi[p] !== p) continue;
  for (let k = p; k <= N; k += p) phi[k] -= Math.floor(phi[k] / p);
}

const rows = [];
for (const a of A_LIST) {
  let cnt = 0;
  const first = [];
  let maxGap = 0;
  let last = -1;
  for (let n = 2; n <= N; n += 1) {
    const ph = phi[n];
    const v = n + a;
    if (v % ph !== 0) continue;
    cnt += 1;
    if (first.length < 20) first.push(n);
    if (last !== -1) {
      const gap = n - last;
      if (gap > maxGap) maxGap = gap;
    }
    last = n;
  }
  rows.push({
    a,
    N,
    count_solutions_n_le_N: cnt,
    density: Number((cnt / N).toPrecision(9)),
    first_20_solutions: first,
    max_gap_between_consecutive_solutions_in_range: maxGap,
  });
}

const out = {
  problem: 'EP-828',
  script: 'ep828.mjs',
  method: 'deep_shift_profile_for_phi_dividing_n_plus_a',
  params: { N, A_LIST },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
