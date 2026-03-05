#!/usr/bin/env node
const meta={problem:'EP-96',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-96 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch4_quick_compute.mjs | unit-distance multiplicity behavior in convex polygons. ----
// // EP-96: unit-distance multiplicity behavior in convex polygons.
// {
//   const rows = [];
// 
//   for (const n of [20, 40, 80, 120]) {
//     // For regular n-gon: scaling can make any chosen chord class equal to 1.
//     // The best class always has multiplicity n (for k < n/2).
//     rows.push({
//       model: 'regular_polygon_theoretical_after_scaling',
//       n,
//       max_unit_pairs_possible: n,
//       ratio_over_n: 1,
//     });
//   }
// 
//   for (const n of [20, 40, 80, 120]) {
//     let best = 0;
//     const trials = 160;
//     for (let t = 0; t < trials; t += 1) {
//       const pts = randomConvexOnCircle(n, rng);
//       const v = maxDistanceMultiplicity(pts);
//       if (v > best) best = v;
//     }
//     rows.push({
//       model: 'random_convex_on_circle_best_distance_multiplicity',
//       n,
//       trials,
//       best_distance_multiplicity_found: best,
//       ratio_over_n: Number((best / n).toFixed(6)),
//       compare_to_nlog2n_plus_4n: Number((best / (n * Math.log2(n) + 4 * n)).toFixed(6)),
//     });
//   }
// 
//   out.results.ep96 = {
//     description: 'Finite convex-polygon distance-multiplicity profile (scaling to unit distance).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
