#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-160
// Search for colorings of [1..N] such that every 4-term AP has at least 3 distinct colors.
// We run a randomized local-search / hill-climbing procedure and report empirical upper bounds.

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

function build4APs(N) {
  const aps = [];
  for (let a = 1; a <= N; a += 1) {
    for (let d = 1; a + 3 * d <= N; d += 1) {
      aps.push([a - 1, a + d - 1, a + 2 * d - 1, a + 3 * d - 1]);
    }
  }
  return aps;
}

function apBad(colors, ap) {
  const c0 = colors[ap[0]];
  const c1 = colors[ap[1]];
  const c2 = colors[ap[2]];
  const c3 = colors[ap[3]];
  let distinct = 1;
  if (c1 !== c0) distinct += 1;
  if (c2 !== c0 && c2 !== c1) distinct += 1;
  if (c3 !== c0 && c3 !== c1 && c3 !== c2) distinct += 1;
  return distinct < 3;
}

function findColoring({ N, k, restarts, steps, seed }) {
  const rng = makeRng(seed);
  const aps = build4APs(N);
  const apByPos = Array.from({ length: N }, () => []);
  for (let i = 0; i < aps.length; i += 1) {
    for (const p of aps[i]) apByPos[p].push(i);
  }

  for (let t = 0; t < restarts; t += 1) {
    const colors = new Uint8Array(N);
    for (let i = 0; i < N; i += 1) colors[i] = Math.floor(rng() * k);

    const bad = new Uint8Array(aps.length);
    let badCount = 0;
    for (let i = 0; i < aps.length; i += 1) {
      if (apBad(colors, aps[i])) {
        bad[i] = 1;
        badCount += 1;
      }
    }

    for (let step = 0; step < steps; step += 1) {
      if (badCount === 0) return { ok: true, restart: t + 1, steps_used: step };

      const pos = Math.floor(rng() * N);
      const oldColor = colors[pos];
      let newColor = oldColor;
      while (newColor === oldColor) newColor = Math.floor(rng() * k);

      let delta = 0;
      for (const apId of apByPos[pos]) {
        const before = bad[apId];
        const ap = aps[apId];
        colors[pos] = newColor;
        const after = apBad(colors, ap) ? 1 : 0;
        colors[pos] = oldColor;
        delta += after - before;
      }

      if (delta <= 0 || rng() < 0.01) {
        colors[pos] = newColor;
        for (const apId of apByPos[pos]) {
          const ap = aps[apId];
          const before = bad[apId];
          const after = apBad(colors, ap) ? 1 : 0;
          if (before !== after) {
            bad[apId] = after;
            badCount += after - before;
          }
        }
      }
    }
  }

  return { ok: false, restart: null, steps_used: null };
}

const N_LIST = parseIntList(process.env.N_LIST, [80, 100, 120, 140]);
const K_MIN = Number(process.env.K_MIN || 4);
const K_MAX = Number(process.env.K_MAX || 12);
const RESTARTS = Number(process.env.RESTARTS || 96);
const STEPS = Number(process.env.STEPS || 120000);
const SEED = Number(process.env.SEED || 1602026);
const OUT = process.env.OUT || '';

if (!Number.isInteger(K_MIN) || !Number.isInteger(K_MAX) || K_MIN < 2 || K_MAX < K_MIN) {
  throw new Error('Bad K_MIN/K_MAX');
}

const rows = [];
for (const N of N_LIST) {
  let found = null;
  for (let k = K_MIN; k <= K_MAX; k += 1) {
    const res = findColoring({
      N,
      k,
      restarts: RESTARTS,
      steps: STEPS,
      seed: SEED ^ (N * 1009 + k * 9173),
    });
    rows.push({
      N,
      k_tested: k,
      valid_coloring_found: res.ok,
      witness_restart: res.restart,
      witness_steps_used: res.steps_used,
      restarts: RESTARTS,
      steps_per_restart: STEPS,
    });
    if (res.ok) {
      found = k;
      break;
    }
  }
  rows.push({ N, empirical_upper_bound_h_of_N: found });
}

const out = {
  problem: 'EP-160',
  script: path.basename(process.argv[1]),
  method: 'randomized_local_search_for_4AP_at_least_3_colors',
  params: { N_LIST, K_MIN, K_MAX, RESTARTS, STEPS, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch6_quick_compute.mjs | color [1..N] with k colors so every 4-AP has >=3 distinct colors. ----
// // EP-160: color [1..N] with k colors so every 4-AP has >=3 distinct colors.
// {
//   function build4APs(N) {
//     const aps = [];
//     for (let a = 1; a <= N; a += 1) {
//       for (let d = 1; a + 3 * d <= N; d += 1) {
//         aps.push([a - 1, a + d - 1, a + 2 * d - 1, a + 3 * d - 1]);
//       }
//     }
//     return aps;
//   }
// 
//   function apBad(colors, ap) {
//     const c0 = colors[ap[0]];
//     const c1 = colors[ap[1]];
//     const c2 = colors[ap[2]];
//     const c3 = colors[ap[3]];
//     let distinct = 1;
//     if (c1 !== c0) distinct += 1;
//     if (c2 !== c0 && c2 !== c1) distinct += 1;
//     if (c3 !== c0 && c3 !== c1 && c3 !== c2) distinct += 1;
//     return distinct < 3;
//   }
// 
//   function findColoring(N, k, restarts, steps) {
//     const aps = build4APs(N);
//     const apByPos = Array.from({ length: N }, () => []);
//     for (let i = 0; i < aps.length; i += 1) for (const p of aps[i]) apByPos[p].push(i);
// 
//     for (let t = 0; t < restarts; t += 1) {
//       const colors = new Uint8Array(N);
//       for (let i = 0; i < N; i += 1) colors[i] = Math.floor(rng() * k);
// 
//       const bad = new Uint8Array(aps.length);
//       let badCount = 0;
//       for (let i = 0; i < aps.length; i += 1) {
//         if (apBad(colors, aps[i])) {
//           bad[i] = 1;
//           badCount += 1;
//         }
//       }
// 
//       for (let step = 0; step < steps; step += 1) {
//         if (badCount === 0) return true;
// 
//         const pos = Math.floor(rng() * N);
//         const oldColor = colors[pos];
//         let newColor = oldColor;
//         while (newColor === oldColor) newColor = Math.floor(rng() * k);
// 
//         let delta = 0;
//         for (const apId of apByPos[pos]) {
//           const before = bad[apId];
//           const ap = aps[apId];
//           colors[pos] = newColor;
//           const after = apBad(colors, ap) ? 1 : 0;
//           colors[pos] = oldColor;
//           delta += after - before;
//         }
// 
//         if (delta <= 0 || rng() < 0.01) {
//           colors[pos] = newColor;
//           for (const apId of apByPos[pos]) {
//             const ap = aps[apId];
//             const before = bad[apId];
//             const after = apBad(colors, ap) ? 1 : 0;
//             if (before !== after) {
//               bad[apId] = after;
//               badCount += after - before;
//             }
//           }
//         }
//       }
//     }
//     return false;
//   }
// 
//   const rows = [];
//   for (const N of [20, 30, 40, 60, 80]) {
//     let found = null;
//     const triesByN = N <= 40 ? [2, 3, 4, 5, 6] : [2, 3, 4, 5, 6, 7, 8];
//     for (const k of triesByN) {
//       const ok = findColoring(N, k, 24, 35000);
//       rows.push({ N, k_tested: k, valid_coloring_found: ok });
//       if (ok && found === null) {
//         found = k;
//         break;
//       }
//     }
//     rows.push({ N, empirical_upper_bound_h_of_N: found });
//   }
// 
//   out.results.ep160 = {
//     description: 'Finite local-search profile for h(N): minimum colors forcing >=3 colors on each 4-AP.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
