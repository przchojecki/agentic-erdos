#!/usr/bin/env node
const meta={problem:'EP-1060',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1060 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch23_quick_compute.mjs | multiplicity profile for values n = k * sigma(k). ----
// // EP-1060: multiplicity profile for values n = k * sigma(k).
// {
//   const K = 300_000;
//   const cnt = new Map();
//   let maxMult = 0;
//   let argN = null;
// 
//   for (let k = 1; k <= K; k += 1) {
//     const n = k * sigma[k];
//     const c = (cnt.get(n) || 0) + 1;
//     cnt.set(n, c);
//     if (c > maxMult) {
//       maxMult = c;
//       argN = n;
//     }
//   }
// 
//   const top = [...cnt.entries()]
//     .sort((a, b) => b[1] - a[1] || a[0] - b[0])
//     .slice(0, 12)
//     .map(([n, c]) => ({ n, multiplicity: c }));
// 
//   let maxSmall = 0;
//   for (const [n, c] of cnt.entries()) if (n <= 65536 && c > maxSmall) maxSmall = c;
// 
//   out.results.ep1060 = {
//     description: 'Finite multiplicity profile of the map k -> k*sigma(k).',
//     K,
//     max_multiplicity_found: maxMult,
//     first_n_at_max_multiplicity: argN,
//     max_multiplicity_for_n_le_2_pow_16: maxSmall,
//     top_rows: top,
//   };
// }
// ==== End Batch Split Integrations ====
