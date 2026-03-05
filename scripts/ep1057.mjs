#!/usr/bin/env node
const meta={problem:'EP-1057',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1057 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch23_quick_compute.mjs | Carmichael counting profile. ----
// // EP-1057: Carmichael counting profile.
// {
//   const X = 1_000_000;
//   const probes = new Set([100_000, 200_000, 400_000, 700_000, 1_000_000]);
//   const rows = [];
//   const samples = [];
//   let count = 0;
// 
//   for (let n = 3; n <= X; n += 1) {
//     if (spf[n] === n) {
//       if (probes.has(n)) {
//         rows.push({
//           x: n,
//           C_x: count,
//           C_over_x: Number((count / n).toPrecision(7)),
//           logC_over_logx: count > 1 ? Number((Math.log(count) / Math.log(n)).toPrecision(7)) : 0,
//         });
//       }
//       continue;
//     }
// 
//     let x = n;
//     let sqfree = true;
//     const facts = [];
//     while (x > 1) {
//       const p = spf[x] || x;
//       let e = 0;
//       while (x % p === 0) {
//         x = Math.floor(x / p);
//         e += 1;
//       }
//       if (e > 1) {
//         sqfree = false;
//         break;
//       }
//       facts.push(p);
//     }
//     if (!sqfree || facts.length < 3) {
//       if (probes.has(n)) {
//         rows.push({
//           x: n,
//           C_x: count,
//           C_over_x: Number((count / n).toPrecision(7)),
//           logC_over_logx: count > 1 ? Number((Math.log(count) / Math.log(n)).toPrecision(7)) : 0,
//         });
//       }
//       continue;
//     }
// 
//     let ok = true;
//     for (const p of facts) {
//       if ((n - 1) % (p - 1) !== 0) {
//         ok = false;
//         break;
//       }
//     }
//     if (ok) {
//       count += 1;
//       if (samples.length < 20) samples.push(n);
//     }
// 
//     if (probes.has(n)) {
//       rows.push({
//         x: n,
//         C_x: count,
//         C_over_x: Number((count / n).toPrecision(7)),
//         logC_over_logx: count > 1 ? Number((Math.log(count) / Math.log(n)).toPrecision(7)) : 0,
//       });
//     }
//   }
// 
//   out.results.ep1057 = {
//     description: 'Finite Carmichael count using Korselt criterion (squarefree + p-1 | n-1 for all p|n).',
//     X,
//     rows,
//     first_carmichael_numbers_in_scan: samples,
//   };
// }
// ==== End Batch Split Integrations ====
