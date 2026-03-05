#!/usr/bin/env node
const meta={problem:'EP-1053',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1053 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch23_quick_compute.mjs | finite profile of multiply-perfect multipliers k = sigma(n)/n. ----
// // EP-1053: finite profile of multiply-perfect multipliers k = sigma(n)/n.
// {
//   const N = 1_000_000;
//   const topByK = new Map();
//   const probes = new Set([100_000, 300_000, 600_000, 1_000_000]);
//   const probeRows = [];
//   let runningMaxK = 0;
//   let argAtMax = 1;
//   let countKge3 = 0;
// 
//   for (let n = 2; n <= N; n += 1) {
//     const s = sigma[n];
//     if (s % n !== 0) {
//       if (probes.has(n)) {
//         probeRows.push({
//           n,
//           running_max_k: runningMaxK,
//           n_attaining_running_max_k: argAtMax,
//           count_k_ge_3_up_to_n: countKge3,
//         });
//       }
//       continue;
//     }
//     const k = s / n;
//     if (k > runningMaxK) {
//       runningMaxK = k;
//       argAtMax = n;
//     }
//     if (k >= 3) countKge3 += 1;
//     const prev = topByK.get(k);
//     if (!prev || n > prev.max_n) topByK.set(k, { max_n: n, sample: prev ? prev.sample : [] });
//     if (topByK.get(k).sample.length < 4) topByK.get(k).sample.push(n);
// 
//     if (probes.has(n)) {
//       probeRows.push({
//         n,
//         running_max_k: runningMaxK,
//         n_attaining_running_max_k: argAtMax,
//         count_k_ge_3_up_to_n: countKge3,
//       });
//     }
//   }
// 
//   const topKRows = [...topByK.entries()]
//     .sort((a, b) => b[0] - a[0])
//     .slice(0, 8)
//     .map(([k, v]) => ({ k, max_n_with_this_k_up_to_N: v.max_n, sample_n: v.sample }));
// 
//   out.results.ep1053 = {
//     description: 'Finite scan of integer multipliers k with sigma(n)=k*n.',
//     N,
//     probe_rows: probeRows,
//     top_k_rows: topKRows,
//   };
// }
// ==== End Batch Split Integrations ====
