#!/usr/bin/env node
const meta={problem:'EP-1095',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1095 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch25_quick_compute.mjs | finite exact g(k) values for small k. ----
// // EP-1095: finite exact g(k) values for small k.
// {
//   const KMAX = 36;
//   const N_CAP = 80_000;
//   const { primes } = sievePrimes(Math.max(KMAX, N_CAP));
// 
//   const rows = [];
//   for (let k = 2; k <= KMAX; k += 1) {
//     let gk = null;
//     for (let n = k + 2; n <= N_CAP; n += 1) {
//       let hasSmallPrime = false;
//       for (const p of primes) {
//         if (p > k) break;
//         if (vpBinom(n, k, p) > 0) {
//           hasSmallPrime = true;
//           break;
//         }
//       }
//       if (!hasSmallPrime) {
//         gk = n;
//         break;
//       }
//     }
//     rows.push({
//       k,
//       g_k_found: gk,
//       found_within_cap: gk !== null,
//       ratio_log_g_over_k_over_logk: gk && k > 2 ? Number((Math.log(gk) / (k / Math.log(k))).toPrecision(7)) : null,
//     });
//   }
// 
//   out.results.ep1095 = {
//     description: 'Finite exact search for g(k): first n with all prime divisors of C(n,k) exceeding k.',
//     KMAX,
//     N_CAP,
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
