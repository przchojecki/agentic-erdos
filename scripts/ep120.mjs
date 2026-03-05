#!/usr/bin/env node
const meta={problem:'EP-120',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-120 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch4_quick_compute.mjs | finite discrete affine-copy avoidance for geometric-pattern proxies. ----
// // EP-120: finite discrete affine-copy avoidance for geometric-pattern proxies.
// {
//   const rows = [];
//   for (const m of [4, 5, 6]) {
//     for (const N of [128, 256, 384]) {
//       rows.push(affineAvoidanceDensityFinitePower2(m, N, rng, 24));
//     }
//   }
//   out.results.ep120 = {
//     description: 'Finite proxy: large subsets of [1,N] avoiding affine copies of {1,2,4,...,2^(m-1)}.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
