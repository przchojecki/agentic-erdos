#!/usr/bin/env node
const meta={problem:'EP-336',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-336 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch10_quick_compute.mjs | finite proxy of order vs exact-order behavior for basis-like sets. ----
// // EP-336: finite proxy of order vs exact-order behavior for basis-like sets.
// {
//   function buildHalfBlockSet(limit) {
//     const A = [];
//     for (let x = 1; x <= limit; x += 1) {
//       let ok = false;
//       for (let k = 0; ; k += 1) {
//         const lo = 2 ** (2 * k);
//         const hi = 2 ** (2 * k + 1);
//         if (lo > limit) break;
//         if (x > lo && x <= hi) {
//           ok = true;
//           break;
//         }
//       }
//       if (ok) A.push(x);
//     }
//     return A;
//   }
// 
//   function exactSumDP(A, Nmax, kMax) {
//     const can = Array.from({ length: kMax + 1 }, () => new Uint8Array(Nmax + 1));
//     can[0][0] = 1;
//     for (let k = 1; k <= kMax; k += 1) {
//       const prev = can[k - 1];
//       const cur = can[k];
//       for (let n = 0; n <= Nmax; n += 1) {
//         if (!prev[n]) continue;
//         for (const a of A) {
//           const t = n + a;
//           if (t > Nmax) break;
//           cur[t] = 1;
//         }
//       }
//     }
//     return can;
//   }
// 
//   function basisProxy(A, cfg) {
//     const { N0, Nmax, kMax } = cfg;
//     const can = exactSumDP(A, Nmax, kMax);
// 
//     let orderProxy = null;
//     for (let r = 1; r <= kMax; r += 1) {
//       let ok = true;
//       for (let n = N0; n <= Nmax; n += 1) {
//         let hit = false;
//         for (let t = 1; t <= r; t += 1) {
//           if (can[t][n]) {
//             hit = true;
//             break;
//           }
//         }
//         if (!hit) {
//           ok = false;
//           break;
//         }
//       }
//       if (ok) {
//         orderProxy = r;
//         break;
//       }
//     }
// 
//     let exactProxy = null;
//     for (let r = 1; r <= kMax; r += 1) {
//       let ok = true;
//       for (let n = N0; n <= Nmax; n += 1) {
//         if (!can[r][n]) {
//           ok = false;
//           break;
//         }
//       }
//       if (ok) {
//         exactProxy = r;
//         break;
//       }
//     }
// 
//     return { orderProxy, exactProxy };
//   }
// 
//   const A = buildHalfBlockSet(2000);
//   const prox = basisProxy(A, { N0: 500, Nmax: 3000, kMax: 8 });
// 
//   out.results.ep336 = {
//     description: 'Finite order/exact-order proxy for a classical half-block basis-type construction.',
//     set_size_up_to_2000: A.length,
//     sample_terms: A.slice(0, 40),
//     order_proxy_window_500_3000: prox.orderProxy,
//     exact_order_proxy_window_500_3000: prox.exactProxy,
//   };
// }
// ==== End Batch Split Integrations ====
