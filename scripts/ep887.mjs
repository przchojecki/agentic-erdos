#!/usr/bin/env node
import fs from 'fs';

const OUT = process.env.OUT || 'data/ep887_standalone_deeper.json';
const N = 3000000;
const C_LIST = [1, 2, 3, 4, 6];

function sieveSPF(limit) {
  const spf = new Uint32Array(limit + 1);
  for (let i = 2; i <= limit; i += 1) if (spf[i] === 0) {
    spf[i] = i;
    if (i * i <= limit) for (let j = i * i; j <= limit; j += i) if (spf[j] === 0) spf[j] = i;
  }
  return spf;
}

function divisorsFromFactorization(n, spf) {
  const fac = [];
  let x = n;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x /= p;
      e += 1;
    }
    fac.push([p, e]);
  }
  const divs = [1];
  for (const [p, e] of fac) {
    const cur = divs.slice();
    let pe = 1;
    for (let i = 1; i <= e; i += 1) {
      pe *= p;
      for (const d of cur) divs.push(d * pe);
    }
  }
  return divs;
}

const t0 = Date.now();
const spf = sieveSPF(N);
const best = new Map(C_LIST.map((C) => [C, { maxCount: 0, witnessN: 1 }]));

for (let n = 2; n <= N; n += 1) {
  const divs = divisorsFromFactorization(n, spf);
  const s = Math.sqrt(n);
  const q = n ** 0.25;
  for (const C of C_LIST) {
    const lo = s;
    const hi = s + C * q;
    let cnt = 0;
    for (const d of divs) if (d > lo && d < hi) cnt += 1;
    const b = best.get(C);
    if (cnt > b.maxCount) {
      b.maxCount = cnt;
      b.witnessN = n;
    }
  }
}

const rows = C_LIST.map((C) => ({
  C,
  max_divisors_in_interval_found: best.get(C).maxCount,
  witness_n: best.get(C).witnessN,
}));

const out = {
  problem: 'EP-887',
  script: 'ep887.mjs',
  method: 'finite_scan_of_divisors_in_short_interval_above_sqrt',
  params: { N, C_LIST },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
