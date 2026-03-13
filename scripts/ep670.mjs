#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

const exactSmall = [
  { n: 4, exact_min_diameter_1D: 6 },
  { n: 5, exact_min_diameter_1D: 11 },
  { n: 6, exact_min_diameter_1D: 17 },
  { n: 7, exact_min_diameter_1D: 25 },
  { n: 8, exact_min_diameter_1D: 34 },
  { n: 9, exact_min_diameter_1D: 44 },
  { n: 10, exact_min_diameter_1D: 55 },
];

const rows = [];
for (const r of exactSmall) {
  const n = r.n;
  const L = r.exact_min_diameter_1D;
  rows.push({
    n,
    exact_min_diameter_1D: L,
    n_choose_2: (n * (n - 1)) / 2,
    ratio_over_n2: Number((L / (n * n)).toPrecision(8)),
    ratio_over_n_choose_2: Number((L / ((n * (n - 1)) / 2)).toPrecision(8)),
    source: 'known optimal Golomb-ruler lengths for n<=10',
  });
}

for (const n of [12, 14, 16, 18, 20, 24, 30, 40, 50]) {
  const proxy = Math.round((n * (n - 1)) / 2 + 0.055 * n * n);
  rows.push({
    n,
    heuristic_1D_diameter_scale_proxy: proxy,
    proxy_over_n2: Number((proxy / (n * n)).toPrecision(8)),
    note: 'heuristic extension beyond tabulated exact n<=10 values',
  });
}

const out = {
  problem: 'EP-670',
  script: path.basename(process.argv[1]),
  method: 'exact_small_n_golomb_ruler_table_plus_larger_n_heuristic_extension',
  params: {},
  rows,
  elapsed_ms: 0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
