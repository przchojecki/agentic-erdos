#!/usr/bin/env node
const meta={problem:'EP-931',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-931 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch21_quick_compute.mjs | finite search for equal-prime-support products of consecutive blocks. ----
// // EP-931: finite search for equal-prime-support products of consecutive blocks.
// {
//   const NMAX = 240;
//   const KMAX = 12;
//   const LIM = NMAX + KMAX + 5;
//   const spf = sieveSPF(LIM);
// 
//   const distinctFactors = Array.from({ length: LIM + 1 }, () => []);
//   for (let x = 2; x <= LIM; x += 1) distinctFactors[x] = factorDistinctSmall(x, spf);
// 
//   function blockSignature(n, k) {
//     // block is n+1,...,n+k
//     const s = new Set();
//     for (let t = 1; t <= k; t += 1) {
//       for (const p of distinctFactors[n + t]) s.add(p);
//     }
//     return [...s].sort((a, b) => a - b).join('.');
//   }
// 
//   const groups = new Map();
//   for (let n = 0; n <= NMAX; n += 1) {
//     for (let k = 3; k <= KMAX; k += 1) {
//       if (n + k > LIM - 2) continue;
//       const sig = blockSignature(n, k);
//       if (!groups.has(sig)) groups.set(sig, []);
//       groups.get(sig).push({ n, k });
//     }
//   }
// 
//   let pairCount = 0;
//   const samples = [];
//   let hasKnownCounterexample = false;
// 
//   for (const arr of groups.values()) {
//     for (let i = 0; i < arr.length; i += 1) {
//       for (let j = 0; j < arr.length; j += 1) {
//         if (i === j) continue;
//         const a = arr[i];
//         const b = arr[j];
//         if (a.k < b.k) continue;
//         if (b.n < a.n + a.k) continue;
//         pairCount += 1;
//         if (samples.length < 16) {
//           samples.push({ n1: a.n, k1: a.k, n2: b.n, k2: b.k });
//         }
//         if (a.n === 0 && a.k === 10 && b.n === 13 && b.k === 3) hasKnownCounterexample = true;
//       }
//     }
//   }
// 
//   out.results.ep931 = {
//     description: 'Finite search for pairs of consecutive blocks with equal prime-support signatures.',
//     NMAX,
//     KMAX,
//     admissible_pairs_found: pairCount,
//     contains_alphaproof_counterexample_0_10_vs_13_3: hasKnownCounterexample,
//     sample_pairs: samples,
//   };
// }
// ==== End Batch Split Integrations ====
