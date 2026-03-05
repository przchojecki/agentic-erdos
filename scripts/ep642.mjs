#!/usr/bin/env node
const meta={problem:'EP-642',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-642 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch16_quick_compute.mjs | maximize edges under cycle-diagonal constraint (small n exact-check within greedy). ----
// // EP-642: maximize edges under cycle-diagonal constraint (small n exact-check within greedy).
// {
//   const rng = makeRng(20260304 ^ 1604);
// 
//   function hasViolation(G) {
//     const n = G.n;
//     const seenMask = new Map();
// 
//     function checkCycle(path) {
//       let mask = 0;
//       for (const v of path) mask |= 1 << v;
//       if (seenMask.has(mask)) return seenMask.get(mask);
// 
//       const S = path;
//       let mS = 0;
//       for (let i = 0; i < S.length; i += 1) {
//         for (let j = i + 1; j < S.length; j += 1) {
//           if (G.adj[S[i]][S[j]]) mS += 1;
//         }
//       }
// 
//       const viol = mS - S.length >= S.length;
//       seenMask.set(mask, viol);
//       return viol;
//     }
// 
//     for (let s = 0; s < n; s += 1) {
//       const visited = Array(n).fill(false);
//       const path = [s];
//       visited[s] = true;
// 
//       function dfs(u) {
//         for (const v of G.neigh[u]) {
//           if (v < s) continue;
//           if (v === s) {
//             if (path.length >= 3) {
//               const second = path[1];
//               const last = u;
//               if (second < last && checkCycle(path)) return true;
//             }
//             continue;
//           }
//           if (visited[v]) continue;
//           visited[v] = true;
//           path.push(v);
//           const bad = dfs(v);
//           path.pop();
//           visited[v] = false;
//           if (bad) return true;
//         }
//         return false;
//       }
// 
//       if (dfs(s)) return true;
//     }
// 
//     return false;
//   }
// 
//   function greedyMaxNoViolation(n, restarts) {
//     let best = 0;
// 
//     for (let r = 0; r < restarts; r += 1) {
//       const G = makeGraph(n);
//       const edges = allEdges(n);
//       shuffle(edges, rng);
// 
//       for (const [u, v] of edges) {
//         addEdge(G, u, v);
//         if (hasViolation(G)) removeEdge(G, u, v);
//       }
// 
//       if (G.m > best) best = G.m;
//     }
// 
//     return best;
//   }
// 
//   const rows = [];
//   for (const [n, restarts] of [[8, 22], [9, 18], [10, 14]]) {
//     const best = greedyMaxNoViolation(n, restarts);
//     rows.push({
//       n,
//       restarts,
//       best_edges_found: best,
//       best_over_n: Number((best / n).toPrecision(7)),
//       best_over_n_log_n: Number((best / Math.max(1, n * Math.log(n))).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep642 = {
//     description: 'Small-n greedy maxima under exact cycle-diagonal violation checks.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
