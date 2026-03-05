#!/usr/bin/env node
const meta={problem:'EP-510',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-510 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch13_quick_compute.mjs | finite cosine-sum minima profiles. ----
// // EP-510: finite cosine-sum minima profiles.
// {
//   const rng = makeRng(20260303 ^ 1305);
// 
//   function minCosGrid(A, M = 4096) {
//     let best = Infinity;
//     let bestTheta = 0;
//     for (let t = 0; t < M; t += 1) {
//       const theta = (2 * Math.PI * t) / M;
//       let s = 0;
//       for (const n of A) s += Math.cos(n * theta);
//       if (s < best) {
//         best = s;
//         bestTheta = theta;
//       }
//     }
//     return { minSum: best, theta: bestTheta };
//   }
// 
//   function randomSet(size, maxVal) {
//     const S = new Set();
//     while (S.size < size) S.add(1 + Math.floor(rng() * maxVal));
//     return [...S];
//   }
// 
//   function greedySidon(size, Nmax) {
//     const A = [];
//     const sums = new Set();
//     for (let x = 1; x <= Nmax && A.length < size; x += 1) {
//       let ok = true;
//       for (const a of A) {
//         const s = a + x;
//         if (sums.has(s)) {
//           ok = false;
//           break;
//         }
//       }
//       if (!ok) continue;
//       for (const a of A) sums.add(a + x);
//       sums.add(2 * x);
//       A.push(x);
//     }
//     return A;
//   }
// 
//   const rows = [];
//   for (const [N, trials] of [[40, 120], [80, 100], [160, 80], [320, 60]]) {
//     let bestNeg = 0;
//     let avgNeg = 0;
//     for (let t = 0; t < trials; t += 1) {
//       const A = randomSet(N, 10 * N);
//       const { minSum } = minCosGrid(A);
//       const neg = -minSum;
//       avgNeg += neg;
//       if (neg > bestNeg) bestNeg = neg;
//     }
//     rows.push({
//       family: 'random',
//       N,
//       trials,
//       best_negative_min: Number(bestNeg.toPrecision(7)),
//       avg_negative_min: Number((avgNeg / trials).toPrecision(7)),
//       best_over_sqrtN: Number((bestNeg / Math.sqrt(N)).toPrecision(7)),
//       best_over_N_pow_1_over_7: Number((bestNeg / (N ** (1 / 7))).toPrecision(7)),
//     });
//   }
// 
//   const B = greedySidon(20, 1200);
//   const diff = new Set();
//   for (const x of B) for (const y of B) diff.add(x - y);
//   const Astruct = [...diff];
//   const { minSum: sMin } = minCosGrid(Astruct);
//   rows.push({
//     family: 'sidon_difference_B_minus_B',
//     N: Astruct.length,
//     trials: 1,
//     best_negative_min: Number((-sMin).toPrecision(7)),
//     avg_negative_min: Number((-sMin).toPrecision(7)),
//     best_over_sqrtN: Number(((-sMin) / Math.sqrt(Astruct.length)).toPrecision(7)),
//     best_over_N_pow_1_over_7: Number(((-sMin) / (Astruct.length ** (1 / 7))).toPrecision(7)),
//   });
// 
//   out.results.ep510 = {
//     description: 'Grid-minimum cosine-sum profiles for random and structured sets A.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
