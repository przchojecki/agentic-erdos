#!/usr/bin/env node
const meta={problem:'EP-161',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-161 canonical script');console.log('Integrated sections: 0');}
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
