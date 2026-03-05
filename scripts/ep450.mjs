#!/usr/bin/env node
const meta={problem:'EP-450',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-450 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch12_quick_compute.mjs | interval densities of integers having a divisor in (n,2n). ----
// // EP-450: interval densities of integers having a divisor in (n,2n).
// {
//   function buildHasDiv(N, n) {
//     const arr = new Uint8Array(N + 1);
//     for (let d = n + 1; d <= 2 * n - 1; d += 1) {
//       for (let m = d; m <= N; m += d) arr[m] = 1;
//     }
//     return arr;
//   }
// 
//   function prefix(arr) {
//     const p = new Uint32Array(arr.length);
//     for (let i = 1; i < arr.length; i += 1) p[i] = p[i - 1] + arr[i];
//     return p;
//   }
// 
//   const rows = [];
//   for (const n of [120, 300, 700]) {
//     const YMAX = 24 * n;
//     const XMAX = 200000;
//     const arr = buildHasDiv(XMAX + YMAX + 5, n);
//     const prefArr = prefix(arr);
// 
//     for (const y of [2 * n, 4 * n, 8 * n, 16 * n, 24 * n]) {
//       let minD = 1;
//       let maxD = 0;
//       let avgD = 0;
//       let cnt = 0;
//       for (let x = 0; x <= XMAX; x += 1) {
//         const c = prefArr[x + y] - prefArr[x];
//         const d = c / y;
//         if (d < minD) minD = d;
//         if (d > maxD) maxD = d;
//         avgD += d;
//         cnt += 1;
//       }
//       rows.push({
//         n,
//         y,
//         min_density_over_x: Number(minD.toPrecision(6)),
//         max_density_over_x: Number(maxD.toPrecision(6)),
//         mean_density_over_x: Number((avgD / cnt).toPrecision(6)),
//       });
//     }
//   }
// 
//   out.results.ep450 = {
//     description: 'Finite x-window density profile for having a divisor in (n,2n).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
