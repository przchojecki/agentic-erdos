#!/usr/bin/env node
const meta={problem:'EP-82',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-82 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch3_quick_compute.mjs | random-graph lower envelope for max regular induced subgraph size. ----
// // EP-82: random-graph lower envelope for max regular induced subgraph size.
// {
//   const nList = [10, 12, 14, 16];
//   const rows = [];
//   for (const n of nList) {
//     let worst = Infinity;
//     const trials = 40;
//     for (let t = 0; t < trials; t += 1) {
//       const adj = Array.from({ length: n }, () => new Uint8Array(n));
//       for (let i = 0; i < n; i += 1) {
//         for (let j = i + 1; j < n; j += 1) {
//           if (rng() < 0.5) {
//             adj[i][j] = 1;
//             adj[j][i] = 1;
//           }
//         }
//       }
//       const v = maxRegularInducedSubgraphSize(adj);
//       if (v < worst) worst = v;
//     }
//     rows.push({
//       n,
//       trials,
//       worst_max_regular_induced_size_found: worst,
//       ratio_over_logn: Number((worst / Math.log(n)).toFixed(6)),
//     });
//   }
//   out.results.ep82 = {
//     description: 'Random finite lower-envelope for guaranteed regular induced subgraph size.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
