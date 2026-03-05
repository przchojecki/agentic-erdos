#!/usr/bin/env node
const meta={problem:'EP-791',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-791 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch18_quick_compute.mjs | finite additive 2-basis exact small n and greedy larger n. ----
// // EP-791: finite additive 2-basis exact small n and greedy larger n.
// {
//   function minBasisExact(n) {
//     const target = n + 1;
// 
//     function coverCount(arr) {
//       const cov = new Uint8Array(n + 1);
//       for (let i = 0; i < arr.length; i += 1) {
//         for (let j = i; j < arr.length; j += 1) {
//           const s = arr[i] + arr[j];
//           if (s <= n) cov[s] = 1;
//         }
//       }
//       let c = 0;
//       for (let x = 0; x <= n; x += 1) c += cov[x];
//       return c;
//     }
// 
//     function feasible(k) {
//       const arr = [0];
// 
//       function dfs(nextVal) {
//         if (arr.length === k) return coverCount(arr) === target;
// 
//         const curCov = coverCount(arr);
//         const r = k - arr.length;
//         const curSize = arr.length;
//         const maxNew = r * curSize + (r * (r + 1)) / 2;
//         if (curCov + maxNew < target) return false;
// 
//         for (let v = nextVal; v <= n; v += 1) {
//           arr.push(v);
//           if (dfs(v + 1)) return true;
//           arr.pop();
//         }
//         return false;
//       }
// 
//       return dfs(1);
//     }
// 
//     for (let k = Math.max(2, Math.floor(Math.sqrt(2 * n))); k <= n + 1; k += 1) {
//       if (feasible(k)) return k;
//     }
//     return null;
//   }
// 
//   function greedyBasis(n) {
//     const A = [0];
//     const cov = new Uint8Array(n + 1);
//     cov[0] = 1;
// 
//     function add(v) {
//       for (const a of A) {
//         const s = a + v;
//         if (s <= n) cov[s] = 1;
//       }
//       const s2 = 2 * v;
//       if (s2 <= n) cov[s2] = 1;
//       A.push(v);
//     }
// 
//     while (true) {
//       let uncovered = -1;
//       for (let x = 0; x <= n; x += 1) {
//         if (!cov[x]) {
//           uncovered = x;
//           break;
//         }
//       }
//       if (uncovered < 0) break;
// 
//       let bestV = 1;
//       let bestGain = -1;
//       for (let v = 1; v <= n; v += 1) {
//         if (A.includes(v)) continue;
//         let gain = 0;
//         for (const a of A) {
//           const s = a + v;
//           if (s <= n && !cov[s]) gain += 1;
//         }
//         const s2 = 2 * v;
//         if (s2 <= n && !cov[s2]) gain += 1;
//         if (gain > bestGain) {
//           bestGain = gain;
//           bestV = v;
//         }
//       }
//       add(bestV);
//     }
// 
//     return A.length;
//   }
// 
//   const exactRows = [];
//   for (const n of [10, 15, 20, 24]) {
//     const g = minBasisExact(n);
//     exactRows.push({
//       n,
//       g_n_exact: g,
//       g_n_squared_over_n: Number(((g * g) / n).toPrecision(7)),
//     });
//   }
// 
//   const greedyRows = [];
//   for (const n of [40, 60, 80, 120]) {
//     const g = greedyBasis(n);
//     greedyRows.push({
//       n,
//       g_n_greedy_upper: g,
//       g_n_squared_over_n: Number(((g * g) / n).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep791 = {
//     description: 'Finite additive 2-basis profile: exact small n and greedy larger n.',
//     exact_rows: exactRows,
//     greedy_rows: greedyRows,
//   };
// }
// ==== End Batch Split Integrations ====
