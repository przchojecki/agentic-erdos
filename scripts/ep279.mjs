#!/usr/bin/env node
// Canonical per-problem script for EP-279.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-279',
  source_count: 2,
  source_files: ["ep279_residue_cover_greedy_scan.mjs","longterm_batch2_compute.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-279 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/2 ====
// Source: ep279_residue_cover_greedy_scan.mjs
// Kind: current_script_file
// Label: From ep279_residue_cover_greedy_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-279 finite heuristic for fixed k:
// // choose residues a_p (mod p) for primes p<=P_MAX to maximize coverage of [1..N]
// // by sets {a_p + t p : t>=k}. This is a finite-prefix proxy only.
// 
// const K = Number(process.env.K || 3);
// const N = Number(process.env.N || 300000);
// const P_MAX = Number(process.env.P_MAX || 200);
// const RESTARTS = Number(process.env.RESTARTS || 80);
// const SEED0 = Number(process.env.SEED || 2792026);
// const TAIL_START = Number(process.env.TAIL_START || 2000);
// 
// if (!Number.isInteger(K) || K < 1) throw new Error('K must be integer >=1');
// if (!Number.isInteger(N) || N < 1000) throw new Error('N must be integer >=1000');
// if (!Number.isInteger(P_MAX) || P_MAX < 5) throw new Error('P_MAX must be integer >=5');
// if (!Number.isInteger(RESTARTS) || RESTARTS < 1) throw new Error('RESTARTS must be positive integer');
// if (!Number.isInteger(TAIL_START) || TAIL_START < 1 || TAIL_START > N) throw new Error('TAIL_START must satisfy 1<=TAIL_START<=N');
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
// const primes = [];
// for (let p = 2; p <= P_MAX; p += 1) if (isPrime(p)) primes.push(p);
// 
// let best = null;
// for (let r = 0; r < RESTARTS; r += 1) {
//   const rng = makeRng(SEED0 + 911 * (r + 1));
//   const order = primes.slice();
//   shuffle(order, rng);
// 
//   const covered = new Uint8Array(N + 1);
//   let coveredCount = 0;
//   const picks = [];
// 
//   for (const p of order) {
//     const counts = new Uint32Array(p);
//     for (let n = 1; n <= N; n += 1) {
//       if (covered[n]) continue;
//       const a = n % p;
//       if (n >= a + K * p) counts[a] += 1;
//     }
// 
//     let bestA = 0;
//     let bestGain = -1;
//     for (let a = 0; a < p; a += 1) {
//       if (counts[a] > bestGain) {
//         bestGain = counts[a];
//         bestA = a;
//       }
//     }
//     const ties = [];
//     for (let a = 0; a < p; a += 1) if (counts[a] === bestGain) ties.push(a);
//     if (ties.length > 1) bestA = ties[Math.floor(rng() * ties.length)];
// 
//     if (bestGain > 0) {
//       for (let n = 1; n <= N; n += 1) {
//         if (covered[n]) continue;
//         if (n % p !== bestA) continue;
//         if (n < bestA + K * p) continue;
//         covered[n] = 1;
//         coveredCount += 1;
//       }
//     }
// 
//     picks.push({ p, a: bestA, gain: bestGain });
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
//     tail_uncovered_count: (() => {
//       let c = 0;
//       for (let n = TAIL_START; n <= N; n += 1) if (!covered[n]) c += 1;
//       return c;
//     })(),
//     tail_covered_ratio: (() => {
//       let c = 0;
//       const len = N - TAIL_START + 1;
//       for (let n = TAIL_START; n <= N; n += 1) if (covered[n]) c += 1;
//       return Number((c / len).toFixed(8));
//     })(),
//     picks,
//   };
// 
//   if (!best || row.uncovered_count < best.uncovered_count) best = row;
// }
// 
// const out = {
//   problem: 'EP-279',
//   script: path.basename(process.argv[1]),
//   method: 'randomized_greedy_finite_prefix_cover_with_t_ge_k',
//   params: { K, N, P_MAX, RESTARTS, seed: SEED0 },
//   primes,
//   best_restart: best,
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep279_residue_cover_greedy_scan.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(
//   JSON.stringify(
//     {
//       outPath,
//       prime_count: primes.length,
//       best_uncovered: best.uncovered_count,
//       best_covered_ratio: best.covered_ratio,
//       best_tail_covered_ratio: best.tail_covered_ratio,
//       first_uncovered: best.first_uncovered,
//     },
//     null,
//     2
//   )
// );
// 
// ==== End Snippet ====

// ==== Integrated Snippet 2/2 ====
// Source: longterm_batch2_compute.mjs
// Kind: batch_ep_section_from_head
// Label: summarize existing residue cover scan.
// // EP-279: summarize existing residue cover scan.
// if (fs.existsSync('data/ep279_residue_cover_greedy_scan.json')) {
//   const d = loadJSON('data/ep279_residue_cover_greedy_scan.json');
//   out.results.ep279 = {
//     best_restart: d.best_restart || null,
//     last_row: pickLastRow(d),
//   };
// }
// ==== End Snippet ====

// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/longterm_batch2_compute.mjs | summarize existing residue cover scan. ----
// // EP-279: summarize existing residue cover scan.
// if (fs.existsSync('data/ep279_residue_cover_greedy_scan.json')) {
//   const d = loadJSON('data/ep279_residue_cover_greedy_scan.json');
//   out.results.ep279 = {
//     best_restart: d.best_restart || null,
//     last_row: pickLastRow(d),
//   };
// }
// ==== End Batch Split Integrations ====
