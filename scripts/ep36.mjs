#!/usr/bin/env node
const meta={problem:'EP-36',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-36 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch2_quick_compute.mjs | random local search for minimum overlap ratio. ----
// // EP-36: random local search for minimum overlap ratio.
// {
//   function maxDiffCount(A, B, N) {
//     const offs = 2 * N + 3;
//     const cnt = new Uint16Array(4 * N + 7);
//     let best = 0;
//     for (const a of A) {
//       for (const b of B) {
//         const idx = a - b + offs;
//         const v = (cnt[idx] += 1);
//         if (v > best) best = v;
//       }
//     }
//     return best;
//   }
// 
//   const NList = [120, 200, 300];
//   const rows = [];
//   for (const N of NList) {
//     const U = Array.from({ length: 2 * N }, (_, i) => i + 1);
//     let globalBest = Infinity;
//     const restarts = 18;
//     for (let r = 0; r < restarts; r += 1) {
//       const arr = U.slice();
//       shuffle(arr, rng);
//       const A = arr.slice(0, N);
//       const B = arr.slice(N);
//       let score = maxDiffCount(A, B, N);
//       for (let it = 0; it < 2000; it += 1) {
//         const ia = Math.floor(rng() * N);
//         const ib = Math.floor(rng() * N);
//         const oldA = A[ia];
//         const oldB = B[ib];
//         A[ia] = oldB;
//         B[ib] = oldA;
//         const s2 = maxDiffCount(A, B, N);
//         if (s2 <= score) {
//           score = s2;
//         } else {
//           A[ia] = oldA;
//           B[ib] = oldB;
//         }
//       }
//       if (score < globalBest) globalBest = score;
//     }
//     rows.push({
//       N,
//       best_max_overlap_found: globalBest,
//       best_ratio_over_N: Number((globalBest / N).toFixed(6)),
//       restarts,
//     });
//   }
//   out.results.ep36 = {
//     description: 'Finite local-search profile for minimum overlap constant c.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
