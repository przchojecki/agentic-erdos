#!/usr/bin/env node
const meta={problem:'EP-354',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-354 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch10_quick_compute.mjs | finite completeness proxy for floor(alpha*2^k), floor(beta*2^k). ----
// // EP-354: finite completeness proxy for floor(alpha*2^k), floor(beta*2^k).
// {
//   function floorSeq(alpha, K) {
//     const arr = [];
//     for (let k = 0; k <= K; k += 1) arr.push(Math.floor(alpha * (2 ** k)));
//     return arr;
//   }
// 
//   function contiguousReachFromMultiset(values) {
//     const v = [...values].filter((x) => x > 0).sort((a, b) => a - b);
//     let reach = 0;
//     for (const x of v) {
//       if (x > reach + 1) break;
//       reach += x;
//     }
//     return reach;
//   }
// 
//   const cases = [
//     { name: 'irr_ratio_sqrt2_sqrt3', alpha: Math.SQRT2, beta: Math.sqrt(3) },
//     { name: 'irr_ratio_pi_e', alpha: Math.PI, beta: Math.E },
//     { name: 'power2_related_alpha1.5_beta6', alpha: 1.5, beta: 6.0 },
//   ];
// 
//   const rows = [];
//   for (const c of cases) {
//     const row = { case: c.name, rows: [] };
//     for (const K of [10, 12, 14, 16]) {
//       const s1 = floorSeq(c.alpha, K);
//       const s2 = floorSeq(c.beta, K);
//       const reach = contiguousReachFromMultiset([...s1, ...s2]);
//       row.rows.push({
//         K,
//         terms_total: s1.length + s2.length,
//         min_term: Math.min(...s1, ...s2),
//         max_term: Math.max(...s1, ...s2),
//         contiguous_reach_from_1: reach,
//       });
//     }
//     rows.push(row);
//   }
// 
//   out.results.ep354 = {
//     description: 'Contiguous subset-sum reach proxy for two floor-doubling sequences.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
