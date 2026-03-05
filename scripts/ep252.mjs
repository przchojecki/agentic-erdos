#!/usr/bin/env node
const meta={problem:'EP-252',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-252 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch8_quick_compute.mjs | finite approximants for sum sigma_k(n)/n!. ----
// // EP-252: finite approximants for sum sigma_k(n)/n!.
// {
//   const Ntail = 140;
//   const sigma = Array.from({ length: 7 }, () => new Float64Array(Ntail + 1));
//   for (let k = 1; k <= 6; k += 1) {
//     for (let d = 1; d <= Ntail; d += 1) {
//       const dk = d ** k;
//       for (let n = d; n <= Ntail; n += d) sigma[k][n] += dk;
//     }
//   }
// 
//   const invFact = new Float64Array(Ntail + 1);
//   invFact[0] = 1;
//   for (let n = 1; n <= Ntail; n += 1) invFact[n] = invFact[n - 1] / n;
// 
//   const rows = [];
//   for (let k = 1; k <= 6; k += 1) {
//     const partialN = 40;
//     let s40 = 0;
//     let s140 = 0;
//     for (let n = 1; n <= partialN; n += 1) s40 += sigma[k][n] * invFact[n];
//     for (let n = 1; n <= Ntail; n += 1) s140 += sigma[k][n] * invFact[n];
//     const tail = Math.abs(s140 - s40);
//     const best = bestRationalApprox(s140, 20000);
//     rows.push({
//       k,
//       partial_sum_N40: Number(s40.toPrecision(14)),
//       extended_sum_N140: Number(s140.toPrecision(14)),
//       N40_to_N140_tail_size: Number(tail.toExponential(4)),
//       best_rational_q_le_20000: `${best.p}/${best.q}`,
//       approx_error: Number(best.err.toExponential(4)),
//     });
//   }
// 
//   out.results.ep252 = {
//     description: 'Finite high-truncation approximants for alpha_k = sum sigma_k(n)/n! (k<=6).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
