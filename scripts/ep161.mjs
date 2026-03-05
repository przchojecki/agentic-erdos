#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-161
// Finite sampled profile for F^{(3)}(n, alpha): largest m such that every m-subset
// has red-density and blue-density both at least alpha (sampled proxy).

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function parseFloatList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isFinite(x) && x >= 0 && x <= 0.5);
  return out.length ? out : fallback;
}

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function buildColoring(n, rng) {
  const idx = (a, b, c) => a * n * n + b * n + c;
  const arr = new Uint8Array(n * n * n);
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) {
      for (let c = b + 1; c < n; c += 1) {
        arr[idx(a, b, c)] = rng() < 0.5 ? 0 : 1;
      }
    }
  }
  return arr;
}

function sampleSubset(n, size, rng) {
  const v = Array.from({ length: n }, (_, i) => i);
  shuffle(v, rng);
  return v.slice(0, size).sort((x, y) => x - y);
}

function redDensityOnSubset(col, n, sub) {
  const idx = (a, b, c) => a * n * n + b * n + c;
  let red = 0;
  let tot = 0;
  for (let i = 0; i < sub.length; i += 1) {
    for (let j = i + 1; j < sub.length; j += 1) {
      for (let k = j + 1; k < sub.length; k += 1) {
        if (col[idx(sub[i], sub[j], sub[k])] === 1) red += 1;
        tot += 1;
      }
    }
  }
  return red / tot;
}

const n = Number(process.env.N || 24);
const colorings = Number(process.env.COLORINGS || 80);
const samples = Number(process.env.SAMPLES || 48);
const seed = Number(process.env.SEED || 1612026);
const alphas = parseFloatList(process.env.ALPHAS, [0, 0.02, 0.05, 0.1, 0.15, 0.2, 0.25]);
const outPath = process.env.OUT || '';

if (!Number.isInteger(n) || n < 8) throw new Error('N must be integer >= 8');
if (!Number.isInteger(colorings) || colorings < 1) throw new Error('COLORINGS must be positive integer');
if (!Number.isInteger(samples) || samples < 1) throw new Error('SAMPLES must be positive integer');

const rng = makeRng(seed);
const rows = [];
for (const alpha of alphas) {
  let bestM = 0;
  for (let t = 0; t < colorings; t += 1) {
    const col = buildColoring(n, rng);
    const good = Array(n + 1).fill(true);
    for (let s = 4; s <= n; s += 1) {
      let okS = true;
      for (let r = 0; r < samples; r += 1) {
        const sub = sampleSubset(n, s, rng);
        const p = redDensityOnSubset(col, n, sub);
        if (Math.min(p, 1 - p) + 1e-12 < alpha) {
          okS = false;
          break;
        }
      }
      good[s] = okS;
    }
    let m = n + 1;
    for (let s = n; s >= 4; s -= 1) {
      if (!good[s]) break;
      m = s;
    }
    if (m <= n && m > bestM) bestM = m;
  }
  rows.push({ n, alpha, random_colorings_tested: colorings, subset_samples_per_size: samples, sampled_empirical_F_3_n_alpha: bestM });
}

const out = {
  problem: 'EP-161',
  script: path.basename(process.argv[1]),
  method: 'sampled_random_coloring_profile_for_F3',
  params: { n, colorings, samples, seed, alphas },
  rows,
  generated_utc: new Date().toISOString(),
};

if (outPath) fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch6_quick_compute.mjs | finite sampled profile for F^{(3)}(n,alpha) behavior. ----
// // EP-161: finite sampled profile for F^{(3)}(n,alpha) behavior.
// {
//   const n = 20;
//   const idx = (a, b, c) => a * n * n + b * n + c;
// 
//   function randomColoringTriples() {
//     const arr = new Uint8Array(n * n * n);
//     for (let a = 0; a < n; a += 1) {
//       for (let b = a + 1; b < n; b += 1) {
//         for (let c = b + 1; c < n; c += 1) {
//           arr[idx(a, b, c)] = rng() < 0.5 ? 0 : 1;
//         }
//       }
//     }
//     return arr;
//   }
// 
//   function sampleSubset(size) {
//     const v = Array.from({ length: n }, (_, i) => i);
//     shuffle(v, rng);
//     return v.slice(0, size).sort((x, y) => x - y);
//   }
// 
//   function redDensityOnSubset(col, sub) {
//     let red = 0;
//     let tot = 0;
//     for (let i = 0; i < sub.length; i += 1) {
//       for (let j = i + 1; j < sub.length; j += 1) {
//         for (let k = j + 1; k < sub.length; k += 1) {
//           if (col[idx(sub[i], sub[j], sub[k])] === 1) red += 1;
//           tot += 1;
//         }
//       }
//     }
//     return red / tot;
//   }
// 
//   const alphas = [0, 0.02, 0.05, 0.1, 0.15, 0.2];
//   const rows = [];
//   for (const alpha of alphas) {
//     let bestM = 0;
//     const colorings = 36;
//     for (let t = 0; t < colorings; t += 1) {
//       const col = randomColoringTriples();
// 
//       const good = Array(n + 1).fill(true);
//       for (let s = 4; s <= n; s += 1) {
//         let okS = true;
//         const samples = 26;
//         for (let r = 0; r < samples; r += 1) {
//           const sub = sampleSubset(s);
//           const p = redDensityOnSubset(col, sub);
//           const minFrac = Math.min(p, 1 - p);
//           if (minFrac + 1e-12 < alpha) {
//             okS = false;
//             break;
//           }
//         }
//         good[s] = okS;
//       }
// 
//       let m = n + 1;
//       for (let s = n; s >= 4; s -= 1) {
//         if (!good[s]) break;
//         m = s;
//       }
//       if (m <= n && m > bestM) bestM = m;
//     }
// 
//     rows.push({
//       n,
//       alpha,
//       random_colorings_tested: 36,
//       sampled_empirical_F_3_n_alpha: bestM,
//     });
//   }
// 
//   out.results.ep161 = {
//     description: 'Sampled finite hypergraph-coloring profile for F^{(3)}(n,alpha).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
