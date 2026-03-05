#!/usr/bin/env node
const meta={problem:'EP-986',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-986 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch22_quick_compute.mjs | finite random triangle-free constructions and exact independence profile (k=3 proxy). ----
// // EP-986: finite random triangle-free constructions and exact independence profile (k=3 proxy).
// {
//   const rng = makeRng(20260304 ^ 986);
//   const rows = [];
// 
//   for (const n of [22, 26, 30]) {
//     let bestEdge = -1;
//     let bestAlpha = null;
// 
//     for (let t = 0; t < 12; t += 1) {
//       const G = triangleFreeProcess(n, rng);
//       const masksComp = Array(n).fill(0n);
//       for (let i = 0; i < n; i += 1) {
//         let m = 0n;
//         for (let j = 0; j < n; j += 1) {
//           if (i === j) continue;
//           if (!G.adj[i][j]) m |= 1n << BigInt(j);
//         }
//         masksComp[i] = m;
//       }
//       const alpha = maxCliqueSizeFromAdjMasks(masksComp, n);
//       if (G.m > bestEdge || (G.m === bestEdge && alpha < bestAlpha)) {
//         bestEdge = G.m;
//         bestAlpha = alpha;
//       }
//     }
// 
//     rows.push({
//       n,
//       best_triangle_free_edges_found: bestEdge,
//       corresponding_independence_number_alpha: bestAlpha,
//       implied_lower_bound_R_3_alpha_plus_1_gt_n: `R(3,${bestAlpha + 1}) > ${n}`,
//       edge_scale_over_n_3_over_2: Number((bestEdge / (n ** 1.5)).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep986 = {
//     description: 'Finite k=3 proxy: random triangle-free process with exact alpha(G) on sampled best graphs.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
