#!/usr/bin/env node
const meta={problem:'EP-387',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-387 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch11_quick_compute.mjs | finite interval-divisor profile for C(n,k). ----
// // EP-387: finite interval-divisor profile for C(n,k).
// {
//   const N = 600;
//   const KMAX = 20;
//   const cVals = [0.3, 0.4, 0.5];
// 
//   let failNK = 0;
//   const failC = new Map(cVals.map((c) => [c, 0]));
//   let totalPairs = 0;
// 
//   let minBestRatio = 1;
//   let minBestWitness = null;
// 
//   const milestones = [150, 300, 450, 600];
//   const rows = [];
// 
//   for (let n = 2; n <= N; n += 1) {
//     let minRatioAtN = 1;
// 
//     for (let k = 1; k <= Math.min(KMAX, n - 1); k += 1) {
//       totalPairs += 1;
// 
//       const vp = new Map();
//       for (const p of primesAll) {
//         if (p > n) break;
//         const e = vpFact(n, p) - vpFact(k, p) - vpFact(n - k, p);
//         if (e > 0) vp.set(p, e);
//       }
// 
//       function divides(d) {
//         let x = d;
//         while (x > 1) {
//           const p = spf[x];
//           let e = 0;
//           while (x % p === 0) {
//             x = Math.floor(x / p);
//             e += 1;
//           }
//           if ((vp.get(p) || 0) < e) return false;
//         }
//         return true;
//       }
// 
//       // Strong interval (n-k, n].
//       let hasNK = false;
//       for (let d = n; d > n - k; d -= 1) {
//         if (divides(d)) {
//           hasNK = true;
//           break;
//         }
//       }
//       if (!hasNK) failNK += 1;
// 
//       // c-interval checks.
//       for (const c of cVals) {
//         const lo = Math.floor(c * n);
//         let hasC = false;
//         for (let d = n; d > lo; d -= 1) {
//           if (divides(d)) {
//             hasC = true;
//             break;
//           }
//         }
//         if (!hasC) failC.set(c, failC.get(c) + 1);
//       }
// 
//       // Best divisor ratio in [1,n].
//       let bestD = 1;
//       for (let d = n; d >= 1; d -= 1) {
//         if (divides(d)) {
//           bestD = d;
//           break;
//         }
//       }
//       const ratio = bestD / n;
//       if (ratio < minRatioAtN) minRatioAtN = ratio;
//       if (ratio < minBestRatio) {
//         minBestRatio = ratio;
//         minBestWitness = { n, k, best_divisor: bestD };
//       }
//     }
// 
//     if (milestones.includes(n)) {
//       rows.push({
//         n,
//         min_best_divisor_ratio_over_k_le_20: Number(minRatioAtN.toPrecision(6)),
//       });
//     }
//   }
// 
//   out.results.ep387 = {
//     description: 'Finite divisor-in-interval profile for C(n,k), n<=600 and k<=20.',
//     total_pairs_checked: totalPairs,
//     fail_count_interval_n_minus_k: failNK,
//     fail_rates_c_intervals: cVals.map((c) => ({ c, fail_count: failC.get(c), fail_rate: Number((failC.get(c) / totalPairs).toPrecision(6)) })),
//     global_min_best_divisor_ratio: Number(minBestRatio.toPrecision(6)),
//     global_min_best_divisor_witness: minBestWitness,
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
