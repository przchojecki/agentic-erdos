#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_MAX = Number(process.env.N_MAX || 12000);
const M_MAX = Number(process.env.M_MAX || 3000);

function buildSpf(n) {
  const spf = new Uint32Array(n + 1);
  for (let i = 2; i <= n; i += 1) {
    if (spf[i] === 0) {
      spf[i] = i;
      if (i <= Math.floor(n / i)) {
        for (let j = i * i; j <= n; j += i) if (spf[j] === 0) spf[j] = i;
      }
    }
  }
  return spf;
}

function factorize(n, spf) {
  const out = [];
  let x = n;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    out.push([p, e]);
  }
  return out;
}

function leastNonDivisor(valMap, spf, mMax) {
  for (let m = 2; m <= mMax; m += 1) {
    const fac = factorize(m, spf);
    let divides = true;
    for (const [p, e] of fac) {
      if ((valMap.get(p) || 0) < e) {
        divides = false;
        break;
      }
    }
    if (!divides) return m;
  }
  return null;
}

const t0 = Date.now();
const spf = buildSpf(Math.max(2 * N_MAX + 10, M_MAX + 10));

// valuations for C(2n,n), start with n=1 => C(2,1)=2
const vals = new Map([[2, 1]]);
const rows = [];
let unresolved = 0;

function addFactors(num, sign) {
  for (const [p, e] of factorize(num, spf)) {
    const v = (vals.get(p) || 0) + sign * e;
    if (v === 0) vals.delete(p);
    else vals.set(p, v);
  }
}

for (let n = 1; n <= N_MAX; n += 1) {
  if (n > 1) {
    // C(2n,n) = C(2n-2,n-1) * (2n-1)(2n) / n^2
    addFactors(2 * n - 1, +1);
    addFactors(2 * n, +1);
    addFactors(n, -2);
  }

  const m = leastNonDivisor(vals, spf, M_MAX);
  if (m == null) unresolved += 1;

  if (n <= 20 || n % 250 === 0) {
    rows.push({
      n,
      least_m_not_dividing_central_binomial_within_scan: m,
      log_m: m ? Number(Math.log(m).toPrecision(8)) : null,
      sqrt_log_n: n > 1 ? Number(Math.sqrt(Math.log(n)).toPrecision(8)) : null,
      ratio_logm_over_sqrtlogn: m && n > 1 ? Number((Math.log(m) / Math.sqrt(Math.log(n))).toPrecision(8)) : null,
    });
  }
}

const sampled = rows.filter((r) => r.ratio_logm_over_sqrtlogn != null).map((r) => r.ratio_logm_over_sqrtlogn);
sampled.sort((a, b) => a - b);
const median = sampled.length ? sampled[Math.floor(sampled.length / 2)] : null;

const out = {
  problem: 'EP-731',
  script: path.basename(process.argv[1]),
  method: 'incremental_prime_valuation_scan_for_least_nondivisor_of_central_binomial',
  params: { N_MAX, M_MAX },
  sampled_rows: rows,
  unresolved_count_due_to_mMax: unresolved,
  sampled_ratio_logm_over_sqrtlogn_median: median,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
