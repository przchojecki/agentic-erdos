#!/usr/bin/env node
const meta={problem:'EP-955',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-955 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch21_quick_compute.mjs | preimage-density probes for sparse target sets A under s(n)=sigma(n)-n. ----
// // EP-955: preimage-density probes for sparse target sets A under s(n)=sigma(n)-n.
// {
//   const N = 1_000_000;
//   const sigma = new Uint32Array(N + 1);
//   for (let d = 1; d <= N; d += 1) {
//     for (let m = d; m <= N; m += d) sigma[m] += d;
//   }
// 
//   const svals = new Uint32Array(N + 1);
//   let maxS = 0;
//   for (let n = 1; n <= N; n += 1) {
//     const v = sigma[n] - n;
//     svals[n] = v;
//     if (v > maxS) maxS = v;
//   }
// 
//   const { isPrime } = sievePrimes(maxS + 5);
// 
//   const isPow2 = new Uint8Array(maxS + 1);
//   for (let x = 1; x <= maxS; x <<= 1) isPow2[x] = 1;
// 
//   const isSquare = new Uint8Array(maxS + 1);
//   for (let a = 0; a * a <= maxS; a += 1) isSquare[a * a] = 1;
// 
//   const isSum2Sq = new Uint8Array(maxS + 1);
//   const lim = Math.floor(Math.sqrt(maxS));
//   for (let a = 0; a <= lim; a += 1) {
//     const a2 = a * a;
//     for (let b = 0; a2 + b * b <= maxS; b += 1) {
//       isSum2Sq[a2 + b * b] = 1;
//     }
//   }
// 
//   let cPrime = 0;
//   let cPow2 = 0;
//   let cSquare = 0;
//   let cSum2Sq = 0;
// 
//   const scales = new Set([100_000, 200_000, 500_000, 1_000_000]);
//   const rows = [];
// 
//   for (let n = 1; n <= N; n += 1) {
//     const s = svals[n];
//     if (isPrime[s]) cPrime += 1;
//     if (isPow2[s]) cPow2 += 1;
//     if (isSquare[s]) cSquare += 1;
//     if (isSum2Sq[s]) cSum2Sq += 1;
// 
//     if (scales.has(n)) {
//       rows.push({
//         x: n,
//         preimage_density_primes: Number((cPrime / n).toPrecision(7)),
//         preimage_density_powers_of_2: Number((cPow2 / n).toPrecision(7)),
//         preimage_density_squares: Number((cSquare / n).toPrecision(7)),
//         preimage_density_sums_of_two_squares: Number((cSum2Sq / n).toPrecision(7)),
//       });
//     }
//   }
// 
//   out.results.ep955 = {
//     description: 'Finite preimage-density profiles s^{-1}(A) for several explicit density-zero sets A.',
//     N,
//     max_s_n_over_range: maxS,
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
