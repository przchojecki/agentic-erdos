#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-169
// Finite greedy profiles for k-AP-free sets and their harmonic sums.

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x > 0);
  return out.length ? out : fallback;
}

function greedyNo3AP(N) {
  const inSet = new Uint8Array(N + 1);
  const elems = [];
  let h = 0;
  for (let x = 1; x <= N; x += 1) {
    let bad = false;
    for (const y of elems) {
      const z = 2 * y - x;
      if (z >= 1 && inSet[z]) {
        bad = true;
        break;
      }
    }
    if (!bad) {
      inSet[x] = 1;
      elems.push(x);
      h += 1 / x;
    }
  }
  return { size: elems.length, harmonic: h };
}

function greedyNo4AP(N) {
  const inSet = new Uint8Array(N + 1);
  let size = 0;
  let h = 0;
  for (let x = 1; x <= N; x += 1) {
    let bad = false;
    for (let d = 1; x - 3 * d >= 1; d += 1) {
      if (inSet[x - d] && inSet[x - 2 * d] && inSet[x - 3 * d]) {
        bad = true;
        break;
      }
    }
    if (!bad) {
      inSet[x] = 1;
      size += 1;
      h += 1 / x;
    }
  }
  return { size, harmonic: h };
}

const N3 = parseIntList(process.env.N3_LIST, [20000, 50000, 100000, 200000, 300000]);
const N4 = parseIntList(process.env.N4_LIST, [4000, 8000, 12000, 16000, 20000]);
const outPath = process.env.OUT || '';

const rows = [];
for (const N of N3) {
  const v = greedyNo3AP(N);
  rows.push({
    k: 3,
    N,
    greedy_size: v.size,
    harmonic_sum: Number(v.harmonic.toFixed(6)),
    harmonic_over_logN: Number((v.harmonic / Math.log(N)).toFixed(6)),
  });
}
for (const N of N4) {
  const v = greedyNo4AP(N);
  rows.push({
    k: 4,
    N,
    greedy_size: v.size,
    harmonic_sum: Number(v.harmonic.toFixed(6)),
    harmonic_over_logN: Number((v.harmonic / Math.log(N)).toFixed(6)),
  });
}

const out = {
  problem: 'EP-169',
  script: path.basename(process.argv[1]),
  method: 'deterministic_greedy_kAP_free_harmonic_profile',
  params: { N3_LIST: N3, N4_LIST: N4 },
  rows,
  generated_utc: new Date().toISOString(),
};

if (outPath) fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch6_quick_compute.mjs | harmonic sums for k-AP-free greedy sets. ----
// // EP-169: harmonic sums for k-AP-free greedy sets.
// {
//   function greedyNo3AP(N) {
//     const inSet = new Uint8Array(N + 1);
//     const elems = [];
//     let h = 0;
//     for (let x = 1; x <= N; x += 1) {
//       let bad = false;
//       for (const y of elems) {
//         const z = 2 * y - x;
//         if (z >= 1 && inSet[z]) {
//           bad = true;
//           break;
//         }
//       }
//       if (!bad) {
//         inSet[x] = 1;
//         elems.push(x);
//         h += 1 / x;
//       }
//     }
//     return { size: elems.length, harmonic: h };
//   }
// 
//   function greedyNo4AP(N) {
//     const inSet = new Uint8Array(N + 1);
//     let size = 0;
//     let h = 0;
//     for (let x = 1; x <= N; x += 1) {
//       let bad = false;
//       for (let d = 1; x - 3 * d >= 1; d += 1) {
//         if (inSet[x - d] && inSet[x - 2 * d] && inSet[x - 3 * d]) {
//           bad = true;
//           break;
//         }
//       }
//       if (!bad) {
//         inSet[x] = 1;
//         size += 1;
//         h += 1 / x;
//       }
//     }
//     return { size, harmonic: h };
//   }
// 
//   const rows = [];
//   for (const N of [20000, 50000, 100000]) {
//     const v = greedyNo3AP(N);
//     rows.push({
//       k: 3,
//       N,
//       greedy_size: v.size,
//       harmonic_sum: Number(v.harmonic.toFixed(6)),
//       harmonic_over_logN: Number((v.harmonic / Math.log(N)).toFixed(6)),
//     });
//   }
//   for (const N of [4000, 8000, 12000]) {
//     const v = greedyNo4AP(N);
//     rows.push({
//       k: 4,
//       N,
//       greedy_size: v.size,
//       harmonic_sum: Number(v.harmonic.toFixed(6)),
//       harmonic_over_logN: Number((v.harmonic / Math.log(N)).toFixed(6)),
//     });
//   }
// 
//   out.results.ep169 = {
//     description: 'Greedy finite harmonic-sum profiles for k-AP-free sets.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
