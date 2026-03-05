#!/usr/bin/env node
const meta={problem:'EP-408',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-408 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch12_quick_compute.mjs | iterated phi depth and coarse largest-prime-factor profile. ----
// // EP-408: iterated phi depth and coarse largest-prime-factor profile.
// {
//   const N = 300000;
//   const f = new Uint16Array(N + 1);
//   f[1] = 0;
//   for (let n = 2; n <= N; n += 1) f[n] = f[phi[n]] + 1;
// 
//   const milestones = [10000, 50000, 100000, 200000, 300000];
//   const mset = new Set(milestones);
// 
//   const rows = [];
//   let sumRatio = 0;
//   let sumSqRatio = 0;
//   let cnt = 0;
//   let fracLpfLeN01 = 0;
//   let fracLpfLeN005 = 0;
// 
//   for (let n = 3; n <= N; n += 1) {
//     const r = f[n] / Math.log(n);
//     sumRatio += r;
//     sumSqRatio += r * r;
//     cnt += 1;
// 
//     const k = Math.max(1, Math.floor(Math.log(Math.log(n))));
//     let x = n;
//     for (let t = 0; t < k; t += 1) x = phi[x];
// 
//     const lp = lpf[x];
//     if (lp <= n ** 0.1) fracLpfLeN01 += 1;
//     if (lp <= n ** 0.05) fracLpfLeN005 += 1;
// 
//     if (mset.has(n)) {
//       const mean = sumRatio / cnt;
//       const varr = Math.max(0, sumSqRatio / cnt - mean * mean);
//       rows.push({
//         X: n,
//         mean_f_over_log: Number(mean.toPrecision(7)),
//         std_f_over_log: Number(Math.sqrt(varr).toPrecision(7)),
//         fraction_lpf_phi_loglog_le_n_pow_0_1: Number((fracLpfLeN01 / cnt).toPrecision(6)),
//         fraction_lpf_phi_loglog_le_n_pow_0_05: Number((fracLpfLeN005 / cnt).toPrecision(6)),
//       });
//     }
//   }
// 
//   out.results.ep408 = {
//     description: 'Finite distribution proxies for f(n)=min{k:phi_k(n)=1} and lpf(phi_{loglog n}(n)).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
