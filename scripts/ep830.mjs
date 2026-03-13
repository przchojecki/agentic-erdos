#!/usr/bin/env node
import fs from 'fs';

// EP-830: deeper finite amicable-pair counting profile.
const OUT = process.env.OUT || 'data/ep830_standalone_deeper.json';
const N = 2_000_000;
const X_LIST = [50_000, 100_000, 200_000, 400_000, 800_000, 1_200_000, 1_600_000, 2_000_000];

const t0 = Date.now();
const sigma = new Uint32Array(N + 1);
for (let d = 1; d <= N; d += 1) {
  for (let m = d; m <= N; m += d) sigma[m] += d;
}

const amicA = [];
for (let a = 2; a <= N; a += 1) {
  const b = sigma[a] - a;
  if (b <= a || b > N) continue;
  if (sigma[b] - b === a && sigma[a] === a + b && sigma[b] === a + b) amicA.push(a);
}
amicA.sort((x, y) => x - y);

const rows = [];
let p = 0;
for (const x of X_LIST) {
  while (p < amicA.length && amicA[p] <= x) p += 1;
  rows.push({
    x,
    A_x_count_amicable_pairs_with_a_le_x: p,
    A_x_over_x: Number((p / x).toPrecision(8)),
    A_x_over_x_pow_09: Number((p / (x ** 0.9)).toPrecision(8)),
    log_A_over_log_x: p > 1 ? Number((Math.log(p) / Math.log(x)).toPrecision(8)) : null,
  });
}

const out = {
  problem: 'EP-830',
  script: 'ep830.mjs',
  method: 'deep_amicable_pair_counting_via_sigma_sieve',
  params: { N, X_LIST },
  amicable_pair_count_up_to_N: amicA.length,
  rows,
  first_40_amicable_a_values: amicA.slice(0, 40),
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
