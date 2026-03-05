#!/usr/bin/env node
const meta={problem:'EP-1074',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1074 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch24_quick_compute.mjs | finite S,P profiles from prime congruence hits of m!+1. ----
// // EP-1074: finite S,P profiles from prime congruence hits of m!+1.
// {
//   const LIMIT = 30_000;
//   const { isPrime, primes } = sievePrimes(LIMIT);
//   const S = new Set();
//   const P = new Set();
// 
//   for (const p of primes) {
//     if (p <= 3) continue;
//     let fac = 1 % p;
//     for (let m = 1; m < p; m += 1) {
//       fac = (fac * m) % p;
//       if (fac === p - 1) {
//         if (p % m !== 1) {
//           S.add(m);
//           P.add(p);
//           break;
//         }
//       }
//       if (fac === 0) break;
//     }
//   }
// 
//   const rowsS = [];
//   for (const x of [200, 500, 1000, 2000, 5000]) {
//     let c = 0;
//     for (const m of S) if (m <= x) c += 1;
//     rowsS.push({ x, count_S_intersect_1_to_x: c, density: Number((c / x).toPrecision(7)) });
//   }
// 
//   const rowsP = [];
//   for (const x of [5000, 10000, 20000, 30000]) {
//     let c = 0;
//     let pi = 0;
//     for (const p of primes) {
//       if (p > x) break;
//       pi += 1;
//       if (P.has(p)) c += 1;
//     }
//     rowsP.push({ x, count_P_intersect_primes_to_x: c, pi_x: pi, proportion_in_primes: Number((c / pi).toPrecision(7)) });
//   }
// 
//   out.results.ep1074 = {
//     description: 'Finite density proxy for EHS-number set S and Pillai-prime set P from p<=30,000 scans.',
//     LIMIT,
//     sample_small_S: [...S].sort((a, b) => a - b).slice(0, 24),
//     sample_small_P: [...P].sort((a, b) => a - b).slice(0, 24),
//     rows_S: rowsS,
//     rows_P: rowsP,
//   };
// }
// ==== End Batch Split Integrations ====
