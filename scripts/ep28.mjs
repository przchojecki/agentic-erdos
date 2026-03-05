#!/usr/bin/env node
const meta={problem:'EP-28',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-28 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch1_quick_compute.mjs | near-cover random additive-basis proxies and max representation counts. ----
// // EP-28: near-cover random additive-basis proxies and max representation counts.
// {
//   const rng = makeRng(28032026);
//   const NList = [500, 1000, 2000];
//   const densities = [0.1, 0.13, 0.16, 0.2, 0.24];
//   const trials = 60;
//   const rows = [];
// 
//   for (const N of NList) {
//     let bestCoverage = 0;
//     let minMax99 = null;
//     let minMax995 = null;
//     for (const d of densities) {
//       for (let t = 0; t < trials; t += 1) {
//         const A = [];
//         for (let x = 1; x <= N; x += 1) {
//           if (rng() < d) A.push(x);
//         }
//         if (A.length < 2) continue;
//         const r = new Uint16Array(2 * N + 1);
//         for (let i = 0; i < A.length; i += 1) {
//           const ai = A[i];
//           for (let j = 0; j < A.length; j += 1) {
//             r[ai + A[j]] += 1;
//           }
//         }
//         let covered = 0;
//         let maxR = 0;
//         for (let s = 2; s <= 2 * N; s += 1) {
//           if (r[s] > 0) covered += 1;
//           if (r[s] > maxR) maxR = r[s];
//         }
//         const cov = covered / (2 * N - 1);
//         if (cov > bestCoverage) bestCoverage = cov;
//         if (cov >= 0.99 && (minMax99 === null || maxR < minMax99)) minMax99 = maxR;
//         if (cov >= 0.995 && (minMax995 === null || maxR < minMax995)) minMax995 = maxR;
//       }
//     }
//     rows.push({
//       N,
//       densities,
//       trials_per_density: trials,
//       best_coverage_found: Number(bestCoverage.toFixed(6)),
//       min_observed_max_rep_if_coverage_ge_0_99: minMax99,
//       min_observed_max_rep_if_coverage_ge_0_995: minMax995,
//     });
//   }
// 
//   out.results.ep28 = {
//     description: 'Random finite proxies: near-full sumset coverage versus peak representation multiplicity.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
