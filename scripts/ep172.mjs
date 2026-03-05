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
    .filter((x) => Number.isInteger(x) && x > 1);
  return out.length ? out : fallback;
}

function hasWitnessM3(colors, N) {
  for (let a = 1; a <= N; a += 1) {
    for (let b = a + 1; b <= N; b += 1) {
      for (let c = b + 1; c <= N; c += 1) {
        const vals = [a + b, a + c, b + c, a * b, a * c, b * c, a + b + c, a * b * c];
        const col0 = colors[vals[0]];
        let ok = true;
        for (let i = 1; i < vals.length; i += 1) {
          if (colors[vals[i]] !== col0) {
            ok = false;
            break;
          }
        }
        if (ok) return true;
      }
    }
  }
  return false;
}

const COLORS = parseIntList(process.env.COLORS, [2, 3]);
const N_LIST = parseIntList(process.env.N_LIST, [18, 24, 30, 36]);
const TRIALS = Number(process.env.TRIALS || 180);
const SEED = Number(process.env.SEED || 1722026);
const OUT = process.env.OUT || '';

const rng = makeRng(SEED);
const rows = [];
for (const r of COLORS) {
  for (const N of N_LIST) {
    const M = N * N * N;
    let hits = 0;
    for (let t = 0; t < TRIALS; t += 1) {
      const colors = new Uint8Array(M + 1);
      for (let x = 1; x <= M; x += 1) colors[x] = Math.floor(rng() * r);
      if (hasWitnessM3(colors, N)) hits += 1;
    }
    rows.push({
      colors: r,
      N_domain_for_A: N,
      color_domain_max: M,
      trials: TRIALS,
      witness_size3_found_count: hits,
      witness_size3_found_rate: Number((hits / TRIALS).toFixed(6)),
    });
  }
}

const out = {
  problem: 'EP-172',
  script: path.basename(process.argv[1]),
  method: 'standalone_random_coloring_sum_product_witness_search',
  params: { COLORS, N_LIST, TRIALS, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch6_quick_compute.mjs | finite coloring proxy for monochromatic sum-product patterns. ----
// // EP-172: finite coloring proxy for monochromatic sum-product patterns.
// {
//   function hasWitnessM3(colors, N) {
//     for (let a = 1; a <= N; a += 1) {
//       for (let b = a + 1; b <= N; b += 1) {
//         for (let c = b + 1; c <= N; c += 1) {
//           const vals = [a + b, a + c, b + c, a * b, a * c, b * c, a + b + c, a * b * c];
//           const col0 = colors[vals[0]];
//           let ok = true;
//           for (let i = 1; i < vals.length; i += 1) {
//             if (colors[vals[i]] !== col0) {
//               ok = false;
//               break;
//             }
//           }
//           if (ok) return true;
//         }
//       }
//     }
//     return false;
//   }
// 
//   const rows = [];
//   for (const r of [2, 3]) {
//     for (const N of [18, 24, 30]) {
//       const M = N * N * N;
//       const trials = 90;
//       let hits = 0;
//       for (let t = 0; t < trials; t += 1) {
//         const colors = new Uint8Array(M + 1);
//         for (let x = 1; x <= M; x += 1) colors[x] = Math.floor(rng() * r);
//         if (hasWitnessM3(colors, N)) hits += 1;
//       }
//       rows.push({
//         colors: r,
//         N_domain_for_A: N,
//         color_domain_max: M,
//         trials,
//         witness_size3_found_count: hits,
//         witness_size3_found_rate: Number((hits / trials).toFixed(6)),
//       });
//     }
//   }
// 
//   out.results.ep172 = {
//     description: 'Finite random-coloring proxy for monochromatic sum/product patterns (|A|=3).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
