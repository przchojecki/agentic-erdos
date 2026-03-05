#!/usr/bin/env node
const meta={problem:'EP-165',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-165 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch6_quick_compute.mjs | finite triangle-free process proxy for off-diagonal Ramsey scale. ----
// // EP-165: finite triangle-free process proxy for off-diagonal Ramsey scale.
// {
//   function triangleFreeProcess(n) {
//     const edges = [];
//     for (let u = 0; u < n; u += 1) for (let v = u + 1; v < n; v += 1) edges.push([u, v]);
//     shuffle(edges, rng);
// 
//     const adj = Array.from({ length: n }, () => new Uint8Array(n));
//     let m = 0;
//     for (const [u, v] of edges) {
//       let createsTri = false;
//       for (let w = 0; w < n; w += 1) {
//         if (adj[u][w] && adj[v][w]) {
//           createsTri = true;
//           break;
//         }
//       }
//       if (createsTri) continue;
//       adj[u][v] = 1;
//       adj[v][u] = 1;
//       m += 1;
//     }
//     return { adj, edges: m };
//   }
// 
//   function greedyIndependentSize(adj, trials = 24) {
//     const n = adj.length;
//     let best = 0;
//     for (let t = 0; t < trials; t += 1) {
//       const ord = Array.from({ length: n }, (_, i) => i);
//       shuffle(ord, rng);
//       const dead = new Uint8Array(n);
//       let sz = 0;
//       for (const v of ord) {
//         if (dead[v]) continue;
//         sz += 1;
//         dead[v] = 1;
//         for (let u = 0; u < n; u += 1) if (adj[v][u]) dead[u] = 1;
//       }
//       if (sz > best) best = sz;
//     }
//     return best;
//   }
// 
//   const rows = [];
//   for (const k of [20, 30, 40, 50]) {
//     const cand = [0.45, 0.55, 0.65, 0.75].map((c) => Math.max(12, Math.floor((c * k * k) / Math.log(k))));
//     let bestN = null;
//     for (const n of cand) {
//       let found = false;
//       let bestAlpha = Infinity;
//       for (let t = 0; t < 6; t += 1) {
//         const g = triangleFreeProcess(n);
//         const alphaEst = greedyIndependentSize(g.adj, 20);
//         if (alphaEst < bestAlpha) bestAlpha = alphaEst;
//         if (alphaEst < k) found = true;
//       }
//       rows.push({
//         k,
//         n_tested: n,
//         six_runs_min_greedy_independent_size: bestAlpha,
//         witness_alpha_less_than_k_found: found,
//       });
//       if (found) bestN = n;
//     }
//     rows.push({
//       k,
//       empirical_lower_bound_n_with_alpha_less_k: bestN,
//       k2_over_logn: Number((k * k / Math.log(k)).toFixed(3)),
//       empirical_ratio_n_over_k2_over_logn: bestN ? Number((bestN / (k * k / Math.log(k))).toFixed(6)) : null,
//     });
//   }
// 
//   out.results.ep165 = {
//     description: 'Triangle-free process finite proxy for R(3,k) lower-scale constants.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
