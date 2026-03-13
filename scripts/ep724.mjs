#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_MAX = Number(process.env.N_MAX || 400);
const STEP = Number(process.env.STEP || 10);

function spfSieve(n) {
  const spf = Array.from({ length: n + 1 }, (_, i) => i);
  spf[0] = 0;
  spf[1] = 1;
  for (let i = 2; i * i <= n; i += 1) {
    if (spf[i] !== i) continue;
    for (let j = i * i; j <= n; j += i) if (spf[j] === j) spf[j] = i;
  }
  return spf;
}

function factorPrimePowers(n, spf) {
  const out = [];
  let x = n;
  while (x > 1) {
    const p = spf[x];
    let q = 1;
    while (x % p === 0) {
      x = Math.floor(x / p);
      q *= p;
    }
    out.push(q);
  }
  return out;
}

const t0 = Date.now();
const spf = spfSieve(N_MAX);
const rows = [];

for (let n = 2; n <= N_MAX; n += STEP) {
  const pps = factorPrimePowers(n, spf);
  const macneishLB = Math.min(...pps.map((q) => q - 1));
  rows.push({
    n,
    prime_power_factors: pps,
    macneish_lower_bound_MOLS_count: macneishLB,
    sqrt_n: Number(Math.sqrt(n).toPrecision(8)),
    ratio_lb_over_sqrt_n: Number((macneishLB / Math.sqrt(n)).toPrecision(8)),
    ratio_lb_over_n_pow_1_over_14p8: Number((macneishLB / (n ** (1 / 14.8))).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-724',
  script: path.basename(process.argv[1]),
  method: 'macneish_type_lower_bound_profile_for_MOLS',
  warning: 'These are guaranteed lower bounds, not exact f(n) values.',
  params: { N_MAX, STEP },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
