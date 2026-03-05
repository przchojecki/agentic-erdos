#!/usr/bin/env node
const meta={problem:'EP-829',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-829 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch19_quick_compute.mjs | representation counts as sum of two cubes. ----
// // EP-829: representation counts as sum of two cubes.
// {
//   const LIM = 200_000_000;
//   const maxBase = Math.floor(Math.cbrt(LIM));
//   const cubes = Array.from({ length: maxBase + 1 }, (_, i) => i ** 3);
// 
//   const mp = new Map();
//   for (let i = 0; i <= maxBase; i += 1) {
//     for (let j = i; j <= maxBase; j += 1) {
//       const s = cubes[i] + cubes[j];
//       if (s > LIM) break;
//       mp.set(s, (mp.get(s) || 0) + 1);
//     }
//   }
// 
//   let bestN = 0;
//   let bestR = 0;
//   let over1 = 0;
//   let over2 = 0;
//   let over3 = 0;
//   for (const [n, r] of mp.entries()) {
//     if (r > bestR) {
//       bestR = r;
//       bestN = n;
//     }
//     if (r >= 2) over1 += 1;
//     if (r >= 3) over2 += 1;
//     if (r >= 4) over3 += 1;
//   }
// 
//   out.results.ep829 = {
//     description: 'Finite map of r(n)=1_A*1_A(n) for cubes up to a large bound.',
//     lim_n: LIM,
//     max_representation_count_found: bestR,
//     argmax_n_found: bestN,
//     counts_with_r_at_least_2: over1,
//     counts_with_r_at_least_3: over2,
//     counts_with_r_at_least_4: over3,
//     log_scale_ratio_max_r_over_log_lim: Number((bestR / Math.log(LIM)).toPrecision(7)),
//   };
// }
// ==== End Batch Split Integrations ====
