#!/usr/bin/env node
const meta={problem:'EP-257',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-257 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch8_quick_compute.mjs | partial sums for canonical infinite sets A. ----
// // EP-257: partial sums for canonical infinite sets A.
// {
//   function primePowers(limit) {
//     const { primes } = sieve(limit);
//     const set = new Set();
//     for (const p of primes) {
//       let v = p;
//       while (v <= limit) {
//         set.add(v);
//         if (v > Math.floor(limit / p)) break;
//         v *= p;
//       }
//     }
//     return [...set].sort((a, b) => a - b);
//   }
// 
//   function partialAhmes(A, L) {
//     let s = 0;
//     for (const n of A) {
//       if (n > L) break;
//       s += 1 / (2 ** n - 1);
//     }
//     return s;
//   }
// 
//   const L = 400;
//   const { primes } = sieve(L);
//   const families = [
//     { name: 'primes', A: primes },
//     { name: 'prime_powers', A: primePowers(L) },
//     { name: 'powers_of_2', A: Array.from({ length: 15 }, (_, i) => 2 ** i).filter((x) => x <= L) },
//     { name: 'squares', A: Array.from({ length: Math.floor(Math.sqrt(L)) }, (_, i) => (i + 1) ** 2) },
//   ];
// 
//   const rows = [];
//   for (const f of families) {
//     const s200 = partialAhmes(f.A, 200);
//     const s400 = partialAhmes(f.A, 400);
//     const best = bestRationalApprox(s400, 50000);
//     rows.push({
//       family: f.name,
//       terms_up_to_400: f.A.filter((x) => x <= 400).length,
//       partial_sum_L200: Number(s200.toPrecision(14)),
//       partial_sum_L400: Number(s400.toPrecision(14)),
//       delta_200_to_400: Number(Math.abs(s400 - s200).toExponential(4)),
//       best_rational_q_le_50000: `${best.p}/${best.q}`,
//       approx_error: Number(best.err.toExponential(4)),
//     });
//   }
// 
//   out.results.ep257 = {
//     description: 'Finite partial-sum profile of sum_{n in A} 1/(2^n-1) for representative infinite sets A.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
