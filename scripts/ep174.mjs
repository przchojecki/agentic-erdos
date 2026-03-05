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

function randomMonoRectRate(d, trials, samplesPerTrial, rng) {
  const n = 1 << d;
  let minRate = 1;
  let avgRate = 0;

  for (let t = 0; t < trials; t += 1) {
    const col = new Uint8Array(n);
    for (let i = 0; i < n; i += 1) col[i] = rng() < 0.5 ? 0 : 1;

    let mono = 0;
    for (let s = 0; s < samplesPerTrial; s += 1) {
      const x = Math.floor(rng() * n);
      let u = Math.floor(rng() * (n - 1)) + 1;
      let v = Math.floor(rng() * (n - 1)) + 1;
      while (v === u) v = Math.floor(rng() * (n - 1)) + 1;
      const p0 = x;
      const p1 = x ^ u;
      const p2 = x ^ v;
      const p3 = x ^ u ^ v;
      const c = col[p0];
      if (col[p1] === c && col[p2] === c && col[p3] === c) mono += 1;
    }
    const rate = mono / samplesPerTrial;
    avgRate += rate;
    if (rate < minRate) minRate = rate;
  }

  return { minRate, avgRate: avgRate / trials };
}

const D_LIST = parseIntList(process.env.D_LIST, [5, 6, 7, 8, 9]);
const TRIALS = Number(process.env.TRIALS || 120);
const SAMPLES = Number(process.env.SAMPLES || 6000);
const SEED = Number(process.env.SEED || 1742026);
const OUT = process.env.OUT || '';

const rng = makeRng(SEED);
const rows = [];
for (const d of D_LIST) {
  const v = randomMonoRectRate(d, TRIALS, SAMPLES, rng);
  rows.push({
    d,
    cube_vertices: 1 << d,
    trials: TRIALS,
    sampled_rectangles_per_trial: SAMPLES,
    min_mono_rectangle_rate_observed: Number(v.minRate.toFixed(6)),
    avg_mono_rectangle_rate_observed: Number(v.avgRate.toFixed(6)),
  });
}

const out = {
  problem: 'EP-174',
  script: path.basename(process.argv[1]),
  method: 'standalone_F2d_rectangle_random_coloring_profile',
  params: { D_LIST, TRIALS, SAMPLES, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch6_quick_compute.mjs | finite F2^d rectangle proxy (known Ramsey-family shape). ----
// // EP-174: finite F2^d rectangle proxy (known Ramsey-family shape).
// {
//   function randomMonoRectRate(d, trials, samplesPerTrial) {
//     const n = 1 << d;
//     let minRate = 1;
//     let avgRate = 0;
// 
//     for (let t = 0; t < trials; t += 1) {
//       const col = new Uint8Array(n);
//       for (let i = 0; i < n; i += 1) col[i] = rng() < 0.5 ? 0 : 1;
// 
//       let mono = 0;
//       for (let s = 0; s < samplesPerTrial; s += 1) {
//         const x = Math.floor(rng() * n);
//         let u = Math.floor(rng() * (n - 1)) + 1;
//         let v = Math.floor(rng() * (n - 1)) + 1;
//         while (v === u) v = Math.floor(rng() * (n - 1)) + 1;
// 
//         const p0 = x;
//         const p1 = x ^ u;
//         const p2 = x ^ v;
//         const p3 = x ^ u ^ v;
//         const c = col[p0];
//         if (col[p1] === c && col[p2] === c && col[p3] === c) mono += 1;
//       }
//       const rate = mono / samplesPerTrial;
//       avgRate += rate;
//       if (rate < minRate) minRate = rate;
//     }
// 
//     return { minRate, avgRate: avgRate / trials };
//   }
// 
//   const rows = [];
//   for (const d of [5, 6, 7, 8]) {
//     const trials = 70;
//     const samples = 3500;
//     const v = randomMonoRectRate(d, trials, samples);
//     rows.push({
//       d,
//       cube_vertices: 1 << d,
//       trials,
//       sampled_rectangles_per_trial: samples,
//       min_mono_rectangle_rate_observed: Number(v.minRate.toFixed(6)),
//       avg_mono_rectangle_rate_observed: Number(v.avgRate.toFixed(6)),
//     });
//   }
// 
//   out.results.ep174 = {
//     description: 'Finite F2^d rectangle proxy under random 2-colorings.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
