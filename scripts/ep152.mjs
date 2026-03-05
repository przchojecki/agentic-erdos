#!/usr/bin/env node
// Canonical per-problem script for EP-152.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-152',
  source_count: 4,
  source_files: ["ep152_ep153_adversarial_search.mjs","ep152_ep153_anneal_search.mjs","ep152_ep153_family_metrics.mjs","ep152_ep153_scan_smallN.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-152 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/4 ====
// Source: ep152_ep153_adversarial_search.mjs
// Kind: current_script_file
// Label: From ep152_ep153_adversarial_search.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// 
// // Heuristic adversarial search for EP-152 / EP-153:
// // For each target size m, try to find Sidon sets minimizing:
// //   - isolated(A+A)           [EP-152 stress]
// //   - avg_sq_gap(A+A)         [EP-153 stress]
// //
// // Usage:
// //   node scripts/ep152_ep153_adversarial_search.mjs
// //   node scripts/ep152_ep153_adversarial_search.mjs 11 40 2000
// //     (mStart=11, mEnd=40, restartsPerM=2000)
// 
// const mStart = Number(process.argv[2] || 11);
// const mEnd = Number(process.argv[3] || 40);
// const restartsPerM = Number(process.argv[4] || 1500);
// const outPath = process.env.OUT_PATH || '';
// 
// if (!Number.isInteger(mStart) || !Number.isInteger(mEnd) || !Number.isInteger(restartsPerM) || mStart < 3 || mEnd < mStart || restartsPerM < 1) {
//   console.error('Usage: node scripts/ep152_ep153_adversarial_search.mjs [mStart>=3] [mEnd>=mStart] [restarts>=1]');
//   process.exit(1);
// }
// 
// function randInt(lo, hi) {
//   return lo + Math.floor(Math.random() * (hi - lo + 1));
// }
// 
// function isSidon(arr) {
//   const diffs = new Set();
//   for (let i = 0; i < arr.length; i++) {
//     for (let j = i + 1; j < arr.length; j++) {
//       const d = arr[j] - arr[i];
//       if (diffs.has(d)) return false;
//       diffs.add(d);
//     }
//   }
//   return true;
// }
// 
// function sidonFromPrefix(prefix, targetM, maxStep) {
//   const arr = prefix.slice();
//   const diffs = new Set();
//   for (let i = 0; i < arr.length; i++) {
//     for (let j = i + 1; j < arr.length; j++) diffs.add(arr[j] - arr[i]);
//   }
// 
//   while (arr.length < targetM) {
//     const base = arr[arr.length - 1];
//     let placed = false;
//     // Try many random nearby candidates first.
//     for (let tries = 0; tries < 600; tries++) {
//       const x = base + randInt(1, maxStep);
//       let ok = true;
//       for (let i = 0; i < arr.length; i++) {
//         const d = x - arr[i];
//         if (diffs.has(d)) {
//           ok = false;
//           break;
//         }
//       }
//       if (!ok) continue;
//       for (let i = 0; i < arr.length; i++) diffs.add(x - arr[i]);
//       arr.push(x);
//       placed = true;
//       break;
//     }
//     if (placed) continue;
// 
//     // Deterministic fallback: walk upward until a valid point appears.
//     let x = base + 1;
//     for (;;) {
//       let ok = true;
//       for (let i = 0; i < arr.length; i++) {
//         const d = x - arr[i];
//         if (diffs.has(d)) {
//           ok = false;
//           break;
//         }
//       }
//       if (ok) {
//         for (let i = 0; i < arr.length; i++) diffs.add(x - arr[i]);
//         arr.push(x);
//         break;
//       }
//       x += 1;
//       if (x - base > maxStep * 20) return null;
//     }
//   }
//   return arr;
// }
// 
// function metrics(arr) {
//   const m = arr.length;
//   const sums = [];
//   for (let i = 0; i < m; i++) {
//     for (let j = i; j < m; j++) sums.push(arr[i] + arr[j]);
//   }
//   sums.sort((a, b) => a - b);
// 
//   const t = sums.length;
//   let sumSq = 0;
//   let isolated = 0;
//   let maxRun = 1;
//   let run = 1;
//   for (let i = 0; i < t; i++) {
//     if (i > 0) {
//       const g = sums[i] - sums[i - 1];
//       sumSq += g * g;
//       if (g === 1) {
//         run += 1;
//         if (run > maxRun) maxRun = run;
//       } else {
//         run = 1;
//       }
//     }
//     const leftMissing = i === 0 || sums[i] - sums[i - 1] > 1;
//     const rightMissing = i === t - 1 || sums[i + 1] - sums[i] > 1;
//     if (leftMissing && rightMissing) isolated += 1;
//   }
// 
//   return {
//     m,
//     maxA: arr[m - 1],
//     t,
//     isolated,
//     isolated_over_m2: isolated / (m * m),
//     avg_sq_gap: sumSq / t,
//     avg_sq_gap_over_m: (sumSq / t) / m,
//     max_consecutive_run: maxRun,
//     max_run_over_m: maxRun / m,
//   };
// }
// 
// function lexLess(a, b) {
//   if (!b) return true;
//   for (let i = 0; i < Math.min(a.length, b.length); i++) {
//     if (a[i] !== b[i]) return a[i] < b[i];
//   }
//   return a.length < b.length;
// }
// 
// function betterIso(candidateMetric, candidateSet, bestMetric, bestSet) {
//   if (!bestMetric) return true;
//   if (candidateMetric.isolated !== bestMetric.isolated) return candidateMetric.isolated < bestMetric.isolated;
//   if (candidateMetric.maxA !== bestMetric.maxA) return candidateMetric.maxA < bestMetric.maxA;
//   return lexLess(candidateSet, bestSet);
// }
// 
// function betterAvg(candidateMetric, candidateSet, bestMetric, bestSet) {
//   if (!bestMetric) return true;
//   if (candidateMetric.avg_sq_gap !== bestMetric.avg_sq_gap) return candidateMetric.avg_sq_gap < bestMetric.avg_sq_gap;
//   if (candidateMetric.maxA !== bestMetric.maxA) return candidateMetric.maxA < bestMetric.maxA;
//   return lexLess(candidateSet, bestSet);
// }
// 
// function generateSeed(m, seedKind) {
//   // A few distinct seed modes to diversify search.
//   if (seedKind === 0) return [1, 2];
//   if (seedKind === 1) return [1, 3];
//   if (seedKind === 2) return [1, 2, 4];
//   return [1, 2, randInt(4, Math.max(4, Math.floor(m / 2) + 3))];
// }
// 
// const rows = [];
// 
// for (let m = mStart; m <= mEnd; m++) {
//   let bestIsoMetric = null;
//   let bestIsoSet = null;
//   let bestAvgMetric = null;
//   let bestAvgSet = null;
//   let validCount = 0;
// 
//   // Step scale tuned by m. Larger m allows a bit more exploration spread.
//   const maxStep = Math.max(8, Math.floor(0.7 * m));
// 
//   for (let r = 0; r < restartsPerM; r++) {
//     const seed = generateSeed(m, r % 4);
//     const A = sidonFromPrefix(seed, m, maxStep);
//     if (!A || !isSidon(A)) continue;
//     validCount += 1;
//     const mt = metrics(A);
// 
//     if (betterIso(mt, A, bestIsoMetric, bestIsoSet)) {
//       bestIsoMetric = mt;
//       bestIsoSet = A.slice();
//     }
//     if (betterAvg(mt, A, bestAvgMetric, bestAvgSet)) {
//       bestAvgMetric = mt;
//       bestAvgSet = A.slice();
//     }
//   }
// 
//   // Extra deterministic fallback using a dense-ish greedy completion.
//   if (!bestIsoMetric || !bestAvgMetric) {
//     const fallback = sidonFromPrefix([1, 2], m, 3);
//     if (fallback && isSidon(fallback)) {
//       const mt = metrics(fallback);
//       if (betterIso(mt, fallback, bestIsoMetric, bestIsoSet)) {
//         bestIsoMetric = mt;
//         bestIsoSet = fallback.slice();
//       }
//       if (betterAvg(mt, fallback, bestAvgMetric, bestAvgSet)) {
//         bestAvgMetric = mt;
//         bestAvgSet = fallback.slice();
//       }
//       validCount += 1;
//     }
//   }
// 
//   if (!bestIsoMetric || !bestAvgMetric) {
//     console.error(`m=${m}: no valid Sidon sample found`);
//     continue;
//   }
// 
//   const row = {
//     m,
//     restarts: restartsPerM,
//     valid_samples: validCount,
//     iso_objective_best: {
//       set: bestIsoSet,
//       ...bestIsoMetric,
//     },
//     avg_sq_objective_best: {
//       set: bestAvgSet,
//       ...bestAvgMetric,
//     },
//   };
//   rows.push(row);
// 
//   console.error(
//     `m=${m} done: bestIso=${bestIsoMetric.isolated}, bestAvg=${bestAvgMetric.avg_sq_gap.toFixed(4)}, maxA(iso)=${
//       bestIsoMetric.maxA
//     }`
//   );
// }
// 
// const out = {
//   mStart,
//   mEnd,
//   restartsPerM,
//   rows,
// };
// 
// if (outPath) {
//   fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
//   console.log(JSON.stringify({ outPath }, null, 2));
// } else {
//   console.log(JSON.stringify(out, null, 2));
// }
// 
// ==== End Snippet ====

// ==== Integrated Snippet 2/4 ====
// Source: ep152_ep153_anneal_search.mjs
// Kind: current_script_file
// Label: From ep152_ep153_anneal_search.mjs
// #!/usr/bin/env node
// 
// // Stronger seeded local-search minimization for EP-152 / EP-153.
// //
// // For each m, optimize two objectives separately:
// // - isolated(A+A)            (EP-152)
// // - avg_sq_gap(A+A)          (EP-153)
// //
// // Seeds include:
// // - Mian-Chowla prefix
// // - Ruzsa prime constructions (or prefixes)
// // - random dense Sidon builds
// //
// // Usage:
// //   node scripts/ep152_ep153_anneal_search.mjs
// //   node scripts/ep152_ep153_anneal_search.mjs 11 50 16 3500
// //     (mStart=11, mEnd=50, restartsPerObjective=16, iterationsPerRestart=3500)
// 
// const mStart = Number(process.argv[2] || 11);
// const mEnd = Number(process.argv[3] || 60);
// const restartsPerObjective = Number(process.argv[4] || 12);
// const iterationsPerRestart = Number(process.argv[5] || 2800);
// 
// if (
//   !Number.isInteger(mStart) ||
//   !Number.isInteger(mEnd) ||
//   !Number.isInteger(restartsPerObjective) ||
//   !Number.isInteger(iterationsPerRestart) ||
//   mStart < 3 ||
//   mEnd < mStart ||
//   restartsPerObjective < 1 ||
//   iterationsPerRestart < 100
// ) {
//   console.error(
//     'Usage: node scripts/ep152_ep153_anneal_search.mjs [mStart>=3] [mEnd>=mStart] [restarts>=1] [iterations>=100]'
//   );
//   process.exit(1);
// }
// 
// function randInt(lo, hi) {
//   return lo + Math.floor(Math.random() * (hi - lo + 1));
// }
// 
// function isPrime(n) {
//   if (n < 2) return false;
//   if (n % 2 === 0) return n === 2;
//   for (let d = 3; d * d <= n; d += 2) {
//     if (n % d === 0) return false;
//   }
//   return true;
// }
// 
// function nextPrime(n) {
//   let p = Math.max(2, n);
//   while (!isPrime(p)) p += 1;
//   return p;
// }
// 
// function isSidon(arr) {
//   const diffs = new Set();
//   for (let i = 0; i < arr.length; i++) {
//     for (let j = i + 1; j < arr.length; j++) {
//       const d = arr[j] - arr[i];
//       if (diffs.has(d)) return false;
//       diffs.add(d);
//     }
//   }
//   return true;
// }
// 
// function metrics(arr) {
//   const m = arr.length;
//   const sums = [];
//   for (let i = 0; i < m; i++) {
//     for (let j = i; j < m; j++) sums.push(arr[i] + arr[j]);
//   }
//   sums.sort((a, b) => a - b);
// 
//   const t = sums.length;
//   let isolated = 0;
//   let sumSq = 0;
//   let maxRun = 1;
//   let run = 1;
//   let positiveGapCount = 0;
//   let extraGapSum = 0;
// 
//   for (let i = 0; i < t; i++) {
//     if (i > 0) {
//       const g = sums[i] - sums[i - 1];
//       sumSq += g * g;
//       if (g > 1) {
//         positiveGapCount += 1;
//         extraGapSum += g - 1;
//       }
//       if (g === 1) {
//         run += 1;
//         if (run > maxRun) maxRun = run;
//       } else {
//         run = 1;
//       }
//     }
//     const leftMissing = i === 0 || sums[i] - sums[i - 1] > 1;
//     const rightMissing = i === t - 1 || sums[i + 1] - sums[i] > 1;
//     if (leftMissing && rightMissing) isolated += 1;
//   }
// 
//   return {
//     m,
//     maxA: arr[m - 1],
//     t,
//     isolated,
//     isolated_over_m2: isolated / (m * m),
//     avg_sq_gap: sumSq / t,
//     avg_sq_gap_over_m: (sumSq / t) / m,
//     max_consecutive_run: maxRun,
//     positive_gap_count: positiveGapCount,
//     extra_gap_sum: extraGapSum,
//   };
// }
// 
// function objectiveValue(metric, mode) {
//   if (mode === 'iso') return metric.isolated + 1e-6 * metric.maxA;
//   return metric.avg_sq_gap + 1e-6 * metric.maxA;
// }
// 
// function lexLess(a, b) {
//   if (!b) return true;
//   const n = Math.min(a.length, b.length);
//   for (let i = 0; i < n; i++) {
//     if (a[i] !== b[i]) return a[i] < b[i];
//   }
//   return a.length < b.length;
// }
// 
// function better(candidateSet, candidateMetric, bestSet, bestMetric, mode) {
//   if (!bestSet || !bestMetric) return true;
//   if (mode === 'iso') {
//     if (candidateMetric.isolated !== bestMetric.isolated) return candidateMetric.isolated < bestMetric.isolated;
//     if (candidateMetric.maxA !== bestMetric.maxA) return candidateMetric.maxA < bestMetric.maxA;
//     return lexLess(candidateSet, bestSet);
//   }
//   if (candidateMetric.avg_sq_gap !== bestMetric.avg_sq_gap) return candidateMetric.avg_sq_gap < bestMetric.avg_sq_gap;
//   if (candidateMetric.maxA !== bestMetric.maxA) return candidateMetric.maxA < bestMetric.maxA;
//   return lexLess(candidateSet, bestSet);
// }
// 
// function mianChowlaPrefix(m) {
//   const arr = [1, 2];
//   const diffs = new Set([1]);
//   while (arr.length < m) {
//     let x = arr[arr.length - 1] + 1;
//     for (;;) {
//       let ok = true;
//       const pending = [];
//       for (let i = 0; i < arr.length; i++) {
//         const d = x - arr[i];
//         if (diffs.has(d)) {
//           ok = false;
//           break;
//         }
//         pending.push(d);
//       }
//       if (ok) {
//         for (const d of pending) diffs.add(d);
//         arr.push(x);
//         break;
//       }
//       x += 1;
//     }
//   }
//   return arr;
// }
// 
// function ruzsaSet(p) {
//   const out = [];
//   for (let i = 0; i < p; i++) out.push(2 * p * i + ((i * i) % p));
//   return out;
// }
// 
// function randomDenseSidon(m, maxStep) {
//   const arr = [1, 2];
//   const diffs = new Set([1]);
//   while (arr.length < m) {
//     const base = arr[arr.length - 1];
//     let placed = false;
//     for (let t = 0; t < 800; t++) {
//       const x = base + randInt(1, maxStep);
//       let ok = true;
//       for (let i = 0; i < arr.length; i++) {
//         if (diffs.has(x - arr[i])) {
//           ok = false;
//           break;
//         }
//       }
//       if (!ok) continue;
//       for (let i = 0; i < arr.length; i++) diffs.add(x - arr[i]);
//       arr.push(x);
//       placed = true;
//       break;
//     }
//     if (placed) continue;
//     let x = base + 1;
//     for (;;) {
//       let ok = true;
//       for (let i = 0; i < arr.length; i++) {
//         if (diffs.has(x - arr[i])) {
//           ok = false;
//           break;
//         }
//       }
//       if (ok) {
//         for (let i = 0; i < arr.length; i++) diffs.add(x - arr[i]);
//         arr.push(x);
//         break;
//       }
//       x += 1;
//       if (x - base > maxStep * 40) return null;
//     }
//   }
//   return arr;
// }
// 
// function mutateOne(arr) {
//   const out = arr.slice();
//   const m = out.length;
//   const i = randInt(1, m - 1); // keep first element anchored at 1
// 
//   const left = out[i - 1] + 1;
//   let right;
//   if (i === m - 1) {
//     right = out[i - 1] + Math.max(4, Math.floor(0.35 * m * m));
//   } else {
//     right = out[i + 1] - 1;
//     if (right < left) return null;
//   }
// 
//   // Mix local and wider jumps.
//   let candidate;
//   if (Math.random() < 0.75) {
//     const radius = Math.max(2, Math.floor(0.08 * m * m));
//     const lo = Math.max(left, out[i] - radius);
//     const hi = Math.min(right, out[i] + radius);
//     if (lo > hi) return null;
//     candidate = randInt(lo, hi);
//   } else {
//     candidate = randInt(left, right);
//   }
// 
//   if (candidate === out[i]) return null;
//   out[i] = candidate;
//   return out;
// }
// 
// function anneal(seed, mode, steps) {
//   let curr = seed.slice();
//   if (!isSidon(curr)) return null;
//   let currMetric = metrics(curr);
//   let currVal = objectiveValue(currMetric, mode);
// 
//   let bestSet = curr.slice();
//   let bestMetric = { ...currMetric };
//   let bestVal = currVal;
// 
//   let temp = 1.0;
//   const cool = Math.exp(Math.log(0.004) / Math.max(1, steps - 1));
// 
//   for (let it = 0; it < steps; it++) {
//     const cand = mutateOne(curr);
//     if (!cand) {
//       temp *= cool;
//       continue;
//     }
//     if (!isSidon(cand)) {
//       temp *= cool;
//       continue;
//     }
//     const candMetric = metrics(cand);
//     const candVal = objectiveValue(candMetric, mode);
//     const delta = candVal - currVal;
//     const accept = delta <= 0 || Math.random() < Math.exp(-delta / Math.max(1e-9, temp));
//     if (accept) {
//       curr = cand;
//       currMetric = candMetric;
//       currVal = candVal;
//       if (candVal < bestVal || (candVal === bestVal && lexLess(cand, bestSet))) {
//         bestSet = cand.slice();
//         bestMetric = { ...candMetric };
//         bestVal = candVal;
//       }
//     }
//     temp *= cool;
//   }
// 
//   return {
//     set: bestSet,
//     metric: bestMetric,
//   };
// }
// 
// function makeSeeds(m) {
//   const seeds = [];
// 
//   // Mian-Chowla seed
//   seeds.push(mianChowlaPrefix(m));
// 
//   // Ruzsa seeds: prime near m and a few larger.
//   const p0 = nextPrime(m);
//   for (const p of [p0, nextPrime(p0 + 1), nextPrime(p0 + 8)]) {
//     const rz = ruzsaSet(p).slice(0, m).map((x) => x - ruzsaSet(p)[0] + 1);
//     // Re-normalize to start at 1 while preserving Sidon.
//     if (isSidon(rz)) seeds.push(rz);
//   }
// 
//   // Random dense seeds.
//   const maxStep = Math.max(6, Math.floor(0.45 * m));
//   for (let s = 0; s < 6; s++) {
//     const rd = randomDenseSidon(m, maxStep);
//     if (rd && isSidon(rd)) seeds.push(rd);
//   }
// 
//   // Deduplicate by key.
//   const uniq = new Map();
//   for (const s of seeds) {
//     uniq.set(s.join(','), s);
//   }
//   return [...uniq.values()];
// }
// 
// const rows = [];
// 
// for (let m = mStart; m <= mEnd; m++) {
//   const seeds = makeSeeds(m);
// 
//   let bestIsoSet = null;
//   let bestIsoMetric = null;
//   let bestAvgSet = null;
//   let bestAvgMetric = null;
//   let isoTries = 0;
//   let avgTries = 0;
// 
//   // Seed-only baseline
//   for (const seed of seeds) {
//     if (!isSidon(seed)) continue;
//     const mt = metrics(seed);
//     if (better(seed, mt, bestIsoSet, bestIsoMetric, 'iso')) {
//       bestIsoSet = seed.slice();
//       bestIsoMetric = { ...mt };
//     }
//     if (better(seed, mt, bestAvgSet, bestAvgMetric, 'avg')) {
//       bestAvgSet = seed.slice();
//       bestAvgMetric = { ...mt };
//     }
//   }
// 
//   const seedPool = seeds.length > 0 ? seeds : [mianChowlaPrefix(m)];
// 
//   for (let r = 0; r < restartsPerObjective; r++) {
//     const isoSeed = seedPool[randInt(0, seedPool.length - 1)];
//     const avgSeed = seedPool[randInt(0, seedPool.length - 1)];
// 
//     const isoOut = anneal(isoSeed, 'iso', iterationsPerRestart);
//     if (isoOut) {
//       isoTries += 1;
//       if (better(isoOut.set, isoOut.metric, bestIsoSet, bestIsoMetric, 'iso')) {
//         bestIsoSet = isoOut.set.slice();
//         bestIsoMetric = { ...isoOut.metric };
//       }
//     }
// 
//     const avgOut = anneal(avgSeed, 'avg', iterationsPerRestart);
//     if (avgOut) {
//       avgTries += 1;
//       if (better(avgOut.set, avgOut.metric, bestAvgSet, bestAvgMetric, 'avg')) {
//         bestAvgSet = avgOut.set.slice();
//         bestAvgMetric = { ...avgOut.metric };
//       }
//     }
//   }
// 
//   const row = {
//     m,
//     seeds_used: seedPool.length,
//     restarts_per_objective: restartsPerObjective,
//     iterations_per_restart: iterationsPerRestart,
//     iso_anneal_runs: isoTries,
//     avg_anneal_runs: avgTries,
//     iso_objective_best: {
//       set: bestIsoSet,
//       ...bestIsoMetric,
//     },
//     avg_sq_objective_best: {
//       set: bestAvgSet,
//       ...bestAvgMetric,
//     },
//   };
//   rows.push(row);
// 
//   console.error(
//     `m=${m} done: iso=${bestIsoMetric.isolated}, avg=${bestAvgMetric.avg_sq_gap.toFixed(4)}, maxA(iso)=${bestIsoMetric.maxA}, maxA(avg)=${bestAvgMetric.maxA}`
//   );
// }
// 
// console.log(
//   JSON.stringify(
//     {
//       mStart,
//       mEnd,
//       restartsPerObjective,
//       iterationsPerRestart,
//       rows,
//     },
//     null,
//     2
//   )
// );
// 
// 
// ==== End Snippet ====

// ==== Integrated Snippet 3/4 ====
// Source: ep152_ep153_family_metrics.mjs
// Kind: current_script_file
// Label: From ep152_ep153_family_metrics.mjs
// #!/usr/bin/env node
// 
// // EP-152 / EP-153 construction-family metrics.
// //
// // Families:
// // 1) Ruzsa prime family:
// //    A_p = { 2*p*i + (i^2 mod p) : 0 <= i < p }.
// // 2) Mian-Chowla greedy Sidon sequence prefixes.
// //
// // Usage:
// //   node scripts/ep152_ep153_family_metrics.mjs
// //   node scripts/ep152_ep153_family_metrics.mjs 101 120
// //     (maxPrime=101, mianChowlaMaxSize=120)
// 
// const maxPrime = Number(process.argv[2] || 101);
// const mianChowlaMaxSize = Number(process.argv[3] || 120);
// 
// if (!Number.isInteger(maxPrime) || !Number.isInteger(mianChowlaMaxSize) || maxPrime < 3 || mianChowlaMaxSize < 2) {
//   console.error('Usage: node scripts/ep152_ep153_family_metrics.mjs [maxPrime>=3] [mianChowlaMaxSize>=2]');
//   process.exit(1);
// }
// 
// function isPrime(n) {
//   if (n < 2) return false;
//   if (n % 2 === 0) return n === 2;
//   for (let d = 3; d * d <= n; d += 2) {
//     if (n % d === 0) return false;
//   }
//   return true;
// }
// 
// function sidonDiffCheck(arr) {
//   const diffs = new Set();
//   for (let i = 0; i < arr.length; i++) {
//     for (let j = i + 1; j < arr.length; j++) {
//       const d = arr[j] - arr[i];
//       if (diffs.has(d)) return false;
//       diffs.add(d);
//     }
//   }
//   return true;
// }
// 
// function metricsForSet(arr) {
//   const m = arr.length;
//   const sums = [];
//   for (let i = 0; i < m; i++) {
//     for (let j = i; j < m; j++) sums.push(arr[i] + arr[j]);
//   }
//   sums.sort((a, b) => a - b);
// 
//   const t = sums.length;
//   let sumSq = 0;
//   for (let i = 0; i < t - 1; i++) {
//     const g = sums[i + 1] - sums[i];
//     sumSq += g * g;
//   }
// 
//   let isolated = 0;
//   for (let i = 0; i < t; i++) {
//     const leftMissing = i === 0 || sums[i] - sums[i - 1] > 1;
//     const rightMissing = i === t - 1 || sums[i + 1] - sums[i] > 1;
//     if (leftMissing && rightMissing) isolated += 1;
//   }
// 
//   return {
//     m,
//     maxA: arr[arr.length - 1],
//     t,
//     isolated,
//     avg_sq_gap: sumSq / t,
//     isolated_over_m2: isolated / (m * m),
//     avg_sq_gap_over_m: (sumSq / t) / m,
//   };
// }
// 
// function ruzsaSet(p) {
//   const out = [];
//   for (let i = 0; i < p; i++) out.push(2 * p * i + ((i * i) % p));
//   return out;
// }
// 
// function mianChowlaPrefix(maxSize) {
//   const arr = [1, 2];
//   const diffs = new Set([1]);
//   while (arr.length < maxSize) {
//     let x = arr[arr.length - 1] + 1;
//     for (;;) {
//       let ok = true;
//       const pending = [];
//       for (let i = 0; i < arr.length; i++) {
//         const d = x - arr[i];
//         if (diffs.has(d)) {
//           ok = false;
//           break;
//         }
//         pending.push(d);
//       }
//       if (ok) {
//         for (const d of pending) diffs.add(d);
//         arr.push(x);
//         break;
//       }
//       x += 1;
//     }
//   }
//   return arr;
// }
// 
// const ruzsaPrimeFamily = [];
// for (let p = 3; p <= maxPrime; p++) {
//   if (!isPrime(p)) continue;
//   const A = ruzsaSet(p);
//   ruzsaPrimeFamily.push({
//     p,
//     sidon_check: sidonDiffCheck(A),
//     ...metricsForSet(A),
//   });
// }
// 
// const mc = mianChowlaPrefix(mianChowlaMaxSize);
// const mianChowlaFamily = [];
// for (let m = 2; m <= mc.length; m++) {
//   const A = mc.slice(0, m);
//   mianChowlaFamily.push({
//     ...metricsForSet(A),
//   });
// }
// 
// console.log(
//   JSON.stringify(
//     {
//       maxPrime,
//       mianChowlaMaxSize,
//       ruzsa_prime_family: ruzsaPrimeFamily,
//       mian_chowla_prefix_family: mianChowlaFamily,
//     },
//     null,
//     2
//   )
// );
// 
// 
// ==== End Snippet ====

// ==== Integrated Snippet 4/4 ====
// Source: ep152_ep153_scan_smallN.mjs
// Kind: current_script_file
// Label: From ep152_ep153_scan_smallN.mjs
// #!/usr/bin/env node
// 
// // EP-152 / EP-153 exhaustive small-N scan.
// // For each Sidon set A subseteq [1..N] with min(A)=1, compute:
// // - EP-152 metric: isolated sums in A+A
// // - EP-153 metric: average squared successive gap in sorted A+A
// //
// // Usage:
// //   node scripts/ep152_ep153_scan_smallN.mjs
// //   node scripts/ep152_ep153_scan_smallN.mjs 10 60
// 
// const startN = Number(process.argv[2] || 10);
// const endN = Number(process.argv[3] || 60);
// 
// if (!Number.isInteger(startN) || !Number.isInteger(endN) || startN < 2 || endN < startN) {
//   console.error('Usage: node scripts/ep152_ep153_scan_smallN.mjs [startN] [endN]');
//   process.exit(1);
// }
// 
// function diffBit(d) {
//   // d in [1, ...]
//   return 1n << BigInt(d - 1);
// }
// 
// function metricsForSet(arr) {
//   const m = arr.length;
//   const sums = [];
//   for (let i = 0; i < m; i++) {
//     for (let j = i; j < m; j++) sums.push(arr[i] + arr[j]);
//   }
//   sums.sort((a, b) => a - b);
// 
//   const t = sums.length;
//   let sumSq = 0;
//   for (let i = 0; i < t - 1; i++) {
//     const g = sums[i + 1] - sums[i];
//     sumSq += g * g;
//   }
// 
//   let isolated = 0;
//   for (let i = 0; i < t; i++) {
//     const leftMissing = i === 0 || sums[i] - sums[i - 1] > 1;
//     const rightMissing = i === t - 1 || sums[i + 1] - sums[i] > 1;
//     if (leftMissing && rightMissing) isolated += 1;
//   }
// 
//   return {
//     isolated,
//     avg_sq_gap: sumSq / t,
//   };
// }
// 
// function setLexLess(a, b) {
//   if (!b) return true;
//   const n = Math.min(a.length, b.length);
//   for (let i = 0; i < n; i++) {
//     if (a[i] !== b[i]) return a[i] < b[i];
//   }
//   return a.length < b.length;
// }
// 
// function updateMin(bySize, m, arr, metric) {
//   const curr = bySize.get(m) || {
//     min_isolated: Infinity,
//     min_isolated_set: null,
//     min_avg_sq_gap: Infinity,
//     min_avg_sq_gap_set: null,
//   };
// 
//   if (
//     metric.isolated < curr.min_isolated ||
//     (metric.isolated === curr.min_isolated && setLexLess(arr, curr.min_isolated_set))
//   ) {
//     curr.min_isolated = metric.isolated;
//     curr.min_isolated_set = arr.slice();
//   }
// 
//   if (
//     metric.avg_sq_gap < curr.min_avg_sq_gap ||
//     (metric.avg_sq_gap === curr.min_avg_sq_gap && setLexLess(arr, curr.min_avg_sq_gap_set))
//   ) {
//     curr.min_avg_sq_gap = metric.avg_sq_gap;
//     curr.min_avg_sq_gap_set = arr.slice();
//   }
// 
//   bySize.set(m, curr);
// }
// 
// function bySizeToObject(bySize) {
//   const out = {};
//   const sizes = [...bySize.keys()].sort((a, b) => a - b);
//   for (const m of sizes) {
//     const rec = bySize.get(m);
//     out[String(m)] = {
//       m,
//       min_isolated: rec.min_isolated,
//       min_isolated_set: rec.min_isolated_set,
//       min_avg_sq_gap: rec.min_avg_sq_gap,
//       min_avg_sq_gap_set: rec.min_avg_sq_gap_set,
//     };
//   }
//   return out;
// }
// 
// const rows = [];
// const globalBySize = new Map();
// 
// for (let N = startN; N <= endN; N++) {
//   const t0 = Date.now();
//   const arr = [1];
//   let usedDiffMask = 0n;
//   let sidonSetCount = 0;
// 
//   const bySize = new Map();
// 
//   function recordCurrent() {
//     sidonSetCount += 1;
//     const m = arr.length;
//     const metric = metricsForSet(arr);
//     updateMin(bySize, m, arr, metric);
//     updateMin(globalBySize, m, arr, metric);
//   }
// 
//   recordCurrent();
// 
//   function rec(next) {
//     for (let x = next; x <= N; x++) {
//       let ok = true;
//       let addMask = 0n;
//       for (let i = 0; i < arr.length; i++) {
//         const bit = diffBit(x - arr[i]);
//         if ((usedDiffMask & bit) !== 0n || (addMask & bit) !== 0n) {
//           ok = false;
//           break;
//         }
//         addMask |= bit;
//       }
//       if (!ok) continue;
// 
//       arr.push(x);
//       usedDiffMask |= addMask;
//       recordCurrent();
//       rec(x + 1);
//       usedDiffMask ^= addMask;
//       arr.pop();
//     }
//   }
// 
//   rec(2);
// 
//   const row = {
//     N,
//     sidon_sets_min1_count: sidonSetCount,
//     by_size: bySizeToObject(bySize),
//     total_ms: Date.now() - t0,
//   };
//   rows.push(row);
//   console.error(`N=${N} done, sets(min=1)=${sidonSetCount}, ms=${row.total_ms}`);
// }
// 
// console.log(
//   JSON.stringify(
//     {
//       startN,
//       endN,
//       rows,
//       global_min_by_size: bySizeToObject(globalBySize),
//     },
//     null,
//     2
//   )
// );
// 
// 
// ==== End Snippet ====

