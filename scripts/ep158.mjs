#!/usr/bin/env node
// Canonical per-problem script for EP-158.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-158',
  source_count: 1,
  source_files: ["ep158_b2_2_random_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-158 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep158_b2_2_random_scan.mjs
// Kind: current_script_file
// Label: From ep158_b2_2_random_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-158 finite heuristic:
// // Random-order greedy constructions for B2[2]-type sets A subset [1..N]
// // with unordered representation cap r_A+A(n) <= 2.
// //
// // For each N, run multiple restarts and report best/avg size and scaling m/sqrt(N).
// 
// const N_LIST = (process.env.N_LIST || '200,400,800,1200,1800,2600,3600,5000')
//   .split(',')
//   .map((x) => Number(x.trim()))
//   .filter((x) => Number.isInteger(x) && x >= 50);
// const RESTARTS = Number(process.env.RESTARTS || 120);
// const SEED0 = Number(process.env.SEED || 1582026);
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
// function greedyB22Size(N, rng) {
//   const order = Array.from({ length: N }, (_, i) => i + 1);
//   shuffle(order, rng);
// 
//   const A = [];
//   const rep = new Uint16Array(2 * N + 1); // unordered pair counts
// 
//   for (const x of order) {
//     if (rep[2 * x] + 1 > 2) continue;
// 
//     let ok = true;
//     for (let i = 0; i < A.length; i += 1) {
//       const s = A[i] + x;
//       if (rep[s] + 1 > 2) {
//         ok = false;
//         break;
//       }
//     }
//     if (!ok) continue;
// 
//     rep[2 * x] += 1;
//     for (let i = 0; i < A.length; i += 1) rep[A[i] + x] += 1;
//     A.push(x);
//   }
// 
//   A.sort((a, b) => a - b);
//   return A;
// }
// 
// const rows = [];
// for (let idx = 0; idx < N_LIST.length; idx += 1) {
//   const N = N_LIST[idx];
//   const rng = makeRng(SEED0 + 10007 * (idx + 1));
// 
//   let bestSize = -1;
//   let bestSet = [];
//   let sum = 0;
// 
//   for (let t = 0; t < RESTARTS; t += 1) {
//     const A = greedyB22Size(N, rng);
//     const m = A.length;
//     sum += m;
//     if (m > bestSize) {
//       bestSize = m;
//       bestSet = A;
//     }
//   }
// 
//   const avg = sum / RESTARTS;
//   rows.push({
//     N,
//     restarts: RESTARTS,
//     best_size: bestSize,
//     avg_size: Number(avg.toFixed(4)),
//     best_over_sqrtN: Number((bestSize / Math.sqrt(N)).toFixed(6)),
//     avg_over_sqrtN: Number((avg / Math.sqrt(N)).toFixed(6)),
//     best_set_prefix: bestSet.slice(0, 40),
//   });
// }
// 
// const out = {
//   problem: 'EP-158',
//   script: path.basename(process.argv[1]),
//   method: 'random_order_greedy_B2_2_construction',
//   n_list: N_LIST,
//   restarts: RESTARTS,
//   seed: SEED0,
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep158_b2_2_random_scan.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(JSON.stringify({ outPath, rows: rows.length, restarts: RESTARTS }, null, 2));
// 
// ==== End Snippet ====

