#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x > 0);
  return out.length ? out : fallback;
}

function kthPowers(k, N) {
  const vals = [];
  for (let a = 1; ; a += 1) {
    const p = a ** k;
    if (p > N) break;
    vals.push(p);
  }
  return vals;
}

function statsFromCounts(cnt, alpha) {
  let maxRep = 0;
  let argMax = 0;
  let witness = 0;
  for (let n = 1; n < cnt.length; n += 1) {
    const c = cnt[n];
    if (c > maxRep) {
      maxRep = c;
      argMax = n;
    }
    if (c > n ** alpha) witness += 1;
  }
  return { maxRep, argMax, witness };
}

function repStatsK3(N, alpha) {
  const vals = kthPowers(3, N);
  const m = vals.length;
  const cnt = new Uint8Array(N + 1);
  for (let i = 0; i < m; i += 1) {
    const ai = vals[i];
    for (let j = i; j < m; j += 1) {
      const aij = ai + vals[j];
      if (aij > N) break;
      for (let t = j; t < m; t += 1) {
        const s = aij + vals[t];
        if (s > N) break;
        if (cnt[s] < 255) cnt[s] += 1;
      }
    }
  }
  const { maxRep, argMax, witness } = statsFromCounts(cnt, alpha);
  return {
    k: 3,
    N,
    basis_values_count: m,
    max_representation_count: maxRep,
    argmax_n: argMax,
    witness_count: witness,
    exponent_alpha: alpha,
    max_over_N_pow_alpha: Number((maxRep / (N ** alpha)).toFixed(6)),
  };
}

function repStatsK4(N, alpha) {
  const vals = kthPowers(4, N);
  const m = vals.length;
  const cnt = new Uint8Array(N + 1);
  for (let i = 0; i < m; i += 1) {
    const ai = vals[i];
    for (let j = i; j < m; j += 1) {
      const aij = ai + vals[j];
      if (aij > N) break;
      for (let t = j; t < m; t += 1) {
        const aijt = aij + vals[t];
        if (aijt > N) break;
        for (let u = t; u < m; u += 1) {
          const s = aijt + vals[u];
          if (s > N) break;
          if (cnt[s] < 255) cnt[s] += 1;
        }
      }
    }
  }
  const { maxRep, argMax, witness } = statsFromCounts(cnt, alpha);
  return {
    k: 4,
    N,
    basis_values_count: m,
    max_representation_count: maxRep,
    argmax_n: argMax,
    witness_count: witness,
    exponent_alpha: alpha,
    max_over_N_pow_alpha: Number((maxRep / (N ** alpha)).toFixed(6)),
  };
}

const N_LIST_K3 = parseIntList(process.env.N_LIST_K3, [70000000, 120000000, 180000000]);
const N_LIST_K4 = parseIntList(process.env.N_LIST_K4, [60000000, 100000000]);
const ALPHA_K3 = Number(process.env.ALPHA_K3 || 0.1);
const ALPHA_K4 = Number(process.env.ALPHA_K4 || 0.05);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const N of N_LIST_K3) rows.push(repStatsK3(N, ALPHA_K3));
for (const N of N_LIST_K4) rows.push(repStatsK4(N, ALPHA_K4));
const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));

const out = {
  problem: 'EP-322',
  script: path.basename(process.argv[1]),
  method: 'standalone_exact_nondecreasing_kth_power_representation_enumeration',
  params: { N_LIST_K3, N_LIST_K4, ALPHA_K3, ALPHA_K4 },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
