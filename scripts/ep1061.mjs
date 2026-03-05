#!/usr/bin/env node
const meta={problem:'EP-1061',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1061 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch23_quick_compute.mjs | finite count of sigma(a)+sigma(b)=sigma(a+b), unordered pairs. ----
// // EP-1061: finite count of sigma(a)+sigma(b)=sigma(a+b), unordered pairs.
// {
//   const X = 12_000;
//   const probes = new Set([2_000, 4_000, 6_000, 8_000, 10_000, 12_000]);
//   let total = 0;
//   const rows = [];
// 
//   for (let c = 2; c <= X; c += 1) {
//     const target = sigma[c];
//     for (let a = 1; a <= Math.floor((c - 1) / 2); a += 1) {
//       const b = c - a;
//       if (sigma[a] + sigma[b] === target) total += 1;
//     }
//     if (probes.has(c)) {
//       rows.push({
//         x: c,
//         unordered_solution_count_up_to_x: total,
//         count_over_x: Number((total / c).toPrecision(7)),
//       });
//     }
//   }
// 
//   out.results.ep1061 = {
//     description: 'Finite count profile for sigma(a)+sigma(b)=sigma(a+b) with a+b<=x (unordered pairs a<b).',
//     X,
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
