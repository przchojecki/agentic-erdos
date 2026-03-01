#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function buildLpf(n) {
  const lpf = new Uint32Array(n + 1);
  for (let i = 2; i <= n; i += 1) {
    if (lpf[i] === 0) {
      for (let j = i; j <= n; j += i) lpf[j] = i;
    }
  }
  return lpf;
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep961_smooth_run_scan.json');

const X = Number(process.argv[2] || 5000000);
const ks = [10, 15, 20, 25, 30, 40, 50, 60, 80, 100, 120, 150, 200, 300, 500, 700, 1000];

const lpf = buildLpf(X);

const run = new Int32Array(ks.length);
const best = new Int32Array(ks.length);
const bestStart = new Int32Array(ks.length);

for (let n = 2; n <= X; n += 1) {
  const p = lpf[n];
  for (let i = 0; i < ks.length; i += 1) {
    const k = ks[i];
    if (n <= k || p > k) {
      run[i] = 0;
    } else {
      run[i] += 1;
      if (run[i] > best[i]) {
        best[i] = run[i];
        bestStart[i] = n - run[i] + 1;
      }
    }
  }
  if (n % 500000 === 0) process.stderr.write(`n=${n}/${X}\n`);
}

const rows = ks.map((k, i) => {
  const r = best[i];
  const lowerBoundF = r + 1;
  const exactByUpperBound = lowerBoundF === k;
  return {
    k,
    scan_limit_X: X,
    max_run_observed: r,
    witness_interval: [bestStart[i], bestStart[i] + r - 1],
    lower_bound_on_f_k: lowerBoundF,
    known_upper_bound_f_k: k,
    exact_f_k_if_upper_bound_sharp: exactByUpperBound ? k : null,
    normalized_ratio_r_logk_over_k: k > 1 ? (r * Math.log(k)) / k : null,
  };
});

const out = {
  problem: 'EP-961',
  method: 'largest_observed_run_of_k_smooth_integers_up_to_X',
  rows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
