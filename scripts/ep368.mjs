#!/usr/bin/env node
const meta={problem:'EP-368',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-368 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch11_quick_compute.mjs | largest prime factor of n(n+1). ----
// // EP-368: largest prime factor of n(n+1).
// {
//   const milestones = [10_000, 100_000, 500_000, 1_000_000, 2_000_000, 3_000_000];
//   const mset = new Set(milestones);
//   const rows = [];
// 
//   let minF = Number.POSITIVE_INFINITY;
//   let maxF = 0;
//   let cntLeLog2 = 0;
// 
//   for (let n = 2; n <= LIMIT; n += 1) {
//     const F = lpf[n] > lpf[n + 1] ? lpf[n] : lpf[n + 1];
//     if (F < minF) minF = F;
//     if (F > maxF) maxF = F;
// 
//     const t = Math.log(n) ** 2;
//     if (F <= t) cntLeLog2 += 1;
// 
//     if (mset.has(n)) {
//       rows.push({
//         X: n,
//         min_F_up_to_X: minF,
//         max_F_up_to_X: maxF,
//         count_n_with_F_le_log2_up_to_X: cntLeLog2,
//         proportion_F_le_log2: Number((cntLeLog2 / (n - 1)).toPrecision(6)),
//       });
//     }
//   }
// 
//   out.results.ep368 = {
//     description: 'Finite behavior of F(n)=P(n(n+1)) relative to logarithmic scales.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
