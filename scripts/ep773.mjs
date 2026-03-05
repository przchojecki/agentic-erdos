#!/usr/bin/env node
// Canonical per-problem script for EP-773.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-773',
  source_count: 1,
  source_files: ["ep773_squares_sidon_random_greedy.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-773 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep773_squares_sidon_random_greedy.mjs
// Kind: current_script_file
// Label: From ep773_squares_sidon_random_greedy.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-773 finite heuristic:
// // Find large Sidon subsets inside {1^2,...,N^2} using repeated random-greedy runs.
// 
// const N_LIST = (process.env.N_LIST || '100,160,250,400,630,1000,1600,2500')
//   .split(',')
//   .map((x) => Number(x.trim()))
//   .filter((x) => x >= 10);
// const TRIALS = Number(process.env.TRIALS || 400);
// const SEED0 = Number(process.env.SEED || 773123);
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
// function shuffleInPlace(arr, rng) {
//   for (let i = arr.length - 1; i > 0; i--) {
//     const j = Math.floor(rng() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
// }
// 
// function greedySidonSize(values, rng) {
//   const cand = values.slice();
//   shuffleInPlace(cand, rng);
// 
//   const chosen = [];
//   const sums = new Set();
//   for (const x of cand) {
//     let ok = !sums.has(x + x);
//     if (ok) {
//       for (const y of chosen) {
//         if (sums.has(x + y)) {
//           ok = false;
//           break;
//         }
//       }
//     }
//     if (!ok) continue;
//     sums.add(x + x);
//     for (const y of chosen) sums.add(x + y);
//     chosen.push(x);
//   }
//   return chosen.length;
// }
// 
// const rows = [];
// for (let idx = 0; idx < N_LIST.length; idx++) {
//   const N = N_LIST[idx];
//   const values = Array.from({ length: N }, (_, i) => (i + 1) * (i + 1));
// 
//   let best = 0;
//   let avg = 0;
//   const rng = makeRng(SEED0 + 7919 * (idx + 1));
//   for (let t = 0; t < TRIALS; t++) {
//     const s = greedySidonSize(values, rng);
//     avg += s;
//     if (s > best) best = s;
//   }
//   avg /= TRIALS;
// 
//   const expBest = Math.log(best) / Math.log(N);
//   rows.push({
//     N,
//     trials: TRIALS,
//     best_size: best,
//     avg_size: Number(avg.toFixed(4)),
//     best_over_N: Number((best / N).toFixed(6)),
//     exponent_log_best_over_log_N: Number(expBest.toFixed(6)),
//   });
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   n_list: N_LIST,
//   trials: TRIALS,
//   seed: SEED0,
//   rows,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep773_squares_sidon_random_greedy.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, rows: rows.length, trials: TRIALS }, null, 2));
// 
// ==== End Snippet ====

