#!/usr/bin/env node
const meta={problem:'EP-1129',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1129 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch26_quick_compute.mjs | finite Lebesgue-constant comparisons for node systems. ----
// // EP-1129: finite Lebesgue-constant comparisons for node systems.
// {
//   function lebesgueConstant(nodes, samples = 4000) {
//     const n = nodes.length;
//     const w = Array(n).fill(1);
//     for (let i = 0; i < n; i += 1) {
//       let den = 1;
//       for (let j = 0; j < n; j += 1) if (i !== j) den *= nodes[i] - nodes[j];
//       w[i] = 1 / den;
//     }
// 
//     let best = 0;
//     for (let s = 0; s <= samples; s += 1) {
//       const x = -1 + (2 * s) / samples;
//       let atNode = -1;
//       for (let i = 0; i < n; i += 1) if (Math.abs(x - nodes[i]) < 1e-12) atNode = i;
//       if (atNode !== -1) {
//         if (1 > best) best = 1;
//         continue;
//       }
//       let denom = 0;
//       const tmp = Array(n).fill(0);
//       for (let i = 0; i < n; i += 1) {
//         tmp[i] = w[i] / (x - nodes[i]);
//         denom += tmp[i];
//       }
//       let sum = 0;
//       for (let i = 0; i < n; i += 1) sum += Math.abs(tmp[i] / denom);
//       if (sum > best) best = sum;
//     }
//     return best;
//   }
// 
//   function equispaced(n) {
//     return [...Array(n).keys()].map((i) => -1 + (2 * i) / (n - 1));
//   }
//   function chebyshevRoots(n) {
//     return [...Array(n).keys()].map((i) => Math.cos(((2 * (i + 1) - 1) * Math.PI) / (2 * n)));
//   }
// 
//   const rows = [];
//   for (const n of [8, 16]) {
//     const lEq = lebesgueConstant(equispaced(n), 4000);
//     const lCh = lebesgueConstant(chebyshevRoots(n), 4000);
//     rows.push({
//       n,
//       lambda_equispaced_est: Number(lEq.toPrecision(8)),
//       lambda_chebyshev_est: Number(lCh.toPrecision(8)),
//       ratio_eq_over_cheb: Number((lEq / lCh).toPrecision(7)),
//     });
//   }
// 
//   // Canonical n=4 symmetric family: nodes (-1,-t,t,1).
//   let bestT = 0;
//   let bestL = Infinity;
//   for (let i = 0; i <= 1000; i += 1) {
//     const t = 0.2 + (0.5 * i) / 1000;
//     const l = lebesgueConstant([-1, -t, t, 1], 4000);
//     if (l < bestL) {
//       bestL = l;
//       bestT = t;
//     }
//   }
// 
//   out.results.ep1129 = {
//     description: 'Finite numerical Lebesgue-constant comparisons and symmetric n=4 canonical search.',
//     rows,
//     n4_symmetric_search: {
//       best_t_est: Number(bestT.toPrecision(7)),
//       lambda_est: Number(bestL.toPrecision(8)),
//       reference_t_from_literature_approx: 0.4177,
//     },
//   };
// }
// ==== End Batch Split Integrations ====
