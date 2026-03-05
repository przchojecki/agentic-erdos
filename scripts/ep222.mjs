#!/usr/bin/env node
const meta={problem:'EP-222',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-222 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch7_quick_compute.mjs | gaps between sums of two squares. ----
// // EP-222: gaps between sums of two squares.
// {
//   function sumsOfTwoSquaresMask(X) {
//     const mark = new Uint8Array(X + 1);
//     const r = Math.floor(Math.sqrt(X));
//     for (let a = 0; a <= r; a += 1) {
//       const aa = a * a;
//       for (let b = a; aa + b * b <= X; b += 1) {
//         mark[aa + b * b] = 1;
//       }
//     }
//     return mark;
//   }
// 
//   const rows = [];
//   for (const X of [200000, 500000, 1000000, 2000000, 5000000]) {
//     const mark = sumsOfTwoSquaresMask(X);
//     let prev = -1;
//     let maxGap = 0;
//     let start = 0;
//     for (let n = 0; n <= X; n += 1) {
//       if (!mark[n]) continue;
//       if (prev >= 0) {
//         const g = n - prev;
//         if (g > maxGap) {
//           maxGap = g;
//           start = prev;
//         }
//       }
//       prev = n;
//     }
//     rows.push({
//       X,
//       max_gap_observed: maxGap,
//       gap_starts_at: start,
//       max_gap_over_log_start: Number((maxGap / Math.log(Math.max(3, start))).toFixed(6)),
//       max_gap_over_log_div_sqrtloglog: Number((maxGap / (Math.log(Math.max(3, start)) / Math.sqrt(Math.log(Math.log(Math.max(5, start)))))).toFixed(6)),
//     });
//   }
// 
//   out.results.ep222 = {
//     description: 'Finite max-gap profile for integers representable as a sum of two squares.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
