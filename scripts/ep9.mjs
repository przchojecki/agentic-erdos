#!/usr/bin/env node
// Canonical per-problem script for EP-9.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-9',
  source_count: 1,
  source_files: ["harder_batch1_quick_compute.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-9 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: harder_batch1_quick_compute.mjs
// Kind: batch_ep_section_from_head
// Label: odd numbers not representable as p + 2^a + 2^b.
// // EP-9: odd numbers not representable as p + 2^a + 2^b.
// {
//   const N = 1000000;
//   const pows = [];
//   for (let v = 1; v <= N; v *= 2) pows.push(v);
//   const sumSet = new Set();
//   for (let i = 0; i < pows.length; i += 1) {
//     for (let j = i; j < pows.length; j += 1) {
//       const s = pows[i] + pows[j];
//       if (s <= N) sumSet.add(s);
//     }
//   }
//   const sums = [...sumSet].sort((a, b) => a - b);
// 
//   let exceptional = 0;
//   let oddCount = 0;
//   const cpTargets = [100000, 200000, 400000, 600000, 800000, 1000000];
//   const cp = [];
//   let tIdx = 0;
// 
//   for (let n = 1; n <= N; n += 2) {
//     oddCount += 1;
//     let ok = false;
//     for (let i = 0; i < sums.length; i += 1) {
//       const s = sums[i];
//       if (s > n - 2) break;
//       if (sieveData.isPrime[n - s]) {
//         ok = true;
//         break;
//       }
//     }
//     if (!ok) exceptional += 1;
//     while (tIdx < cpTargets.length && n >= cpTargets[tIdx]) {
//       cp.push({
//         N: cpTargets[tIdx],
//         exceptional_odds: exceptional,
//         odd_count: Math.floor((cpTargets[tIdx] + 1) / 2),
//         exceptional_density_among_odds: Number((exceptional / Math.floor((cpTargets[tIdx] + 1) / 2)).toFixed(6)),
//       });
//       tIdx += 1;
//     }
//   }
//   while (tIdx < cpTargets.length) {
//     const tgt = cpTargets[tIdx];
//     cp.push({
//       N: tgt,
//       exceptional_odds: exceptional,
//       odd_count: Math.floor((tgt + 1) / 2),
//       exceptional_density_among_odds: Number((exceptional / Math.floor((tgt + 1) / 2)).toFixed(6)),
//     });
//     tIdx += 1;
//   }
// 
//   out.results.ep9 = {
//     description: 'Finite scan of exceptional odd integers for p + 2^a + 2^b up to 1e6.',
//     N_max: N,
//     exceptional_odds: exceptional,
//     odd_count: oddCount,
//     exceptional_density_among_odds: Number((exceptional / oddCount).toFixed(6)),
//     checkpoints: cp,
//   };
// }
// ==== End Snippet ====

// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch1_quick_compute.mjs | odd numbers not representable as p + 2^a + 2^b. ----
// // EP-9: odd numbers not representable as p + 2^a + 2^b.
// {
//   const N = 1000000;
//   const pows = [];
//   for (let v = 1; v <= N; v *= 2) pows.push(v);
//   const sumSet = new Set();
//   for (let i = 0; i < pows.length; i += 1) {
//     for (let j = i; j < pows.length; j += 1) {
//       const s = pows[i] + pows[j];
//       if (s <= N) sumSet.add(s);
//     }
//   }
//   const sums = [...sumSet].sort((a, b) => a - b);
// 
//   let exceptional = 0;
//   let oddCount = 0;
//   const cpTargets = [100000, 200000, 400000, 600000, 800000, 1000000];
//   const cp = [];
//   let tIdx = 0;
// 
//   for (let n = 1; n <= N; n += 2) {
//     oddCount += 1;
//     let ok = false;
//     for (let i = 0; i < sums.length; i += 1) {
//       const s = sums[i];
//       if (s > n - 2) break;
//       if (sieveData.isPrime[n - s]) {
//         ok = true;
//         break;
//       }
//     }
//     if (!ok) exceptional += 1;
//     while (tIdx < cpTargets.length && n >= cpTargets[tIdx]) {
//       cp.push({
//         N: cpTargets[tIdx],
//         exceptional_odds: exceptional,
//         odd_count: Math.floor((cpTargets[tIdx] + 1) / 2),
//         exceptional_density_among_odds: Number((exceptional / Math.floor((cpTargets[tIdx] + 1) / 2)).toFixed(6)),
//       });
//       tIdx += 1;
//     }
//   }
//   while (tIdx < cpTargets.length) {
//     const tgt = cpTargets[tIdx];
//     cp.push({
//       N: tgt,
//       exceptional_odds: exceptional,
//       odd_count: Math.floor((tgt + 1) / 2),
//       exceptional_density_among_odds: Number((exceptional / Math.floor((tgt + 1) / 2)).toFixed(6)),
//     });
//     tIdx += 1;
//   }
// 
//   out.results.ep9 = {
//     description: 'Finite scan of exceptional odd integers for p + 2^a + 2^b up to 1e6.',
//     N_max: N,
//     exceptional_odds: exceptional,
//     odd_count: oddCount,
//     exceptional_density_among_odds: Number((exceptional / oddCount).toFixed(6)),
//     checkpoints: cp,
//   };
// }
// ==== End Batch Split Integrations ====
