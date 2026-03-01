#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const N_MAX = Number(process.env.N_MAX || 8);

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

function factorize(n, spf) {
  const fac = [];
  let x = n;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e++;
    }
    fac.push([p, e]);
  }
  return fac;
}

function divisorsFromFac(fac) {
  let d = [1];
  for (const [p, e] of fac) {
    const base = d.slice();
    let pe = 1;
    for (let i = 1; i <= e; i++) {
      pe *= p;
      for (const v of base) d.push(v * pe);
    }
  }
  d.sort((a, b) => b - a);
  return d;
}

function hm(n, spf) {
  const divs = divisorsFromFac(factorize(n, spf));
  const INF = 1e9;
  const dp = new Int32Array(n);
  for (let i = 1; i < n; i++) dp[i] = INF;
  dp[0] = 0;
  for (const d of divs) {
    if (d >= n) continue;
    for (let s = n - 1; s >= d; s--) {
      const cand = dp[s - d] + 1;
      if (cand < dp[s]) dp[s] = cand;
    }
  }
  let h = 0;
  for (let s = 1; s < n; s++) {
    if (dp[s] >= INF) return null;
    if (dp[s] > h) h = dp[s];
  }
  return h;
}

const facts = [1];
for (let n = 1; n <= N_MAX; n++) facts[n] = facts[n - 1] * n;
const maxFact = facts[N_MAX];
const spf = sieveSpf(maxFact + 5);

const rows = [];
for (let n = 3; n <= N_MAX; n++) {
  rows.push({ n, factorial: facts[n], h_factorial: hm(facts[n], spf) });
}

const out = {
  script: path.basename(process.argv[1]),
  n_max: N_MAX,
  rows,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep18_factorial_h_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, rows: rows.length }, null, 2));
