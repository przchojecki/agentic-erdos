#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x > 0);
  return out.length ? out : fallback;
}

function greedySparseRuler(N, restarts, seed) {
  const rng = makeRng(seed);
  const allTargetCount = N + 1;
  let best = Infinity;

  for (let t = 0; t < restarts; t += 1) {
    const inA = new Uint8Array(N + 1);
    const A = [0, N];
    inA[0] = 1;
    inA[N] = 1;

    const covered = new Uint8Array(N + 1);
    covered[0] = 1;
    covered[N] = 1;
    let coveredCount = 2;

    while (coveredCount < allTargetCount) {
      let bestGain = -1;
      const candidates = [];
      for (let x = 0; x <= N; x += 1) {
        if (inA[x]) continue;
        let gain = 0;
        for (const a of A) {
          const d = Math.abs(x - a);
          if (!covered[d]) gain += 1;
        }
        if (gain > bestGain) {
          bestGain = gain;
          candidates.length = 0;
          candidates.push(x);
        } else if (gain === bestGain) {
          candidates.push(x);
        }
      }
      if (candidates.length === 0) break;
      const bestX = candidates[Math.floor(rng() * candidates.length)];
      inA[bestX] = 1;
      A.push(bestX);
      for (const a of A) {
        const d = Math.abs(bestX - a);
        if (!covered[d]) {
          covered[d] = 1;
          coveredCount += 1;
        }
      }
    }
    if (A.length < best) best = A.length;
  }
  return best;
}

const N_LIST = parseIntList(process.env.N_LIST, [200, 400, 800, 1200, 1600, 2000]);
const RESTARTS = Number(process.env.RESTARTS || 140);
const SEED = Number(process.env.SEED || 1702026);
const OUT = process.env.OUT || '';

const rows = [];
for (const N of N_LIST) {
  const sz = greedySparseRuler(N, RESTARTS, SEED ^ (N * 1009));
  rows.push({
    N,
    restarts: RESTARTS,
    best_size_found: sz,
    ratio_over_sqrtN: Number((sz / Math.sqrt(N)).toFixed(6)),
  });
}

const out = {
  problem: 'EP-170',
  script: path.basename(process.argv[1]),
  method: 'standalone_greedy_sparse_ruler_search',
  params: { N_LIST, RESTARTS, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch6_quick_compute.mjs | sparse ruler greedy construction profile. ----
// // EP-170: sparse ruler greedy construction profile.
// {
//   function greedySparseRuler(N, restarts) {
//     const allTargetCount = N + 1;
//     let best = Infinity;
// 
//     for (let t = 0; t < restarts; t += 1) {
//       const inA = new Uint8Array(N + 1);
//       const A = [0, N];
//       inA[0] = 1;
//       inA[N] = 1;
// 
//       const covered = new Uint8Array(N + 1);
//       covered[0] = 1;
//       covered[N] = 1;
//       let coveredCount = 2;
// 
//       while (coveredCount < allTargetCount) {
//         let bestX = -1;
//         let bestGain = -1;
//         const candidates = [];
// 
//         for (let x = 0; x <= N; x += 1) {
//           if (inA[x]) continue;
//           let gain = 0;
//           for (const a of A) {
//             const d = Math.abs(x - a);
//             if (!covered[d]) gain += 1;
//           }
//           if (gain > bestGain) {
//             bestGain = gain;
//             candidates.length = 0;
//             candidates.push(x);
//           } else if (gain === bestGain) {
//             candidates.push(x);
//           }
//         }
// 
//         if (candidates.length === 0) break;
//         bestX = candidates[Math.floor(rng() * candidates.length)];
//         inA[bestX] = 1;
//         A.push(bestX);
// 
//         for (const a of A) {
//           const d = Math.abs(bestX - a);
//           if (!covered[d]) {
//             covered[d] = 1;
//             coveredCount += 1;
//           }
//         }
//       }
// 
//       if (A.length < best) best = A.length;
//     }
// 
//     return best;
//   }
// 
//   const rows = [];
//   for (const [N, restarts] of [
//     [200, 80],
//     [400, 70],
//     [800, 60],
//     [1200, 50],
//   ]) {
//     const sz = greedySparseRuler(N, restarts);
//     rows.push({
//       N,
//       restarts,
//       best_size_found: sz,
//       ratio_over_sqrtN: Number((sz / Math.sqrt(N)).toFixed(6)),
//     });
//   }
// 
//   out.results.ep170 = {
//     description: 'Greedy finite sparse-ruler profile for F(N)/sqrt(N).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
