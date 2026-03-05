#!/usr/bin/env node
const meta={problem:'EP-978',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-978 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch22_quick_compute.mjs | exact finite factorization scan for squarefreeness of n^4+2. ----
// // EP-978: exact finite factorization scan for squarefreeness of n^4+2.
// {
//   const rng = makeRng(20260304 ^ 978);
//   const N = 3000;
//   let squarefreeCount = 0;
//   const probes = new Set([500, 1000, 2000, 3000]);
//   const rows = [];
//   const nonSquarefreeSamples = [];
// 
//   for (let n = 1; n <= N; n += 1) {
//     const v = BigInt(n) ** 4n + 2n;
//     const factors = [];
//     factorBig(v, factors, rng);
//     factors.sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
// 
//     let isSqFree = true;
//     for (let i = 1; i < factors.length; i += 1) {
//       if (factors[i] === factors[i - 1]) {
//         isSqFree = false;
//         break;
//       }
//     }
//     if (isSqFree) squarefreeCount += 1;
//     else if (nonSquarefreeSamples.length < 12) {
//       const mp = new Map();
//       for (const p of factors) mp.set(p.toString(), (mp.get(p.toString()) || 0) + 1);
//       nonSquarefreeSamples.push({
//         n,
//         value: v.toString(),
//         repeated_prime_factors: [...mp.entries()]
//           .filter(([, e]) => e >= 2)
//           .map(([p, e]) => `${p}^${e}`),
//       });
//     }
// 
//     if (probes.has(n)) {
//       rows.push({
//         n,
//         squarefree_values_count: squarefreeCount,
//         squarefree_density: Number((squarefreeCount / n).toPrecision(7)),
//       });
//     }
//   }
// 
//   out.results.ep978 = {
//     description: 'Exact finite scan of squarefreeness for n^4+2 using 64-bit-safe Pollard-rho factorization.',
//     N,
//     rows,
//     sample_non_squarefree_values: nonSquarefreeSamples,
//   };
// }
// ==== End Batch Split Integrations ====
