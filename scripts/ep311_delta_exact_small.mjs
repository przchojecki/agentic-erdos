#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function gcd(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

function lcmToN(N) {
  let D = 1n;
  for (let i = 1n; i <= BigInt(N); i += 1n) D = lcm(D, i);
  return D;
}

function subsetSums(weights) {
  const m = weights.length;
  const total = 1 << m;
  const out = new Array(total);
  out[0] = 0n;
  for (let mask = 1; mask < total; mask += 1) {
    const b = mask & -mask;
    const i = Math.log2(b) | 0;
    out[mask] = out[mask ^ b] + weights[i];
  }
  return out;
}

function lowerBound(arr, x) {
  let l = 0;
  let r = arr.length;
  while (l < r) {
    const m = (l + r) >> 1;
    if (arr[m] < x) l = m + 1;
    else r = m;
  }
  return l;
}

function exactDeltaForN(N) {
  const D = lcmToN(N);
  const w = [];
  for (let n = 1; n <= N; n += 1) w.push(D / BigInt(n));

  const mid = Math.floor(N / 2);
  const L = w.slice(0, mid);
  const R = w.slice(mid);

  const sL = subsetSums(L);
  const sR = subsetSums(R);
  sR.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));

  let best = null;
  let bestPair = null;

  for (const a of sL) {
    const t = D - a;
    const p = lowerBound(sR, t);
    const candIdx = [p - 1, p, p + 1];
    for (const q of candIdx) {
      if (q < 0 || q >= sR.length) continue;
      const s = a + sR[q];
      let diff = s > D ? s - D : D - s;
      if (diff === 0n) continue;
      if (best == null || diff < best) {
        best = diff;
        bestPair = { a: a.toString(), b: sR[q].toString() };
      }
    }
  }

  const deltaApprox = Number(best) / Number(D);
  return {
    N,
    D: D.toString(),
    exact_delta_num: best.toString(),
    approx_delta: deltaApprox,
    approx_neglog_delta_over_N: -Math.log(deltaApprox) / N,
    witness_half_sums: bestPair,
  };
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep311_delta_exact_small.json');

const Nlist = (process.argv[2] || '10,12,14,16,18,20,22,24,26,28,30,32').split(',').map((x) => Number(x));

const rows = [];
for (const N of Nlist) {
  const t0 = Date.now();
  const r = exactDeltaForN(N);
  r.runtime_ms = Date.now() - t0;
  rows.push(r);
  process.stderr.write(`N=${N}, delta~${r.approx_delta.toExponential(4)}, c~${r.approx_neglog_delta_over_N.toFixed(4)}, ms=${r.runtime_ms}\n`);
}

const out = {
  problem: 'EP-311',
  method: 'exact_meet-in-the-middle_for_deltaN_scaled_by_lcm',
  params: { N_list: Nlist },
  rows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
