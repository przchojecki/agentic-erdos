#!/usr/bin/env node
const meta={problem:'EP-522',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-522 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch14_quick_compute.mjs | count roots in |z|<=1 via argument principle on unit circle. ----
// // EP-522: count roots in |z|<=1 via argument principle on unit circle.
// {
//   const rng = makeRng(20260303 ^ 1401);
// 
//   function windingInside(coeff, M = 2048) {
//     let total = 0;
//     let prevArg = null;
//     let unstable = false;
// 
//     for (let i = 0; i <= M; i += 1) {
//       const t = (2 * Math.PI * i) / M;
//       const ct = Math.cos(t);
//       const st = Math.sin(t);
// 
//       // Evaluate f(e^{it}) by Horner in complex arithmetic.
//       let re = 0;
//       let im = 0;
//       for (let k = coeff.length - 1; k >= 0; k -= 1) {
//         const nre = re * ct - im * st + coeff[k];
//         const nim = re * st + im * ct;
//         re = nre;
//         im = nim;
//       }
// 
//       const mag = Math.hypot(re, im);
//       if (mag < 1e-8) {
//         unstable = true;
//       }
// 
//       const arg = Math.atan2(im, re);
//       if (prevArg !== null) {
//         let d = arg - prevArg;
//         while (d <= -Math.PI) d += 2 * Math.PI;
//         while (d > Math.PI) d -= 2 * Math.PI;
//         total += d;
//       }
//       prevArg = arg;
//     }
// 
//     const w = Math.round(total / (2 * Math.PI));
//     return { rootsInside: w, unstable };
//   }
// 
//   const rows = [];
//   for (const [n, trials] of [[80, 40], [160, 35], [320, 30]]) {
//     let used = 0;
//     let sum = 0;
//     let sumSq = 0;
//     let unstableCount = 0;
// 
//     for (let t = 0; t < trials; t += 1) {
//       const coeff = Array.from({ length: n + 1 }, () => (rng() < 0.5 ? -1 : 1));
//       const { rootsInside, unstable } = windingInside(coeff);
//       if (unstable) unstableCount += 1;
//       used += 1;
//       sum += rootsInside;
//       sumSq += rootsInside * rootsInside;
//     }
// 
//     const mean = sum / used;
//     const varr = Math.max(0, sumSq / used - mean * mean);
// 
//     rows.push({
//       n,
//       trials,
//       unstable_trials: unstableCount,
//       avg_roots_inside_disk: Number(mean.toPrecision(7)),
//       std_roots_inside_disk: Number(Math.sqrt(varr).toPrecision(7)),
//       ratio_avg_over_n_over_2: Number((mean / (n / 2)).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep522 = {
//     description: 'Argument-principle Monte Carlo proxy for R_n roots inside the unit disk.',
//     rows,
//   };
// }
// 
// // EP-528 + EP-529: exact small-n self-avoiding walk counts and displacement.
// {
//   function enumerateSAW(d, nMax) {
//     const dirs = [];
//     for (let i = 0; i < d; i += 1) {
//       const a = Array(d).fill(0);
//       a[i] = 1;
//       dirs.push(a);
//       const b = Array(d).fill(0);
//       b[i] = -1;
//       dirs.push(b);
//     }
// 
//     const cnt = Array(nMax + 1).fill(0);
//     const distSum = Array(nMax + 1).fill(0);
// 
//     const coord = Array(d).fill(0);
//     const visited = new Set(['0'.repeat(d)]);
// 
//     function key(v) {
//       return v.join(',');
//     }
// 
//     function dfs(step) {
//       if (step > 0) {
//         cnt[step] += 1;
//         let r2 = 0;
//         for (let i = 0; i < d; i += 1) r2 += coord[i] * coord[i];
//         distSum[step] += Math.sqrt(r2);
//       }
//       if (step === nMax) return;
// 
//       for (const mv of dirs) {
//         for (let i = 0; i < d; i += 1) coord[i] += mv[i];
//         const k = key(coord);
//         if (!visited.has(k)) {
//           visited.add(k);
//           dfs(step + 1);
//           visited.delete(k);
//         }
//         for (let i = 0; i < d; i += 1) coord[i] -= mv[i];
//       }
//     }
// 
//     dfs(0);
//     return { cnt, distSum };
//   }
// 
//   const configs = [
//     { d: 2, nMax: 10 },
//     { d: 3, nMax: 8 },
//     { d: 4, nMax: 7 },
//   ];
// 
//   const connectiveRows = [];
//   const displacementRows = [];
// 
//   for (const cfg of configs) {
//     const { d, nMax } = cfg;
//     const { cnt, distSum } = enumerateSAW(d, nMax);
// 
//     for (let n = 2; n <= nMax; n += 1) {
//       const c = cnt[n];
//       const prev = cnt[n - 1];
//       const muRoot = c ** (1 / n);
//       const muRatio = c / prev;
//       connectiveRows.push({
//         d,
//         n,
//         f_n_k: c,
//         root_estimate: Number(muRoot.toPrecision(7)),
//         ratio_estimate: Number(muRatio.toPrecision(7)),
//       });
// 
//       const dn = distSum[n] / c;
//       displacementRows.push({
//         d,
//         n,
//         expected_distance: Number(dn.toPrecision(7)),
//         over_sqrt_n: Number((dn / Math.sqrt(n)).toPrecision(7)),
//         over_n_pow_0_75: Number((dn / (n ** 0.75)).toPrecision(7)),
//       });
//     }
//   }
// 
//   out.results.ep528 = {
//     description: 'Exact small-n connective-constant proxies from self-avoiding walk counts.',
//     rows: connectiveRows,
//   };
// 
//   out.results.ep529 = {
//     description: 'Exact small-n displacement profile for self-avoiding walks.',
//     rows: displacementRows,
//   };
// }
// ==== End Batch Split Integrations ====
