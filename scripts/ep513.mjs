#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const ANG = Number(process.env.ANG || 2048);

function complexAbs(re, im) {
  return Math.hypot(re, im);
}

function evalFromCoeffs(coeffs, zRe, zIm) {
  let pr = 1;
  let pi = 0;
  let sr = 0;
  let si = 0;
  for (let n = 0; n < coeffs.length; n += 1) {
    sr += coeffs[n] * pr;
    si += coeffs[n] * pi;
    const nr = pr * zRe - pi * zIm;
    const ni = pr * zIm + pi * zRe;
    pr = nr;
    pi = ni;
  }
  return [sr, si];
}

function maxModulus(coeffs, r, ang) {
  let best = 0;
  for (let k = 0; k < ang; k += 1) {
    const t = (2 * Math.PI * k) / ang;
    const [re, im] = evalFromCoeffs(coeffs, r * Math.cos(t), r * Math.sin(t));
    const a = complexAbs(re, im);
    if (a > best) best = a;
  }
  return best;
}

function maxTerm(coeffs, r) {
  let p = 1;
  let best = 0;
  for (let n = 0; n < coeffs.length; n += 1) {
    const v = Math.abs(coeffs[n]) * p;
    if (v > best) best = v;
    p *= r;
  }
  return best;
}

function coeffsExp(N) {
  const c = [];
  let fact = 1;
  for (let n = 0; n <= N; n += 1) {
    if (n > 0) fact *= n;
    c.push(1 / fact);
  }
  return c;
}

function coeffsSin(N) {
  const c = Array(N + 1).fill(0);
  let fact = 1;
  for (let n = 1; n <= N; n += 1) {
    fact *= n;
    if (n % 2 === 1) c[n] = ((n % 4) === 1 ? 1 : -1) / fact;
  }
  return c;
}

function coeffsLacunary(N) {
  const c = Array(N + 1).fill(0);
  c[0] = 1;
  for (let k = 1; ; k += 1) {
    const n = k * k;
    if (n > N) break;
    c[n] = 1 / (k + 1);
  }
  return c;
}

const t0 = Date.now();
const funcs = [
  { name: 'exp_z', coeffs: coeffsExp(60) },
  { name: 'sin_z', coeffs: coeffsSin(60) },
  { name: 'lacunary_square_exponents', coeffs: coeffsLacunary(80) },
];

const radii = [0.5, 1, 2, 3, 5, 8, 12, 16, 20];
const rows = [];
for (const f of funcs) {
  let minRatio = Infinity;
  const profile = [];
  for (const r of radii) {
    const M = maxModulus(f.coeffs, r, ANG);
    const mu = maxTerm(f.coeffs, r);
    const ratio = mu / M;
    if (ratio < minRatio) minRatio = ratio;
    profile.push({ r, max_term_over_M: Number(ratio.toPrecision(10)) });
  }
  rows.push({
    function_family: f.name,
    radii,
    profile,
    finite_liminf_proxy: Number(minRatio.toPrecision(10)),
  });
}

const out = {
  problem: 'EP-513',
  script: path.basename(process.argv[1]),
  method: 'finite_radius_proxy_for_max_term_over_maximum_modulus',
  params: { ANG, radii },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
