#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const R_LIST = (process.env.R_LIST || '2,3,4').split(',').map((x) => Number(x.trim())).filter(Boolean);
const N_MAX = Number(process.env.N_MAX || 120000);

function sieveSpf(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i++) {
    if (spf[i] === 0) {
      spf[i] = i;
      if (i * i <= n) {
        for (let j = i * i; j <= n; j += i) if (spf[j] === 0) spf[j] = i;
      }
    }
  }
  return spf;
}

function isRPowerful(n, r, spf) {
  if (n === 1) return true;
  let x = n;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e++;
    }
    if (e < r) return false;
  }
  return true;
}

const spf = sieveSpf(N_MAX + 5);
const results = [];

for (const r of R_LIST) {
  const maxTerms = r + 1;
  const nums = [];
  for (let n = 1; n <= N_MAX; n++) if (isRPowerful(n, r, spf)) nums.push(n);

  const minTerms = new Int16Array(N_MAX + 1);
  minTerms.fill(-1);
  minTerms[0] = 0;

  let frontier = [0];
  for (let t = 1; t <= maxTerms; t++) {
    const seen = new Uint8Array(N_MAX + 1);
    const next = [];
    for (const s of frontier) {
      for (const a of nums) {
        const v = s + a;
        if (v > N_MAX) break;
        if (seen[v]) continue;
        seen[v] = 1;
        if (minTerms[v] === -1 || t < minTerms[v]) minTerms[v] = t;
        next.push(v);
      }
    }
    frontier = next;
  }

  const missing = [];
  for (let n = 1; n <= N_MAX; n++) if (minTerms[n] === -1) missing.push(n);

  let largestMissing = missing.length ? missing[missing.length - 1] : 0;
  const tailStart = Math.max(1, N_MAX - 10000 + 1);
  let tailMissing = 0;
  for (let n = tailStart; n <= N_MAX; n++) if (minTerms[n] === -1) tailMissing++;

  results.push({
    r,
    n_max: N_MAX,
    max_terms_allowed: maxTerms,
    r_powerful_count_up_to_n_max: nums.length,
    largest_missing_up_to_n_max: largestMissing,
    missing_count_up_to_n_max: missing.length,
    tail_interval: [tailStart, N_MAX],
    tail_missing_count: tailMissing,
    first_missing: missing.slice(0, 30),
    last_missing: missing.slice(-30),
  });
}

const out = {
  script: path.basename(process.argv[1]),
  n_max: N_MAX,
  r_list: R_LIST,
  results,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep1107_r_powerful_sum_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, n_max: N_MAX, r_list: R_LIST, results: results.length }, null, 2));
