#!/usr/bin/env node
const meta={problem:'EP-507',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-507 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch13_quick_compute.mjs | random upper-bound search for alpha(n) in unit disk. ----
// // EP-507: random upper-bound search for alpha(n) in unit disk.
// {
//   const rng = makeRng(20260303 ^ 1304);
// 
//   function randomPointDisk() {
//     const r = Math.sqrt(rng());
//     const t = 2 * Math.PI * rng();
//     return [r * Math.cos(t), r * Math.sin(t)];
//   }
// 
//   function minTriangleArea(points) {
//     const n = points.length;
//     let best = Number.POSITIVE_INFINITY;
//     for (let i = 0; i < n; i += 1) {
//       const [xi, yi] = points[i];
//       for (let j = i + 1; j < n; j += 1) {
//         const [xj, yj] = points[j];
//         for (let k = j + 1; k < n; k += 1) {
//           const [xk, yk] = points[k];
//           const area = 0.5 * Math.abs((xj - xi) * (yk - yi) - (xk - xi) * (yj - yi));
//           if (area < best) best = area;
//         }
//       }
//     }
//     return best;
//   }
// 
//   const rows = [];
//   for (const [n, restarts] of [[20, 200], [40, 180], [70, 150], [100, 120]]) {
//     let best = 0;
//     let avg = 0;
//     for (let t = 0; t < restarts; t += 1) {
//       const pts = Array.from({ length: n }, () => randomPointDisk());
//       const v = minTriangleArea(pts);
//       avg += v;
//       if (v > best) best = v;
//     }
//     rows.push({
//       n,
//       restarts,
//       best_min_area_found: Number(best.toPrecision(7)),
//       avg_min_area: Number((avg / restarts).toPrecision(7)),
//       best_times_n_sq: Number((best * n * n).toPrecision(7)),
//       best_times_n_pow_7_over_6: Number((best * n ** (7 / 6)).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep507 = {
//     description: 'Random finite upper-bound probes for Heilbronn triangle parameter alpha(n).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
