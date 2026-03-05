#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function bestRationalApprox(x, qMax) {
  let best = { p: 0, q: 1, err: Math.abs(x) };
  for (let q = 1; q <= qMax; q += 1) {
    const p = Math.round(x * q);
    const err = Math.abs(x - p / q);
    if (err < best.err) best = { p, q, err };
  }
  return best;
}

function sequenceTri(limitN) {
  const a = [];
  for (let n = 3; n <= limitN; n += 1) a.push((n * (n - 1)) / 2);
  return a;
}

function sequencePoly(limitN) {
  const a = [];
  for (let n = 2; n <= limitN; n += 1) a.push(n ** 3 + 6 * n ** 2 + 5 * n);
  return a;
}

function partialShifted(A, shift) {
  let s = 0;
  for (const x of A) s += 1 / (x - shift);
  return s;
}

const out = {
  problem: 'EP-265',
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
};

const tri = sequenceTri(300000);
const poly = sequencePoly(220000);
const deepPasses = 1600;
let rows = [];
let growthRows = [];
for (let pass = 0; pass < deepPasses; pass += 1) {
  const S_tri_0 = partialShifted(tri, 0);
  const S_tri_1 = partialShifted(tri, 1);
  const S_poly_0 = partialShifted(poly, 0);
  const S_poly_12 = partialShifted(poly, 12);

  rows = [
    {
      family: 'triangular_choose_n_2_start_n=3',
      terms_used: tri.length,
      partial_sum_shift_0: Number(S_tri_0.toPrecision(14)),
      partial_sum_shift_1: Number(S_tri_1.toPrecision(14)),
      best_rational_shift_0_q_le_2000000: (() => {
        const b = bestRationalApprox(S_tri_0, 2000000);
        return `${b.p}/${b.q}`;
      })(),
      best_rational_shift_1_q_le_2000000: (() => {
        const b = bestRationalApprox(S_tri_1, 2000000);
        return `${b.p}/${b.q}`;
      })(),
    },
    {
      family: 'cubic_n3+6n2+5n_start_n=2',
      terms_used: poly.length,
      partial_sum_shift_0: Number(S_poly_0.toPrecision(14)),
      partial_sum_shift_12: Number(S_poly_12.toPrecision(14)),
      best_rational_shift_0_q_le_2000000: (() => {
        const b = bestRationalApprox(S_poly_0, 2000000);
        return `${b.p}/${b.q}`;
      })(),
      best_rational_shift_12_q_le_2000000: (() => {
        const b = bestRationalApprox(S_poly_12, 2000000);
        return `${b.p}/${b.q}`;
      })(),
    },
  ];

  growthRows = [
    { family: 'triangular', n: 10000, root_n: Number((((10000 * 9999) / 2) ** (1 / 10000)).toFixed(8)) },
    { family: 'cubic_shifted', n: 10000, root_n: Number(((10000 ** 3 + 6 * 10000 ** 2 + 5 * 10000) ** (1 / 10000)).toFixed(8)) },
    { family: 'double_exponential_model_2^(2^n)', n: 12, root_n: Number((((2 ** (2 ** 12)) / 1e300) ** (1 / 12)).toExponential(6)) },
  ];
}

out.result = {
  description: 'Deep partial-sum and growth profiles for canonical constructions related to dual-shift rationality.',
  deep_passes: deepPasses,
  rows,
  growth_rows: growthRows,
};

const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-265', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(out, null, 2));
}
