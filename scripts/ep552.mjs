#!/usr/bin/env node
const meta={problem:'EP-552',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-552 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch14_quick_compute.mjs | exact small-n R(C4, S_n) profile. ----
// // EP-552: exact small-n R(C4, S_n) profile.
// {
//   function c4ExistsInColor(mask, N, red = true) {
//     const idx = Array.from({ length: N }, () => Array(N).fill(-1));
//     let e = 0;
//     for (let i = 0; i < N; i += 1) {
//       for (let j = i + 1; j < N; j += 1) {
//         idx[i][j] = e;
//         idx[j][i] = e;
//         e += 1;
//       }
//     }
// 
//     for (let u = 0; u < N; u += 1) {
//       for (let v = u + 1; v < N; v += 1) {
//         let common = 0;
//         for (let w = 0; w < N; w += 1) {
//           if (w === u || w === v) continue;
//           const b1 = ((mask >> BigInt(idx[u][w])) & 1n) === 1n;
//           const b2 = ((mask >> BigInt(idx[v][w])) & 1n) === 1n;
//           const c1 = red ? b1 : !b1;
//           const c2 = red ? b2 : !b2;
//           if (c1 && c2) {
//             common += 1;
//             if (common >= 2) return true;
//           }
//         }
//       }
//     }
//     return false;
//   }
// 
//   function blueStarExists(mask, N, nLeaves) {
//     const degBlue = Array(N).fill(0);
//     let ei = 0;
//     for (let i = 0; i < N; i += 1) {
//       for (let j = i + 1; j < N; j += 1) {
//         const isRed = ((mask >> BigInt(ei)) & 1n) === 1n;
//         if (!isRed) {
//           degBlue[i] += 1;
//           degBlue[j] += 1;
//         }
//         ei += 1;
//       }
//     }
//     return degBlue.some((d) => d >= nLeaves);
//   }
// 
//   function R_C4_Star_small(nLeaves, cap = 6) {
//     for (let N = Math.max(4, nLeaves + 1); N <= cap; N += 1) {
//       const E = (N * (N - 1)) / 2;
//       const total = 1n << BigInt(E);
//       let avoidFound = false;
//       for (let mask = 0n; mask < total; mask += 1n) {
//         const redC4 = c4ExistsInColor(mask, N, true);
//         const blueStar = blueStarExists(mask, N, nLeaves);
//         if (!redC4 && !blueStar) {
//           avoidFound = true;
//           break;
//         }
//       }
//       if (!avoidFound) return N;
//     }
//     return null;
//   }
// 
//   const rng = makeRng(20260303 ^ 1407);
// 
//   function randomMask(E) {
//     let mask = 0n;
//     for (let e = 0; e < E; e += 1) {
//       if (rng() < 0.5) mask |= 1n << BigInt(e);
//     }
//     return mask;
//   }
// 
//   function randomAvoidHits(nLeaves, N, trials) {
//     const E = (N * (N - 1)) / 2;
//     let hits = 0;
//     for (let t = 0; t < trials; t += 1) {
//       const mask = randomMask(E);
//       const redC4 = c4ExistsInColor(mask, N, true);
//       const blueStar = blueStarExists(mask, N, nLeaves);
//       if (!redC4 && !blueStar) hits += 1;
//     }
//     return hits;
//   }
// 
//   const exact_rows = [];
//   const random_rows = [];
//   for (const n of [2, 3, 4]) {
//     const targetA = n + Math.ceil(Math.sqrt(n));
//     const targetB = targetA + 1;
//     const R = R_C4_Star_small(n, 6);
//     exact_rows.push({
//       n,
//       R_C4_Sn_exact_if_at_most_6_else_null: R,
//       n_plus_ceil_sqrt_n: targetA,
//       n_plus_ceil_sqrt_n_plus_1: targetB,
//     });
// 
//     for (const N of [Math.max(4, targetA - 1), targetA, targetB]) {
//       random_rows.push({
//         n,
//         N,
//         trials: 600,
//         random_avoiding_hits: randomAvoidHits(n, N, 600),
//       });
//     }
//   }
// 
//   out.results.ep552 = {
//     description: 'Exact tiny-n computations and random avoidance probes for R(C4, S_n).',
//     exact_rows,
//     random_rows,
//   };
// }
// ==== End Batch Split Integrations ====
