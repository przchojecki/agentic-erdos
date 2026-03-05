#!/usr/bin/env node
const meta={problem:'EP-520',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-520 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch13_quick_compute.mjs | random multiplicative function partial-sum limsup proxies. ----
// // EP-520: random multiplicative function partial-sum limsup proxies.
// {
//   const N = 300000;
//   const trials = 24;
//   const primeList = primes.filter((p) => p <= N);
//   const rng = makeRng(20260303 ^ 1306);
// 
//   const limsupRows = [];
//   const samplePathMilestones = [5000, 20000, 50000, 100000, 200000, 300000];
//   const samplePath = [];
// 
//   for (let tr = 0; tr < trials; tr += 1) {
//     const sign = new Int8Array(N + 1);
//     for (const p of primeList) sign[p] = rng() < 0.5 ? -1 : 1;
// 
//     const f = new Int8Array(N + 1);
//     f[1] = 1;
//     let S = 0;
//     let limsupLIL = -Infinity;
//     let limsupQuarter = -Infinity;
// 
//     for (let n = 1; n <= N; n += 1) {
//       if (n > 1) {
//         const p = spf[n];
//         const m = Math.floor(n / p);
//         if (m % p === 0) f[n] = 0;
//         else f[n] = f[m] * sign[p];
//       }
//       S += f[n];
// 
//       if (n >= 20) {
//         const ll = Math.log(Math.log(n));
//         const rL = S / Math.sqrt(n * ll);
//         const rQ = Math.abs(S) / (Math.sqrt(n) * (ll ** 0.25));
//         if (rL > limsupLIL) limsupLIL = rL;
//         if (rQ > limsupQuarter) limsupQuarter = rQ;
//       }
// 
//       if (tr === 0 && samplePathMilestones.includes(n)) {
//         const ll = Math.log(Math.log(n));
//         samplePath.push({
//           n,
//           S_n: S,
//           S_over_sqrt_n_loglog_n: Number((S / Math.sqrt(n * ll)).toPrecision(7)),
//           absS_over_sqrt_n_loglog_quarter: Number((Math.abs(S) / (Math.sqrt(n) * (ll ** 0.25))).toPrecision(7)),
//         });
//       }
//     }
// 
//     limsupRows.push({ trial: tr + 1, limsup_lil_norm: limsupLIL, limsup_quarter_norm: limsupQuarter });
//   }
// 
//   const lilVals = limsupRows.map((r) => r.limsup_lil_norm).sort((a, b) => a - b);
//   const qVals = limsupRows.map((r) => r.limsup_quarter_norm).sort((a, b) => a - b);
// 
//   function quant(arr, q) {
//     const i = Math.max(0, Math.min(arr.length - 1, Math.floor(q * (arr.length - 1))));
//     return arr[i];
//   }
// 
//   out.results.ep520 = {
//     description: 'Monte-Carlo limsup proxies for partial sums of random Rademacher multiplicative functions.',
//     N,
//     trials,
//     summary: {
//       lil_norm_mean: Number((lilVals.reduce((a, b) => a + b, 0) / lilVals.length).toPrecision(7)),
//       lil_norm_median: Number(quant(lilVals, 0.5).toPrecision(7)),
//       lil_norm_q90: Number(quant(lilVals, 0.9).toPrecision(7)),
//       quarter_norm_mean: Number((qVals.reduce((a, b) => a + b, 0) / qVals.length).toPrecision(7)),
//       quarter_norm_median: Number(quant(qVals, 0.5).toPrecision(7)),
//       quarter_norm_q90: Number(quant(qVals, 0.9).toPrecision(7)),
//     },
//     sample_path_trial_1: samplePath,
//   };
// }
// ==== End Batch Split Integrations ====
