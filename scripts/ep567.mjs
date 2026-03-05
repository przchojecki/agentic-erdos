#!/usr/bin/env node
const meta={problem:'EP-567',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-567 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch14_quick_compute.mjs | finite heuristic for H5 Ramsey-size linearity using H = mK2. ----
// // EP-567: finite heuristic for H5 Ramsey-size linearity using H = mK2.
// {
//   // H5 (K4 with one subdivided edge): 5 vertices, 7 edges.
//   const H5 = {
//     v: 5,
//     edges: [[0, 2], [0, 3], [1, 2], [1, 3], [2, 3], [0, 4], [1, 4]],
//   };
// 
//   function edgeIndex(N) {
//     const idx = Array.from({ length: N }, () => Array(N).fill(-1));
//     let e = 0;
//     for (let i = 0; i < N; i += 1) {
//       for (let j = i + 1; j < N; j += 1) {
//         idx[i][j] = e;
//         idx[j][i] = e;
//         e += 1;
//       }
//     }
//     return idx;
//   }
// 
//   function redContainsH5Sample(mask, N, idx, rng, samples = 800) {
//     const verts = Array.from({ length: N }, (_, i) => i);
// 
//     for (let s = 0; s < samples; s += 1) {
//       // Partial Fisher-Yates sample of 5 distinct vertices.
//       for (let i = 0; i < 5; i += 1) {
//         const j = i + Math.floor(rng() * (N - i));
//         const tmp = verts[i];
//         verts[i] = verts[j];
//         verts[j] = tmp;
//       }
//       const map = verts;
//       let ok = true;
//       for (const [a, b] of H5.edges) {
//         const bit = ((mask >> BigInt(idx[map[a]][map[b]])) & 1n) === 1n;
//         if (!bit) {
//           ok = false;
//           break;
//         }
//       }
//       if (ok) return true;
//     }
//     return false;
//   }
// 
//   function blueMatchingNumber(mask, N, idx) {
//     const memo = new Map();
// 
//     function dfs(maskV) {
//       if (memo.has(maskV)) return memo.get(maskV);
//       if (maskV === 0) return 0;
// 
//       let v = 0;
//       while (((maskV >> v) & 1) === 0) v += 1;
//       let best = dfs(maskV & ~(1 << v)); // leave v unmatched
// 
//       for (let u = v + 1; u < N; u += 1) {
//         if (((maskV >> u) & 1) === 0) continue;
//         const isRed = ((mask >> BigInt(idx[v][u])) & 1n) === 1n;
//         if (!isRed) {
//           const cand = 1 + dfs(maskV & ~(1 << v) & ~(1 << u));
//           if (cand > best) best = cand;
//         }
//       }
//       memo.set(maskV, best);
//       return best;
//     }
// 
//     return dfs((1 << N) - 1);
//   }
// 
//   const rng = makeRng(20260303 ^ 1409);
//   const rows = [];
// 
//   for (const m of [2, 3, 4]) {
//     let heuristicThreshold = null;
// 
//     for (const N of [8, 10, 12]) {
//       const E = (N * (N - 1)) / 2;
//       const idx = edgeIndex(N);
// 
//       let avoidFound = 0;
//       const trials = 60;
//       for (let t = 0; t < trials; t += 1) {
//         let mask = 0n;
//         for (let e = 0; e < E; e += 1) {
//           if (rng() < 0.5) mask |= 1n << BigInt(e);
//         }
//         const redH5 = redContainsH5Sample(mask, N, idx, rng, 1000);
//         if (redH5) continue;
//         const blueMatch = blueMatchingNumber(mask, N, idx);
//         if (blueMatch < m) avoidFound += 1;
//       }
// 
//       rows.push({
//         target_H_matching_size_m: m,
//         N,
//         trials,
//         avoiding_coloring_hits: avoidFound,
//       });
// 
//       if (heuristicThreshold === null && avoidFound === 0) heuristicThreshold = N;
//     }
// 
//     rows.push({
//       target_H_matching_size_m: m,
//       heuristic_zero_avoid_threshold_N: heuristicThreshold,
//       ratio_threshold_over_m: heuristicThreshold === null ? null : Number((heuristicThreshold / m).toPrecision(6)),
//     });
//   }
// 
//   out.results.ep567 = {
//     description: 'Finite heuristic on R(H5, mK2) via random-coloring avoidance search.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
