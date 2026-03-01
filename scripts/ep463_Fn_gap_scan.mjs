#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const N_MAX = Number(process.env.N_MAX || 2000000);

function sieveSpf(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i++) {
    if (spf[i] === 0) {
      spf[i] = i;
      if (i * i <= n) for (let j = i * i; j <= n; j += i) if (spf[j] === 0) spf[j] = i;
    }
  }
  return spf;
}

const spf = sieveSpf(N_MAX + 5);
const T = new Int32Array(N_MAX + 1); // T[m]=m-p(m) for composite m else large
for (let m = 2; m <= N_MAX; m++) {
  if (spf[m] === m) T[m] = 1e9; // prime
  else T[m] = m - spf[m];
}

// F(n)=min_{m>n} T[m]
const F = new Int32Array(N_MAX + 2);
F[N_MAX] = 1e9;
for (let n = N_MAX - 1; n >= 1; n--) {
  const v = T[n + 1];
  F[n] = Math.min(v, F[n + 1]);
}

// G(n)=max_{m<=N_MAX, composite, T[m]<n}(m-n) : finite-window proxy for statement.
const bestMforT = new Int32Array(N_MAX + 1);
for (let m = 2; m <= N_MAX; m++) {
  const t = T[m];
  if (t <= N_MAX) bestMforT[t] = Math.max(bestMforT[t], m);
}
const prefMaxM = new Int32Array(N_MAX + 1);
for (let t = 1; t <= N_MAX; t++) prefMaxM[t] = Math.max(prefMaxM[t - 1], bestMforT[t]);

const checkpoints = [5000, 20000, 50000, 100000, 300000, 1000000].filter((x, i, a) => x <= N_MAX - 1 && a.indexOf(x) === i);
const rows = [];
for (const n of checkpoints) {
  const fn = F[n];
  const gap = n - fn;
  const mstar = prefMaxM[n - 1];
  const gproxy = mstar > n ? mstar - n : 0;
  rows.push({ n, F_n: fn, n_minus_F_n: gap, max_m_with_m_minus_p_lt_n_up_to_window: mstar, g_proxy: gproxy });
}

const out = {
  script: path.basename(process.argv[1]),
  n_max: N_MAX,
  checkpoints: rows,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep463_Fn_gap_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, n_max: N_MAX, rows: rows.length }, null, 2));
