#!/usr/bin/env node
const meta={problem:'EP-351',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-351 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch10_quick_compute.mjs | finite subset-sum integer coverage for p(n)+1/n examples. ----
// // EP-351: finite subset-sum integer coverage for p(n)+1/n examples.
// {
//   function termPolyPlusInv(n, kind) {
//     if (kind === 'linear') return [BigInt(n * n + 1), BigInt(n)]; // n + 1/n
//     if (kind === 'quadratic') return [BigInt(n * n * n + 1), BigInt(n)]; // n^2 + 1/n
//     return [BigInt(n * n * n * n + 1), BigInt(n)]; // n^3 + 1/n
//   }
// 
//   function finiteCoverage(kind, nFrom, nTo) {
//     const nums = [];
//     const dens = [];
//     for (let n = nFrom; n <= nTo; n += 1) {
//       const [a, b] = termPolyPlusInv(n, kind);
//       nums.push(a);
//       dens.push(b);
//     }
//     let L = 1n;
//     for (const d of dens) L = lcmBig(L, d);
//     const weights = nums.map((a, i) => (a * (L / dens[i])));
// 
//     let sums = new Set([0n]);
//     for (const w of weights) {
//       const nxt = new Set(sums);
//       for (const s of sums) nxt.add(s + w);
//       sums = nxt;
//     }
// 
//     const arr = [...sums].sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
//     const ints = [...arr.filter((s) => s % L === 0n).map((s) => s / L)];
//     ints.sort((x, y) => (x < y ? -1 : x > y ? 1 : 0));
// 
//     let longestRun = 0;
//     let runStart = null;
//     if (ints.length) {
//       let curStart = ints[0];
//       let curLen = 1;
//       longestRun = 1;
//       runStart = ints[0];
//       for (let i = 1; i < ints.length; i += 1) {
//         if (ints[i] === ints[i - 1] + 1n) {
//           curLen += 1;
//         } else {
//           if (curLen > longestRun) {
//             longestRun = curLen;
//             runStart = curStart;
//           }
//           curStart = ints[i];
//           curLen = 1;
//         }
//       }
//       if (curLen > longestRun) {
//         longestRun = curLen;
//         runStart = curStart;
//       }
//     }
// 
//     return {
//       kind,
//       n_range: [nFrom, nTo],
//       terms_used: weights.length,
//       subset_count: sums.size,
//       lcm_digits: L.toString().length,
//       integer_values_count: ints.length,
//       min_integer_value: ints.length ? Number(ints[0]) : null,
//       max_integer_value: ints.length ? Number(ints[ints.length - 1]) : null,
//       longest_consecutive_integer_run_length: longestRun,
//       longest_run_start: runStart === null ? null : Number(runStart),
//     };
//   }
// 
//   out.results.ep351 = {
//     description: 'Finite subset-sum integer reach for sequences p(n)+1/n with polynomial p.',
//     rows: [
//       finiteCoverage('linear', 2, 18),
//       finiteCoverage('linear', 4, 20),
//       finiteCoverage('quadratic', 2, 16),
//       finiteCoverage('quadratic', 4, 18),
//     ],
//   };
// }
// ==== End Batch Split Integrations ====
