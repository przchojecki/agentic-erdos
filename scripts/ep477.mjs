#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function complexAbs2(re, im) {
  return re * re + im * im;
}

function fourierMagnitudeOfImage(m, f) {
  const seen = new Uint8Array(m);
  for (let x = 0; x < m; x += 1) {
    const v = ((f(x) % m) + m) % m;
    seen[v] = 1;
  }
  const B = [];
  for (let i = 0; i < m; i += 1) if (seen[i]) B.push(i);

  const nonzero = [];
  for (let k = 1; k < m; k += 1) {
    let re = 0;
    let im = 0;
    for (const b of B) {
      const th = (2 * Math.PI * k * b) / m;
      re += Math.cos(th);
      im -= Math.sin(th);
    }
    nonzero.push({ k, abs2: complexAbs2(re, im) });
  }
  const min = nonzero.reduce((a, b) => (b.abs2 < a.abs2 ? b : a), { k: -1, abs2: Infinity });
  return { Bsize: B.length, minAbs2AtNonzeroFrequency: min.abs2, argmin_k: min.k };
}

const M_LIST = (process.env.M_LIST || '24,30,36,40,45,48,60,72,84,96,108,120').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const OUT = process.env.OUT || '';

const polys = [
  { name: 'x2', f: (x) => x * x },
  { name: 'x2_plus_x', f: (x) => x * x + x },
  { name: 'x2_plus_1', f: (x) => x * x + 1 },
  { name: 'x3_plus_x2', f: (x) => x * x * x + x * x },
];

const rows = [];
for (const m of M_LIST) {
  for (const P of polys) {
    const r = fourierMagnitudeOfImage(m, P.f);
    const divisibility = m % r.Bsize === 0;
    const obstructedByFourier = r.minAbs2AtNonzeroFrequency > 1e-9; // no nonzero Fourier zeros of B
    rows.push({
      m,
      poly: P.name,
      B_size_mod_m: r.Bsize,
      m_divisible_by_B_size: divisibility,
      min_abs2_fourier_nonzero: Number(r.minAbs2AtNonzeroFrequency.toPrecision(8)),
      argmin_frequency: r.argmin_k,
      obstruction_flag: divisibility && obstructedByFourier,
    });
  }
}

const out = {
  problem: 'EP-477',
  script: path.basename(process.argv[1]),
  method: 'modular_fourier_obstruction_scan_for_unique_A_plus_fZ_decompositions',
  params: { M_LIST, polys: polys.map((p) => p.name) },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
