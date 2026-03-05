#!/usr/bin/env node
const meta={problem:'EP-545',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-545 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch14_quick_compute.mjs | small-m exact counterexample check for "as complete as possible" maximizer. ----
// // EP-545: small-m exact counterexample check for "as complete as possible" maximizer.
// {
//   function edgeListComplete(N) {
//     const e = [];
//     for (let i = 0; i < N; i += 1) {
//       for (let j = i + 1; j < N; j += 1) e.push([i, j]);
//     }
//     return e;
//   }
// 
//   function graphBitHelpers(N) {
//     const edges = edgeListComplete(N);
//     const idx = Array.from({ length: N }, () => Array(N).fill(-1));
//     edges.forEach(([u, v], i) => {
//       idx[u][v] = i;
//       idx[v][u] = i;
//     });
//     return { edges, idx };
//   }
// 
//   function embeddingEdgeMasks(G, N, idx) {
//     const out = [];
//     const used = Array(N).fill(false);
//     const map = Array(G.v).fill(-1);
// 
//     function dfs(i) {
//       if (i === G.v) {
//         let m = 0n;
//         for (const [a, b] of G.edges) {
//           const e = idx[map[a]][map[b]];
//           m |= 1n << BigInt(e);
//         }
//         out.push(m);
//         return;
//       }
//       for (let x = 0; x < N; x += 1) {
//         if (used[x]) continue;
//         used[x] = true;
//         map[i] = x;
//         dfs(i + 1);
//         used[x] = false;
//       }
//     }
// 
//     dfs(0);
//     return out;
//   }
// 
//   function hasMonoFromMasks(mask, edgeMasks) {
//     for (const em of edgeMasks) {
//       if ((mask & em) === em) return true; // all red
//       if ((mask & em) === 0n) return true; // all blue
//     }
//     return false;
//   }
// 
//   function ramseyDiagonalExact(G, capN = 6) {
//     for (let N = G.v; N <= capN; N += 1) {
//       const { edges, idx } = graphBitHelpers(N);
//       const E = edges.length;
//       const edgeMasks = embeddingEdgeMasks(G, N, idx);
//       const total = 1n << BigInt(E);
//       let foundAvoid = false;
//       for (let m = 0n; m < total; m += 1n) {
//         if (!hasMonoFromMasks(m, edgeMasks)) {
//           foundAvoid = true;
//           break;
//         }
//       }
//       if (!foundAvoid) return N;
//     }
//     return null;
//   }
// 
//   const P3 = { v: 3, edges: [[0, 1], [1, 2]] };
//   const M2 = { v: 4, edges: [[0, 1], [2, 3]] };
//   const K3 = { v: 3, edges: [[0, 1], [0, 2], [1, 2]] };
// 
//   const rows = [
//     { graph: 'P3', m_edges: 2, R_diag_exact_cap6: ramseyDiagonalExact(P3, 6) },
//     { graph: '2K2', m_edges: 2, R_diag_exact_cap6: ramseyDiagonalExact(M2, 6) },
//     { graph: 'K3', m_edges: 3, R_diag_exact_cap6: ramseyDiagonalExact(K3, 6) },
//   ];
// 
//   out.results.ep545 = {
//     description: 'Exact tiny-m diagonal Ramsey checks showing small-edge counterexample behavior.',
//     rows,
//     explicit_m2_counterexample: 'R(2K2)=5 > R(P3)=3 where P3 is the as-complete-as-possible graph for m=2.',
//   };
// }
// ==== End Batch Split Integrations ====
