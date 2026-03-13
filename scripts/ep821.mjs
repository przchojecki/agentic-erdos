#!/usr/bin/env node
import fs from 'fs';

// EP-821: deeper totient preimage multiplicity scan for g(n)=#{m:phi(m)=n}.
const OUT = process.env.OUT || 'data/ep821_standalone_deeper.json';
const N = 2_000_000;

const t0 = Date.now();
const phi = Array.from({ length: N + 1 }, (_, i) => i);
for (let p = 2; p <= N; p += 1) {
  if (phi[p] !== p) continue;
  for (let k = p; k <= N; k += p) phi[k] -= Math.floor(phi[k] / p);
}

const freq = new Uint32Array(N + 1);
for (let m = 1; m <= N; m += 1) {
  const v = phi[m];
  if (v <= N) freq[v] += 1;
}

let bestN = 1;
let bestG = 0;
const record_rows = [];
for (let n = 1; n <= N; n += 1) {
  const g = freq[n];
  if (g > bestG) {
    bestG = g;
    bestN = n;
    record_rows.push({
      n,
      g,
      log_g_over_log_n: n > 1 ? Number((Math.log(g) / Math.log(n)).toPrecision(7)) : null,
    });
  }
}

const top_values = [];
for (let n = 1; n <= N; n += 1) {
  const g = freq[n];
  if (g >= 40) top_values.push({ n, g });
}
top_values.sort((a, b) => b.g - a.g || a.n - b.n);

const out = {
  problem: 'EP-821',
  script: 'ep821.mjs',
  method: 'totient_preimage_multiplicity_scan_deepened',
  params: { N, threshold_for_top_values: 40 },
  max_g_n_found: bestG,
  argmax_n_found: bestN,
  max_exponent_log_g_over_log_n: Number((Math.log(bestG) / Math.log(bestN)).toPrecision(7)),
  record_progression: record_rows.slice(-20),
  top_values: top_values.slice(0, 60),
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
