#!/usr/bin/env node
const meta={problem:'EP-588',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-588 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch15_quick_compute.mjs | heuristic max count of >=k-point lines with no (k+1)-collinear points. ----
// // EP-588: heuristic max count of >=k-point lines with no (k+1)-collinear points.
// {
//   const rng = makeRng(20260303 ^ 1504);
// 
//   function optimizeForK(n, k, restarts, steps, grid) {
//     let best = {
//       linesAtLeastK: -1,
//       linesExactlyK: -1,
//       maxCollinear: Infinity,
//     };
// 
//     for (let r = 0; r < restarts; r += 1) {
//       let pts = randomDistinctPoints(n, grid, rng);
//       let stats = lineStats(pts);
// 
//       function score(st) {
//         const linesAtLeastK = st.lineSizes.filter((x) => x >= k).length;
//         const linesExactlyK = st.lineSizes.filter((x) => x === k).length;
//         return { linesAtLeastK, linesExactlyK, maxCollinear: st.maxCollinear };
//       }
// 
//       let cur = score(stats);
// 
//       if (cur.maxCollinear <= k) {
//         if (
//           cur.linesAtLeastK > best.linesAtLeastK ||
//           (cur.linesAtLeastK === best.linesAtLeastK && cur.linesExactlyK > best.linesExactlyK)
//         ) {
//           best = { ...cur };
//         }
//       }
// 
//       for (let it = 0; it < steps; it += 1) {
//         const idx = Math.floor(rng() * n);
//         const used = new Set(pts.map((p) => `${p[0]},${p[1]}`));
//         used.delete(`${pts[idx][0]},${pts[idx][1]}`);
// 
//         let cand = null;
//         for (let tr = 0; tr < 25; tr += 1) {
//           const x = Math.floor(rng() * grid);
//           const y = Math.floor(rng() * grid);
//           const key = `${x},${y}`;
//           if (!used.has(key)) {
//             cand = [x, y];
//             break;
//           }
//         }
//         if (!cand) continue;
// 
//         const old = pts[idx];
//         pts[idx] = cand;
//         const st2 = lineStats(pts);
//         const sc2 = score(st2);
// 
//         const improve =
//           sc2.maxCollinear <= k &&
//           (sc2.linesAtLeastK > cur.linesAtLeastK ||
//             (sc2.linesAtLeastK === cur.linesAtLeastK && sc2.linesExactlyK >= cur.linesExactlyK));
// 
//         if (improve) {
//           stats = st2;
//           cur = sc2;
//           if (
//             cur.linesAtLeastK > best.linesAtLeastK ||
//             (cur.linesAtLeastK === best.linesAtLeastK && cur.linesExactlyK > best.linesExactlyK)
//           ) {
//             best = { ...cur };
//           }
//         } else {
//           pts[idx] = old;
//         }
//       }
//     }
// 
//     return best;
//   }
// 
//   const rows = [];
//   for (const [k, nList] of [
//     [4, [28, 36, 44]],
//     [5, [30, 40]],
//   ]) {
//     for (const n of nList) {
//       const best = optimizeForK(n, k, 10, 420, 29);
//       rows.push({
//         k,
//         n,
//         best_lines_with_at_least_k_points: best.linesAtLeastK,
//         best_lines_with_exactly_k_points: best.linesExactlyK,
//         max_collinear_constraint: k,
//         lines_at_least_k_over_n_sq: Number((best.linesAtLeastK / (n * n)).toPrecision(7)),
//       });
//     }
//   }
// 
//   out.results.ep588 = {
//     description: 'Heuristic lower-bound search for many k-rich lines under no-(k+1)-collinear constraint.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
