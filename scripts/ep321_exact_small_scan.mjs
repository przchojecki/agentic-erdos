#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function popcount(x) {
  let v = x;
  let c = 0;
  while (v !== 0) {
    v &= v - 1;
    c += 1;
  }
  return c;
}

function gcdBig(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function lcmRange(N) {
  let l = 1n;
  for (let i = 1n; i <= BigInt(N); i += 1n) {
    l = (l / gcdBig(l, i)) * i;
  }
  return l;
}

function solveForN(N) {
  const D = lcmRange(N);
  const w = Array(N + 1).fill(0n);
  for (let x = 1; x <= N; x += 1) w[x] = D / BigInt(x);

  let bestCount = 0;
  let bestSet = [];

  // subset sums of scaled reciprocals
  let sums = [0n];
  let sumSet = new Set(['0']);
  const chosen = [];

  function canInclude(wx) {
    for (const s of sums) {
      if (sumSet.has((s + wx).toString())) return false;
    }
    return true;
  }

  function include(wx) {
    const newSums = [];
    for (const s of sums) newSums.push(s + wx);
    for (const ns of newSums) sumSet.add(ns.toString());
    sums = sums.concat(newSums);
  }

  function uninclude(wx) {
    const half = sums.length >> 1;
    for (let i = half; i < sums.length; i += 1) sumSet.delete(sums[i].toString());
    sums = sums.slice(0, half);
  }

  function dfs(x) {
    if (chosen.length + x <= bestCount) return;

    if (x === 0) {
      if (chosen.length > bestCount) {
        bestCount = chosen.length;
        bestSet = chosen.slice().sort((a, b) => a - b);
      }
      return;
    }

    // include first
    const wx = w[x];
    if (canInclude(wx)) {
      chosen.push(x);
      include(wx);
      dfs(x - 1);
      uninclude(wx);
      chosen.pop();
    }

    dfs(x - 1);
  }

  dfs(N);

  return {
    N,
    R_exact_small: bestCount,
    witness_set: bestSet,
    witness_size: bestSet.length,
    N_over_logN: N / Math.log(N),
    ratio_R_over_NlogN: bestCount / (N / Math.log(N)),
  };
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep321_exact_small_scan.json');

const Nmax = Number(process.argv[2] || 46);
const rows = [];
for (let N = 8; N <= Nmax; N += 1) {
  const t0 = Date.now();
  const r = solveForN(N);
  r.runtime_ms = Date.now() - t0;
  rows.push(r);
  process.stderr.write(`N=${N}, R=${r.R_exact_small}, ratio=${r.ratio_R_over_NlogN.toFixed(3)}, ms=${r.runtime_ms}\n`);
}

const out = {
  problem: 'EP-321',
  method: 'exact_branch_and_bound_on_unique_subset_sums_of_scaled_reciprocals',
  note: 'Scaled by lcm(1..N) to convert reciprocal subset sums into exact integer subset sums.',
  Nmax,
  rows,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
