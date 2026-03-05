#!/usr/bin/env node
const meta={problem:'EP-711',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-711 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch17_quick_compute.mjs | finite matching computation for f(n,m). ----
// // EP-711: finite matching computation for f(n,m).
// {
//   function hopcroftKarp(adj) {
//     const nL = adj.length;
//     const nR = Math.max(...adj.flat(), -1) + 1;
//     const pairU = Array(nL).fill(-1);
//     const pairV = Array(nR).fill(-1);
//     const dist = Array(nL).fill(0);
// 
//     function bfs() {
//       const q = [];
//       for (let u = 0; u < nL; u += 1) {
//         if (pairU[u] === -1) {
//           dist[u] = 0;
//           q.push(u);
//         } else {
//           dist[u] = -1;
//         }
//       }
// 
//       let found = false;
//       for (let qi = 0; qi < q.length; qi += 1) {
//         const u = q[qi];
//         for (const v of adj[u]) {
//           const u2 = pairV[v];
//           if (u2 >= 0 && dist[u2] < 0) {
//             dist[u2] = dist[u] + 1;
//             q.push(u2);
//           }
//           if (u2 === -1) found = true;
//         }
//       }
//       return found;
//     }
// 
//     function dfs(u) {
//       for (const v of adj[u]) {
//         const u2 = pairV[v];
//         if (u2 === -1 || (dist[u2] === dist[u] + 1 && dfs(u2))) {
//           pairU[u] = v;
//           pairV[v] = u;
//           return true;
//         }
//       }
//       dist[u] = -1;
//       return false;
//     }
// 
//     let matching = 0;
//     while (bfs()) {
//       for (let u = 0; u < nL; u += 1) {
//         if (pairU[u] === -1 && dfs(u)) matching += 1;
//       }
//     }
// 
//     return matching;
//   }
// 
//   function hasFeasible(n, m, L) {
//     const left = n;
//     const rightSize = L;
//     const adj = Array.from({ length: left }, () => []);
// 
//     for (let k = 1; k <= n; k += 1) {
//       for (let t = m + 1; t <= m + L; t += 1) {
//         if (t % k === 0) adj[k - 1].push(t - (m + 1));
//       }
//       if (!adj[k - 1].length) return false;
//     }
// 
//     const mat = hopcroftKarp(adj);
//     return mat === n;
//   }
// 
//   function fnm(n, m) {
//     let lo = n;
//     let hi = 4 * n;
//     while (!hasFeasible(n, m, hi)) hi *= 2;
//     while (lo < hi) {
//       const mid = Math.floor((lo + hi) / 2);
//       if (hasFeasible(n, m, mid)) hi = mid;
//       else lo = mid + 1;
//     }
//     return lo;
//   }
// 
//   const rows = [];
//   for (const n of [20, 30, 40]) {
//     const base = fnm(n, n);
//     let best = base;
//     let bestM = n;
//     for (let m = n; m <= n + 350; m += 1) {
//       const v = fnm(n, m);
//       if (v > best) {
//         best = v;
//         bestM = m;
//       }
//     }
// 
//     rows.push({
//       n,
//       f_n_n: base,
//       max_f_n_m_sampled_m_in_n_to_n_plus_350: best,
//       argmax_m_sampled: bestM,
//       sampled_gap_max_minus_f_n_n: best - base,
//       max_over_n: Number((best / n).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep711 = {
//     description: 'Exact finite matching computation for f(n,m) over sampled m-ranges.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
