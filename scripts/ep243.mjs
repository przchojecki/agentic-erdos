#!/usr/bin/env node
const meta={problem:'EP-243',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-243 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch8_quick_compute.mjs | Sylvester-type telescoping identity vs perturbation. ----
// // EP-243: Sylvester-type telescoping identity vs perturbation.
// {
//   function sylvesterTerms(a1, len) {
//     const a = [BigInt(a1)];
//     while (a.length < len) {
//       const x = a[a.length - 1];
//       a.push(x * x - x + 1n);
//     }
//     return a;
//   }
// 
//   function telescopingResidual(a) {
//     // Sum_i [1/a_i - (1/(a_i-1) - 1/(a_{i+1}-1))]
//     let res = [0n, 1n];
//     for (let i = 0; i + 1 < a.length; i += 1) {
//       const term1 = [1n, a[i]];
//       const term2 = fracSub([1n, a[i] - 1n], [1n, a[i + 1] - 1n]);
//       const diff = fracSub(term1, term2);
//       res = fracAdd(res, diff);
//     }
//     return res;
//   }
// 
//   const rows = [];
//   for (const a1 of [2, 3, 5]) {
//     const a = sylvesterTerms(a1, 8);
//     const r = telescopingResidual(a);
//     rows.push({
//       model: 'exact_sylvester',
//       a1,
//       terms_checked: 8,
//       residual_numerator: r[0].toString(),
//       residual_denominator: r[1].toString(),
//       residual_as_number: fracToNumber(r),
//     });
// 
//     const b = [...a];
//     b[4] += 1n; // perturb one term
//     const rp = telescopingResidual(b);
//     rows.push({
//       model: 'single_perturbation_at_index5',
//       a1,
//       terms_checked: 8,
//       residual_numerator: rp[0].toString(),
//       residual_denominator: rp[1].toString(),
//       residual_as_number: fracToNumber(rp),
//     });
//   }
// 
//   out.results.ep243 = {
//     description: 'Exact telescoping residual check for Sylvester recurrence and perturbed variants.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
