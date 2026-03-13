#!/usr/bin/env node
import fs from 'fs';

// EP-851 finite density profile:
// S_r = {m <= N : m = 2^k + n, Omega(n) <= r}.
const OUT = process.env.OUT || 'data/ep851_standalone_deeper.json';
const N = 1_000_000;
const R_LIST = [1, 2, 3, 4, 5];

function omegaSieve(limit) {
  const omega = new Uint8Array(limit + 1);
  const spf = new Uint32Array(limit + 1);
  for (let i = 2; i <= limit; i += 1) if (spf[i] === 0) {
    spf[i] = i;
    if (i * i <= limit) for (let j = i * i; j <= limit; j += i) if (spf[j] === 0) spf[j] = i;
  }
  for (let i = 2; i <= limit; i += 1) {
    let x = i;
    let cnt = 0;
    while (x > 1) {
      const p = spf[x];
      cnt += 1;
      x = Math.floor(x / p);
    }
    omega[i] = cnt;
  }
  return omega;
}

const t0 = Date.now();
const omega = omegaSieve(N);
const powers2 = [];
for (let p = 1; p <= N; p *= 2) powers2.push(p);

const rows = [];
for (const r of R_LIST) {
  const good = new Uint8Array(N + 1);
  for (let m = 1; m <= N; m += 1) {
    let ok = false;
    for (const p2 of powers2) {
      if (p2 > m) break;
      const n = m - p2;
      if (n >= 2 && omega[n] <= r) {
        ok = true;
        break;
      }
    }
    if (ok) good[m] = 1;
  }
  let cnt = 0;
  for (let i = 1; i <= N; i += 1) cnt += good[i];
  rows.push({
    r,
    N,
    covered_count: cnt,
    covered_density: Number((cnt / N).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-851',
  script: 'ep851.mjs',
  method: 'finite_density_profile_for_2k_plus_almost_prime_representations',
  warning: 'Finite N profile only; does not prove asymptotic density limit.',
  params: { N, R_LIST },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
