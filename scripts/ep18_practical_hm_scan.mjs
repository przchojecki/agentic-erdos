#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const M_MAX = Number(process.env.M_MAX || 12000);

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
  return fac.sort((a, b) => a[0] - b[0]);
}

function sigmaPrimePower(p, e) {
  let s = 1;
  let pe = 1;
  for (let i = 0; i < e; i++) {
    pe *= p;
    s += pe;
  }
  return s;
}

function isPractical(n, spf) {
  if (n === 1) return true;
  const fac = factorize(n, spf);
  if (fac[0][0] !== 2) return false;
  let prefix = sigmaPrimePower(fac[0][0], fac[0][1]);
  for (let i = 1; i < fac.length; i++) {
    const [p, e] = fac[i];
    if (p > prefix + 1) return false;
    prefix *= sigmaPrimePower(p, e);
  }
  return true;
}

function divisors(n, spf) {
  const fac = factorize(n, spf);
  let d = [1];
  for (const [p, e] of fac) {
    const base = d.slice();
    let pe = 1;
    for (let k = 1; k <= e; k++) {
      pe *= p;
      for (const v of base) d.push(v * pe);
    }
  }
  d.sort((a, b) => b - a);
  return d;
}

function hmValue(n, spf) {
  const divs = divisors(n, spf);
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

const spf = sieveSpf(M_MAX + 5);
const rows = [];
let practicalCount = 0;

for (let m = 2; m <= M_MAX; m++) {
  if (!isPractical(m, spf)) continue;
  practicalCount++;
  const h = hmValue(m, spf);
  if (h == null) continue;
  if (m <= 300 || m % 250 === 0) {
    rows.push({
      m,
      h_m: h,
      loglog_m: Number((Math.log(Math.log(m))).toFixed(6)),
      h_over_sqrt_log_m: Number((h / Math.sqrt(Math.log(m))).toFixed(6)),
      h_over_log_m: Number((h / Math.log(m)).toFixed(6)),
    });
  }
}

const out = {
  script: path.basename(process.argv[1]),
  m_max: M_MAX,
  practical_count_scanned: practicalCount,
  sample_rows: rows,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep18_practical_hm_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, m_max: M_MAX, rows: rows.length }, null, 2));
