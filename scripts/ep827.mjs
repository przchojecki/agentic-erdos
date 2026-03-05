#!/usr/bin/env node
const meta={problem:'EP-827',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-827 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch19_quick_compute.mjs | subset with all circumradii distinct. ----
// // EP-827: subset with all circumradii distinct.
// {
//   const rng = makeRng(20260304 ^ 1902);
// 
//   function randomGeneralPositionPoints(n, side) {
//     while (true) {
//       const pts = [];
//       const used = new Set();
//       while (pts.length < n) {
//         const x = Math.floor(rng() * side);
//         const y = Math.floor(rng() * side);
//         const key = `${x},${y}`;
//         if (used.has(key)) continue;
//         used.add(key);
//         pts.push([x, y]);
//       }
// 
//       let good = true;
//       for (let i = 0; i < n && good; i += 1) {
//         for (let j = i + 1; j < n && good; j += 1) {
//           for (let k = j + 1; k < n; k += 1) {
//             const x1 = pts[i][0];
//             const y1 = pts[i][1];
//             const x2 = pts[j][0];
//             const y2 = pts[j][1];
//             const x3 = pts[k][0];
//             const y3 = pts[k][1];
//             const cross = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
//             if (cross === 0) {
//               good = false;
//               break;
//             }
//           }
//         }
//       }
//       if (good) return pts;
//     }
//   }
// 
//   function radiusKey(p1, p2, p3) {
//     const a2 = (p2[0] - p3[0]) ** 2 + (p2[1] - p3[1]) ** 2;
//     const b2 = (p1[0] - p3[0]) ** 2 + (p1[1] - p3[1]) ** 2;
//     const c2 = (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2;
//     const cross = Math.abs((p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]));
//     if (cross === 0) return null;
//     let num = a2 * b2 * c2;
//     let den = 4 * cross * cross;
//     const g = gcd(num, den);
//     num /= g;
//     den /= g;
//     return `${num}/${den}`;
//   }
// 
//   function bestSubsetSize(pts) {
//     const n = pts.length;
//     const chosen = [];
//     const radSet = new Set();
//     let best = 0;
// 
//     function dfs(i) {
//       if (chosen.length + (n - i) <= best) return;
//       if (i === n) {
//         if (chosen.length > best) best = chosen.length;
//         return;
//       }
// 
//       // try include i
//       const newKeys = [];
//       let ok = true;
//       for (let a = 0; a < chosen.length && ok; a += 1) {
//         for (let b = a + 1; b < chosen.length; b += 1) {
//           const key = radiusKey(pts[chosen[a]], pts[chosen[b]], pts[i]);
//           if (key === null || radSet.has(key)) {
//             ok = false;
//             break;
//           }
//           newKeys.push(key);
//         }
//       }
// 
//       if (ok) {
//         for (const k of newKeys) radSet.add(k);
//         chosen.push(i);
//         dfs(i + 1);
//         chosen.pop();
//         for (const k of newKeys) radSet.delete(k);
//       }
// 
//       // skip i
//       dfs(i + 1);
//     }
// 
//     dfs(0);
//     return best;
//   }
// 
//   const rows = [];
//   for (const [n, side, samples] of [[10, 36, 8], [12, 44, 6], [13, 52, 5]]) {
//     let best = 0;
//     let avg = 0;
//     for (let t = 0; t < samples; t += 1) {
//       const pts = randomGeneralPositionPoints(n, side);
//       const b = bestSubsetSize(pts);
//       avg += b;
//       if (b > best) best = b;
//     }
//     rows.push({
//       n,
//       samples,
//       best_subset_size_all_circumradii_distinct: best,
//       avg_best_subset_size: Number((avg / samples).toPrecision(7)),
//       best_over_n: Number((best / n).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep827 = {
//     description: 'Finite random-general-position profile for distinct-circumradius subset sizes.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
