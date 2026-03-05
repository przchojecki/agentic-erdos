#!/usr/bin/env node
const meta={problem:'EP-44',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-44 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch2_quick_compute.mjs | finite extension experiments for random Sidon A. ----
// // EP-44: finite extension experiments for random Sidon A.
// {
//   const NList = [120, 180, 240];
//   const rows = [];
//   for (const N of NList) {
//     const tries = 18;
//     let success = 0;
//     const eps = 0.2;
//     let avgRatio = 0;
//     for (let t = 0; t < tries; t += 1) {
//       const targetA = Math.max(6, Math.floor(0.75 * Math.sqrt(N)));
//       const A = randomSidonSet(N, targetA, rng);
//       if (!A) continue;
// 
//       const M = 3 * N;
//       const current = A.slice();
//       const sums = new Set();
//       for (let i = 0; i < current.length; i += 1) {
//         for (let j = i; j < current.length; j += 1) sums.add(current[i] + current[j]);
//       }
//       const candidates = Array.from({ length: M - N }, (_, i) => N + 1 + i);
//       shuffle(candidates, rng);
//       for (const x of candidates) {
//         if (canAddToSidon(current, sums, x)) addToSidonState(current, sums, x);
//       }
//       const ratio = current.length / Math.sqrt(M);
//       avgRatio += ratio;
//       if (current.length >= (1 - eps) * Math.sqrt(M)) success += 1;
//     }
//     rows.push({
//       N,
//       M_test: 3 * N,
//       epsilon: 0.2,
//       trials: tries,
//       success_count: success,
//       success_fraction: Number((success / tries).toFixed(6)),
//       avg_final_ratio_over_sqrtM: Number((avgRatio / tries).toFixed(6)),
//     });
//   }
//   out.results.ep44 = {
//     description: 'Finite random extension tests from initial Sidon sets into [N+1,3N].',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
