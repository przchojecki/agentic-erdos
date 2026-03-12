#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveSpfSigmaOmega(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i += 1) if (!spf[i]) {
    spf[i] = i;
    if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
  }
  const sigma = new Float64Array(n + 1);
  const omega = new Uint8Array(n + 1);
  sigma[1] = 1;
  for (let x = 2; x <= n; x += 1) {
    let t = x;
    let sig = 1;
    while (t > 1) {
      const p = spf[t];
      let e = 0;
      let pe = 1;
      while (t % p === 0) {
        t = Math.floor(t / p);
        e += 1;
        pe *= p;
      }
      omega[x] += 1;
      sig *= (pe * p - 1) / (p - 1);
    }
    sigma[x] = sig;
  }
  return { spf, sigma, omega };
}

function properDivisors(n, spf) {
  const factors = [];
  let t = n;
  while (t > 1) {
    const p = spf[t];
    let e = 0;
    while (t % p === 0) {
      t = Math.floor(t / p);
      e += 1;
    }
    factors.push([p, e]);
  }
  const divs = [1];
  for (const [p, e] of factors) {
    const cur = divs.slice();
    let mult = 1;
    for (let i = 1; i <= e; i += 1) {
      mult *= p;
      for (const d of cur) divs.push(d * mult);
    }
  }
  divs.sort((a, b) => a - b);
  divs.pop(); // remove n itself
  return divs;
}

function isSemiperfect(n, spf) {
  const divs = properDivisors(n, spf);
  let bits = 1n;
  const target = 1n << BigInt(n);
  const mask = (1n << BigInt(n + 1)) - 1n;
  for (const d of divs) {
    bits |= bits << BigInt(d);
    bits &= mask;
    if (bits & target) return true;
  }
  return false;
}

const N_WEIRD = Number(process.env.N_WEIRD || 50000);
const N_ODD = Number(process.env.N_ODD || 1000000);
const OUT = process.env.OUT || '';

const { spf, sigma, omega } = sieveSpfSigmaOmega(N_ODD + 5);

const weird = [];
for (let n = 2; n <= N_WEIRD; n += 1) {
  if (sigma[n] < 2 * n) continue;
  if (!isSemiperfect(n, spf)) weird.push(n);
}

const weirdSet = new Set(weird);
const primitive = [];
for (const n of weird) {
  let prim = true;
  const divs = properDivisors(n, spf);
  for (const d of divs) {
    if (weirdSet.has(d)) {
      prim = false;
      break;
    }
  }
  if (prim) primitive.push(n);
}

const oddCandidates = [];
for (let n = 3; n <= N_ODD; n += 2) {
  if (sigma[n] < 2 * n) continue;
  if (omega[n] < 6) continue;
  oddCandidates.push(n);
}

const out = {
  problem: 'EP-470',
  script: path.basename(process.argv[1]),
  method: 'deeper_weird_and_odd_candidate_profile',
  params: { N_WEIRD, N_ODD },
  weird_count: weird.length,
  first_40_weird: weird.slice(0, 40),
  primitive_weird_count: primitive.length,
  first_40_primitive_weird: primitive.slice(0, 40),
  odd_candidates_count_by_necessary_filters: oddCandidates.length,
  odd_candidates_first_50: oddCandidates.slice(0, 50),
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
