#!/usr/bin/env node
const meta={problem:'EP-652',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-652 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch16_quick_compute.mjs | finite profiles for sorted pinned-distance counts. ----
// // EP-652: finite profiles for sorted pinned-distance counts.
// {
//   const rng = makeRng(20260304 ^ 1606);
// 
//   function gridPoints(m) {
//     const pts = [];
//     for (let x = 0; x < m; x += 1) {
//       for (let y = 0; y < m; y += 1) pts.push([x, y]);
//     }
//     return pts;
//   }
// 
//   const rows = [];
//   for (const m of [10, 14]) {
//     const pts = gridPoints(m);
//     const n = pts.length;
//     const R = pinnedRValues(pts);
//     for (const k of [2, 4, 8, 16]) {
//       if (k > n) continue;
//       rows.push({
//         family: 'grid',
//         n,
//         k,
//         R_x_k: R[k - 1],
//         R_x_k_over_sqrt_n: Number((R[k - 1] / Math.sqrt(n)).toPrecision(7)),
//       });
//     }
//   }
// 
//   for (const n of [100, 196]) {
//     const trials = 10;
//     const best = new Map();
//     for (const k of [2, 4, 8, 16]) best.set(k, Infinity);
// 
//     for (let t = 0; t < trials; t += 1) {
//       const pts = randomDistinctPoints(n, 4000, rng);
//       const R = pinnedRValues(pts);
//       for (const k of [2, 4, 8, 16]) {
//         const v = R[k - 1];
//         if (v < best.get(k)) best.set(k, v);
//       }
//     }
// 
//     for (const k of [2, 4, 8, 16]) {
//       rows.push({
//         family: 'random_best_of_trials',
//         n,
//         trials,
//         k,
//         best_R_x_k_over_trials: best.get(k),
//         best_R_x_k_over_sqrt_n: Number((best.get(k) / Math.sqrt(n)).toPrecision(7)),
//       });
//     }
//   }
// 
//   out.results.ep652 = {
//     description: 'Finite sorted pinned-distance profile R(x_k) for structured and random point sets.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
