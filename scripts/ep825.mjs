#!/usr/bin/env node
const meta={problem:'EP-825',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-825 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch19_quick_compute.mjs | weird numbers and abundancy index scan. ----
// // EP-825: weird numbers and abundancy index scan.
// {
//   const N = 25_000;
//   const properDivs = Array.from({ length: N + 1 }, () => []);
//   const sigma = new Uint32Array(N + 1);
// 
//   for (let d = 1; d <= N; d += 1) {
//     for (let m = d; m <= N; m += d) {
//       sigma[m] += d;
//       if (m !== d) properDivs[m].push(d);
//     }
//   }
// 
//   function canRepresentAsDistinctSum(target, arr) {
//     const bits = new Uint8Array(target + 1);
//     bits[0] = 1;
//     for (const v of arr) {
//       for (let s = target; s >= v; s -= 1) {
//         if (bits[s - v]) bits[s] = 1;
//       }
//       if (bits[target]) return true;
//     }
//     return bits[target] === 1;
//   }
// 
//   const weirds = [];
//   const abundant = [];
//   let maxWeirdAbund = 0;
// 
//   for (let n = 2; n <= N; n += 1) {
//     if (sigma[n] <= 2 * n) continue;
//     abundant.push(n);
//     const can = canRepresentAsDistinctSum(n, properDivs[n]);
//     if (!can) {
//       const abund = sigma[n] / n;
//       weirds.push({ n, abundancy: abund });
//       if (abund > maxWeirdAbund) maxWeirdAbund = abund;
//     }
//   }
// 
//   // Small finite threshold proxy: if sigma(n) > Cn then all representable (within range)
//   let bestC = 2;
//   for (let Cnum = 201; Cnum <= 800; Cnum += 1) {
//     const C = Cnum / 100;
//     let ok = true;
//     for (const w of weirds) {
//       if (w.abundancy > C) {
//         ok = false;
//         break;
//       }
//     }
//     if (ok) {
//       bestC = C;
//       break;
//     }
//   }
// 
//   out.results.ep825 = {
//     description: 'Finite weird-number abundancy scan and representability threshold proxy.',
//     N,
//     abundant_count: abundant.length,
//     weird_count: weirds.length,
//     first_20_weirds: weirds.slice(0, 20).map((x) => x.n),
//     max_weird_abundancy_in_range: Number(maxWeirdAbund.toPrecision(8)),
//     finite_C_threshold_no_counterexample_above_in_range: bestC,
//     note: 'Web status indicates EP-825 solved affirmatively (Larsen); finite scan is consistency check only.',
//   };
// }
// ==== End Batch Split Integrations ====
