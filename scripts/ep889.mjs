#!/usr/bin/env node
const meta={problem:'EP-889',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-889 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch20_quick_compute.mjs | finite profile of v_0(n) with bounded k-range. ----
// // EP-889: finite profile of v_0(n) with bounded k-range.
// {
//   const N = 2500;
//   const KMAX = 6000;
//   const LIM = N + KMAX + 5;
//   const spf = sieveSPF(LIM);
// 
//   const facs = Array.from({ length: LIM + 1 }, () => []);
//   for (let x = 2; x <= LIM; x += 1) facs[x] = factorDistinct(x, spf);
// 
//   function vBounded(n) {
//     let best = 0;
//     let argk = 0;
//     for (let k = 0; k <= KMAX; k += 1) {
//       const arr = facs[n + k];
//       let c = 0;
//       for (const p of arr) if (p > k) c += 1;
//       if (c > best) {
//         best = c;
//         argk = k;
//       }
//     }
//     return { best, argk };
//   }
// 
//   const v0 = new Int16Array(N + 1);
//   const argk = new Int32Array(N + 1);
//   let globalBest = 0;
//   let globalN = 1;
// 
//   for (let n = 1; n <= N; n += 1) {
//     const v = vBounded(n);
//     v0[n] = v.best;
//     argk[n] = v.argk;
//     if (v.best > globalBest) {
//       globalBest = v.best;
//       globalN = n;
//     }
//   }
// 
//   const rows = [];
//   for (const x of [200, 500, 1000, 1500, 2000, 2500]) {
//     let mn = 1e9;
//     let avg = 0;
//     for (let n = 1; n <= x; n += 1) {
//       if (v0[n] < mn) mn = v0[n];
//       avg += v0[n];
//     }
//     rows.push({
//       N_prefix: x,
//       min_v0_bounded_over_n_le_N: mn,
//       avg_v0_bounded_over_n_le_N: Number((avg / x).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep889 = {
//     description: 'Finite bounded-k profile for v_0(n) type quantity.',
//     N,
//     KMAX,
//     max_v0_bounded_found: globalBest,
//     argmax_n: globalN,
//     argmax_k_for_argmax_n: argk[globalN],
//     rows,
//     note: 'This is max over 0<=k<=KMAX only; unbounded k may be larger.',
//   };
// }
// ==== End Batch Split Integrations ====
