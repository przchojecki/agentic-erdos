#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function buildPrefix(A, Nmax) {
  const mark = new Uint8Array(Nmax + 1);
  for (const a of A) for (let m = a; m <= Nmax; m += a) mark[m] = 1;
  const pref = new Uint32Array(Nmax + 1);
  for (let i = 1; i <= Nmax; i += 1) pref[i] = pref[i - 1] + mark[i];
  return pref;
}

function maxRatioForA(A, Nmax) {
  const n0 = Math.max(...A);
  const pref = buildPrefix(A, Nmax);
  const dens = new Float64Array(Nmax + 1);
  for (let n = 1; n <= Nmax; n += 1) dens[n] = pref[n] / n;
  const sufMax = new Float64Array(Nmax + 2);
  const sufArg = new Int32Array(Nmax + 2);
  for (let n = Nmax; n >= 1; n -= 1) {
    if (dens[n] >= sufMax[n + 1]) { sufMax[n] = dens[n]; sufArg[n] = n; }
    else { sufMax[n] = sufMax[n + 1]; sufArg[n] = sufArg[n + 1]; }
  }
  let best = 0, bestN = n0, bestM = n0 + 1;
  for (let n = n0; n < Nmax; n += 1) {
    if (dens[n] === 0) continue;
    const r = sufMax[n + 1] / dens[n];
    if (r > best) { best = r; bestN = n; bestM = sufArg[n + 1]; }
  }
  return { ratio: best, n: bestN, m: bestM, density_n: dens[bestN], density_m: dens[bestM] };
}

function rng(seed){let x=seed>>>0;return()=>{x^=x<<13;x^=x>>>17;x^=x<<5;return (x>>>0)/0x100000000;};}

const NMAX = Number(process.env.NMAX || 60000);
const TRIALS = Number(process.env.TRIALS || 1200);
const OUT = process.env.OUT || '';

const singletonRows = [];
for (const a of [50,100,200,400,800]) {
  const n = 2*a-1, m = 2*a;
  const dn = Math.floor(n/a)/n;
  const dm = Math.floor(m/a)/m;
  singletonRows.push({ a, n, m, ratio_dm_over_dn: Number((dm/dn).toPrecision(10)), gap_to_2: Number((2-dm/dn).toPrecision(10)) });
}

const rnd = rng(20260312 ^ 488);
let best = { ratio: 0, n: 0, m: 0, A: [], density_n: 0, density_m: 0 };
for (let t = 0; t < TRIALS; t += 1) {
  const sz = 2 + Math.floor(rnd() * 7);
  const Aset = new Set();
  while (Aset.size < sz) Aset.add(2 + Math.floor(rnd() * 300));
  const A = [...Aset].sort((x,y)=>x-y);
  const r = maxRatioForA(A, NMAX);
  if (r.ratio > best.ratio) best = { ...r, A };
}

const out = {
  problem: 'EP-488',
  script: path.basename(process.argv[1]),
  method: 'deeper_ratio_search_for_multiples_union_density_inequality',
  params: { NMAX, TRIALS },
  singleton_rows: singletonRows,
  random_search_best: { A: best.A, ratio: Number(best.ratio.toPrecision(10)), n: best.n, m: best.m, density_n: Number(best.density_n.toPrecision(10)), density_m: Number(best.density_m.toPrecision(10)) },
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
