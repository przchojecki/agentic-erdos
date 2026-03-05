#!/usr/bin/env node
const meta={problem:'EP-431',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-431 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch12_quick_compute.mjs | finite random sumset coverage proxy for primes. ----
// // EP-431: finite random sumset coverage proxy for primes.
// {
//   const X = 5000;
//   const M = 800;
//   const primesX = primes.filter((p) => p <= X);
// 
//   const rng = { x: 20260303 ^ 1201 };
// 
//   function coverageForSizes(sa, sb, trials) {
//     let best = 0;
//     let avg = 0;
// 
//     for (let t = 0; t < trials; t += 1) {
//       const A = sampleWithoutReplacement(M, sa, rng);
//       const B = sampleWithoutReplacement(M, sb, rng);
//       const sums = new Uint8Array(X + 1);
//       for (const a of A) {
//         for (const b of B) {
//           const s = a + b;
//           if (s <= X) sums[s] = 1;
//         }
//       }
//       let c = 0;
//       for (const p of primesX) if (sums[p]) c += 1;
//       const ratio = c / primesX.length;
//       avg += ratio;
//       if (ratio > best) best = ratio;
//     }
// 
//     return {
//       size_A: sa,
//       size_B: sb,
//       trials,
//       best_prime_coverage_ratio: Number(best.toPrecision(6)),
//       avg_prime_coverage_ratio: Number((avg / trials).toPrecision(6)),
//     };
//   }
// 
//   out.results.ep431 = {
//     description: 'Random finite sumset coverage of primes up to X by A+B with bounded A,B.',
//     X,
//     prime_count_up_to_X: primesX.length,
//     rows: [
//       coverageForSizes(12, 12, 250),
//       coverageForSizes(20, 20, 250),
//       coverageForSizes(30, 30, 250),
//       coverageForSizes(40, 40, 250),
//       coverageForSizes(50, 50, 250),
//     ],
//   };
// }
// ==== End Batch Split Integrations ====
