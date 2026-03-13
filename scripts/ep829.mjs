#!/usr/bin/env node
import fs from 'fs';

// EP-829: deeper finite profile of r(n)=#{a^3+b^3=n, a,b>=0}.
const OUT = process.env.OUT || 'data/ep829_standalone_deeper.json';
const LIM = 1_000_000_000;

const t0 = Date.now();
const maxBase = Math.floor(Math.cbrt(LIM));
const cubes = Array.from({ length: maxBase + 1 }, (_, i) => i ** 3);

const mp = new Map();
for (let i = 0; i <= maxBase; i += 1) {
  for (let j = i; j <= maxBase; j += 1) {
    const s = cubes[i] + cubes[j];
    if (s > LIM) break;
    mp.set(s, (mp.get(s) || 0) + 1);
  }
}

let bestN = 0;
let bestR = 0;
const hist = new Map();
for (const [n, r] of mp.entries()) {
  if (r > bestR) {
    bestR = r;
    bestN = n;
  }
  hist.set(r, (hist.get(r) || 0) + 1);
}

const rows = [];
for (const thr of [2, 3, 4, 5]) {
  let cnt = 0;
  for (const [r, v] of hist.entries()) if (r >= thr) cnt += v;
  rows.push({ threshold_r_at_least: thr, count_n: cnt });
}

const topN = [];
for (const [n, r] of mp.entries()) {
  if (r >= Math.max(3, bestR - 1)) topN.push({ n, r });
}
topN.sort((a, b) => b.r - a.r || a.n - b.n);

const out = {
  problem: 'EP-829',
  script: 'ep829.mjs',
  method: 'deep_enumeration_of_two_cube_representation_function',
  params: { LIM, max_base: maxBase },
  max_representation_count_found: bestR,
  argmax_n_found: bestN,
  tail_counts: rows,
  top_values: topN.slice(0, 50),
  log_scale_ratio_max_r_over_log_lim: Number((bestR / Math.log(LIM)).toPrecision(7)),
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
