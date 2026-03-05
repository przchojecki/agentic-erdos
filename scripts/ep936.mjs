#!/usr/bin/env node
const meta={problem:'EP-936',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-936 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch21_quick_compute.mjs | search for powerful values among 2^n±1 and n!±1 at finite range. ----
// // EP-936: search for powerful values among 2^n±1 and n!±1 at finite range.
// {
//   const { primes } = sievePrimes(1_100_000);
// 
//   const hits_pow2 = [];
//   for (let n = 2; n <= 40; n += 1) {
//     const a = 2 ** n - 1;
//     const b = 2 ** n + 1;
// 
//     const fa = factorNumber(a, primes);
//     const fb = factorNumber(b, primes);
// 
//     if (isPowerfulFromFactorization(fa, 2)) hits_pow2.push({ n, sign: '-', value: a });
//     if (isPowerfulFromFactorization(fb, 2)) hits_pow2.push({ n, sign: '+', value: b });
//   }
// 
//   const hits_fact = [];
//   let fact = 1;
//   for (let n = 1; n <= 13; n += 1) {
//     fact *= n;
//     if (n < 3) continue;
//     const a = fact - 1;
//     const b = fact + 1;
//     const fa = factorNumber(a, primes);
//     const fb = factorNumber(b, primes);
//     if (isPowerfulFromFactorization(fa, 2)) hits_fact.push({ n, sign: '-', value: a });
//     if (isPowerfulFromFactorization(fb, 2)) hits_fact.push({ n, sign: '+', value: b });
//   }
// 
//   out.results.ep936 = {
//     description: 'Finite exact factorization scan for powerful values in 2^n±1 and n!±1.',
//     scanned_ranges: {
//       pow2_n_range: [2, 40],
//       factorial_n_range: [3, 13],
//     },
//     powerful_hits_pow2: hits_pow2,
//     powerful_hits_factorial: hits_fact,
//   };
// }
// ==== End Batch Split Integrations ====
