#!/usr/bin/env node
const meta={problem:'EP-997',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-997 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch22_quick_compute.mjs | sliding-window discrepancy profile for {alpha * p_n} on sampled irrational alphas. ----
// // EP-997: sliding-window discrepancy profile for {alpha * p_n} on sampled irrational alphas.
// {
//   const N = 40_000;
//   const { primes } = sievePrimes(500_000);
//   const p = primes.slice(0, N);
// 
//   const alphaRows = [
//     { name: 'sqrt2', val: Math.SQRT2 },
//     { name: 'pi', val: Math.PI },
//     { name: 'e', val: Math.E },
//     { name: 'phi', val: (1 + Math.sqrt(5)) / 2 },
//   ];
//   const windows = [200, 500, 1000, 2000];
//   const intervals = [
//     [0, 0.5],
//     [0, 1 / 3],
//     [1 / 3, 2 / 3],
//     [0.2, 0.7],
//   ];
// 
//   const outRows = [];
//   for (const a of alphaRows) {
//     const vals = p.map((x) => frac(a.val * x));
//     const stats = [];
// 
//     for (const k of windows) {
//       let best = { relDev: -1, interval: null };
//       for (const [L, R] of intervals) {
//         const ind = new Uint8Array(N);
//         for (let i = 0; i < N; i += 1) if (vals[i] >= L && vals[i] < R) ind[i] = 1;
//         const pref = new Int32Array(N + 1);
//         for (let i = 0; i < N; i += 1) pref[i + 1] = pref[i] + ind[i];
// 
//         let localBest = 0;
//         for (let s = 0; s + k <= N; s += 97) {
//           const c = pref[s + k] - pref[s];
//           const dev = Math.abs(c - (R - L) * k) / k;
//           if (dev > localBest) localBest = dev;
//         }
// 
//         if (localBest > best.relDev) best = { relDev: localBest, interval: [L, R] };
//       }
//       stats.push({
//         k,
//         max_relative_deviation_found: Number(best.relDev.toPrecision(7)),
//         interval: best.interval,
//       });
//     }
//     outRows.push({ alpha: a.name, rows: stats });
//   }
// 
//   out.results.ep997 = {
//     description: 'Finite discrepancy scan for fractional parts of alpha times primes in sliding windows.',
//     N,
//     sampled_alphas: outRows,
//   };
// }
// ==== End Batch Split Integrations ====
