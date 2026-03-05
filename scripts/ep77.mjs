#!/usr/bin/env node
const meta={problem:'EP-77',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-77 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch3_quick_compute.mjs | explicit lower/upper kth-root bound windows from classic bounds. ----
// // EP-77: explicit lower/upper kth-root bound windows from classic bounds.
// {
//   const rows = [];
//   for (let k = 3; k <= 20; k += 1) {
//     let n = 2;
//     let best = 1;
//     while (true) {
//       const comb = Number(chooseBigInt(n, k));
//       const expect = comb * 2 ** (1 - (k * (k - 1)) / 2);
//       if (expect < 1) {
//         best = n;
//         n += 1;
//       } else break;
//     }
//     const upper = Number(chooseBigInt(2 * k - 2, k - 1));
//     rows.push({
//       k,
//       probabilistic_nonconstructive_lower_n: best,
//       lower_root: Number(best ** (1 / k)).toFixed(6),
//       erdos_szekeres_upper_n: upper,
//       upper_root: Number(upper ** (1 / k)).toFixed(6),
//     });
//   }
//   out.results.ep77 = {
//     description: 'kth-root windows from classic diagonal Ramsey lower/upper bounds.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
