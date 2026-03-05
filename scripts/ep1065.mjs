#!/usr/bin/env node
const meta={problem:'EP-1065',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1065 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch24_quick_compute.mjs | finite counts of primes p=2^a q+1 and p=2^a 3^b q+1 (q prime). ----
// // EP-1065: finite counts of primes p=2^a q+1 and p=2^a 3^b q+1 (q prime).
// {
//   const LIMIT = 2_000_000;
//   const { isPrime, primes } = sievePrimes(LIMIT);
// 
//   let c1 = 0;
//   let c2 = 0;
//   let pi = 0;
//   const probeX = [100_000, 300_000, 700_000, 1_200_000, 2_000_000];
//   let ptr = 0;
//   const rows = [];
// 
//   for (const p of primes) {
//     if (p < 3) continue;
//     pi += 1;
//     let n = p - 1;
// 
//     let ok1 = false;
//     let t = n;
//     while (t % 2 === 0) {
//       t /= 2;
//       if (t > 1 && isPrime[t]) {
//         ok1 = true;
//         break;
//       }
//     }
//     if (ok1) c1 += 1;
// 
//     let ok2 = false;
//     let a = n;
//     while (a % 2 === 0) {
//       a /= 2;
//       let b = a;
//       while (b % 3 === 0) {
//         b /= 3;
//         if (b > 1 && isPrime[b]) {
//           ok2 = true;
//           break;
//         }
//       }
//       if (ok2) break;
//     }
//     if (ok2) c2 += 1;
// 
//     while (ptr < probeX.length && p >= probeX[ptr]) {
//       rows.push({
//         x: probeX[ptr],
//         pi_x: pi,
//         count_2a_q_plus_1: c1,
//         count_2a3b_q_plus_1: c2,
//         density_2a_q_plus_1_among_primes: Number((c1 / pi).toPrecision(7)),
//         density_2a3b_q_plus_1_among_primes: Number((c2 / pi).toPrecision(7)),
//       });
//       ptr += 1;
//     }
//   }
// 
//   out.results.ep1065 = {
//     description: 'Finite prime-count profile for the forms p=2^a q+1 and p=2^a 3^b q+1 with q prime.',
//     LIMIT,
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
