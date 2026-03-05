#!/usr/bin/env node
const meta={problem:'EP-503',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-503 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch13_quick_compute.mjs | explicit lower-construction validity checks. ----
// // EP-503: explicit lower-construction validity checks.
// {
//   function dist2(x, y) {
//     let s = 0;
//     for (let i = 0; i < x.length; i += 1) {
//       const d = x[i] - y[i];
//       s += d * d;
//     }
//     return s;
//   }
// 
//   function allTriplesIsosceles(points, eps = 1e-9) {
//     const n = points.length;
//     for (let i = 0; i < n; i += 1) {
//       for (let j = i + 1; j < n; j += 1) {
//         for (let k = j + 1; k < n; k += 1) {
//           const a = dist2(points[i], points[j]);
//           const b = dist2(points[i], points[k]);
//           const c = dist2(points[j], points[k]);
//           if (Math.abs(a - b) > eps && Math.abs(a - c) > eps && Math.abs(b - c) > eps) return false;
//         }
//       }
//     }
//     return true;
//   }
// 
//   const rows = [];
//   for (let d = 2; d <= 8; d += 1) {
//     const m = d + 1;
//     const pts = [];
//     for (let i = 0; i < m; i += 1) {
//       for (let j = i + 1; j < m; j += 1) {
//         const v = Array(m).fill(0);
//         v[i] = 1;
//         v[j] = 1;
//         pts.push(v);
//       }
//     }
//     const centroid = Array(m).fill(2 / m);
//     const ptsPlus = [...pts, centroid];
// 
//     rows.push({
//       d,
//       base_size_binom_dplus1_2: pts.length,
//       base_valid: allTriplesIsosceles(pts),
//       plus1_size: ptsPlus.length,
//       plus1_valid: allTriplesIsosceles(ptsPlus),
//       upper_bound_binom_dplus2_2: choose2(d + 2),
//     });
//   }
// 
//   out.results.ep503 = {
//     description: 'Validity checks for known explicit lower constructions in the all-triples-isosceles problem.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
