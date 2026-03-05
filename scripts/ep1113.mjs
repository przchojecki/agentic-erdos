#!/usr/bin/env node
const meta={problem:'EP-1113',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1113 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch26_quick_compute.mjs | finite pseudo-Sierpinski screening and small covering-set profile. ----
// // EP-1113: finite pseudo-Sierpinski screening and small covering-set profile.
// {
//   const M_MAX = 3000;
//   const K_MAX = 14;
//   const MAX_VAL = (1 << K_MAX) * M_MAX + 1;
//   const { primes } = sievePrimes(Math.floor(Math.sqrt(MAX_VAL)) + 100);
// 
//   function primeFactorsDistinct(n) {
//     return factorDistinctByPrimes(n, primes);
//   }
// 
//   const candidates = [];
//   for (let m = 3; m <= M_MAX; m += 2) {
//     let allComposite = true;
//     const factorSets = [];
//     for (let k = 0; k <= K_MAX; k += 1) {
//       const v = (m << k) + 1;
//       if (isPrimeByTrial(v, primes)) {
//         allComposite = false;
//         break;
//       }
//       factorSets.push(primeFactorsDistinct(v));
//     }
//     if (!allComposite) continue;
// 
//     // Greedy set-cover over exponent indices 0..K_MAX.
//     const uncovered = new Set([...Array(K_MAX + 1).keys()]);
//     const chosen = [];
//     const primeToIdx = new Map();
//     for (let k = 0; k <= K_MAX; k += 1) {
//       for (const p of factorSets[k]) {
//         if (!primeToIdx.has(p)) primeToIdx.set(p, []);
//         primeToIdx.get(p).push(k);
//       }
//     }
//     while (uncovered.size) {
//       let bestP = null;
//       let bestHit = [];
//       for (const [p, idxs] of primeToIdx.entries()) {
//         const hit = idxs.filter((x) => uncovered.has(x));
//         if (hit.length > bestHit.length) {
//           bestHit = hit;
//           bestP = p;
//         }
//       }
//       if (!bestP || bestHit.length === 0) break;
//       chosen.push(bestP);
//       for (const x of bestHit) uncovered.delete(x);
//     }
// 
//     candidates.push({
//       m,
//       greedy_cover_size_for_k0_to_kmax: chosen.length,
//       greedy_cover_primes_sample: chosen.slice(0, 12),
//     });
//   }
// 
//   candidates.sort((a, b) => a.greedy_cover_size_for_k0_to_kmax - b.greedy_cover_size_for_k0_to_kmax || a.m - b.m);
// 
//   out.results.ep1113 = {
//     description: 'Finite pseudo-Sierpinski scan (composite checks for 2^k m+1 up to k<=14) with greedy covering-prime profile.',
//     M_MAX,
//     K_MAX,
//     pseudo_sierpinski_count_in_scan: candidates.length,
//     best_candidates_by_small_cover_size: candidates.slice(0, 20),
//   };
// }
// ==== End Batch Split Integrations ====
