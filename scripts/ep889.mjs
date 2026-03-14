#!/usr/bin/env node
import fs from 'fs';

const OUT = process.env.OUT || 'data/ep889_standalone_deeper.json';
const N = 5000;
const KMAX = 15000;
const LIM = N + KMAX + 5;

function sieveSPF(limit) {
  const spf = new Uint32Array(limit + 1);
  for (let i = 2; i <= limit; i += 1) if (spf[i] === 0) {
    spf[i] = i;
    if (i * i <= limit) for (let j = i * i; j <= limit; j += i) if (spf[j] === 0) spf[j] = i;
  }
  return spf;
}
function factorDistinct(n, spf) {
  const arr = [];
  let x = n, last = 0;
  while (x > 1) {
    const p = spf[x];
    if (p !== last) arr.push(p);
    last = p;
    while (x % p === 0) x /= p;
  }
  return arr;
}

const t0 = Date.now();
const spf = sieveSPF(LIM);
const facs = Array.from({ length: LIM + 1 }, () => []);
for (let x = 2; x <= LIM; x += 1) facs[x] = factorDistinct(x, spf);

function vBounded(n) {
  let best = 0, argk = 0;
  for (let k = 0; k <= KMAX; k += 1) {
    let c = 0;
    for (const p of facs[n + k]) if (p > k) c += 1;
    if (c > best) {
      best = c;
      argk = k;
    }
  }
  return { best, argk };
}

const v0 = new Int16Array(N + 1);
const argk = new Int32Array(N + 1);
let globalBest = 0, globalN = 1;
for (let n = 1; n <= N; n += 1) {
  const v = vBounded(n);
  v0[n] = v.best;
  argk[n] = v.argk;
  if (v.best > globalBest) {
    globalBest = v.best;
    globalN = n;
  }
}

const rows = [];
for (const x of [500, 1000, 2000, 3000, 4000, 5000]) {
  let mn = 1e9, avg = 0;
  for (let n = 1; n <= x; n += 1) {
    if (v0[n] < mn) mn = v0[n];
    avg += v0[n];
  }
  rows.push({
    N_prefix: x,
    min_v0_bounded_over_n_le_N: mn,
    avg_v0_bounded_over_n_le_N: Number((avg / x).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-889',
  script: 'ep889.mjs',
  method: 'deeper_bounded_k_profile_for_v0n',
  params: { N, KMAX },
  max_v0_bounded_found: globalBest,
  argmax_n: globalN,
  argmax_k_for_argmax_n: argk[globalN],
  rows,
  note: 'Still bounded-k finite proxy; unbounded k may be larger.',
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
