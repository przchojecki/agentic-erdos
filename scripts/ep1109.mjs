#!/usr/bin/env node
const meta={problem:'EP-1109',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1109 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch25_quick_compute.mjs | finite exact f(N) for A subset [1,N] with (A+A) squarefree. ----
// // EP-1109: finite exact f(N) for A subset [1,N] with (A+A) squarefree.
// {
//   const N_LIST = [30, 40, 50, 60, 70, 80];
//   const NMAX = Math.max(...N_LIST);
//   const spf = sieveSPF(2 * NMAX + 5);
// 
//   function exactF(N) {
//     const allowed = [];
//     for (let i = 1; i <= N; i += 1) if (isSquarefree(2 * i, spf)) allowed.push(i);
//     const m = allowed.length;
//     const compat = Array.from({ length: m }, () => Array(m).fill(false));
//     for (let i = 0; i < m; i += 1) {
//       for (let j = i; j < m; j += 1) {
//         const ok = isSquarefree(allowed[i] + allowed[j], spf);
//         compat[i][j] = ok;
//         compat[j][i] = ok;
//       }
//     }
// 
//     const masks = Array(m).fill(0n);
//     for (let i = 0; i < m; i += 1) {
//       let ms = 0n;
//       for (let j = 0; j < m; j += 1) {
//         if (i === j) continue;
//         if (compat[i][j]) ms |= 1n << BigInt(j);
//       }
//       masks[i] = ms;
//     }
//     return maxCliqueSizeFromAdjMasks(masks, m);
//   }
// 
//   const rows = [];
//   for (const N of N_LIST) {
//     const fN = exactF(N);
//     rows.push({
//       N,
//       exact_f_N: fN,
//       f_over_log_N: Number((fN / Math.log(N)).toPrecision(7)),
//       f_over_sqrt_N: Number((fN / Math.sqrt(N)).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep1109 = {
//     description: 'Exact finite maximum-set computation for A subset [1,N] with all sums squarefree.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
