#!/usr/bin/env node
import fs from 'fs';

// EP-891 finite proxy for k=2,3 and nearby length variant.
const OUT = process.env.OUT || 'data/ep891_standalone_deeper.json';
const X = 300000;

function sieveOmega(limit) {
  const spf = new Uint32Array(limit + 1);
  const omega = new Uint8Array(limit + 1);
  for (let i = 2; i <= limit; i += 1) if (spf[i] === 0) {
    spf[i] = i;
    if (i * i <= limit) for (let j = i * i; j <= limit; j += i) if (spf[j] === 0) spf[j] = i;
  }
  for (let n = 2; n <= limit; n += 1) {
    let x = n, c = 0;
    while (x > 1) {
      c += 1;
      x = Math.floor(x / spf[x]);
    }
    omega[n] = c;
  }
  return omega;
}

const t0 = Date.now();
const omega = sieveOmega(X + 100);
const primePrefix = [2, 3, 5, 7, 11, 13];

function windowFails(k, len) {
  // return count of windows [n,n+len) with no number having omega>k
  let fails = 0;
  let first = null;
  for (let n = 1; n + len - 1 <= X; n += 1) {
    let good = false;
    for (let t = n; t < n + len; t += 1) {
      if (omega[t] > k) {
        good = true;
        break;
      }
    }
    if (!good) {
      fails += 1;
      if (first === null) first = n;
    }
  }
  return { fails, first_fail_start: first };
}

const rows = [];
for (const k of [2, 3]) {
  const prodPk = primePrefix.slice(0, k).reduce((a, b) => a * b, 1);
  const prodVariant = primePrefix.slice(0, k - 1).reduce((a, b) => a * b, 1) * primePrefix[k];
  rows.push({
    k,
    interval_len_exact_prod_p1_to_pk: prodPk,
    check_exact: windowFails(k, prodPk),
    interval_len_variant_prod_p1_to_pkm1_times_pkp1: prodVariant,
    check_variant: windowFails(k, prodVariant),
  });
}

const out = {
  problem: 'EP-891',
  script: 'ep891.mjs',
  method: 'finite_window_failure_scan_for_omega_threshold_formulation',
  params: { X, tested_k: [2, 3] },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
