#!/usr/bin/env node
const meta={problem:'EP-805',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-805 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch18_quick_compute.mjs | random-graph induced-subset local Ramsey checks. ----
// // EP-805: random-graph induced-subset local Ramsey checks.
// {
//   const rng = makeRng(20260304 ^ 1805);
// 
//   function randomGraph(n, p) {
//     const G = makeGraph(n);
//     for (let i = 0; i < n; i += 1) {
//       for (let j = i + 1; j < n; j += 1) {
//         if (rng() < p) addEdge(G, i, j);
//       }
//     }
//     return G;
//   }
// 
//   function hasCliqueAtLeastT(localAdjMasks, t) {
//     const m = localAdjMasks.length;
//     const all = (1n << BigInt(m)) - 1n;
// 
//     function dfs(cand, need) {
//       if (need <= 0) return true;
//       if (popcountBigInt(cand) < need) return false;
//       let c = cand;
//       while (c) {
//         const bit = c & -c;
//         const v = lsbIndex(bit);
//         if (dfs(cand & localAdjMasks[v], need - 1)) return true;
//         c &= ~bit;
//         cand &= ~bit;
//         if (popcountBigInt(cand) < need) return false;
//       }
//       return false;
//     }
// 
//     return dfs(all, t);
//   }
// 
//   function sampleSubset(n, g) {
//     const arr = Array.from({ length: n }, (_, i) => i);
//     shuffle(arr, rng);
//     return arr.slice(0, g);
//   }
// 
//   function buildLocalMasks(G, subset, complement = false) {
//     const m = subset.length;
//     const masks = Array(m).fill(0n);
//     for (let i = 0; i < m; i += 1) {
//       let mm = 0n;
//       for (let j = 0; j < m; j += 1) {
//         if (i === j) continue;
//         const u = subset[i];
//         const v = subset[j];
//         const edge = G.adj[u][v] === 1;
//         if (complement ? !edge : edge) mm |= 1n << BigInt(j);
//       }
//       masks[i] = mm;
//     }
//     return masks;
//   }
// 
//   const rows = [];
//   for (const n of [128, 256]) {
//     const G = randomGraph(n, 0.5);
//     const t = Math.ceil(Math.log2(n));
// 
//     for (const g of [24, 32, 40, 56, 72, 96]) {
//       if (g >= n) continue;
//       const samples = 140;
//       let pass = 0;
// 
//       for (let s = 0; s < samples; s += 1) {
//         const subset = sampleSubset(n, g);
//         const masks = buildLocalMasks(G, subset, false);
//         const hasCl = hasCliqueAtLeastT(masks, t);
//         if (!hasCl) continue;
//         const compMasks = buildLocalMasks(G, subset, true);
//         const hasInd = hasCliqueAtLeastT(compMasks, t);
//         if (hasInd) pass += 1;
//       }
// 
//       rows.push({
//         n,
//         target_log2_n_threshold_t: t,
//         g,
//         samples,
//         sampled_fraction_subsets_with_both_clique_and_independent_size_at_least_t: Number((pass / samples).toPrecision(6)),
//       });
//     }
//   }
// 
//   out.results.ep805 = {
//     description: 'Sampled induced-subset local Ramsey profile in random graphs.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
