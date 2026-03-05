#!/usr/bin/env node
const meta={problem:'EP-1063',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1063 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch24_quick_compute.mjs | finite exact n_k for small k. ----
// // EP-1063: finite exact n_k for small k.
// {
//   function binomBig(n, k) {
//     const kk = Math.min(k, n - k);
//     let r = 1n;
//     for (let i = 1; i <= kk; i += 1) {
//       r = (r * BigInt(n - kk + i)) / BigInt(i);
//     }
//     return r;
//   }
// 
//   const rows = [];
//   for (let k = 2; k <= 12; k += 1) {
//     let foundN = null;
//     let failIndex = null;
//     for (let n = 2 * k; n <= 6000; n += 1) {
//       const b = binomBig(n, k);
//       let fails = 0;
//       let fi = -1;
//       for (let i = 0; i < k; i += 1) {
//         if (b % BigInt(n - i) !== 0n) {
//           fails += 1;
//           fi = i;
//         }
//       }
//       if (fails === 1) {
//         foundN = n;
//         failIndex = fi;
//         break;
//       }
//     }
//     rows.push({
//       k,
//       n_k_found: foundN,
//       failing_i_for_nk: failIndex,
//       n_k_over_k: foundN ? Number((foundN / k).toPrecision(7)) : null,
//     });
//   }
// 
//   out.results.ep1063 = {
//     description: 'Finite exact search for n_k where exactly one divisibility failure occurs among n-i | C(n,k).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
