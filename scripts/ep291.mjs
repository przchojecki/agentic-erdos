#!/usr/bin/env node
const meta={problem:'EP-291',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-291 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch9_quick_compute.mjs | exact BigInt profile of gcd(a_n, L_n), H_n = a_n / L_n. ----
// // EP-291: exact BigInt profile of gcd(a_n, L_n), H_n = a_n / L_n.
// {
//   let num = 0n;
//   let den = 1n;
//   let L = 1n;
// 
//   let coprimeCount = 0;
//   let nontrivialCount = 0;
//   let firstCoprime = null;
//   let firstNontrivial = null;
//   const rows = [];
// 
//   const milestones = new Set([100, 200, 300, 400, 500]);
//   for (let n = 1; n <= 500; n += 1) {
//     const bn = BigInt(n);
//     [num, den] = reduceFrac(num * bn + den, den * bn);
//     L = lcmBig(L, bn);
// 
//     const a = num * (L / den);
//     const g = gcdBig(a, L);
//     if (g === 1n) {
//       coprimeCount += 1;
//       if (firstCoprime === null) firstCoprime = n;
//     } else {
//       nontrivialCount += 1;
//       if (firstNontrivial === null) firstNontrivial = n;
//     }
// 
//     if (milestones.has(n)) {
//       rows.push({
//         n,
//         coprime_count_up_to_n: coprimeCount,
//         nontrivial_count_up_to_n: nontrivialCount,
//         coprime_density: Number((coprimeCount / n).toPrecision(6)),
//       });
//     }
//   }
// 
//   out.results.ep291 = {
//     description: 'Exact finite profile of gcd(a_n,L_n) for n<=500 via BigInt harmonic arithmetic.',
//     first_n_with_gcd_eq_1: firstCoprime,
//     first_n_with_gcd_gt_1: firstNontrivial,
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
