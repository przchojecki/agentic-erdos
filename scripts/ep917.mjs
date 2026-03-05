#!/usr/bin/env node
const meta={problem:'EP-917',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-917 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch20_quick_compute.mjs | Dirac-type dense critical constructions for k=6. ----
// // EP-917: Dirac-type dense critical constructions for k=6.
// {
//   function diracJoinTwoOddCycles(t) {
//     const m = 2 * t + 1;
//     const n = 2 * m;
//     const adj = makeGraph(n);
// 
//     // First odd cycle on [0, m-1], second on [m,2m-1].
//     for (let i = 0; i < m; i += 1) {
//       addUndirectedEdge(adj, i, (i + 1) % m);
//       addUndirectedEdge(adj, m + i, m + ((i + 1) % m));
//     }
// 
//     // Complete join between two cycles.
//     for (let i = 0; i < m; i += 1) {
//       for (let j = 0; j < m; j += 1) addUndirectedEdge(adj, i, m + j);
//     }
// 
//     return adj;
//   }
// 
//   function edgeList(adj) {
//     const n = adj.length;
//     const outE = [];
//     const seen = new Set();
//     for (let u = 0; u < n; u += 1) {
//       for (const v of adj[u]) {
//         if (u < v) {
//           const key = `${u},${v}`;
//           if (!seen.has(key)) {
//             seen.add(key);
//             outE.push([u, v]);
//           }
//         }
//       }
//     }
//     return outE;
//   }
// 
//   function copyAdj(adj) {
//     return adj.map((x) => [...x]);
//   }
// 
//   function removeEdge(adj, a, b) {
//     adj[a] = adj[a].filter((x) => x !== b);
//     adj[b] = adj[b].filter((x) => x !== a);
//   }
// 
//   const rows = [];
//   for (const t of [2, 3, 4, 5]) {
//     const G = diracJoinTwoOddCycles(t);
//     const n = G.length;
//     const E = edgeList(G);
// 
//     const chiG = chromaticNumberDSATUR(G);
//     let allDrop = true;
// 
//     const sample = E.length <= 80 ? E : E.filter((_, i) => i % Math.floor(E.length / 80) === 0);
//     for (const [u, v] of sample) {
//       const H = copyAdj(G);
//       removeEdge(H, u, v);
//       const chiH = chromaticNumberDSATUR(H);
//       if (!(chiH < chiG)) {
//         allDrop = false;
//         break;
//       }
//     }
// 
//     rows.push({
//       t,
//       n,
//       edge_count: E.length,
//       edge_density_over_n2: Number((E.length / (n * n)).toPrecision(7)),
//       chromatic_number: chiG,
//       tested_edge_criticality_on_sample: allDrop,
//       tested_edges: sample.length,
//       dirac_formula_value_4t2_plus8t_plus3: 4 * t * t + 8 * t + 3,
//     });
//   }
// 
//   out.results.ep917 = {
//     description: 'Finite verification profile for Dirac join-of-two-odd-cycles construction (k=6 case).',
//     rows,
//     note: 'Criticality check is exact on sampled edges only when E is large.',
//   };
// }
// ==== End Batch Split Integrations ====
