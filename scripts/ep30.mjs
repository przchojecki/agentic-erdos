#!/usr/bin/env node
const meta={problem:'EP-30',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-30 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch1_quick_compute.mjs | random greedy Sidon constructions and scale comparison. ----
// // EP-30: random greedy Sidon constructions and scale comparison.
// {
//   const rng = makeRng(30032026);
//   const NList = [500, 1000, 2000, 5000, 10000];
//   const trials = 300;
//   const rows = [];
//   for (const N of NList) {
//     let best = 0;
//     let worst = 1e9;
//     let sum = 0;
//     for (let t = 0; t < trials; t += 1) {
//       const s = greedyMaximalSidonSize(N, rng);
//       if (s > best) best = s;
//       if (s < worst) worst = s;
//       sum += s;
//     }
//     const avg = sum / trials;
//     const sqrtN = Math.sqrt(N);
//     const refinedUpper = sqrtN + 0.98183 * N ** 0.25;
//     rows.push({
//       N,
//       trials,
//       min_size_found: worst,
//       avg_size_found: Number(avg.toFixed(4)),
//       max_size_found: best,
//       max_minus_sqrtN: Number((best - sqrtN).toFixed(6)),
//       refined_upper_sqrt_plus_0_98183_N_quarter: Number(refinedUpper.toFixed(6)),
//       refined_upper_minus_max_found: Number((refinedUpper - best).toFixed(6)),
//     });
//   }
//   const singerLikeRows = [31, 61, 127, 251, 509].map((q) => {
//     const N = q * q + q + 1;
//     const size = q + 1;
//     return {
//       q_prime: q,
//       N_q2_plus_q_plus_1: N,
//       lower_bound_size_q_plus_1: size,
//       ratio_over_sqrtN: Number((size / Math.sqrt(N)).toFixed(6)),
//       lower_bound_minus_sqrtN: Number((size - Math.sqrt(N)).toFixed(6)),
//     };
//   });
//   out.results.ep30 = {
//     description: 'Random greedy Sidon lower-bound profile against sqrt(N) and refined N^(1/4) correction scale.',
//     rows,
//     structured_prime_power_family_profile: singerLikeRows,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch1_quick_compute.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
