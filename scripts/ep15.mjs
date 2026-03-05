#!/usr/bin/env node
// Canonical per-problem script for EP-15.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-15',
  source_count: 2,
  source_files: ["ep15_alternating_prime_series_scan.mjs","harder_batch1_quick_compute.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-15 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/2 ====
// Source: ep15_alternating_prime_series_scan.mjs
// Kind: current_script_file
// Label: From ep15_alternating_prime_series_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-15 counterexample-oriented finite scan:
// // partial sums S_N = sum_{n<=N} (-1)^n n/p_n.
// 
// const N_MAX = Number(process.env.N_MAX || 2000000);
// const CHECKPOINTS = (process.env.CHECKPOINTS || '1000,5000,10000,50000,100000,200000,500000,1000000,1500000,2000000')
//   .split(',')
//   .map((x) => Number(x.trim()))
//   .filter((x) => x >= 1 && x <= N_MAX);
// 
// function nthPrimeUpper(n) {
//   if (n < 6) return 20;
//   const nn = n;
//   return Math.ceil(nn * (Math.log(nn) + Math.log(Math.log(nn)) + 1));
// }
// 
// function sievePrimes(limit) {
//   const is = new Uint8Array(limit + 1);
//   is.fill(1, 2);
//   for (let i = 2; i * i <= limit; i++) {
//     if (!is[i]) continue;
//     for (let j = i * i; j <= limit; j += i) is[j] = 0;
//   }
//   const ps = [];
//   for (let i = 2; i <= limit; i++) if (is[i]) ps.push(i);
//   return ps;
// }
// 
// let lim = nthPrimeUpper(N_MAX);
// let primes = sievePrimes(lim);
// while (primes.length < N_MAX) {
//   lim *= 2;
//   primes = sievePrimes(lim);
// }
// 
// const cpSet = new Set(CHECKPOINTS);
// const checkpoints = [];
// let s = 0;
// let sMin = 0;
// let sMax = 0;
// let argMin = 0;
// let argMax = 0;
// 
// for (let n = 1; n <= N_MAX; n++) {
//   const term = ((n & 1) ? -1 : 1) * (n / primes[n - 1]);
//   s += term;
//   if (s < sMin) {
//     sMin = s;
//     argMin = n;
//   }
//   if (s > sMax) {
//     sMax = s;
//     argMax = n;
//   }
//   if (cpSet.has(n)) checkpoints.push({ n, partial_sum: Number(s.toFixed(10)), min_so_far: Number(sMin.toFixed(10)), max_so_far: Number(sMax.toFixed(10)) });
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   n_max: N_MAX,
//   partial_sum_at_n_max: Number(s.toFixed(12)),
//   min_partial_sum: Number(sMin.toFixed(12)),
//   argmin_n: argMin,
//   max_partial_sum: Number(sMax.toFixed(12)),
//   argmax_n: argMax,
//   checkpoints,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep15_alternating_prime_series_scan.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, n_max: N_MAX, partial: out.partial_sum_at_n_max }, null, 2));
// 
// ==== End Snippet ====

// ==== Integrated Snippet 2/2 ====
// Source: harder_batch1_quick_compute.mjs
// Kind: batch_ep_section_from_head
// Label: alternating prime series partial sums.
// // EP-15: alternating prime series partial sums.
// {
//   const cpSet = new Set([1000, 10000, 100000, 500000, 1000000]);
//   const checkpoints = [];
//   let s = 0;
//   let sMin = 0;
//   let sMax = 0;
//   let argMin = 0;
//   let argMax = 0;
//   for (let n = 1; n <= EP15_N_MAX; n += 1) {
//     const term = ((n & 1) ? -1 : 1) * (n / sieveData.primes[n - 1]);
//     s += term;
//     if (s < sMin) {
//       sMin = s;
//       argMin = n;
//     }
//     if (s > sMax) {
//       sMax = s;
//       argMax = n;
//     }
//     if (cpSet.has(n)) checkpoints.push({ n, partial_sum: Number(s.toFixed(10)) });
//   }
//   out.results.ep15 = {
//     description: 'Partial sums of sum (-1)^n n / p_n up to n=1e6.',
//     n_max: EP15_N_MAX,
//     partial_sum_at_n_max: Number(s.toFixed(12)),
//     min_partial_sum: Number(sMin.toFixed(12)),
//     argmin_n: argMin,
//     max_partial_sum: Number(sMax.toFixed(12)),
//     argmax_n: argMax,
//     checkpoints,
//   };
// }
// ==== End Snippet ====

// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch1_quick_compute.mjs | alternating prime series partial sums. ----
// // EP-15: alternating prime series partial sums.
// {
//   const cpSet = new Set([1000, 10000, 100000, 500000, 1000000]);
//   const checkpoints = [];
//   let s = 0;
//   let sMin = 0;
//   let sMax = 0;
//   let argMin = 0;
//   let argMax = 0;
//   for (let n = 1; n <= EP15_N_MAX; n += 1) {
//     const term = ((n & 1) ? -1 : 1) * (n / sieveData.primes[n - 1]);
//     s += term;
//     if (s < sMin) {
//       sMin = s;
//       argMin = n;
//     }
//     if (s > sMax) {
//       sMax = s;
//       argMax = n;
//     }
//     if (cpSet.has(n)) checkpoints.push({ n, partial_sum: Number(s.toFixed(10)) });
//   }
//   out.results.ep15 = {
//     description: 'Partial sums of sum (-1)^n n / p_n up to n=1e6.',
//     n_max: EP15_N_MAX,
//     partial_sum_at_n_max: Number(s.toFixed(12)),
//     min_partial_sum: Number(sMin.toFixed(12)),
//     argmin_n: argMin,
//     max_partial_sum: Number(sMax.toFixed(12)),
//     argmax_n: argMax,
//     checkpoints,
//   };
// }
// ==== End Batch Split Integrations ====
