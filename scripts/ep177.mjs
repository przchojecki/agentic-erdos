#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x > 0);
  return out.length ? out : fallback;
}

function thueMorseValue(i) {
  let x = i;
  let p = 0;
  while (x > 0) {
    p ^= x & 1;
    x >>= 1;
  }
  return p ? -1 : 1;
}

function maxProgDiscrepancyForD(seq, d) {
  let best = 0;
  const N = seq.length;
  for (let r = 0; r < d; r += 1) {
    let pref = 0;
    let minPref = 0;
    let maxPref = 0;
    for (let i = r; i < N; i += d) {
      pref += seq[i];
      if (pref < minPref) minPref = pref;
      if (pref > maxPref) maxPref = pref;
    }
    const disc = maxPref - minPref;
    if (disc > best) best = disc;
  }
  return best;
}

const N = Number(process.env.N || 40000);
const D_LIST = parseIntList(process.env.D_LIST, [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64, 96, 128]);
const RANDOM_TRIALS = Number(process.env.RANDOM_TRIALS || 16);
const SEED = Number(process.env.SEED || 1772026);
const OUT = process.env.OUT || '';

const rng = makeRng(SEED);
const thue = new Int8Array(N);
for (let i = 0; i < N; i += 1) thue[i] = thueMorseValue(i);

const rows = [];
for (const d of D_LIST) {
  const th = maxProgDiscrepancyForD(thue, d);
  let bestRnd = Infinity;
  for (let t = 0; t < RANDOM_TRIALS; t += 1) {
    const rnd = new Int8Array(N);
    for (let i = 0; i < N; i += 1) rnd[i] = rng() < 0.5 ? -1 : 1;
    const v = maxProgDiscrepancyForD(rnd, d);
    if (v < bestRnd) bestRnd = v;
  }
  rows.push({
    d,
    N_prefix: N,
    thue_morse_hN_d: th,
    random_best_of_trials_hN_d: bestRnd,
    thue_over_sqrt_d: Number((th / Math.sqrt(d)).toFixed(6)),
    random_over_sqrt_d: Number((bestRnd / Math.sqrt(d)).toFixed(6)),
  });
}

const out = {
  problem: 'EP-177',
  script: path.basename(process.argv[1]),
  method: 'standalone_discrepancy_profile_thue_vs_random',
  params: { N, D_LIST, RANDOM_TRIALS, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch6_quick_compute.mjs | finite h_N(d) profiles for explicit +/-1 sequences. ----
// // EP-177: finite h_N(d) profiles for explicit +/-1 sequences.
// {
//   function thueMorseValue(i) {
//     let x = i;
//     let p = 0;
//     while (x > 0) {
//       p ^= x & 1;
//       x >>= 1;
//     }
//     return p ? -1 : 1;
//   }
// 
//   function maxProgDiscrepancyForD(seq, d) {
//     let best = 0;
//     const N = seq.length;
//     for (let r = 0; r < d; r += 1) {
//       let pref = 0;
//       let minPref = 0;
//       let maxPref = 0;
//       for (let i = r; i < N; i += d) {
//         pref += seq[i];
//         if (pref < minPref) minPref = pref;
//         if (pref > maxPref) maxPref = pref;
//       }
//       const disc = maxPref - minPref;
//       if (disc > best) best = disc;
//     }
//     return best;
//   }
// 
//   const N = 30000;
//   const dList = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64];
// 
//   const thue = new Int8Array(N);
//   for (let i = 0; i < N; i += 1) thue[i] = thueMorseValue(i);
// 
//   const rows = [];
//   for (const d of dList) {
//     const th = maxProgDiscrepancyForD(thue, d);
// 
//     let bestRnd = Infinity;
//     for (let t = 0; t < 10; t += 1) {
//       const rnd = new Int8Array(N);
//       for (let i = 0; i < N; i += 1) rnd[i] = rng() < 0.5 ? -1 : 1;
//       const v = maxProgDiscrepancyForD(rnd, d);
//       if (v < bestRnd) bestRnd = v;
//     }
// 
//     rows.push({
//       d,
//       N_prefix: N,
//       thue_morse_hN_d: th,
//       random_best_of_10_hN_d: bestRnd,
//       thue_over_sqrt_d: Number((th / Math.sqrt(d)).toFixed(6)),
//       random_over_sqrt_d: Number((bestRnd / Math.sqrt(d)).toFixed(6)),
//     });
//   }
// 
//   out.results.ep177 = {
//     description: 'Finite discrepancy profile h_N(d) for Thue-Morse and random +/-1 sequences.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
