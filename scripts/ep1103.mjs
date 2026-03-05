#!/usr/bin/env node
const meta={problem:'EP-1103',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1103 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch25_quick_compute.mjs | finite greedy growth for infinite squarefree-sumset sequence proxy. ----
// // EP-1103: finite greedy growth for infinite squarefree-sumset sequence proxy.
// {
//   const MAX_A = 20_000;
//   const spf = sieveSPF(2 * MAX_A + 5);
//   const A = [];
// 
//   function compatible(x) {
//     if (!isSquarefree(2 * x, spf)) return false;
//     for (const a of A) {
//       if (!isSquarefree(a + x, spf)) return false;
//     }
//     return true;
//   }
// 
//   for (let x = 1; x <= MAX_A; x += 1) {
//     if (compatible(x)) A.push(x);
//   }
// 
//   const probes = [200, 500, 1000, 2000, 5000, 10000, 20000];
//   const rows = probes.map((x) => ({
//     x,
//     count_a_le_x: A.filter((a) => a <= x).length,
//     count_over_log_x: Number((A.filter((a) => a <= x).length / Math.log(x)).toPrecision(7)),
//   }));
// 
//   out.results.ep1103 = {
//     description: 'Finite greedy-construction proxy for an infinite sequence A with A+A squarefree.',
//     MAX_A,
//     first_terms: A.slice(0, 40),
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
