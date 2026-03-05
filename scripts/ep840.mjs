#!/usr/bin/env node
const meta={problem:'EP-840',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-840 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch19_quick_compute.mjs | quasi-Sidon greedy profile. ----
// // EP-840: quasi-Sidon greedy profile.
// {
//   const rng = makeRng(20260304 ^ 1903);
// 
//   function greedyQuasiSidon(N, tau, trials) {
//     let best = 0;
// 
//     for (let t = 0; t < trials; t += 1) {
//       const A = [];
//       const sums = new Map();
//       const vals = Array.from({ length: N }, (_, i) => i + 1);
//       shuffle(vals, rng);
// 
//       function currentRatio(nextWith = null) {
//         const m = A.length + (nextWith === null ? 0 : 1);
//         if (m < 2) return 1;
//         const bin = (m * (m - 1)) / 2;
//         const distinct = sums.size + (nextWith === null ? 0 : nextWith);
//         return distinct / bin;
//       }
// 
//       for (const x of vals) {
//         let newDistinct = 0;
//         const touched = [];
// 
//         // sums with existing elements (unordered pair i<j proxy; also include x+x to be conservative for A+A)
//         for (const a of A) {
//           const s = a + x;
//           if (!sums.has(s)) {
//             newDistinct += 1;
//             touched.push(s);
//           }
//         }
//         const d = x + x;
//         if (!sums.has(d) && !touched.includes(d)) {
//           newDistinct += 1;
//           touched.push(d);
//         }
// 
//         if (currentRatio(newDistinct) >= tau) {
//           A.push(x);
//           for (const s of touched) sums.set(s, 1);
//         }
//       }
// 
//       if (A.length > best) best = A.length;
//     }
// 
//     return best;
//   }
// 
//   const rows = [];
//   for (const N of [200, 500, 1000, 2000]) {
//     for (const tau of [0.9, 0.95, 0.98]) {
//       const best = greedyQuasiSidon(N, tau, 25);
//       rows.push({
//         N,
//         tau_ratio_threshold: tau,
//         best_size_found: best,
//         best_over_sqrtN: Number((best / Math.sqrt(N)).toPrecision(7)),
//       });
//     }
//   }
// 
//   out.results.ep840 = {
//     description: 'Greedy finite profile for maximal quasi-Sidon subsets under ratio thresholds.',
//     rows,
//     note: 'Local metadata has latest_reference_year=2097, likely a typo; web page indicates open status as of 2025 edits.',
//   };
// }
// ==== End Batch Split Integrations ====
