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
const X_LIST = (process.env.X_LIST || '20000,50000,100000,200000,500000,1000000,1500000').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);

const phi = sievePhi(M);
const hit = new Uint8Array(M + 1);
for (let m = 1; m <= M; m += 1) {
  const v = phi[m];
  if (v <= M) hit[v] = 1;
}

const pref = new Uint32Array(M + 1);
for (let i = 1; i <= M; i += 1) pref[i] = pref[i - 1] + hit[i];

const rows = [];
for (const X of X_LIST) {
  if (2 * X > M) continue;
  const Vx = pref[X];
  const V2x = pref[2 * X];
  rows.push({
    X,
    V_proxy_X: Vx,
    V_proxy_2X: V2x,
    ratio_V2X_over_VX: Number((V2x / Vx).toPrecision(8)),
    V_over_X_over_logX: Number((Vx / (X / Math.log(X))).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-416',
  script: path.basename(process.argv[1]),
  method: 'deep_totient_image_count_proxy',
  params: { M, X_LIST },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
