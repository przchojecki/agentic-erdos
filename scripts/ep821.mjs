#!/usr/bin/env node
const meta={problem:'EP-821',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-821 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch18_quick_compute.mjs | totient preimage multiplicity scan. ----
// // EP-821: totient preimage multiplicity scan.
// {
//   const N = 500_000;
//   const phi = Array.from({ length: N + 1 }, (_, i) => i);
//   for (let p = 2; p <= N; p += 1) {
//     if (phi[p] !== p) continue;
//     for (let k = p; k <= N; k += p) {
//       phi[k] -= Math.floor(phi[k] / p);
//     }
//   }
// 
//   const freq = new Uint32Array(N + 1);
//   for (let m = 1; m <= N; m += 1) {
//     const v = phi[m];
//     if (v <= N) freq[v] += 1;
//   }
// 
//   let bestN = 1;
//   let bestG = 0;
//   const tops = [];
//   for (let n = 1; n <= N; n += 1) {
//     const g = freq[n];
//     if (g > bestG) {
//       bestG = g;
//       bestN = n;
//     }
//     if (g >= 20) tops.push({ n, g });
//   }
// 
//   const topSorted = tops.sort((a, b) => b.g - a.g || a.n - b.n).slice(0, 30);
// 
//   out.results.ep821 = {
//     description: 'Finite scan of g(n)=#{m:phi(m)=n} for n up to 5e5.',
//     N,
//     max_g_n_found: bestG,
//     argmax_n_found: bestN,
//     max_exponent_log_g_over_log_n: Number((Math.log(bestG) / Math.log(bestN)).toPrecision(7)),
//     top_values: topSorted,
//   };
// }
// ==== End Batch Split Integrations ====
