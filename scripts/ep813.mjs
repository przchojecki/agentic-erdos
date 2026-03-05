#!/usr/bin/env node
const meta={problem:'EP-813',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-813 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch18_quick_compute.mjs | sampled graphs with local 7-vertex triangle condition and clique size. ----
// // EP-813: sampled graphs with local 7-vertex triangle condition and clique size.
// {
//   const rng = makeRng(20260304 ^ 1806);
// 
//   function randomGraph(n, p) {
//     const G = makeGraph(n);
//     for (let i = 0; i < n; i += 1) {
//       for (let j = i + 1; j < n; j += 1) {
//         if (rng() < p) addEdge(G, i, j);
//       }
//     }
//     return G;
//   }
// 
//   function sampledLocalViolations(G, samples) {
//     const n = G.n;
//     let bad = 0;
//     for (let s = 0; s < samples; s += 1) {
//       const verts = Array.from({ length: n }, (_, i) => i);
//       shuffle(verts, rng);
//       const A = verts.slice(0, 7);
// 
//       let hasTri = false;
//       for (let i = 0; i < 7 && !hasTri; i += 1) {
//         for (let j = i + 1; j < 7 && !hasTri; j += 1) {
//           if (!G.adj[A[i]][A[j]]) continue;
//           for (let k = j + 1; k < 7; k += 1) {
//             if (G.adj[A[i]][A[k]] && G.adj[A[j]][A[k]]) {
//               hasTri = true;
//               break;
//             }
//           }
//         }
//       }
// 
//       if (!hasTri) bad += 1;
//     }
//     return bad;
//   }
// 
//   function cliqueSizeExact(G) {
//     const n = G.n;
//     const masks = Array(n).fill(0n);
//     for (let i = 0; i < n; i += 1) {
//       let m = 0n;
//       for (let j = 0; j < n; j += 1) if (G.adj[i][j]) m |= 1n << BigInt(j);
//       masks[i] = m;
//     }
//     return maxCliqueSizeFromAdjMasks(masks, n);
//   }
// 
//   const rows = [];
//   for (const [n, p, tries] of [[26, 0.52, 30], [30, 0.52, 28], [34, 0.53, 24]]) {
//     let best = null;
//     for (let t = 0; t < tries; t += 1) {
//       const G = randomGraph(n, p);
//       const bad = sampledLocalViolations(G, 12_000);
//       if (best === null || bad < best.bad || (bad === best.bad && G.m < best.m)) {
//         best = { G, bad, m: G.m };
//       }
//     }
// 
//     const clique = cliqueSizeExact(best.G);
//     rows.push({
//       n,
//       edge_count: best.m,
//       sampled_7set_triangle_free_violations_in_12000_samples: best.bad,
//       clique_number_exact: clique,
//       clique_over_n_pow_1_over_3: Number((clique / (n ** (1 / 3))).toPrecision(7)),
//       clique_over_sqrt_n: Number((clique / Math.sqrt(n)).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep813 = {
//     description: 'Sampled local-condition graph search with exact clique computation on best candidates.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
