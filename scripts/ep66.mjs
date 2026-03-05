#!/usr/bin/env node
const meta={problem:'EP-66',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-66 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch3_quick_compute.mjs | finite profile for model sets A and 1_A * 1_A(n) / log n. ----
// // EP-66: finite profile for model sets A and 1_A * 1_A(n) / log n.
// {
//   const N = 200000;
//   const models = [];
// 
//   const squares = new Uint8Array(N + 1);
//   for (let t = 1; t * t <= N; t += 1) squares[t * t] = 1;
//   models.push({ name: 'squares', ind: squares });
// 
//   const pset = new Uint8Array(N + 1);
//   for (const p of primes) {
//     if (p > N) break;
//     pset[p] = 1;
//   }
//   models.push({ name: 'primes', ind: pset });
// 
//   const pow2 = new Uint8Array(N + 1);
//   for (let v = 1; v <= N; v *= 2) pow2[v] = 1;
//   models.push({ name: 'powers_of_2', ind: pow2 });
// 
//   const checkpoints = [20000, 50000, 100000, 150000, 200000];
//   const rows = [];
//   for (const model of models) {
//     const vals = [];
//     for (const n of checkpoints) {
//       let r = 0;
//       for (let a = 1; a <= n - 1; a += 1) if (model.ind[a] && model.ind[n - a]) r += 1;
//       vals.push({
//         n,
//         conv_value: r,
//         ratio_over_logn: Number((r / Math.log(n)).toFixed(6)),
//       });
//     }
//     rows.push({ model: model.name, checkpoints: vals });
//   }
//   out.results.ep66 = {
//     description: 'Finite self-convolution-over-log profile for simple model sets.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
