#!/usr/bin/env node
const meta={problem:'EP-170',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-170 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch6_quick_compute.mjs | sparse ruler greedy construction profile. ----
// // EP-170: sparse ruler greedy construction profile.
// {
//   function greedySparseRuler(N, restarts) {
//     const allTargetCount = N + 1;
//     let best = Infinity;
// 
//     for (let t = 0; t < restarts; t += 1) {
//       const inA = new Uint8Array(N + 1);
//       const A = [0, N];
//       inA[0] = 1;
//       inA[N] = 1;
// 
//       const covered = new Uint8Array(N + 1);
//       covered[0] = 1;
//       covered[N] = 1;
//       let coveredCount = 2;
// 
//       while (coveredCount < allTargetCount) {
//         let bestX = -1;
//         let bestGain = -1;
//         const candidates = [];
// 
//         for (let x = 0; x <= N; x += 1) {
//           if (inA[x]) continue;
//           let gain = 0;
//           for (const a of A) {
//             const d = Math.abs(x - a);
//             if (!covered[d]) gain += 1;
//           }
//           if (gain > bestGain) {
//             bestGain = gain;
//             candidates.length = 0;
//             candidates.push(x);
//           } else if (gain === bestGain) {
//             candidates.push(x);
//           }
//         }
// 
//         if (candidates.length === 0) break;
//         bestX = candidates[Math.floor(rng() * candidates.length)];
//         inA[bestX] = 1;
//         A.push(bestX);
// 
//         for (const a of A) {
//           const d = Math.abs(bestX - a);
//           if (!covered[d]) {
//             covered[d] = 1;
//             coveredCount += 1;
//           }
//         }
//       }
// 
//       if (A.length < best) best = A.length;
//     }
// 
//     return best;
//   }
// 
//   const rows = [];
//   for (const [N, restarts] of [
//     [200, 80],
//     [400, 70],
//     [800, 60],
//     [1200, 50],
//   ]) {
//     const sz = greedySparseRuler(N, restarts);
//     rows.push({
//       N,
//       restarts,
//       best_size_found: sz,
//       ratio_over_sqrtN: Number((sz / Math.sqrt(N)).toFixed(6)),
//     });
//   }
// 
//   out.results.ep170 = {
//     description: 'Greedy finite sparse-ruler profile for F(N)/sqrt(N).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
