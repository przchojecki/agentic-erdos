#!/usr/bin/env node
// Canonical per-problem script for EP-995.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-995',
  source_count: 1,
  source_files: ["ep995_heavy_step_counterexample_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-995 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep995_heavy_step_counterexample_scan.mjs
// Kind: current_script_file
// Label: From ep995_heavy_step_counterexample_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-995 search:
// // exact-modular simulations for n_k = b^k (b lacunary base),
// // with mean-zero "heavy step" L^2 functions:
// //   f_M(x) = M on [0, 1/M^2), else -c_M (chosen to make discrete mean zero mod q).
// 
// const Q_LIST = (process.env.Q_LIST || '1000003,1000033')
//   .split(',')
//   .map((x) => Number(x.trim()))
//   .filter((x) => Number.isFinite(x) && x > 10);
// const BASES = (process.env.BASES || '2,3')
//   .split(',')
//   .map((x) => Number(x.trim()))
//   .filter((x) => Number.isFinite(x) && x >= 2);
// const M_LIST = (process.env.M_LIST || '4,8,16,32')
//   .split(',')
//   .map((x) => Number(x.trim()))
//   .filter((x) => Number.isFinite(x) && x >= 2);
// const SAMPLES_PER_Q = Number(process.env.SAMPLES_PER_Q || 120);
// const N_LIST = (process.env.N_LIST || '1024,2048,4096,8192,16384,32768')
//   .split(',')
//   .map((x) => Number(x.trim()))
//   .filter((x) => Number.isFinite(x) && x >= 16)
//   .sort((a, b) => a - b);
// const SEED = Number(process.env.SEED || 20260302);
// 
// function makeRng(seed) {
//   let x = (seed >>> 0) || 1;
//   return () => {
//     x ^= x << 13;
//     x ^= x >>> 17;
//     x ^= x << 5;
//     return (x >>> 0) / 4294967296;
//   };
// }
// 
// function quantile(sorted, p) {
//   if (sorted.length === 0) return 0;
//   const idx = (sorted.length - 1) * p;
//   const lo = Math.floor(idx);
//   const hi = Math.ceil(idx);
//   if (lo === hi) return sorted[lo];
//   const t = idx - lo;
//   return sorted[lo] * (1 - t) + sorted[hi] * t;
// }
// 
// const rng = makeRng(SEED);
// const maxN = N_LIST[N_LIST.length - 1];
// const byConfig = [];
// 
// for (const q of Q_LIST) {
//   for (const base of BASES) {
//     const samplesA = [];
//     for (let s = 0; s < SAMPLES_PER_Q; s += 1) {
//       const a = 1 + Math.floor(rng() * (q - 1));
//       samplesA.push(a);
//     }
// 
//     for (const M of M_LIST) {
//       const t = Math.max(1, Math.floor((q - 1) / (M * M)));
//       const p = t / (q - 1);
//       const cNeg = (M * p) / (1 - p); // exact mean-zero over nonzero residues
// 
//       // stats[N] collects |S_N| over all samples
//       const stats = new Map();
//       for (const N of N_LIST) stats.set(N, []);
// 
//       for (const a0 of samplesA) {
//         let r = (a0 * base) % q; // k=1 residue
//         let sum = 0;
//         let ptr = 0;
//         for (let k = 1; k <= maxN; k += 1) {
//           const v = r <= t ? M : -cNeg;
//           sum += v;
//           while (ptr < N_LIST.length && N_LIST[ptr] === k) {
//             stats.get(N_LIST[ptr]).push(Math.abs(sum));
//             ptr += 1;
//           }
//           r = (r * base) % q;
//         }
//       }
// 
//       const rows = [];
//       for (const N of N_LIST) {
//         const arr = stats.get(N).slice().sort((a, b) => a - b);
//         const meanAbs = arr.reduce((acc, x) => acc + x, 0) / arr.length;
//         const loglog = Math.max(1, Math.log(Math.log(Math.max(16, N))));
//         rows.push({
//           N,
//           samples: arr.length,
//           mean_abs: meanAbs,
//           p90_abs: quantile(arr, 0.9),
//           p99_abs: quantile(arr, 0.99),
//           max_abs: arr[arr.length - 1],
//           mean_over_sqrtNloglog: meanAbs / Math.sqrt(N * loglog),
//           max_over_sqrtNloglog: arr[arr.length - 1] / Math.sqrt(N * loglog),
//           mean_over_Nsqrtloglog: meanAbs / (N * Math.sqrt(loglog)),
//           max_over_Nsqrtloglog: arr[arr.length - 1] / (N * Math.sqrt(loglog)),
//         });
//       }
// 
//       byConfig.push({
//         q,
//         base,
//         M,
//         threshold_t: t,
//         p_estimate: p,
//         c_neg: cNeg,
//         rows,
//       });
//     }
//   }
// }
// 
// let globalMaxRatio = -1;
// let globalMaxMeta = null;
// for (const cfg of byConfig) {
//   for (const row of cfg.rows) {
//     if (row.max_over_Nsqrtloglog > globalMaxRatio) {
//       globalMaxRatio = row.max_over_Nsqrtloglog;
//       globalMaxMeta = { q: cfg.q, base: cfg.base, M: cfg.M, N: row.N, value: row.max_over_Nsqrtloglog };
//     }
//   }
// }
// 
// const out = {
//   problem: 'EP-995',
//   script: path.basename(process.argv[1]),
//   method: 'exact_modular_scan_lacunary_bases_with_mean_zero_heavy_step_L2_functions',
//   params: {
//     q_list: Q_LIST,
//     bases: BASES,
//     m_list: M_LIST,
//     samples_per_q: SAMPLES_PER_Q,
//     n_list: N_LIST,
//     seed: SEED,
//   },
//   global_max_over_Nsqrtloglog: globalMaxMeta,
//   configs: byConfig,
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep995_heavy_step_counterexample_scan.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(
//   JSON.stringify(
//     {
//       outPath,
//       config_count: byConfig.length,
//       global_max_over_Nsqrtloglog: globalMaxMeta,
//     },
//     null,
//     2
//   )
// );
// 
// ==== End Snippet ====

