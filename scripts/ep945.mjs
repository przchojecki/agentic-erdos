#!/usr/bin/env node
const meta={problem:'EP-945',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-945 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch21_quick_compute.mjs | longest run with distinct tau(n) values up to x. ----
// // EP-945: longest run with distinct tau(n) values up to x.
// {
//   const X = 2_000_000;
//   const tau = new Uint16Array(X + 1);
//   for (let d = 1; d <= X; d += 1) {
//     for (let m = d; m <= X; m += d) tau[m] += 1;
//   }
// 
//   let maxTau = 0;
//   for (let i = 1; i <= X; i += 1) {
//     if (tau[i] > maxTau) maxTau = tau[i];
//   }
//   const lastPos = new Int32Array(maxTau + 1);
//   lastPos.fill(0);
// 
//   let left = 1;
//   let best = 0;
//   const scales = new Set([10_000, 100_000, 500_000, 1_000_000, 2_000_000]);
//   const rows = [];
// 
//   for (let i = 1; i <= X; i += 1) {
//     const t = tau[i];
//     if (lastPos[t] >= left) left = lastPos[t] + 1;
//     lastPos[t] = i;
//     const len = i - left + 1;
//     if (len > best) best = len;
// 
//     if (scales.has(i)) {
//       rows.push({
//         x: i,
//         F_x_finite_proxy: best,
//         over_log_x: Number((best / Math.log(i)).toPrecision(7)),
//       });
//     }
//   }
// 
//   out.results.ep945 = {
//     description: 'Finite profile of maximal consecutive runs with pairwise distinct divisor counts.',
//     X,
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
