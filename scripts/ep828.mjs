#!/usr/bin/env node
const meta={problem:'EP-828',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-828 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch19_quick_compute.mjs | counts of n with phi(n) | n+a. ----
// // EP-828: counts of n with phi(n) | n+a.
// {
//   const N = 500_000;
//   const phi = new Uint32Array(N + 1);
//   for (let i = 0; i <= N; i += 1) phi[i] = i;
//   for (let p = 2; p <= N; p += 1) {
//     if (phi[p] !== p) continue;
//     for (let k = p; k <= N; k += p) {
//       phi[k] -= Math.floor(phi[k] / p);
//     }
//   }
// 
//   const rows = [];
//   for (const a of [-8, -4, -1, 0, 1, 2, 3, 5, 8, 12]) {
//     let cnt = 0;
//     const first = [];
//     for (let n = 2; n <= N; n += 1) {
//       const ph = phi[n];
//       const v = n + a;
//       if (v % ph === 0) {
//         cnt += 1;
//         if (first.length < 12) first.push(n);
//       }
//     }
//     rows.push({
//       a,
//       N,
//       count_solutions_n_le_N: cnt,
//       first_12_solutions: first,
//       density: Number((cnt / N).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep828 = {
//     description: 'Finite density/count profile for divisibility phi(n) | n+a across shifts a.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
