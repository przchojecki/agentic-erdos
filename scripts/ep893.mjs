#!/usr/bin/env node
const meta={problem:'EP-893',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-893 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch20_quick_compute.mjs | exact tau(2^k-1) for feasible k by trial division. ----
// // EP-893: exact tau(2^k-1) for feasible k by trial division.
// {
//   const KMAX = 44;
//   const maxM = (1n << BigInt(KMAX)) - 1n;
//   const sqrtMax = Math.floor(Math.sqrt(Number(maxM)));
//   const { primes } = sievePrimes(sqrtMax + 5);
// 
//   function tauBigByTrial(n0) {
//     let n = n0;
//     let tau = 1;
//     for (const p of primes) {
//       const pb = BigInt(p);
//       if (pb * pb > n) break;
//       let e = 0;
//       while (n % pb === 0n) {
//         n /= pb;
//         e += 1;
//       }
//       if (e > 0) tau *= (e + 1);
//     }
//     if (n > 1n) tau *= 2;
//     return tau;
//   }
// 
//   const tauVals = [];
//   for (let k = 1; k <= KMAX; k += 1) {
//     const m = (1n << BigInt(k)) - 1n;
//     const t = tauBigByTrial(m);
//     tauVals.push(t);
//   }
// 
//   const f = [0];
//   for (let i = 1; i <= KMAX; i += 1) f[i] = f[i - 1] + tauVals[i - 1];
// 
//   const rows = [];
//   for (let n = 2; 2 * n <= KMAX; n += 1) {
//     rows.push({
//       n,
//       f_n: f[n],
//       f_2n: f[2 * n],
//       ratio_f_2n_over_f_n: Number((f[2 * n] / f[n]).toPrecision(8)),
//     });
//   }
// 
//   let minRatio = 1e9;
//   let maxRatio = 0;
//   for (const r of rows) {
//     if (r.ratio_f_2n_over_f_n < minRatio) minRatio = r.ratio_f_2n_over_f_n;
//     if (r.ratio_f_2n_over_f_n > maxRatio) maxRatio = r.ratio_f_2n_over_f_n;
//   }
// 
//   out.results.ep893 = {
//     description: 'Exact finite prefix ratio profile for f(2n)/f(n) using tau(2^k-1) up to k=44.',
//     KMAX,
//     min_ratio_in_tested_range: minRatio,
//     max_ratio_in_tested_range: maxRatio,
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
