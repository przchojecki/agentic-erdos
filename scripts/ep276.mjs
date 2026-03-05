#!/usr/bin/env node
const meta={problem:'EP-276',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-276 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch9_quick_compute.mjs | search small-seed Lucas recurrences for long initial all-composite runs with gcd profile. ----
// // EP-276: search small-seed Lucas recurrences for long initial all-composite runs with gcd profile.
// {
//   function lucasSeq(a0, a1, len) {
//     const a = [a0, a1];
//     for (let i = 2; i < len; i += 1) {
//       const next = a[i - 1] + a[i - 2];
//       if (!Number.isSafeInteger(next) || next <= 0) return a;
//       a.push(next);
//     }
//     return a;
//   }
// 
//   function compositePrefixLen(arr) {
//     let t = 0;
//     while (t < arr.length && !isPrimeInt(arr[t])) t += 1;
//     return t;
//   }
// 
//   const compositeSeeds = [];
//   for (let x = 4; x <= 120; x += 1) if (!isPrimeInt(x)) compositeSeeds.push(x);
// 
//   let bestAny = null;
//   let bestGcd1 = null;
// 
//   for (const a0 of compositeSeeds) {
//     for (const a1 of compositeSeeds) {
//       const seq = lucasSeq(a0, a1, 28);
//       if (seq.length < 8) continue;
//       const t = compositePrefixLen(seq);
//       if (t < 6) continue;
//       let g = 0;
//       for (let i = 0; i < t; i += 1) g = gcdInt(g, seq[i]);
//       const rec = {
//         a0,
//         a1,
//         composite_prefix_len: t,
//         gcd_prefix: g,
//         prefix_tail_value: seq[t - 1],
//       };
//       if (!bestAny || t > bestAny.composite_prefix_len || (t === bestAny.composite_prefix_len && rec.gcd_prefix < bestAny.gcd_prefix)) {
//         bestAny = rec;
//       }
//       if (g === 1 && (!bestGcd1 || t > bestGcd1.composite_prefix_len)) {
//         bestGcd1 = rec;
//       }
//     }
//   }
// 
//   out.results.ep276 = {
//     description: 'Small-seed Lucas scan for long initial composite runs and gcd behavior.',
//     seed_range: [4, 120],
//     terms_tested: 28,
//     best_overall: bestAny,
//     best_with_prefix_gcd_1: bestGcd1,
//   };
// }
// ==== End Batch Split Integrations ====
