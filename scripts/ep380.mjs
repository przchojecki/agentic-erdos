#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveSpf(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i += 1) if (!spf[i]) {
    spf[i] = i;
    if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
  }
  return spf;
}

function primesFromSpf(n, spf) {
  const ps = [];
  for (let i = 2; i <= n; i += 1) if (spf[i] === i) ps.push(i);
  return ps;
}

function valuationInFactorialQuotient(v, u, p) {
  // v_p(v!/(u-1)!)
  let s = 0;
  let pp = p;
  while (pp <= v) {
    s += Math.floor(v / pp) - Math.floor((u - 1) / pp);
    pp *= p;
  }
  return s;
}

function largestPrimeFactorInIntervalProduct(u, v, primes) {
  for (let i = primes.length - 1; i >= 0; i -= 1) {
    const p = primes[i];
    if (p > v) continue;
    const hasMultiple = Math.floor(v / p) - Math.floor((u - 1) / p) > 0;
    if (hasMultiple) return p;
  }
  return 1;
}

function isBadInterval(u, v, primes) {
  const p = largestPrimeFactorInIntervalProduct(u, v, primes);
  if (p <= 1) return false;
  return valuationInFactorialQuotient(v, u, p) >= 2;
}

function largestPrimeFactor(n, spf) {
  let x = n;
  let p = 1;
  while (x > 1) {
    p = spf[x];
    x = Math.floor(x / spf[x]);
  }
  return p;
}

const X = Number(process.env.X || 2500);
const WINDOW_MAX = Number(process.env.WINDOW_MAX || 180);
const OUT = process.env.OUT || '';

const spf = sieveSpf(X);
const primes = primesFromSpf(X, spf);

const inBad = new Uint8Array(X + 1);
let badIntervals = 0;
for (let u = 1; u <= X; u += 1) {
  for (let v = u; v <= Math.min(X, u + WINDOW_MAX); v += 1) {
    if (isBadInterval(u, v, primes)) {
      badIntervals += 1;
      for (let n = u; n <= v; n += 1) inBad[n] = 1;
    }
  }
}
let Bx = 0;
for (let n = 1; n <= X; n += 1) if (inBad[n]) Bx += 1;

let model = 0;
for (let n = 2; n <= X; n += 1) {
  const P = largestPrimeFactor(n, spf);
  if (n % (P * P) === 0) model += 1;
}

const out = {
  problem: 'EP-380',
  script: path.basename(process.argv[1]),
  method: 'finite_bad_interval_membership_vs_Pn_square_divisibility_model',
  params: { X, WINDOW_MAX },
  bad_interval_count_scanned: badIntervals,
  B_of_X_scanned: Bx,
  model_count_Pn2_divides_n: model,
  ratio_B_over_model: model > 0 ? Number((Bx / model).toFixed(6)) : null,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
