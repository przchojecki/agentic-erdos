#!/usr/bin/env node
const meta={problem:'EP-944',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-944 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch21_quick_compute.mjs | random search for k=4 vertex-critical graphs with no single critical edge. ----
// // EP-944: random search for k=4 vertex-critical graphs with no single critical edge.
// {
//   const rng = makeRng(20260304 ^ 942);
// 
//   function randomGraph(n, p) {
//     const adj = makeGraph(n);
//     for (let u = 0; u < n; u += 1) {
//       for (let v = u + 1; v < n; v += 1) {
//         if (rng() < p) addEdge(adj, u, v);
//       }
//     }
//     return adj;
//   }
// 
//   function isVertexCriticalK(adj, k) {
//     if (chromaticNumberDSATUR(adj) !== k) return false;
//     for (let v = 0; v < adj.length; v += 1) {
//       const keep = [];
//       for (let u = 0; u < adj.length; u += 1) if (u !== v) keep.push(u);
//       const H = inducedSubgraph(adj, keep);
//       if (chromaticNumberDSATUR(H) >= k) return false;
//     }
//     return true;
//   }
// 
//   function hasSingleCriticalEdge(adj, k) {
//     const E = edgesOfGraph(adj);
//     for (const [u, v] of E) {
//       const H = copyAdj(adj);
//       removeEdge(H, u, v);
//       if (chromaticNumberDSATUR(H) < k) return true;
//     }
//     return false;
//   }
// 
//   const rows = [];
//   const candidates = [];
// 
//   for (const n of [8, 9, 10, 11, 12]) {
//     let sampled = 0;
//     let chi4 = 0;
//     let vc4 = 0;
//     let vc4_no_single_critical_edge = 0;
// 
//     for (let t = 0; t < 260; t += 1) {
//       const p = 0.25 + 0.5 * rng();
//       const G = randomGraph(n, p);
//       sampled += 1;
// 
//       const chi = chromaticNumberDSATUR(G);
//       if (chi !== 4) continue;
//       chi4 += 1;
// 
//       if (!isVertexCriticalK(G, 4)) continue;
//       vc4 += 1;
// 
//       if (!hasSingleCriticalEdge(G, 4)) {
//         vc4_no_single_critical_edge += 1;
//         if (candidates.length < 3) {
//           candidates.push({
//             n,
//             edge_count: edgesOfGraph(G).length,
//             adjacency_bitmasks: G.map((nbrs, i) => {
//               let m = 0;
//               for (const v of nbrs) m |= 1 << v;
//               return { v: i, mask: m };
//             }),
//           });
//         }
//       }
//     }
// 
//     rows.push({
//       n,
//       sampled_graphs: sampled,
//       chi4_graphs: chi4,
//       vertex_critical_chi4_graphs: vc4,
//       vertex_critical_chi4_without_single_critical_edge: vc4_no_single_critical_edge,
//     });
//   }
// 
//   out.results.ep944 = {
//     description: 'Finite random search for k=4 vertex-critical graphs with no critical single edge.',
//     rows,
//     candidate_graphs_if_any: candidates,
//     note: 'Any candidate would require independent verification; non-detection is not evidence of nonexistence.',
//   };
// }
// ==== End Batch Split Integrations ====
