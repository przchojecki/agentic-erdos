#!/usr/bin/env node
const meta={problem:'EP-84',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-84 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch3_quick_compute.mjs | exact small-n cycle-set counts. ----
// // EP-84: exact small-n cycle-set counts.
// {
//   function hasCycleLen(adj, n, L) {
//     const used = new Uint8Array(n);
//     function dfs(start, cur, depth) {
//       if (depth === L) return adj[cur][start] === 1;
//       used[cur] = 1;
//       for (let nxt = 0; nxt < n; nxt += 1) {
//         if (!adj[cur][nxt]) continue;
//         if (used[nxt]) continue;
//         if (nxt < start) continue;
//         if (dfs(start, nxt, depth + 1)) {
//           used[cur] = 0;
//           return true;
//         }
//       }
//       used[cur] = 0;
//       return false;
//     }
//     for (let s = 0; s < n; s += 1) {
//       used.fill(0);
//       if (dfs(s, s, 1)) return true;
//     }
//     return false;
//   }
// 
//   const rows = [];
//   for (let n = 3; n <= 7; n += 1) {
//     const edges = addEdgeList(n);
//     const E = edges.length;
//     const totalGraphs = 1 << E;
//     const lim = n <= 6 ? totalGraphs : 30000;
//     const sets = new Set();
//     for (let mask = 0; mask < lim; mask += 1) {
//       const adj = Array.from({ length: n }, () => new Uint8Array(n));
//       for (let e = 0; e < E; e += 1) {
//         if (((mask >>> e) & 1) === 0) continue;
//         const [u, v] = edges[e];
//         adj[u][v] = 1;
//         adj[v][u] = 1;
//       }
//       let cycMask = 0;
//       for (let L = 3; L <= n; L += 1) {
//         if (hasCycleLen(adj, n, L)) cycMask |= 1 << (L - 3);
//       }
//       sets.add(cycMask);
//     }
//     rows.push({
//       n,
//       graphs_processed: lim,
//       total_graphs_if_exhaustive: totalGraphs,
//       distinct_cycle_sets_found: sets.size,
//       normalized_over_2_pow_n: Number((sets.size / 2 ** n).toFixed(6)),
//       exact: n <= 6,
//     });
//   }
//   out.results.ep84 = {
//     description: 'Small-n cycle-set counting profile (exact for n<=6, sampled for n=7).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
