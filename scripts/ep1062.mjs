#!/usr/bin/env node
const meta={problem:'EP-1062',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1062 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch23_quick_compute.mjs | exact small-n optimisation by branch-and-bound. ----
// // EP-1062: exact small-n optimisation by branch-and-bound.
// {
//   function exactF(n) {
//     const divisors = Array.from({ length: n + 1 }, () => []);
//     for (let d = 1; d <= n; d += 1) {
//       for (let m = 2 * d; m <= n; m += d) divisors[m].push(d);
//     }
// 
//     const selected = new Uint8Array(n + 1);
//     const multCnt = new Int16Array(n + 1);
//     let best = 0;
// 
//     function dfs(i, cur) {
//       if (i === 0) {
//         if (cur > best) best = cur;
//         return;
//       }
//       if (cur + i <= best) return;
// 
//       let canTake = multCnt[i] <= 1;
//       if (canTake) {
//         for (const d of divisors[i]) {
//           if (selected[d] && multCnt[d] >= 1) {
//             canTake = false;
//             break;
//           }
//         }
//       }
// 
//       if (canTake) {
//         selected[i] = 1;
//         for (const d of divisors[i]) multCnt[d] += 1;
//         dfs(i - 1, cur + 1);
//         for (const d of divisors[i]) multCnt[d] -= 1;
//         selected[i] = 0;
//       }
//       dfs(i - 1, cur);
//     }
// 
//     dfs(n, 0);
//     return best;
//   }
// 
//   const rows = [];
//   for (const n of [18, 20, 22, 24, 26, 28, 30, 32]) {
//     const f = exactF(n);
//     rows.push({
//       n,
//       exact_f_n: f,
//       ratio_f_over_n: Number((f / n).toPrecision(7)),
//       benchmark_two_thirds_n: Number(((2 * n) / 3).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep1062 = {
//     description: 'Exact small-n optimisation for sets with no element dividing two others in the set.',
//     rows,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch23_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
