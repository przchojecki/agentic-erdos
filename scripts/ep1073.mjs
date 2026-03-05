#!/usr/bin/env node
const meta={problem:'EP-1073',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1073 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch24_quick_compute.mjs | finite count A(x) for composite u with n! ≡ -1 mod u for some n. ----
// // EP-1073: finite count A(x) for composite u with n! ≡ -1 mod u for some n.
// {
//   const X = 12_000;
//   const { isPrime } = sievePrimes(X);
//   const probes = [2_000, 4_000, 6_000, 8_000, 10_000, 12_000];
//   let ptr = 0;
// 
//   let A = 0;
//   const firstHits = [];
//   const rows = [];
// 
//   for (let u = 4; u <= X; u += 1) {
//     if (isPrime[u]) {
//       while (ptr < probes.length && u >= probes[ptr]) {
//         rows.push({ x: probes[ptr], A_x: A, A_over_x: Number((A / probes[ptr]).toPrecision(7)) });
//         ptr += 1;
//       }
//       continue;
//     }
// 
//     let fac = 1 % u;
//     let ok = false;
//     for (let n = 1; n < u; n += 1) {
//       fac = (fac * n) % u;
//       if (fac === u - 1) {
//         ok = true;
//         break;
//       }
//       if (fac === 0) break;
//     }
//     if (ok) {
//       A += 1;
//       if (firstHits.length < 24) firstHits.push(u);
//     }
// 
//     while (ptr < probes.length && u >= probes[ptr]) {
//       rows.push({ x: probes[ptr], A_x: A, A_over_x: Number((A / probes[ptr]).toPrecision(7)) });
//       ptr += 1;
//     }
//   }
// 
//   out.results.ep1073 = {
//     description: 'Finite composite-modulus scan for existence of n with n! ≡ -1 (mod u).',
//     X,
//     first_hits: firstHits,
//     probe_rows: rows,
//   };
// }
// ==== End Batch Split Integrations ====
