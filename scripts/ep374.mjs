#!/usr/bin/env node
const meta={problem:'EP-374',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-374 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch11_quick_compute.mjs | exact finite profile for D2/D3 via parity signatures modulo squares. ----
// // EP-374: exact finite profile for D2/D3 via parity signatures modulo squares.
// {
//   const M = 600;
//   const sig = Array(M + 1).fill(0n);
// 
//   const primes = primesAll.filter((p) => p <= M);
//   const pIndex = new Map(primes.map((p, i) => [p, i]));
// 
//   for (let n = 1; n <= M; n += 1) {
//     let x = n;
//     let delta = 0n;
//     while (x > 1) {
//       const p = spf[x];
//       let e = 0;
//       while (x % p === 0) {
//         x = Math.floor(x / p);
//         e += 1;
//       }
//       if (e & 1) delta ^= 1n << BigInt(pIndex.get(p));
//     }
//     sig[n] = sig[n - 1] ^ delta;
//   }
// 
//   const best = new Int8Array(M + 1);
//   best.fill(99);
// 
//   const seenSig = new Map();
//   const pairXor = new Set();
//   seenSig.set(sig[1], 1);
// 
//   for (let m = 2; m <= M; m += 1) {
//     if (seenSig.has(sig[m])) best[m] = 2;
//     if (pairXor.has(sig[m]) && best[m] > 3) best[m] = 3;
// 
//     for (let i = 1; i < m; i += 1) pairXor.add(sig[i] ^ sig[m]);
//     seenSig.set(sig[m], m);
//   }
// 
//   const milestones = [100, 200, 300, 400, 500, 600];
//   const rows = [];
//   for (const X of milestones) {
//     let d2 = 0;
//     let d3 = 0;
//     let other = 0;
//     let primeInD2orD3 = 0;
//     for (let m = 2; m <= X; m += 1) {
//       if (best[m] === 2) {
//         d2 += 1;
//         if (spf[m] === m) primeInD2orD3 += 1;
//       } else if (best[m] === 3) {
//         d3 += 1;
//         if (spf[m] === m) primeInD2orD3 += 1;
//       } else {
//         other += 1;
//       }
//     }
//     rows.push({
//       X,
//       D2_count: d2,
//       D3_count: d3,
//       unresolved_or_ge4_count: other,
//       prime_count_in_D2_or_D3: primeInD2orD3,
//     });
//   }
// 
//   out.results.ep374 = {
//     description: 'Exact finite counts for D2 and D3 via square-parity signatures up to m<=600.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
