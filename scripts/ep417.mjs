#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sievePhi(n) {
  const phi = new Int32Array(n + 1);
  const spf = new Int32Array(n + 1);
  phi[1] = 1;
  for (let i = 2; i <= n; i += 1) {
    if (!spf[i]) {
      spf[i] = i;
      phi[i] = i - 1;
      if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
    }
    if (!phi[i]) {
      const p = spf[i];
      const m = Math.floor(i / p);
      phi[i] = m % p === 0 ? phi[m] * p : phi[m] * (p - 1);
    }
  }
  return phi;
}

const M = Number(process.env.M || 3000000);
const OUT = process.env.OUT || '';
const X_LIST = (process.env.X_LIST || '20000,50000,100000,200000,500000,1000000,1500000,2000000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);

const phi = sievePhi(M);

const VprimeAt = new Map();
const seenArg = new Uint8Array(M + 1);
let curVprime = 0;
for (let m = 1; m <= M; m += 1) {
  const v = phi[m];
  if (!seenArg[v]) {
    seenArg[v] = 1;
    curVprime += 1;
  }
  VprimeAt.set(m, curVprime);
}

const hitValue = new Uint8Array(M + 1);
for (let m = 1; m <= M; m += 1) {
  const v = phi[m];
  if (v <= M) hitValue[v] = 1;
}
const prefV = new Uint32Array(M + 1);
for (let i = 1; i <= M; i += 1) prefV[i] = prefV[i - 1] + hitValue[i];

const rows = [];
for (const X of X_LIST) {
  if (X > M) continue;
  const Vp = VprimeAt.get(X);
  const V = prefV[X];
  rows.push({
    X,
    Vprime_X: Vp,
    V_X: V,
    ratio_V_over_Vprime: Number((V / Vp).toPrecision(8)),
    gap_V_minus_Vprime: V - Vp,
  });
}

const out = {
  problem: 'EP-417',
  script: path.basename(process.argv[1]),
  method: 'deep_finite_comparison_of_V_and_Vprime_for_totient_values',
  params: { M, X_LIST },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
