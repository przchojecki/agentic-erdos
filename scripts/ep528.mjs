#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function enumerateSAWCounts(d, nMax) {
  const dirs = [];
  for (let i = 0; i < d; i += 1) {
    const a = Array(d).fill(0); a[i] = 1; dirs.push(a);
    const b = Array(d).fill(0); b[i] = -1; dirs.push(b);
  }

  const cnt = Array(nMax + 1).fill(0);
  const coord = Array(d).fill(0);
  const visited = new Set([coord.join(',')]);

  function dfs(step) {
    if (step > 0) cnt[step] += 1;
    if (step === nMax) return;

    for (const mv of dirs) {
      for (let i = 0; i < d; i += 1) coord[i] += mv[i];
      const k = coord.join(',');
      if (!visited.has(k)) {
        visited.add(k);
        dfs(step + 1);
        visited.delete(k);
      }
      for (let i = 0; i < d; i += 1) coord[i] -= mv[i];
    }
  }

  dfs(0);
  return cnt;
}

const t0 = Date.now();
const configs = [
  { d: 2, nMax: 12 },
  { d: 3, nMax: 9 },
  { d: 4, nMax: 8 },
];

const rows = [];
for (const cfg of configs) {
  const cnt = enumerateSAWCounts(cfg.d, cfg.nMax);
  for (let n = 2; n <= cfg.nMax; n += 1) {
    rows.push({
      d: cfg.d,
      n,
      c_n: cnt[n],
      root_estimate_c_n_pow_1_over_n: Number((cnt[n] ** (1 / n)).toPrecision(8)),
      ratio_c_n_over_c_n_minus_1: Number((cnt[n] / cnt[n - 1]).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-528',
  script: path.basename(process.argv[1]),
  method: 'exact_small_n_saw_count_profile_for_connective_constant_proxies',
  params: { configs },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
