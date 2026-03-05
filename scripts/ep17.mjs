#!/usr/bin/env node
// Canonical per-problem script for EP-17.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-17',
  source_count: 2,
  source_files: ["ep17_cluster_prime_scan.mjs","harder_batch1_quick_compute.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-17 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/2 ====
// Source: ep17_cluster_prime_scan.mjs
// Kind: current_script_file
// Label: From ep17_cluster_prime_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-17 counterexample-oriented finite scan:
// // list cluster primes up to P_MAX.
// 
// const P_MAX = Number(process.env.P_MAX || 300000);
// 
// function sieve(n) {
//   const isPrime = new Uint8Array(n + 1);
//   isPrime.fill(1, 2);
//   for (let i = 2; i * i <= n; i++) {
//     if (!isPrime[i]) continue;
//     for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
//   }
//   const ps = [];
//   for (let i = 2; i <= n; i++) if (isPrime[i]) ps.push(i);
//   return { isPrime, primes: ps };
// }
// 
// const { primes } = sieve(P_MAX);
// const canDiff = new Uint8Array(P_MAX + 1); // canDiff[n]=1 if n=q1-q2 for primes in current prefix
// const clusterPrimes = [];
// const checkpoints = [];
// 
// const pref = [];
// for (const p of primes) {
//   // add differences p-q for previous q
//   for (const q of pref) {
//     const d = p - q;
//     if (d <= P_MAX) canDiff[d] = 1;
//   }
//   pref.push(p);
// 
//   let ok = true;
//   for (let n = 2; n <= p - 3; n += 2) {
//     if (!canDiff[n]) {
//       ok = false;
//       break;
//     }
//   }
//   if (ok) clusterPrimes.push(p);
//   if (p <= 2000 || p % 50000 === 1) checkpoints.push({ p, cluster_count: clusterPrimes.length });
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   p_max: P_MAX,
//   cluster_primes_count: clusterPrimes.length,
//   largest_cluster_prime_found: clusterPrimes.length ? clusterPrimes[clusterPrimes.length - 1] : null,
//   first_cluster_primes: clusterPrimes.slice(0, 80),
//   last_cluster_primes: clusterPrimes.slice(-40),
//   checkpoints,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep17_cluster_prime_scan.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, p_max: P_MAX, count: clusterPrimes.length }, null, 2));
// 
// ==== End Snippet ====

// ==== Integrated Snippet 2/2 ====
// Source: harder_batch1_quick_compute.mjs
// Kind: batch_ep_section_from_head
// Label: cluster-prime scan.
// // EP-17: cluster-prime scan.
// {
//   const P_MAX = 200000;
//   const primes = [];
//   for (const p of sieveData.primes) {
//     if (p > P_MAX) break;
//     primes.push(p);
//   }
//   const canDiff = new Uint8Array(P_MAX + 1);
//   const clusterPrimes = [];
//   const pref = [];
//   for (const p of primes) {
//     for (const q of pref) {
//       canDiff[p - q] = 1;
//     }
//     pref.push(p);
//     let ok = true;
//     for (let n = 2; n <= p - 3; n += 2) {
//       if (!canDiff[n]) {
//         ok = false;
//         break;
//       }
//     }
//     if (ok) clusterPrimes.push(p);
//   }
//   out.results.ep17 = {
//     description: 'Finite scan for cluster primes up to 2e5.',
//     p_max: P_MAX,
//     cluster_primes_count: clusterPrimes.length,
//     largest_cluster_prime_found: clusterPrimes.length ? clusterPrimes[clusterPrimes.length - 1] : null,
//     first_cluster_primes: clusterPrimes.slice(0, 50),
//     last_cluster_primes: clusterPrimes.slice(-25),
//   };
// }
// 
// // EP-20: random greedy sunflower-free families (k=3), small n-uniform regimes.
// {
//   const rng = makeRng(20260303);
//   const rows = [];
//   const mList = [3, 4, 5];
//   for (const m of mList) {
//     const U = 2 * m + 6;
//     const all = allSubsetsOfSize(U, m);
//     const trials = 60;
//     let best = 0;
//     let sum = 0;
//     for (let t = 0; t < trials; t += 1) {
//       const order = all.slice();
//       shuffle(order, rng);
//       const fam = [];
//       for (const s of order) {
//         if (!candCreates3Sunflower(s, fam)) fam.push(s);
//       }
//       if (fam.length > best) best = fam.length;
//       sum += fam.length;
//     }
//     rows.push({
//       m,
//       universe_size: U,
//       candidate_sets_total: all.length,
//       trials,
//       best_family_size_found: best,
//       avg_family_size: Number((sum / trials).toFixed(4)),
//       best_size_to_the_1_over_m: Number((best ** (1 / m)).toFixed(6)),
//     });
//   }
//   out.results.ep20 = {
//     description: 'Small-scale random greedy profile for 3-sunflower-free m-uniform families.',
//     rows,
//   };
// }
// 
// // EP-28: near-cover random additive-basis proxies and max representation counts.
// {
//   const rng = makeRng(28032026);
//   const NList = [500, 1000, 2000];
//   const densities = [0.1, 0.13, 0.16, 0.2, 0.24];
//   const trials = 60;
//   const rows = [];
// 
//   for (const N of NList) {
//     let bestCoverage = 0;
//     let minMax99 = null;
//     let minMax995 = null;
//     for (const d of densities) {
//       for (let t = 0; t < trials; t += 1) {
//         const A = [];
//         for (let x = 1; x <= N; x += 1) {
//           if (rng() < d) A.push(x);
//         }
//         if (A.length < 2) continue;
//         const r = new Uint16Array(2 * N + 1);
//         for (let i = 0; i < A.length; i += 1) {
//           const ai = A[i];
//           for (let j = 0; j < A.length; j += 1) {
//             r[ai + A[j]] += 1;
//           }
//         }
//         let covered = 0;
//         let maxR = 0;
//         for (let s = 2; s <= 2 * N; s += 1) {
//           if (r[s] > 0) covered += 1;
//           if (r[s] > maxR) maxR = r[s];
//         }
//         const cov = covered / (2 * N - 1);
//         if (cov > bestCoverage) bestCoverage = cov;
//         if (cov >= 0.99 && (minMax99 === null || maxR < minMax99)) minMax99 = maxR;
//         if (cov >= 0.995 && (minMax995 === null || maxR < minMax995)) minMax995 = maxR;
//       }
//     }
//     rows.push({
//       N,
//       densities,
//       trials_per_density: trials,
//       best_coverage_found: Number(bestCoverage.toFixed(6)),
//       min_observed_max_rep_if_coverage_ge_0_99: minMax99,
//       min_observed_max_rep_if_coverage_ge_0_995: minMax995,
//     });
//   }
// 
//   out.results.ep28 = {
//     description: 'Random finite proxies: near-full sumset coverage versus peak representation multiplicity.',
//     rows,
//   };
// }
// 
// // EP-30: random greedy Sidon constructions and scale comparison.
// {
//   const rng = makeRng(30032026);
//   const NList = [500, 1000, 2000, 5000, 10000];
//   const trials = 300;
//   const rows = [];
//   for (const N of NList) {
//     let best = 0;
//     let worst = 1e9;
//     let sum = 0;
//     for (let t = 0; t < trials; t += 1) {
//       const s = greedyMaximalSidonSize(N, rng);
//       if (s > best) best = s;
//       if (s < worst) worst = s;
//       sum += s;
//     }
//     const avg = sum / trials;
//     const sqrtN = Math.sqrt(N);
//     const refinedUpper = sqrtN + 0.98183 * N ** 0.25;
//     rows.push({
//       N,
//       trials,
//       min_size_found: worst,
//       avg_size_found: Number(avg.toFixed(4)),
//       max_size_found: best,
//       max_minus_sqrtN: Number((best - sqrtN).toFixed(6)),
//       refined_upper_sqrt_plus_0_98183_N_quarter: Number(refinedUpper.toFixed(6)),
//       refined_upper_minus_max_found: Number((refinedUpper - best).toFixed(6)),
//     });
//   }
//   const singerLikeRows = [31, 61, 127, 251, 509].map((q) => {
//     const N = q * q + q + 1;
//     const size = q + 1;
//     return {
//       q_prime: q,
//       N_q2_plus_q_plus_1: N,
//       lower_bound_size_q_plus_1: size,
//       ratio_over_sqrtN: Number((size / Math.sqrt(N)).toFixed(6)),
//       lower_bound_minus_sqrtN: Number((size - Math.sqrt(N)).toFixed(6)),
//     };
//   });
//   out.results.ep30 = {
//     description: 'Random greedy Sidon lower-bound profile against sqrt(N) and refined N^(1/4) correction scale.',
//     rows,
//     structured_prime_power_family_profile: singerLikeRows,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch1_quick_compute.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Snippet ====

// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch1_quick_compute.mjs | cluster-prime scan. ----
// // EP-17: cluster-prime scan.
// {
//   const P_MAX = 200000;
//   const primes = [];
//   for (const p of sieveData.primes) {
//     if (p > P_MAX) break;
//     primes.push(p);
//   }
//   const canDiff = new Uint8Array(P_MAX + 1);
//   const clusterPrimes = [];
//   const pref = [];
//   for (const p of primes) {
//     for (const q of pref) {
//       canDiff[p - q] = 1;
//     }
//     pref.push(p);
//     let ok = true;
//     for (let n = 2; n <= p - 3; n += 2) {
//       if (!canDiff[n]) {
//         ok = false;
//         break;
//       }
//     }
//     if (ok) clusterPrimes.push(p);
//   }
//   out.results.ep17 = {
//     description: 'Finite scan for cluster primes up to 2e5.',
//     p_max: P_MAX,
//     cluster_primes_count: clusterPrimes.length,
//     largest_cluster_prime_found: clusterPrimes.length ? clusterPrimes[clusterPrimes.length - 1] : null,
//     first_cluster_primes: clusterPrimes.slice(0, 50),
//     last_cluster_primes: clusterPrimes.slice(-25),
//   };
// }
// ==== End Batch Split Integrations ====
