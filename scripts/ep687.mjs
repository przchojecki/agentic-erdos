#!/usr/bin/env node
const meta={problem:'EP-687',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-687 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch17_quick_compute.mjs | random covering-system heuristic for Y(x). ----
// // EP-687: random covering-system heuristic for Y(x).
// {
//   const rng = makeRng(20260304 ^ 1701);
// 
//   function longestCoveredPrefix(primes, residues, yMax) {
//     const covered = new Uint8Array(yMax + 1);
//     for (let i = 0; i < primes.length; i += 1) {
//       const p = primes[i];
//       const a = residues[i];
//       let t = a;
//       if (t <= 0) t += Math.ceil((1 - t) / p) * p;
//       for (let v = t; v <= yMax; v += p) {
//         if (v >= 1) covered[v] = 1;
//       }
//     }
// 
//     let y = 0;
//     for (let v = 1; v <= yMax; v += 1) {
//       if (!covered[v]) break;
//       y = v;
//     }
//     return y;
//   }
// 
//   function hillclimb(x, restarts, steps) {
//     const primes = sieve(x).primes;
//     const yMax = 6 * x * x;
//     let best = 0;
// 
//     for (let r = 0; r < restarts; r += 1) {
//       const residues = primes.map((p) => Math.floor(rng() * p));
//       let cur = longestCoveredPrefix(primes, residues, yMax);
// 
//       for (let it = 0; it < steps; it += 1) {
//         const i = Math.floor(rng() * primes.length);
//         const old = residues[i];
//         residues[i] = Math.floor(rng() * primes[i]);
//         const nxt = longestCoveredPrefix(primes, residues, yMax);
//         if (nxt >= cur) cur = nxt;
//         else residues[i] = old;
//       }
// 
//       if (cur > best) best = cur;
//     }
// 
//     return { best, yMax, numPrimes: primes.length };
//   }
// 
//   const rows = [];
//   for (const x of [20, 30, 40, 60, 80, 100]) {
//     const { best, yMax, numPrimes } = hillclimb(x, 20, 250);
//     rows.push({
//       x,
//       primes_up_to_x: numPrimes,
//       y_max_search_cap: yMax,
//       best_prefix_length_found: best,
//       best_over_x: Number((best / x).toPrecision(7)),
//       best_over_x2: Number((best / (x * x)).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep687 = {
//     description: 'Heuristic coverage optimization for Jacobsthal-style Y(x) lower profiles.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
