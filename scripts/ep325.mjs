#!/usr/bin/env node
const meta={problem:'EP-325',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-325 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch10_quick_compute.mjs | finite profile of f_{k,3}(x), count of <=x representable as sum of three k-th powers. ----
// // EP-325: finite profile of f_{k,3}(x), count of <=x representable as sum of three k-th powers.
// {
//   function fProfile(k, Xmax, milestones) {
//     const { cnt } = repCounts3Powers(k, Xmax);
//     const rows = [];
//     for (const X of milestones) {
//       let f = 0;
//       for (let n = 0; n <= X; n += 1) if (cnt[n] > 0) f += 1;
//       rows.push({
//         k,
//         X,
//         f_k3_X: f,
//         ratio_over_X_pow_3_over_k: Number((f / (X ** (3 / k))).toPrecision(6)),
//         density: Number((f / X).toPrecision(6)),
//       });
//     }
//     return rows;
//   }
// 
//   out.results.ep325 = {
//     description: 'Finite coverage profile f_{k,3}(X) for sums of three nonnegative k-th powers.',
//     rows: [
//       ...fProfile(3, 200000, [20000, 50000, 100000, 200000]),
//       ...fProfile(4, 300000, [30000, 80000, 150000, 300000]),
//       ...fProfile(5, 400000, [40000, 100000, 200000, 400000]),
//     ],
//   };
// }
// ==== End Batch Split Integrations ====
