#!/usr/bin/env node
// Canonical per-problem script for EP-273.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-273',
  source_count: 1,
  source_files: ["ep273_pminus1_cover_greedy_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-273 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep273_pminus1_cover_greedy_scan.mjs
// Kind: current_script_file
// Label: From ep273_pminus1_cover_greedy_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-273 finite heuristic:
// // Distinct moduli m = p-1 (p prime >=5), m<=MOD_MAX.
// // Greedy/randomized residue assignment to maximize coverage of [1..N].
// 
// const N = Number(process.env.N || 200000);
// const MOD_MAX = Number(process.env.MOD_MAX || 120);
// const RESTARTS = Number(process.env.RESTARTS || 120);
// const SEED0 = Number(process.env.SEED || 2732026);
// 
// if (!Number.isInteger(N) || N < 1000) throw new Error('N must be integer >= 1000');
// if (!Number.isInteger(MOD_MAX) || MOD_MAX < 10) throw new Error('MOD_MAX must be integer >= 10');
// if (!Number.isInteger(RESTARTS) || RESTARTS < 1) throw new Error('RESTARTS must be positive integer');
// 
// function isPrime(x) {
//   if (x < 2) return false;
//   if (x % 2 === 0) return x === 2;
//   for (let d = 3; d * d <= x; d += 2) if (x % d === 0) return false;
//   return true;
// }
// 
// function makeRng(seed) {
//   let x = seed | 0;
//   return () => {
//     x ^= x << 13;
//     x ^= x >>> 17;
//     x ^= x << 5;
//     return ((x >>> 0) + 0.5) / 4294967296;
//   };
// }
// 
// function shuffle(arr, rng) {
//   for (let i = arr.length - 1; i > 0; i -= 1) {
//     const j = Math.floor(rng() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
// }
// 
// const moduli = [];
// for (let p = 5; p <= MOD_MAX + 1; p += 1) {
//   if (isPrime(p)) moduli.push(p - 1);
// }
// moduli.sort((a, b) => a - b);
// 
// const baseOrder = moduli.slice();
// let best = null;
// 
// for (let r = 0; r < RESTARTS; r += 1) {
//   const rng = makeRng(SEED0 + 101 * (r + 1));
//   const order = baseOrder.slice();
//   shuffle(order, rng);
// 
//   const covered = new Uint8Array(N + 1);
//   let coveredCount = 0;
//   const picks = [];
// 
//   for (const m of order) {
//     const counts = new Uint32Array(m);
//     for (let n = 1; n <= N; n += 1) {
//       if (!covered[n]) counts[n % m] += 1;
//     }
//     let bestResidue = 0;
//     let bestGain = -1;
//     for (let a = 0; a < m; a += 1) {
//       if (counts[a] > bestGain) {
//         bestGain = counts[a];
//         bestResidue = a;
//       }
//     }
// 
//     // random tie-break perturbation
//     const tieCandidates = [];
//     for (let a = 0; a < m; a += 1) if (counts[a] === bestGain) tieCandidates.push(a);
//     if (tieCandidates.length > 1) bestResidue = tieCandidates[Math.floor(rng() * tieCandidates.length)];
// 
//     if (bestGain > 0) {
//       for (let n = 1; n <= N; n += 1) {
//         if (!covered[n] && n % m === bestResidue) {
//           covered[n] = 1;
//           coveredCount += 1;
//         }
//       }
//     }
//     picks.push({ modulus: m, residue: bestResidue, gain: bestGain });
//   }
// 
//   const uncoveredCount = N - coveredCount;
//   const row = {
//     restart: r + 1,
//     covered_count: coveredCount,
//     uncovered_count: uncoveredCount,
//     covered_ratio: Number((coveredCount / N).toFixed(8)),
//     first_uncovered: (() => {
//       for (let n = 1; n <= N; n += 1) if (!covered[n]) return n;
//       return null;
//     })(),
//     picks,
//   };
// 
//   if (!best || row.uncovered_count < best.uncovered_count) best = row;
// }
// 
// const out = {
//   problem: 'EP-273',
//   script: path.basename(process.argv[1]),
//   method: 'distinct_pminus1_moduli_randomized_greedy_cover_on_finite_prefix',
//   params: { N, MOD_MAX, RESTARTS, seed: SEED0 },
//   moduli,
//   best_restart: best,
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep273_pminus1_cover_greedy_scan.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(
//   JSON.stringify(
//     {
//       outPath,
//       moduli_count: moduli.length,
//       best_uncovered: best.uncovered_count,
//       best_covered_ratio: best.covered_ratio,
//       first_uncovered: best.first_uncovered,
//     },
//     null,
//     2
//   )
// );
// 
// ==== End Snippet ====

