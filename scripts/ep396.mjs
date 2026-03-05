#!/usr/bin/env node
const meta={problem:'EP-396',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-396 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch11_quick_compute.mjs | search smallest n for each k with prod_{i=0..k}(n-i) | C(2n,n), finite range. ----
// // EP-396: search smallest n for each k with prod_{i=0..k}(n-i) | C(2n,n), finite range.
// {
//   const N = 8000;
//   const KMAX = 8;
//   const primes = primesAll.filter((p) => p <= N);
// 
//   const firstN = Array(KMAX + 1).fill(null);
//   const hitCounts = Array(KMAX + 1).fill(0);
// 
//   for (let n = 2; n <= N; n += 1) {
//     const vp = new Map();
//     for (const p of primes) {
//       if (p > n) break;
//       const e = vpCentralBinom(n, p);
//       if (e > 0) vp.set(p, e);
//     }
// 
//     const acc = new Map();
//     const kLim = Math.min(KMAX, n - 1);
// 
//     for (let k = 0; k <= kLim; k += 1) {
//       const factors = factorizeInt(n - k, spf);
//       for (const [p, e] of factors) acc.set(p, (acc.get(p) || 0) + e);
// 
//       let ok = true;
//       for (const [p, e] of acc.entries()) {
//         if ((vp.get(p) || 0) < e) {
//           ok = false;
//           break;
//         }
//       }
// 
//       if (ok) {
//         hitCounts[k] += 1;
//         if (firstN[k] === null) firstN[k] = n;
//       }
//     }
// 
//     let done = true;
//     for (let k = 0; k <= KMAX; k += 1) {
//       if (firstN[k] === null) {
//         done = false;
//         break;
//       }
//     }
//     if (done && n > 1000) break;
//   }
// 
//   out.results.ep396 = {
//     description: 'Finite search for divisibility of descending products by C(2n,n), k<=8.',
//     search_limit_n: N,
//     rows: Array.from({ length: KMAX + 1 }, (_, k) => ({
//       k,
//       first_n_found: firstN[k],
//       hit_count_in_range: hitCounts[k],
//     })),
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch11_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
