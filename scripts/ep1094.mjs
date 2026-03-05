#!/usr/bin/env node
const meta={problem:'EP-1094',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1094 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch25_quick_compute.mjs | finite exception scan for least prime factor of C(n,k). ----
// // EP-1094: finite exception scan for least prime factor of C(n,k).
// {
//   const NMAX = 420;
//   const { primes } = sievePrimes(NMAX);
// 
//   const exceptions = [];
//   let tested = 0;
//   for (let n = 4; n <= NMAX; n += 1) {
//     for (let k = 2; k <= Math.floor(n / 2); k += 1) {
//       if (n < 2 * k) continue;
//       tested += 1;
//       const lp = leastPrimeFactorBinom(n, k, primes);
//       const bound = Math.max(n / k, k);
//       if (lp > bound + 1e-12) exceptions.push({ n, k, least_prime_factor: lp, bound });
//     }
//   }
// 
//   out.results.ep1094 = {
//     description: 'Finite exact scan of least prime factor condition for binomial coefficients.',
//     NMAX,
//     tested_pairs_n_k: tested,
//     exception_count: exceptions.length,
//     exception_sample_first_30: exceptions.slice(0, 30),
//   };
// }
// ==== End Batch Split Integrations ====
