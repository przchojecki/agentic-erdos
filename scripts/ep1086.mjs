#!/usr/bin/env node
const meta={problem:'EP-1086',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1086 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch25_quick_compute.mjs | finite search for many equal-area triangles. ----
// // EP-1086: finite search for many equal-area triangles.
// {
//   const rng = makeRng(20260304 ^ 1086);
// 
//   function maxRepeatedArea(points) {
//     const m = points.length;
//     const cnt = new Map();
//     let best = 0;
//     for (let i = 0; i < m; i += 1) {
//       const [x1, y1] = points[i];
//       for (let j = i + 1; j < m; j += 1) {
//         const [x2, y2] = points[j];
//         for (let k = j + 1; k < m; k += 1) {
//           const [x3, y3] = points[k];
//           const area2 = Math.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
//           if (area2 === 0) continue;
//           const c = (cnt.get(area2) || 0) + 1;
//           cnt.set(area2, c);
//           if (c > best) best = c;
//         }
//       }
//     }
//     return best;
//   }
// 
//   function randomDistinctPoints(n, box) {
//     const used = new Set();
//     const pts = [];
//     while (pts.length < n) {
//       const x = Math.floor(rng() * box);
//       const y = Math.floor(rng() * box);
//       const key = `${x},${y}`;
//       if (used.has(key)) continue;
//       used.add(key);
//       pts.push([x, y]);
//     }
//     return pts;
//   }
// 
//   const rows = [];
//   for (const n of [12, 16, 20, 24]) {
//     let best = 0;
//     for (let t = 0; t < 240; t += 1) {
//       const pts = randomDistinctPoints(n, 45);
//       const b = maxRepeatedArea(pts);
//       if (b > best) best = b;
//     }
//     rows.push({
//       n,
//       best_equal_area_triangle_count_found: best,
//       normalized_best_over_n_squared: Number((best / (n * n)).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep1086 = {
//     description: 'Finite random-grid search for maximal multiplicity of a triangle area.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
