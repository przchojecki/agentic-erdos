#!/usr/bin/env node
const meta={problem:'EP-1017',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1017 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch22_quick_compute.mjs | edge-disjoint triangle packing in K4-free graphs above n^2/4 via explicit constructions. ----
// // EP-1017: edge-disjoint triangle packing in K4-free graphs above n^2/4 via explicit constructions.
// {
//   const rng = makeRng(20260304 ^ 1017);
//   const rows = [];
//   for (const n of [20, 26, 32]) {
//     const base = Math.floor((n * n) / 4);
//     for (const q of [1, 2, 3, 4, 5]) {
//       const G = buildBipartitePlusInternalEdges(n, q, rng);
//       const { best, triangle_count } = greedyEdgeDisjointTrianglePacking(G.adj, rng, 60);
//       rows.push({
//         n,
//         edges: G.m,
//         floor_n2_over_4: base,
//         q_above_threshold: G.m - base,
//         total_triangles_in_graph: triangle_count,
//         best_greedy_edge_disjoint_triangles_found: best,
//         verifies_best_ge_q_in_greedy_trials: best >= q,
//       });
//     }
//   }
// 
//   out.results.ep1017 = {
//     description: 'Finite exact packing checks for K4-free constructions with edges floor(n^2/4)+q.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
