#!/usr/bin/env node
const meta={problem:'EP-872',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-872 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch20_quick_compute.mjs | exact minimax game lengths for small n. ----
// // EP-872: exact minimax game lengths for small n.
// {
//   function solveGameLength(n, longStarts) {
//     const vals = Array.from({ length: n - 1 }, (_, i) => i + 2);
//     const m = vals.length;
//     const incompat = new Uint32Array(m);
// 
//     for (let i = 0; i < m; i += 1) {
//       for (let j = 0; j < m; j += 1) {
//         if (i === j) continue;
//         const a = vals[i];
//         const b = vals[j];
//         if (a % b === 0 || b % a === 0) incompat[i] |= (1 << j);
//       }
//     }
// 
//     const memoLong = new Map();
//     const memoShort = new Map();
// 
//     function dfs(mask, longTurn) {
//       const memo = longTurn ? memoLong : memoShort;
//       if (memo.has(mask)) return memo.get(mask);
// 
//       const legal = [];
//       for (let i = 0; i < m; i += 1) {
//         const bit = 1 << i;
//         if (mask & bit) continue;
//         if (mask & incompat[i]) continue;
//         legal.push(i);
//       }
// 
//       if (legal.length === 0) {
//         memo.set(mask, 0);
//         return 0;
//       }
// 
//       let best = longTurn ? -1 : 1e9;
//       for (const i of legal) {
//         const val = 1 + dfs(mask | (1 << i), !longTurn);
//         if (longTurn) {
//           if (val > best) best = val;
//         } else if (val < best) best = val;
//       }
// 
//       memo.set(mask, best);
//       return best;
//     }
// 
//     return dfs(0, longStarts);
//   }
// 
//   const rows = [];
//   for (const n of [10, 12, 14, 16, 18, 20]) {
//     const lf = solveGameLength(n, true);
//     const sf = solveGameLength(n, false);
//     rows.push({
//       n,
//       optimal_length_long_player_starts: lf,
//       optimal_length_short_player_starts: sf,
//       pi_n: (() => {
//         let c = 0;
//         for (let x = 2; x <= n; x += 1) {
//           let p = true;
//           for (let d = 2; d * d <= x; d += 1) if (x % d === 0) p = false;
//           if (p) c += 1;
//         }
//         return c;
//       })(),
//       over_n_long_starts: Number((lf / n).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep872 = {
//     description: 'Exact minimax game length profile for the divisibility-free saturation game at small n.',
//     rows,
//     note: 'State space grows quickly; this is exact only for tested n.',
//   };
// }
// ==== End Batch Split Integrations ====
