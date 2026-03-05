#!/usr/bin/env node
const meta={problem:'EP-322',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-322 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch10_quick_compute.mjs | finite max multiplicity profile of representations by k k-th powers. ----
// // EP-322: finite max multiplicity profile of representations by k k-th powers.
// {
//   const rows = [];
// 
//   {
//     const N = 200000;
//     const { cnt, vals } = repCounts3Powers(3, N);
//     let maxRep = 0;
//     let argMax = 0;
//     let witness = 0;
//     for (let n = 1; n <= N; n += 1) {
//       if (cnt[n] > maxRep) {
//         maxRep = cnt[n];
//         argMax = n;
//       }
//       if (cnt[n] > n ** 0.1) witness += 1;
//     }
//     rows.push({
//       k: 3,
//       N,
//       basis_values_count: vals.length,
//       max_representation_count: maxRep,
//       argmax_n: argMax,
//       max_over_N_pow_0_1: Number((maxRep / (N ** 0.1)).toPrecision(6)),
//       count_n_with_r_n_gt_n_pow_0_1: witness,
//     });
//   }
// 
//   {
//     const N = 350000;
//     const { cnt, vals } = repCounts4Powers(4, N);
//     let maxRep = 0;
//     let argMax = 0;
//     let witness = 0;
//     for (let n = 1; n <= N; n += 1) {
//       if (cnt[n] > maxRep) {
//         maxRep = cnt[n];
//         argMax = n;
//       }
//       if (cnt[n] > n ** 0.05) witness += 1;
//     }
//     rows.push({
//       k: 4,
//       N,
//       basis_values_count: vals.length,
//       max_representation_count: maxRep,
//       argmax_n: argMax,
//       max_over_N_pow_0_05: Number((maxRep / (N ** 0.05)).toPrecision(6)),
//       count_n_with_r_n_gt_n_pow_0_05: witness,
//     });
//   }
// 
//   out.results.ep322 = {
//     description: 'Finite representation-multiplicity profile for sums of k many k-th powers (small k).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
