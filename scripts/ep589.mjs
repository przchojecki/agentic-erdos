#!/usr/bin/env node
const meta={problem:'EP-589',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-589 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch15_quick_compute.mjs | no-4-collinear sets and large no-3-collinear subset heuristic. ----
// // EP-589: no-4-collinear sets and large no-3-collinear subset heuristic.
// {
//   const rng = makeRng(20260303 ^ 1505);
// 
//   function buildNo4Set(n, grid) {
//     let pts = randomDistinctPoints(n, grid, rng);
// 
//     for (let it = 0; it < 1600; it += 1) {
//       const st = lineStats(pts);
//       if (st.maxCollinear <= 3) return pts;
// 
//       let badLine = null;
//       let badPts = null;
//       for (const [key, S] of st.lineMap.entries()) {
//         if (S.size >= 4) {
//           badLine = key;
//           badPts = [...S];
//           break;
//         }
//       }
//       if (!badLine) return pts;
// 
//       const idx = badPts[Math.floor(rng() * badPts.length)];
//       const used = new Set(pts.map((p) => `${p[0]},${p[1]}`));
//       used.delete(`${pts[idx][0]},${pts[idx][1]}`);
// 
//       for (let tr = 0; tr < 40; tr += 1) {
//         const x = Math.floor(rng() * grid);
//         const y = Math.floor(rng() * grid);
//         const key = `${x},${y}`;
//         if (used.has(key)) continue;
//         pts[idx] = [x, y];
//         break;
//       }
//     }
// 
//     return pts;
//   }
// 
//   function maxNo3SubsetHeuristic(points) {
//     const n = points.length;
//     const st = lineStats(points);
// 
//     const triples = [];
//     for (const S of st.lineMap.values()) {
//       const arr = [...S];
//       if (arr.length === 3) triples.push(arr);
//       if (arr.length > 3) {
//         for (let i = 0; i < arr.length; i += 1) {
//           for (let j = i + 1; j < arr.length; j += 1) {
//             for (let k = j + 1; k < arr.length; k += 1) {
//               triples.push([arr[i], arr[j], arr[k]]);
//             }
//           }
//         }
//       }
//     }
// 
//     const alive = Array(n).fill(true);
//     const deg = Array(n).fill(0);
// 
//     function recomputeDeg() {
//       deg.fill(0);
//       for (const [a, b, c] of triples) {
//         if (alive[a] && alive[b] && alive[c]) {
//           deg[a] += 1;
//           deg[b] += 1;
//           deg[c] += 1;
//         }
//       }
//     }
// 
//     recomputeDeg();
//     while (true) {
//       let anyBad = false;
//       for (const [a, b, c] of triples) {
//         if (alive[a] && alive[b] && alive[c]) {
//           anyBad = true;
//           break;
//         }
//       }
//       if (!anyBad) break;
// 
//       let vBest = -1;
//       let dBest = -1;
//       for (let v = 0; v < n; v += 1) {
//         if (!alive[v]) continue;
//         if (deg[v] > dBest) {
//           dBest = deg[v];
//           vBest = v;
//         }
//       }
//       if (vBest < 0) break;
//       alive[vBest] = false;
//       recomputeDeg();
//     }
// 
//     const removed = [];
//     for (let v = 0; v < n; v += 1) if (!alive[v]) removed.push(v);
// 
//     function canAdd(v) {
//       for (const [a, b, c] of triples) {
//         if (a !== v && b !== v && c !== v) continue;
//         const aa = a === v ? true : alive[a];
//         const bb = b === v ? true : alive[b];
//         const cc = c === v ? true : alive[c];
//         if (aa && bb && cc) return false;
//       }
//       return true;
//     }
// 
//     let improved = true;
//     while (improved) {
//       improved = false;
//       for (const v of removed) {
//         if (alive[v]) continue;
//         if (canAdd(v)) {
//           alive[v] = true;
//           improved = true;
//         }
//       }
//     }
// 
//     let sz = 0;
//     for (let v = 0; v < n; v += 1) if (alive[v]) sz += 1;
//     return { size: sz, num_triples: triples.length, max_collinear_original: st.maxCollinear };
//   }
// 
//   const rows = [];
//   for (const n of [28, 36, 44, 52]) {
//     let best = { size: 0, num_triples: 0, max_collinear_original: 0 };
//     for (let r = 0; r < 16; r += 1) {
//       const pts = buildNo4Set(n, 41);
//       const cur = maxNo3SubsetHeuristic(pts);
//       if (cur.size > best.size) best = cur;
//     }
// 
//     rows.push({
//       n,
//       best_no3_subset_size_from_no4_instance: best.size,
//       ratio_over_sqrt_n: Number((best.size / Math.sqrt(n)).toPrecision(7)),
//       ratio_over_n: Number((best.size / n).toPrecision(7)),
//       triples_in_source_instance: best.num_triples,
//       source_max_collinear: best.max_collinear_original,
//     });
//   }
// 
//   out.results.ep589 = {
//     description: 'Heuristic lower bounds for g(n) via no-4-collinear instances and extracted no-3-collinear subsets.',
//     rows,
//   };
// }
// 
// // EP-591 and EP-592: toy finite Ramsey analogue (R(3,3)=6) and status marker.
// {
//   function hasMonoTriangle(mask, N) {
//     let e = 0;
//     const idx = Array.from({ length: N }, () => Array(N).fill(-1));
//     for (let i = 0; i < N; i += 1) {
//       for (let j = i + 1; j < N; j += 1) {
//         idx[i][j] = e;
//         idx[j][i] = e;
//         e += 1;
//       }
//     }
// 
//     for (let a = 0; a < N; a += 1) {
//       for (let b = a + 1; b < N; b += 1) {
//         for (let c = b + 1; c < N; c += 1) {
//           const ab = ((mask >> BigInt(idx[a][b])) & 1n) === 1n;
//           const ac = ((mask >> BigInt(idx[a][c])) & 1n) === 1n;
//           const bc = ((mask >> BigInt(idx[b][c])) & 1n) === 1n;
//           if ((ab && ac && bc) || (!ab && !ac && !bc)) return true;
//         }
//       }
//     }
//     return false;
//   }
// 
//   function ramsey33Exact() {
//     for (let N = 3; N <= 7; N += 1) {
//       const E = choose2(N);
//       const total = 1n << BigInt(E);
//       let allForced = true;
//       for (let m = 0n; m < total; m += 1n) {
//         if (!hasMonoTriangle(m, N)) {
//           allForced = false;
//           break;
//         }
//       }
//       if (allForced) return N;
//     }
//     return null;
//   }
// 
//   const r33 = ramsey33Exact();
// 
//   out.results.ep591 = {
//     description: 'Ordinal statement itself is theorem-level; finite toy analogue confirms R(3,3)=6.',
//     toy_finite_ramsey_result: {
//       R_3_3_exact: r33,
//     },
//   };
// 
//   out.results.ep592 = {
//     description: 'General partition-ordinal classification has no faithful finite proxy; retained toy baseline from triangle-Ramsey core.',
//     toy_reference: {
//       R_3_3_exact: r33,
//     },
//   };
// }
// ==== End Batch Split Integrations ====
