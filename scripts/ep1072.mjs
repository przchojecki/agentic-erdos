#!/usr/bin/env node
const meta={problem:'EP-1072',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1072 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch24_quick_compute.mjs | finite profile of f(p), the least n with n! ≡ -1 mod p. ----
// // EP-1072: finite profile of f(p), the least n with n! ≡ -1 mod p.
// {
//   const LIMIT = 50_000;
//   const { isPrime, primes } = sievePrimes(LIMIT);
//   const probeX = [5_000, 10_000, 20_000, 35_000, 50_000];
//   let ptr = 0;
// 
//   let pi = 0;
//   let countFpEqPminus1 = 0;
//   let avgRatio = 0;
//   const rows = [];
//   const smallSamples = [];
// 
//   for (const p of primes) {
//     if (p <= 3) continue;
//     pi += 1;
//     let fac = 1 % p;
//     let f = p - 1;
//     for (let n = 1; n < p; n += 1) {
//       fac = (fac * n) % p;
//       if (fac === p - 1) {
//         f = n;
//         break;
//       }
//       if (fac === 0) break;
//     }
//     if (f === p - 1) countFpEqPminus1 += 1;
//     avgRatio += f / p;
//     if (smallSamples.length < 20) smallSamples.push({ p, f_p: f, ratio: Number((f / p).toPrecision(7)) });
// 
//     while (ptr < probeX.length && p >= probeX[ptr]) {
//       rows.push({
//         x: probeX[ptr],
//         pi_x: pi,
//         count_f_p_eq_p_minus_1: countFpEqPminus1,
//         proportion_f_p_eq_p_minus_1: Number((countFpEqPminus1 / pi).toPrecision(7)),
//         mean_f_over_p_up_to_x: Number((avgRatio / pi).toPrecision(7)),
//       });
//       ptr += 1;
//     }
//   }
// 
//   out.results.ep1072 = {
//     description: 'Finite exact computation of f(p) by modular factorial scan for primes p<=50,000.',
//     LIMIT,
//     sample_rows_small_primes: smallSamples,
//     probe_rows: rows,
//   };
// }
// ==== End Batch Split Integrations ====
