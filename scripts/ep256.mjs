#!/usr/bin/env node
const meta={problem:'EP-256',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-256 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch8_quick_compute.mjs | max-product profile for candidate exponent sets. ----
// // EP-256: max-product profile for candidate exponent sets.
// {
//   function maxLogProduct(exponents, grid = 2048) {
//     let best = -Infinity;
//     for (let t = 1; t <= grid; t += 1) {
//       const theta = (2 * Math.PI * t) / (grid + 1);
//       let s = 0;
//       for (const a of exponents) {
//         const v = Math.abs(2 * Math.sin((a * theta) / 2));
//         s += Math.log(Math.max(v, 1e-15));
//       }
//       if (s > best) best = s;
//     }
//     return best;
//   }
// 
//   function randomSet(n, m) {
//     const arr = Array.from({ length: m }, (_, i) => i + 1);
//     shuffle(arr, rng);
//     return arr.slice(0, n).sort((a, b) => a - b);
//   }
// 
//   const rows = [];
//   for (const n of [8, 12, 16, 20, 24]) {
//     const consec = Array.from({ length: n }, (_, i) => i + 1);
//     const p2 = Array.from({ length: n }, (_, i) => 2 ** i);
// 
//     const lc = maxLogProduct(consec);
//     const lp2 = maxLogProduct(p2);
// 
//     let bestRnd = Infinity;
//     for (let t = 0; t < 60; t += 1) {
//       const ex = randomSet(n, 6 * n);
//       const v = maxLogProduct(ex, 1536);
//       if (v < bestRnd) bestRnd = v;
//     }
// 
//     rows.push({
//       n,
//       log_max_product_consecutive: Number(lc.toFixed(6)),
//       log_max_product_powers_of_2: Number(lp2.toFixed(6)),
//       min_log_max_product_random_60: Number(bestRnd.toFixed(6)),
//     });
//   }
// 
//   out.results.ep256 = {
//     description: 'Grid-based finite profile for log max_{|z|=1} prod_i |1-z^{a_i}| over candidate exponent sets.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
