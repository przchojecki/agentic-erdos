#!/usr/bin/env node
const meta={problem:'EP-1005',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1005 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch22_quick_compute.mjs | exact finite f(n) from Farey sequences via similarly-ordered run lengths. ----
// // EP-1005: exact finite f(n) from Farey sequences via similarly-ordered run lengths.
// {
//   const rows = [];
//   for (const n of [40, 60, 80, 120, 160, 200, 240]) {
//     const { numer, denom } = fareySequence(n);
//     const runLen = longestSimilarOrderRunLength(numer, denom);
//     const f = runLen - 1;
//     rows.push({
//       n,
//       farey_length: numer.length,
//       f_n_exact_in_this_computation: f,
//       f_over_n: Number((f / n).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep1005 = {
//     description: 'Exact finite computation of similarly-ordered local window lengths in Farey sequences.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
