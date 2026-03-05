#!/usr/bin/env node
const meta={problem:'EP-33',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-33 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch2_quick_compute.mjs | greedy finite additive complement to squares on intervals. ----
// // EP-33: greedy finite additive complement to squares on intervals.
// {
//   const XList = [20000, 50000, 100000];
//   const rows = [];
//   for (const X of XList) {
//     const low = Math.floor(X / 2);
//     const high = X;
//     const U = high - low + 1;
//     const maxA = Math.floor(4 * Math.sqrt(X));
//     const squares = [];
//     for (let t = 0; t * t <= high; t += 1) squares.push(t * t);
// 
//     const covers = [];
//     for (let a = 0; a <= maxA; a += 1) {
//       const arr = [];
//       for (const s of squares) {
//         const n = s + a;
//         if (n < low || n > high) continue;
//         arr.push(n - low);
//       }
//       covers.push(arr);
//     }
// 
//     const uncovered = new Uint8Array(U);
//     uncovered.fill(1);
//     let uncoveredCount = U;
//     const chosen = [];
//     const checkpoints = new Set([20, 40, 60, 80, 100, 120]);
//     const profile = [];
// 
//     for (let step = 1; step <= 120; step += 1) {
//       let bestA = -1;
//       let bestGain = -1;
//       for (let a = 0; a <= maxA; a += 1) {
//         if (chosen.includes(a)) continue;
//         let gain = 0;
//         for (const idx of covers[a]) if (uncovered[idx]) gain += 1;
//         if (gain > bestGain) {
//           bestGain = gain;
//           bestA = a;
//         }
//       }
//       if (bestA < 0 || bestGain <= 0) break;
//       chosen.push(bestA);
//       for (const idx of covers[bestA]) {
//         if (uncovered[idx]) {
//           uncovered[idx] = 0;
//           uncoveredCount -= 1;
//         }
//       }
//       if (checkpoints.has(step)) {
//         profile.push({
//           t: step,
//           coverage_fraction: Number(((U - uncoveredCount) / U).toFixed(6)),
//           t_over_sqrtX: Number((step / Math.sqrt(X)).toFixed(6)),
//         });
//       }
//     }
// 
//     rows.push({
//       X,
//       interval: [low, high],
//       candidate_a_max: maxA,
//       profile,
//       final_step_count: chosen.length,
//       final_coverage_fraction: Number(((U - uncoveredCount) / U).toFixed(6)),
//     });
//   }
//   out.results.ep33 = {
//     description: 'Greedy finite interval coverage by n = square + a with bounded a.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
