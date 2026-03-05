#!/usr/bin/env node
const meta={problem:'EP-32',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-32 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch2_quick_compute.mjs | random finite additive complement probes for primes. ----
// // EP-32: random finite additive complement probes for primes.
// {
//   const XList = [50000, 100000, 200000];
//   const rows = [];
//   for (const X of XList) {
//     const low = Math.floor(X / 2);
//     const B = Math.floor(18 * Math.sqrt(X));
//     const kList = [8, 12, 16, 20, 24];
//     const primesInRange = primes.filter((p) => p <= X + B);
// 
//     for (const k of kList) {
//       let best = 0;
//       for (let t = 0; t < 120; t += 1) {
//         const A = randomSubset(B, k, rng);
//         const cover = new Uint8Array(X - low + 1);
//         let c = 0;
//         for (const a of A) {
//           for (const p of primesInRange) {
//             const n = p + a;
//             if (n < low || n > X) continue;
//             const idx = n - low;
//             if (!cover[idx]) {
//               cover[idx] = 1;
//               c += 1;
//             }
//           }
//         }
//         const frac = c / (X - low + 1);
//         if (frac > best) best = frac;
//       }
//       rows.push({
//         X,
//         low,
//         B,
//         k,
//         trials: 120,
//         best_coverage_fraction: Number(best.toFixed(6)),
//         k_over_logX: Number((k / Math.log(X)).toFixed(4)),
//       });
//     }
//   }
//   out.results.ep32 = {
//     description: 'Random finite coverage proxies for representations n=p+a on [X/2, X].',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
