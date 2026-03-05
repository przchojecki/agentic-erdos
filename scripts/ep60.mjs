#!/usr/bin/env node
const meta={problem:'EP-60',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-60 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch2_quick_compute.mjs | small-n random search at ex(n,C4)+1 edge level. ----
// // EP-60: small-n random search at ex(n,C4)+1 edge level.
// {
//   // ex(n,C4) for n=1..39 from OEIS A006855 small exact values.
//   const exSmall = [
//     0, // n=1
//     1, 3, 4, 6, 7, 9, 11, 13, 16, 18, 21, 24, 27, 30, 33, 36, 39, 42, 46,
//     50, 52, 56, 59, 63, 67, 71, 76, 80, 85, 90, 92, 96, 102, 106, 110, 113, 117, 122,
//   ];
//   const nList = [20, 24, 28, 32, 36];
//   const rows = [];
//   for (const n of nList) {
//     const ex = exSmall[n - 1];
//     const m = ex + 1;
//     let best = Infinity;
//     const trials = 320;
//     for (let t = 0; t < trials; t += 1) {
//       const g = randomGraphWithEdges(n, m, rng);
//       const c4 = countC4InGraph(n, g);
//       if (c4 < best) best = c4;
//     }
//     rows.push({
//       n,
//       ex_n_C4_assumed_exact_small_n: ex,
//       tested_edges: m,
//       random_trials: trials,
//       min_C4_found: best,
//       min_C4_over_sqrt_n: Number((best / Math.sqrt(n)).toFixed(6)),
//     });
//   }
//   out.results.ep60 = {
//     description: 'Small-n random lower-envelope search for C4 counts at ex(n,C4)+1 edges.',
//     rows,
//     caveat: 'Uses known small exact ex(n,C4) table values only for n<=39.',
//   };
// }
// ==== End Batch Split Integrations ====
