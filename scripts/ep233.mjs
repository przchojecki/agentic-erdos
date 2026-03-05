#!/usr/bin/env node
const meta={problem:'EP-233',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-233 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch7_quick_compute.mjs | second moment of prime gaps. ----
// // EP-233: second moment of prime gaps.
// {
//   const Nmax = 500000;
//   const lim = 8000000;
//   const { primes } = sieve(lim);
// 
//   const rows = [];
//   let S = 0;
//   let ptr = 1;
//   const checkpoints = new Set([10000, 50000, 100000, 200000, 500000]);
// 
//   while (ptr <= Nmax && ptr < primes.length) {
//     const d = primes[ptr] - primes[ptr - 1];
//     S += d * d;
//     if (checkpoints.has(ptr)) {
//       const N = ptr;
//       const pN = primes[ptr - 1];
//       rows.push({
//         N,
//         p_N: pN,
//         sum_d_n_sq: S,
//         ratio_over_N_logN_sq: Number((S / (N * Math.log(N) ** 2)).toFixed(6)),
//         ratio_over_N_logpN_sq: Number((S / (N * Math.log(pN) ** 2)).toFixed(6)),
//       });
//     }
//     ptr += 1;
//   }
// 
//   out.results.ep233 = {
//     description: 'Finite profile for sum_{n<=N} (p_{n+1}-p_n)^2.',
//     sieve_limit: lim,
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
