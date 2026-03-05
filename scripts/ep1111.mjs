#!/usr/bin/env node
const meta={problem:'EP-1111',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1111 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch26_quick_compute.mjs | finite anticomplete-pair chromatic profile in high-chi, omega=2 examples. ----
// // EP-1111: finite anticomplete-pair chromatic profile in high-chi, omega=2 examples.
// {
//   function mycielski(masks) {
//     const n = masks.length;
//     const outMasks = Array(2 * n + 1).fill(0n);
//     for (let u = 0; u < n; u += 1) {
//       let m = masks[u];
//       while (m) {
//         const b = m & -m;
//         const v = bitIndexBigInt(b);
//         m ^= b;
//         if (u < v) {
//           outMasks[u] |= 1n << BigInt(v);
//           outMasks[v] |= 1n << BigInt(u);
//           outMasks[u] |= 1n << BigInt(n + v);
//           outMasks[n + v] |= 1n << BigInt(u);
//           outMasks[v] |= 1n << BigInt(n + u);
//           outMasks[n + u] |= 1n << BigInt(v);
//         }
//       }
//     }
//     const w = 2 * n;
//     for (let u = 0; u < n; u += 1) {
//       outMasks[n + u] |= 1n << BigInt(w);
//       outMasks[w] |= 1n << BigInt(n + u);
//     }
//     return outMasks;
//   }
// 
//   const c5 = adjacencyMasksFromEdgeList(5, [
//     [0, 1],
//     [1, 2],
//     [2, 3],
//     [3, 4],
//     [4, 0],
//   ]);
//   const m1 = mycielski(c5); // n=11, chi=4
//   const m2 = mycielski(m1); // n=23, chi=5
// 
//   const n1 = m1.length;
//   const ALL1 = (1n << BigInt(n1)) - 1n;
//   const neighUnion = Array(1 << n1).fill(0n);
//   for (let mask = 1; mask < (1 << n1); mask += 1) {
//     const b = mask & -mask;
//     const i = Math.log2(b) | 0;
//     neighUnion[mask] = neighUnion[mask ^ b] | m1[i];
//   }
// 
//   const chiCache = new Map();
//   function chiSubset(maskBig) {
//     if (chiCache.has(maskBig)) return chiCache.get(maskBig);
//     const adj = inducedAdjListFromMask(m1, maskBig);
//     const c = chromaticNumberDSATUR(adj);
//     chiCache.set(maskBig, c);
//     return c;
//   }
// 
//   let bestMinChi = 0;
//   let bestPair = null;
//   for (let A = 1; A < (1 << n1); A += 1) {
//     const ABig = BigInt(A);
//     const allowedB = (ALL1 ^ ABig) & ~neighUnion[A];
//     let B = allowedB;
//     const chiA = chiSubset(ABig);
//     while (B > 0n) {
//       const chiB = chiSubset(B);
//       const mm = Math.min(chiA, chiB);
//       if (mm > bestMinChi) {
//         bestMinChi = mm;
//         bestPair = { A_mask: ABig.toString(), B_mask: B.toString(), chiA, chiB };
//       }
//       B = (B - 1n) & allowedB;
//     }
//   }
// 
//   // Random sampling on n=23 variant.
//   const rng = makeRng(20260304 ^ 1111);
//   const samples = [];
//   let best23 = 0;
//   for (let t = 0; t < 2000; t += 1) {
//     let A = 0n;
//     for (let i = 0; i < m2.length; i += 1) if (rng() < 0.28) A |= 1n << BigInt(i);
//     if (A === 0n) continue;
//     let neigh = 0n;
//     for (let i = 0; i < m2.length; i += 1) if ((A >> BigInt(i)) & 1n) neigh |= m2[i];
//     const allowed = (((1n << BigInt(m2.length)) - 1n) ^ A) & ~neigh;
//     if (allowed === 0n) continue;
//     let B = 0n;
//     for (let i = 0; i < m2.length; i += 1) if (((allowed >> BigInt(i)) & 1n) && rng() < 0.45) B |= 1n << BigInt(i);
//     if (B === 0n) continue;
//     const chiA = chromaticNumberDSATUR(inducedAdjListFromMask(m2, A));
//     const chiB = chromaticNumberDSATUR(inducedAdjListFromMask(m2, B));
//     const mm = Math.min(chiA, chiB);
//     if (mm > best23) best23 = mm;
//     if (samples.length < 12 && mm >= 2) samples.push({ chiA, chiB, minChi: mm });
//   }
// 
//   out.results.ep1111 = {
//     description: 'Finite anticomplete-pair chromatic search on Mycielski triangle-free high-chromatic graphs.',
//     exact_on_mycielski1_n11: {
//       chi_graph: chromaticNumberDSATUR(adjacencyListFromMasks(m1)),
//       best_min_of_chiA_chiB_over_anticomplete_pairs: bestMinChi,
//       witness_pair_summary: bestPair,
//     },
//     sampled_on_mycielski2_n23: {
//       chi_graph: chromaticNumberDSATUR(adjacencyListFromMasks(m2)),
//       best_min_of_chiA_chiB_in_samples: best23,
//       sample_rows: samples,
//     },
//   };
// }
// ==== End Batch Split Integrations ====
