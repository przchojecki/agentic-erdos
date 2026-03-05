#!/usr/bin/env node
const meta={problem:'EP-352',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-352 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch10_quick_compute.mjs | discrete proxy on integer grids avoiding area-1 triangles. ----
// // EP-352: discrete proxy on integer grids avoiding area-1 triangles.
// {
//   function area2(p, q, r) {
//     const [x1, y1] = p;
//     const [x2, y2] = q;
//     const [x3, y3] = r;
//     return Math.abs((x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1));
//   }
// 
//   function bestAvoidArea1(m, restarts) {
//     const pts = [];
//     for (let x = 0; x <= m; x += 1) {
//       for (let y = 0; y <= m; y += 1) pts.push([x, y]);
//     }
// 
//     const n = pts.length;
//     const pairsWithPoint = Array.from({ length: n }, () => []);
//     for (let i = 0; i < n; i += 1) {
//       for (let j = i + 1; j < n; j += 1) {
//         for (let k = j + 1; k < n; k += 1) {
//           if (area2(pts[i], pts[j], pts[k]) !== 2) continue;
//           pairsWithPoint[i].push([j, k]);
//           pairsWithPoint[j].push([i, k]);
//           pairsWithPoint[k].push([i, j]);
//         }
//       }
//     }
// 
//     let best = 0;
//     for (let r = 0; r < restarts; r += 1) {
//       const ord = Array.from({ length: n }, (_, i) => i);
//       for (let i = n - 1; i > 0; i -= 1) {
//         const j = Math.floor(rng() * (i + 1));
//         const t = ord[i];
//         ord[i] = ord[j];
//         ord[j] = t;
//       }
//       const chosen = new Uint8Array(n);
//       let c = 0;
//       for (const v of ord) {
//         let bad = false;
//         for (const [a, b] of pairsWithPoint[v]) {
//           if (chosen[a] && chosen[b]) {
//             bad = true;
//             break;
//           }
//         }
//         if (!bad) {
//           chosen[v] = 1;
//           c += 1;
//         }
//       }
//       if (c > best) best = c;
//     }
//     return { points: n, best };
//   }
// 
//   const rows = [];
//   for (const m of [6, 8, 10]) {
//     const { points, best } = bestAvoidArea1(m, 150);
//     rows.push({
//       grid_m: m,
//       total_points: points,
//       best_area1_free_subset_size: best,
//       density: Number((best / points).toPrecision(6)),
//     });
//   }
// 
//   out.results.ep352 = {
//     description: 'Grid-geometry proxy: large subsets of [0,m]^2 with no area-1 triangle among chosen points.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
