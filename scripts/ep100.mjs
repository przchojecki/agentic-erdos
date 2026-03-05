#!/usr/bin/env node
const meta={problem:'EP-100',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-100 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch4_quick_compute.mjs | lattice greedy search under separated-distance constraints. ----
// // EP-100: lattice greedy search under separated-distance constraints.
// {
//   const rows = [];
// 
//   function admissible(existingPts, uniqueD, cand) {
//     const nd = [];
//     for (const p of existingPts) {
//       const d = Math.hypot(cand[0] - p[0], cand[1] - p[1]);
//       if (d < 1 - 1e-9) return null;
//       nd.push(d);
//     }
// 
//     for (let i = 0; i < nd.length; i += 1) {
//       for (const e of uniqueD) {
//         const diff = Math.abs(nd[i] - e);
//         if (diff > 1e-9 && diff < 1 - 1e-9) return null;
//       }
//       for (let j = i + 1; j < nd.length; j += 1) {
//         const diff = Math.abs(nd[i] - nd[j]);
//         if (diff > 1e-9 && diff < 1 - 1e-9) return null;
//       }
//     }
// 
//     const nu = [...uniqueD];
//     for (const d of nd) {
//       let seen = false;
//       for (const e of nu) {
//         if (Math.abs(d - e) <= 1e-9) {
//           seen = true;
//           break;
//         }
//       }
//       if (!seen) nu.push(d);
//     }
//     return nu;
//   }
// 
//   function diameter(pts) {
//     let mx = 0;
//     for (let i = 0; i < pts.length; i += 1) {
//       for (let j = i + 1; j < pts.length; j += 1) {
//         const d = Math.hypot(pts[i][0] - pts[j][0], pts[i][1] - pts[j][1]);
//         if (d > mx) mx = d;
//       }
//     }
//     return mx;
//   }
// 
//   const R = 7;
//   const pool = [];
//   for (let x = -R; x <= R; x += 1) for (let y = -R; y <= R; y += 1) pool.push([x, y]);
// 
//   for (const n of [6, 7, 8, 9, 10]) {
//     let bestDiam = Infinity;
//     let bestDistinct = null;
//     let reached = false;
// 
//     const restarts = 420;
//     for (let rep = 0; rep < restarts; rep += 1) {
//       const ord = [...pool];
//       shuffle(ord, rng);
//       const pts = [];
//       let uniq = [];
// 
//       for (const c of ord) {
//         const nu = admissible(pts, uniq, c);
//         if (!nu) continue;
//         pts.push(c);
//         uniq = nu;
//         if (pts.length >= n) break;
//       }
// 
//       if (pts.length < n) continue;
//       reached = true;
//       const d = diameter(pts);
//       if (d < bestDiam) {
//         bestDiam = d;
//         bestDistinct = uniq.length;
//       }
//     }
// 
//     rows.push({
//       n,
//       restarts,
//       found_size_n_set: reached,
//       best_diameter_found: reached ? Number(bestDiam.toFixed(6)) : null,
//       best_diameter_over_n: reached ? Number((bestDiam / n).toFixed(6)) : null,
//       distinct_distance_count_in_best: bestDistinct,
//     });
//   }
// 
//   out.results.ep100 = {
//     description: 'Finite lattice-greedy search for small-diameter sets with 1-separated distinct distance spectrum.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
