#!/usr/bin/env node
const meta={problem:'EP-92',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-92 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch4_quick_compute.mjs | finite profiles for f(n)-style local equidistance in model sets. ----
// // EP-92: finite profiles for f(n)-style local equidistance in model sets.
// {
//   const rows = [];
// 
//   for (const m of [4, 5, 6, 8]) {
//     const pts = gridPoints(m);
//     const n = pts.length;
//     const f = localEquidistantMin(pts);
//     rows.push({
//       model: 'square_grid',
//       n,
//       f_model: f,
//       f_over_n_pow_4_over_11: Number((f / n ** (4 / 11)).toFixed(6)),
//     });
//   }
// 
//   for (const n of [16, 25, 36, 64]) {
//     const pts = triPatchPoints(n);
//     const f = localEquidistantMin(pts);
//     rows.push({
//       model: 'triangular_patch',
//       n,
//       f_model: f,
//       f_over_n_pow_4_over_11: Number((f / n ** (4 / 11)).toFixed(6)),
//     });
//   }
// 
//   for (const n of [12, 18, 24, 30]) {
//     const pts = regularPolygon(n, 1, 0);
//     const f = localEquidistantMin(pts);
//     rows.push({
//       model: 'regular_polygon',
//       n,
//       f_model: f,
//       f_over_n_pow_4_over_11: Number((f / n ** (4 / 11)).toFixed(6)),
//     });
//   }
// 
//   out.results.ep92 = {
//     description: 'Finite model lower profiles for per-center equidistant multiplicity.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
