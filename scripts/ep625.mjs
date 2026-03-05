#!/usr/bin/env node
const meta={problem:'EP-625',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-625 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch16_quick_compute.mjs | random graph estimates for chi(G)-zeta(G). ----
// // EP-625: random graph estimates for chi(G)-zeta(G).
// {
//   const rng = makeRng(20260304 ^ 1602);
// 
//   function randomGraph(n, p = 0.5) {
//     const G = makeGraph(n);
//     for (let i = 0; i < n; i += 1) {
//       for (let j = i + 1; j < n; j += 1) {
//         if (rng() < p) addEdge(G, i, j);
//       }
//     }
//     return G;
//   }
// 
//   function greedyChiUpper(G, restarts = 12) {
//     const n = G.n;
//     let best = n;
// 
//     for (let r = 0; r < restarts; r += 1) {
//       const order = Array.from({ length: n }, (_, i) => i);
//       shuffle(order, rng);
//       const col = Array(n).fill(-1);
//       let maxC = -1;
// 
//       for (const v of order) {
//         const used = new Set();
//         for (const u of G.neigh[v]) {
//           if (col[u] >= 0) used.add(col[u]);
//         }
//         let c = 0;
//         while (used.has(c)) c += 1;
//         col[v] = c;
//         if (c > maxC) maxC = c;
//       }
// 
//       const num = maxC + 1;
//       if (num < best) best = num;
//     }
//     return best;
//   }
// 
//   function greedyZetaUpper(G, restarts = 16) {
//     const n = G.n;
//     let best = n;
// 
//     for (let r = 0; r < restarts; r += 1) {
//       const order = Array.from({ length: n }, (_, i) => i);
//       shuffle(order, rng);
// 
//       const classes = []; // {type:0 unknown,1 clique,2 indep, verts:number[]}
// 
//       for (const v of order) {
//         let placed = false;
// 
//         // best-fit heuristic: prefer class with largest size.
//         const idx = Array.from({ length: classes.length }, (_, i) => i);
//         idx.sort((a, b) => classes[b].verts.length - classes[a].verts.length);
// 
//         for (const ci of idx) {
//           const C = classes[ci];
//           if (C.type === 1) {
//             let ok = true;
//             for (const u of C.verts) {
//               if (!G.adj[u][v]) {
//                 ok = false;
//                 break;
//               }
//             }
//             if (!ok) continue;
//             C.verts.push(v);
//             placed = true;
//             break;
//           } else if (C.type === 2) {
//             let ok = true;
//             for (const u of C.verts) {
//               if (G.adj[u][v]) {
//                 ok = false;
//                 break;
//               }
//             }
//             if (!ok) continue;
//             C.verts.push(v);
//             placed = true;
//             break;
//           } else {
//             const u = C.verts[0];
//             C.verts.push(v);
//             C.type = G.adj[u][v] ? 1 : 2;
//             placed = true;
//             break;
//           }
//         }
// 
//         if (!placed) {
//           classes.push({ type: 0, verts: [v] });
//         }
//       }
// 
//       if (classes.length < best) best = classes.length;
//     }
// 
//     return best;
//   }
// 
//   const rows = [];
//   for (const [n, trials] of [[60, 8], [90, 6], [120, 5]]) {
//     let sumChi = 0;
//     let sumZeta = 0;
//     let minDiff = Infinity;
//     let maxDiff = -Infinity;
// 
//     for (let t = 0; t < trials; t += 1) {
//       const G = randomGraph(n, 0.5);
//       const chi = greedyChiUpper(G, 14);
//       const zeta = greedyZetaUpper(G, 18);
//       const diff = chi - zeta;
// 
//       sumChi += chi;
//       sumZeta += zeta;
//       if (diff < minDiff) minDiff = diff;
//       if (diff > maxDiff) maxDiff = diff;
//     }
// 
//     rows.push({
//       n,
//       trials,
//       avg_greedy_chi_upper: Number((sumChi / trials).toPrecision(7)),
//       avg_greedy_zeta_upper: Number((sumZeta / trials).toPrecision(7)),
//       avg_gap_chi_minus_zeta: Number(((sumChi - sumZeta) / trials).toPrecision(7)),
//       min_gap_observed: minDiff,
//       max_gap_observed: maxDiff,
//     });
//   }
// 
//   out.results.ep625 = {
//     description: 'Heuristic random-graph profile for chromatic minus cochromatic number.',
//     rows,
//   };
// }
// 
// // EP-633 + EP-634: arithmetic coverage map from known constructive families.
// {
//   const NMAX = 260;
//   const represented = new Set();
// 
//   // Universal square construction.
//   for (let n = 1; n * n <= NMAX; n += 1) represented.add(n * n);
// 
//   // Soifer families.
//   for (let n = 1; n * n <= NMAX; n += 1) {
//     for (const c of [2, 3, 6]) {
//       const v = c * n * n;
//       if (v <= NMAX) represented.add(v);
//     }
//   }
// 
//   for (let a = 1; a * a <= NMAX; a += 1) {
//     for (let b = 1; b * b <= NMAX; b += 1) {
//       const v = a * a + b * b;
//       if (v <= NMAX) represented.add(v);
//     }
//   }
// 
//   // Zhang 2025 family: n^2 * a * b for n >= 3*ceil((a^2+b^2+ab-a-b)/(ab)), a>=b.
//   for (let a = 1; a <= 10; a += 1) {
//     for (let b = 1; b <= a; b += 1) {
//       const thresh = 3 * Math.ceil((a * a + b * b + a * b - a - b) / (a * b));
//       for (let n = Math.max(1, thresh); n <= 20; n += 1) {
//         const v = n * n * a * b;
//         if (v <= NMAX) represented.add(v);
//       }
//     }
//   }
// 
//   const missing = [];
//   const nonSquareRepresented = [];
//   for (let x = 1; x <= NMAX; x += 1) {
//     if (!represented.has(x)) missing.push(x);
//     const rt = Math.floor(Math.sqrt(x));
//     if (represented.has(x) && rt * rt !== x) nonSquareRepresented.push(x);
//   }
// 
//   out.results.ep633 = {
//     description: 'Finite arithmetic map illustrating abundance of non-square congruent-tiling counts from known families.',
//     NMAX,
//     represented_non_square_count_up_to_NMAX: nonSquareRepresented.length,
//     first_40_represented_non_squares: nonSquareRepresented.slice(0, 40),
//   };
// 
//   out.results.ep634 = {
//     description: 'Coverage of n-values reachable by currently recorded constructive families.',
//     NMAX,
//     represented_count_up_to_NMAX: represented.size,
//     missing_count_up_to_NMAX: missing.length,
//     first_50_missing_values: missing.slice(0, 50),
//     checks: {
//       contains_7: represented.has(7),
//       contains_11: represented.has(11),
//       contains_19: represented.has(19),
//     },
//   };
// }
// ==== End Batch Split Integrations ====
