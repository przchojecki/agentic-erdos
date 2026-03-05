#!/usr/bin/env node
const meta={problem:'EP-208',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-208 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch7_quick_compute.mjs | squarefree gaps profile. ----
// // EP-208: squarefree gaps profile.
// {
//   function squarefreeMask(X) {
//     const sf = new Uint8Array(X + 1);
//     sf.fill(1, 1);
//     const r = Math.floor(Math.sqrt(X));
//     for (let p = 2; p <= r; p += 1) {
//       const sq = p * p;
//       for (let v = sq; v <= X; v += sq) sf[v] = 0;
//     }
//     sf[0] = 0;
//     return sf;
//   }
// 
//   const rows = [];
//   for (const X of [200000, 500000, 1000000, 2000000, 5000000]) {
//     const sf = squarefreeMask(X);
//     let prev = -1;
//     let maxGap = 0;
//     let gapStart = null;
//     for (let n = 1; n <= X; n += 1) {
//       if (!sf[n]) continue;
//       if (prev >= 0) {
//         const g = n - prev;
//         if (g > maxGap) {
//           maxGap = g;
//           gapStart = prev;
//         }
//       }
//       prev = n;
//     }
//     const scale = (Math.PI * Math.PI / 6) * (Math.log(gapStart) / Math.log(Math.log(gapStart)));
//     rows.push({
//       X,
//       max_gap_observed: maxGap,
//       gap_start_at: gapStart,
//       ratio_over_pi2_over6_log_over_loglog: Number((maxGap / scale).toFixed(6)),
//       ratio_over_gap_start_pow_0_2: Number((maxGap / (gapStart ** 0.2)).toFixed(6)),
//     });
//   }
// 
//   out.results.ep208 = {
//     description: 'Finite maximum-gap profile for squarefree numbers.',
//     rows,
//   };
// }
// 
// // EP-212 + EP-213: integer-grid rational-distance proxies.
// {
//   function pointsGrid(M) {
//     const pts = [];
//     for (let x = -M; x <= M; x += 1) for (let y = -M; y <= M; y += 1) pts.push([x, y]);
//     return pts;
//   }
// 
//   function buildIntDistanceAdj(pts) {
//     const n = pts.length;
//     const adj = Array.from({ length: n }, () => new Uint8Array(n));
//     for (let i = 0; i < n; i += 1) {
//       for (let j = i + 1; j < n; j += 1) {
//         const dx = pts[i][0] - pts[j][0];
//         const dy = pts[i][1] - pts[j][1];
//         const d2 = dx * dx + dy * dy;
//         if (isPerfectSquare(d2)) {
//           adj[i][j] = 1;
//           adj[j][i] = 1;
//         }
//       }
//     }
//     return adj;
//   }
// 
//   function collinear(a, b, c) {
//     return (b[0] - a[0]) * (c[1] - a[1]) === (b[1] - a[1]) * (c[0] - a[0]);
//   }
// 
//   function det3(m) {
//     return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
//       - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
//       + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
//   }
// 
//   function cocircular4(a, b, c, d) {
//     const rows = [a, b, c, d].map(([x, y]) => [x * x + y * y, x, y, 1]);
//     const m0 = [
//       [rows[1][1], rows[1][2], rows[1][3]],
//       [rows[2][1], rows[2][2], rows[2][3]],
//       [rows[3][1], rows[3][2], rows[3][3]],
//     ];
//     const m1 = [
//       [rows[1][0], rows[1][2], rows[1][3]],
//       [rows[2][0], rows[2][2], rows[2][3]],
//       [rows[3][0], rows[3][2], rows[3][3]],
//     ];
//     const m2 = [
//       [rows[1][0], rows[1][1], rows[1][3]],
//       [rows[2][0], rows[2][1], rows[2][3]],
//       [rows[3][0], rows[3][1], rows[3][3]],
//     ];
//     const m3 = [
//       [rows[1][0], rows[1][1], rows[1][2]],
//       [rows[2][0], rows[2][1], rows[2][2]],
//       [rows[3][0], rows[3][1], rows[3][2]],
//     ];
//     const det = rows[0][0] * det3(m0) - rows[0][1] * det3(m1) + rows[0][2] * det3(m2) - rows[0][3] * det3(m3);
//     return det === 0;
//   }
// 
//   function maxCliqueGreedy(adj, restarts) {
//     const n = adj.length;
//     let best = 0;
//     for (let rep = 0; rep < restarts; rep += 1) {
//       const ord = Array.from({ length: n }, (_, i) => i);
//       shuffle(ord, rng);
//       const chosen = [];
//       for (const v of ord) {
//         let ok = true;
//         for (const u of chosen) {
//           if (!adj[v][u]) {
//             ok = false;
//             break;
//           }
//         }
//         if (ok) chosen.push(v);
//       }
//       if (chosen.length > best) best = chosen.length;
//     }
//     return best;
//   }
// 
//   function maxGeneralPositionIntDistSet(pts, adj, restarts) {
//     const n = pts.length;
//     let best = 0;
//     for (let rep = 0; rep < restarts; rep += 1) {
//       const ord = Array.from({ length: n }, (_, i) => i);
//       shuffle(ord, rng);
//       const chosen = [];
//       for (const v of ord) {
//         let ok = true;
// 
//         for (const u of chosen) {
//           if (!adj[v][u]) {
//             ok = false;
//             break;
//           }
//         }
//         if (!ok) continue;
// 
//         for (let i = 0; i < chosen.length && ok; i += 1) {
//           for (let j = i + 1; j < chosen.length; j += 1) {
//             if (collinear(pts[chosen[i]], pts[chosen[j]], pts[v])) {
//               ok = false;
//               break;
//             }
//           }
//         }
//         if (!ok) continue;
// 
//         for (let i = 0; i < chosen.length && ok; i += 1) {
//           for (let j = i + 1; j < chosen.length && ok; j += 1) {
//             for (let k = j + 1; k < chosen.length; k += 1) {
//               if (cocircular4(pts[chosen[i]], pts[chosen[j]], pts[chosen[k]], pts[v])) {
//                 ok = false;
//                 break;
//               }
//             }
//           }
//         }
//         if (ok) chosen.push(v);
//       }
//       if (chosen.length > best) best = chosen.length;
//     }
//     return best;
//   }
// 
//   const rows212 = [];
//   const rows213 = [];
//   for (const M of [4, 5, 6, 7]) {
//     const pts = pointsGrid(M);
//     const adj = buildIntDistanceAdj(pts);
// 
//     const c = maxCliqueGreedy(adj, 450);
//     rows212.push({
//       M,
//       grid_points: pts.length,
//       best_all_integer_distance_subset_size_found: c,
//       ratio_over_grid_size: Number((c / pts.length).toFixed(6)),
//     });
// 
//     const g = maxGeneralPositionIntDistSet(pts, adj, 420);
//     rows213.push({
//       M,
//       grid_points: pts.length,
//       best_general_position_integer_distance_subset_size_found: g,
//     });
//   }
// 
//   out.results.ep212 = {
//     description: 'Integer-grid proxy for large finite all-rational-distance subsets (integer-distance specialization).',
//     rows: rows212,
//   };
// 
//   out.results.ep213 = {
//     description: 'Integer-grid proxy for general-position all-integer-distance finite sets.',
//     rows: rows213,
//   };
// }
// ==== End Batch Split Integrations ====
