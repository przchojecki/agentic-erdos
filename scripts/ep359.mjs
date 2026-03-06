#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x > 0)
    .sort((a, b) => a - b);
  return out.length ? out : fallback;
}

function generateMacmahon(K, firstTerm) {
  const a = [firstTerm];
  let cap = 1024;
  while (cap <= firstTerm + 1) cap *= 2;
  let repr = new Uint8Array(cap);
  repr[firstTerm] = 1;

  function ensureCap(x) {
    if (x < cap) return;
    let ncap = cap;
    while (ncap <= x) ncap *= 2;
    const next = new Uint8Array(ncap);
    next.set(repr);
    repr = next;
    cap = ncap;
  }

  for (let k = 2; k <= K; k += 1) {
    const prev = a[a.length - 1];
    let x = prev + 1;
    while (x < cap && repr[x]) x += 1;
    if (x >= cap) {
      ensureCap(x + 1);
      while (repr[x]) x += 1;
    }

    a.push(x);
    let s = 0;
    for (let i = a.length - 1; i >= 0; i -= 1) {
      s += a[i];
      ensureCap(s + 1);
      repr[s] = 1;
    }
  }
  return a;
}

const K = Number(process.env.K || 12000);
const N_LIST = parseIntList(process.env.N_LIST, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12, 14, 16, 18, 20, 24, 28, 32, 36, 40, 48, 56, 64, 80, 96, 112]);
const CHECKPOINTS = parseIntList(
  process.env.CHECKPOINTS,
  [500, 1000, 2000, 3000, 5000, 7000, 9000, 12000],
).filter((x) => x <= K);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const n0 of N_LIST) {
  const a = generateMacmahon(K, n0);
  const checkpoints = CHECKPOINTS.map((k) => {
    const ak = a[k - 1];
    const logk = Math.log(k);
    const llk = Math.log(logk);
    const model = (k * logk) / llk;
    return {
      k,
      a_k: ak,
      a_over_k: Number((ak / k).toFixed(8)),
      a_over_k_logk_over_loglogk: Number((ak / model).toFixed(8)),
      a_over_k_pow_1p02: Number((ak / (k ** 1.02)).toFixed(8)),
      a_over_k_pow_1p05: Number((ak / (k ** 1.05)).toFixed(8)),
    };
  });
  rows.push({
    first_term: n0,
    first_terms: a.slice(0, 30),
    tail_terms: a.slice(-40),
    checkpoints,
  });
}

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-359',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_exact_macmahon_generation_across_multiple_initial_terms',
  params: { K, N_LIST, CHECKPOINTS },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
