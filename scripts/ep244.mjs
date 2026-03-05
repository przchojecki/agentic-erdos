#!/usr/bin/env node
const meta={problem:'EP-244',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-244 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch8_quick_compute.mjs | density of p + floor(C^k) in finite ranges. ----
// // EP-244: density of p + floor(C^k) in finite ranges.
// {
//   const X = 200000;
//   const { isPrime } = sieve(X);
// 
//   function shiftsForC(C, Xmax) {
//     const s = new Set();
//     let v = 1;
//     for (let k = 0; k < 200; k += 1) {
//       const f = Math.floor(v);
//       if (f > Xmax) break;
//       s.add(f);
//       v *= C;
//       if (!Number.isFinite(v)) break;
//     }
//     return [...s].sort((a, b) => a - b);
//   }
// 
//   function densityForC(C) {
//     const shifts = shiftsForC(C, X);
//     const mark = new Uint8Array(X + 1);
//     for (let n = 1; n <= X; n += 1) {
//       let ok = false;
//       for (const s of shifts) {
//         if (s >= n) break;
//         if (isPrime[n - s]) {
//           ok = true;
//           break;
//         }
//       }
//       if (ok) mark[n] = 1;
//     }
//     let all = 0;
//     let tail = 0;
//     const L = Math.floor(X / 2);
//     for (let n = 1; n <= X; n += 1) {
//       all += mark[n];
//       if (n >= L) tail += mark[n];
//     }
//     return {
//       C: Number(C.toFixed(6)),
//       shifts_count: shifts.length,
//       density_1_to_X: Number((all / X).toFixed(6)),
//       density_tail_half: Number((tail / (X - L + 1)).toFixed(6)),
//     };
//   }
// 
//   const rows = [1.3, Math.sqrt(2), (1 + Math.sqrt(5)) / 2, Math.PI, 2, 3].map(densityForC);
// 
//   out.results.ep244 = {
//     description: 'Finite density profile for representations n = p + floor(C^k).',
//     X,
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
