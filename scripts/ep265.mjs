#!/usr/bin/env node
const meta={problem:'EP-265',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-265 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch8_quick_compute.mjs | growth and rational-approximation profiles for known constructions. ----
// // EP-265: growth and rational-approximation profiles for known constructions.
// {
//   function sequenceTri(limitN) {
//     const a = [];
//     for (let n = 3; n <= limitN; n += 1) a.push((n * (n - 1)) / 2);
//     return a;
//   }
// 
//   function sequencePoly(limitN) {
//     const a = [];
//     for (let n = 2; n <= limitN; n += 1) a.push(n ** 3 + 6 * n ** 2 + 5 * n);
//     return a;
//   }
// 
//   function partialShifted(A, shift) {
//     let s = 0;
//     for (const x of A) s += 1 / (x - shift);
//     return s;
//   }
// 
//   const tri = sequenceTri(80000);
//   const poly = sequencePoly(50000);
// 
//   const S_tri_0 = partialShifted(tri, 0);
//   const S_tri_1 = partialShifted(tri, 1);
//   const S_poly_0 = partialShifted(poly, 0);
//   const S_poly_12 = partialShifted(poly, 12);
// 
//   const rows = [
//     {
//       family: 'triangular_choose_n_2_start_n=3',
//       terms_used: tri.length,
//       partial_sum_shift_0: Number(S_tri_0.toPrecision(14)),
//       partial_sum_shift_1: Number(S_tri_1.toPrecision(14)),
//       'best_rational_shift_0_q<=5000': (() => {
//         const b = bestRationalApprox(S_tri_0, 5000);
//         return `${b.p}/${b.q}`;
//       })(),
//       'best_rational_shift_1_q<=5000': (() => {
//         const b = bestRationalApprox(S_tri_1, 5000);
//         return `${b.p}/${b.q}`;
//       })(),
//     },
//     {
//       family: 'cubic_n3+6n2+5n_start_n=2',
//       terms_used: poly.length,
//       partial_sum_shift_0: Number(S_poly_0.toPrecision(14)),
//       partial_sum_shift_12: Number(S_poly_12.toPrecision(14)),
//       'best_rational_shift_0_q<=5000': (() => {
//         const b = bestRationalApprox(S_poly_0, 5000);
//         return `${b.p}/${b.q}`;
//       })(),
//       'best_rational_shift_12_q<=5000': (() => {
//         const b = bestRationalApprox(S_poly_12, 5000);
//         return `${b.p}/${b.q}`;
//       })(),
//     },
//   ];
// 
//   const growthRows = [
//     { family: 'triangular', n: 2000, root_n: Number((((2000 * 1999) / 2) ** (1 / 2000)).toFixed(6)) },
//     { family: 'cubic_shifted', n: 2000, root_n: Number(((2000 ** 3 + 6 * 2000 ** 2 + 5 * 2000) ** (1 / 2000)).toFixed(6)) },
//     { family: 'double_exponential_model_2^(2^n)', n: 10, root_n: Number(((2 ** (2 ** 10)) ** (1 / 10)).toExponential(6)) },
//   ];
// 
//   out.results.ep265 = {
//     description: 'Finite partial-sum and growth profiles for canonical constructions related to dual-shift rationality phenomena.',
//     rows,
//     growth_rows: growthRows,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch8_quick_compute.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
