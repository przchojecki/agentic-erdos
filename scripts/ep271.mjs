#!/usr/bin/env node
const meta={problem:'EP-271',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-271 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch9_quick_compute.mjs | greedy no-3AP Stanley sequence profiles from different starts A(n). ----
// // EP-271: greedy no-3AP Stanley sequence profiles from different starts A(n).
// {
//   function canAddNo3APAsLargest(A, Aset, x) {
//     for (const z of A) {
//       const y = 2 * z - x;
//       if (y >= 0 && y < z && Aset.has(y)) return false;
//     }
//     return true;
//   }
// 
//   function buildAofN(n, terms) {
//     const A = [0, n];
//     const Aset = new Set(A);
//     while (A.length < terms) {
//       let x = A[A.length - 1] + 1;
//       while (true) {
//         if (canAddNo3APAsLargest(A, Aset, x)) {
//           A.push(x);
//           Aset.add(x);
//           break;
//         }
//         x += 1;
//       }
//     }
//     return A;
//   }
// 
//   function fitExponent(A, kStart) {
//     let sx = 0;
//     let sy = 0;
//     let sxx = 0;
//     let sxy = 0;
//     let cnt = 0;
//     for (let k = kStart; k < A.length; k += 1) {
//       if (k <= 0 || A[k] <= 0) continue;
//       const x = Math.log(k);
//       const y = Math.log(A[k]);
//       sx += x;
//       sy += y;
//       sxx += x * x;
//       sxy += x * y;
//       cnt += 1;
//     }
//     const den = cnt * sxx - sx * sx;
//     if (cnt < 2 || Math.abs(den) < 1e-12) return null;
//     return (cnt * sxy - sx * sy) / den;
//   }
// 
//   const alpha = Math.log(3) / Math.log(2);
//   const rows = [];
//   for (const n of [1, 2, 3, 4, 5, 7, 10]) {
//     const A = buildAofN(n, 220);
//     const exp = fitExponent(A, 40);
//     const k = A.length - 1;
//     rows.push({
//       n,
//       terms_used: A.length,
//       last_index: k,
//       last_value: A[k],
//       fitted_growth_exponent: exp === null ? null : Number(exp.toFixed(6)),
//       ratio_last_over_k_pow_log2_3: Number((A[k] / (k ** alpha)).toPrecision(7)),
//       first_15_terms: A.slice(0, 15),
//     });
//   }
// 
//   out.results.ep271 = {
//     description: 'Greedy finite profiles for A(n) no-3AP sequence growth exponents.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
