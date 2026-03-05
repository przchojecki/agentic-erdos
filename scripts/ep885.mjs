#!/usr/bin/env node
const meta={problem:'EP-885',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-885 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch20_quick_compute.mjs | common intersection search for factor-difference sets. ----
// // EP-885: common intersection search for factor-difference sets.
// {
//   const N = 30000;
//   const DofN = Array.from({ length: N + 1 }, () => []);
//   const diffToNs = new Map();
// 
//   for (let n = 1; n <= N; n += 1) {
//     const s = new Set();
//     const lim = Math.floor(Math.sqrt(n));
//     for (let a = 1; a <= lim; a += 1) {
//       if (n % a !== 0) continue;
//       const b = Math.floor(n / a);
//       s.add(Math.abs(b - a));
//     }
//     const arr = Array.from(s).sort((x, y) => x - y);
//     DofN[n] = arr;
//     for (const d of arr) {
//       if (!diffToNs.has(d)) diffToNs.set(d, []);
//       diffToNs.get(d).push(n);
//     }
//   }
// 
//   function findWitness(k) {
//     const cands = [];
//     for (const [d, ns] of diffToNs.entries()) {
//       if (ns.length >= k) cands.push({ d, ns });
//     }
//     cands.sort((a, b) => b.ns.length - a.ns.length || a.d - b.d);
// 
//     const maxDiffs = 220;
//     const arr = cands.slice(0, maxDiffs);
// 
//     let answer = null;
//     const t0 = Date.now();
//     const timeLimitMs = 2600;
// 
//     function dfs(start, depth, curNs, chosenDiffs) {
//       if (Date.now() - t0 > timeLimitMs) return true;
//       if (depth === k) {
//         if (curNs.length >= k) {
//           answer = {
//             k,
//             common_differences: [...chosenDiffs],
//             witness_N_values: curNs.slice(0, k),
//             intersection_size: chosenDiffs.length,
//           };
//           return true;
//         }
//         return false;
//       }
// 
//       for (let i = start; i < arr.length; i += 1) {
//         if (arr.length - i < k - depth) break;
//         const nextNs = curNs === null ? arr[i].ns : intersectSortedArrays(curNs, arr[i].ns);
//         if (nextNs.length < k) continue;
//         chosenDiffs.push(arr[i].d);
//         const ok = dfs(i + 1, depth + 1, nextNs, chosenDiffs);
//         chosenDiffs.pop();
//         if (answer) return true;
//         if (ok && Date.now() - t0 > timeLimitMs) return true;
//       }
//       return false;
//     }
// 
//     dfs(0, 0, null, []);
//     return {
//       k,
//       found: !!answer,
//       witness: answer,
//       searched_top_diff_supports: arr.slice(0, 12).map((x) => ({ d: x.d, support: x.ns.length })),
//       hit_time_limit: Date.now() - t0 > timeLimitMs,
//     };
//   }
// 
//   const rows = [];
//   for (const k of [2, 3, 4, 5, 6]) rows.push(findWitness(k));
// 
//   out.results.ep885 = {
//     description: 'Finite search for k-tuples with at least k common factor differences.',
//     N,
//     rows,
//     note: 'Not finding a witness for larger k in this finite bounded search is inconclusive.',
//   };
// }
// ==== End Batch Split Integrations ====
