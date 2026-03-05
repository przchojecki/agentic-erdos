#!/usr/bin/env node
const meta={problem:'EP-78',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-78 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch3_quick_compute.mjs | random-coloring explicit witness search for small k. ----
// // EP-78: random-coloring explicit witness search for small k.
// {
//   function countMonochK(n, k, bits) {
//     const verts = Array.from({ length: n }, (_, i) => i);
//     let bad = 0;
//     function rec(start, left, cur) {
//       if (left === 0) {
//         let red = true;
//         let blue = true;
//         for (let i = 0; i < cur.length; i += 1) {
//           for (let j = i + 1; j < cur.length; j += 1) {
//             const a = cur[i];
//             const b = cur[j];
//             const id = a * n + b;
//             const c = bits[id];
//             red = red && c === 1;
//             blue = blue && c === 0;
//             if (!red && !blue) return;
//           }
//         }
//         if (red || blue) bad += 1;
//         return;
//       }
//       for (let x = start; x <= n - left; x += 1) {
//         cur.push(verts[x]);
//         rec(x + 1, left - 1, cur);
//         cur.pop();
//       }
//     }
//     rec(0, k, []);
//     return bad;
//   }
// 
//   const tests = [
//     { k: 4, n: 17, trials: 120 },
//     { k: 5, n: 30, trials: 60 },
//     { k: 5, n: 35, trials: 40 },
//   ];
//   const rows = [];
//   for (const { k, n, trials } of tests) {
//     let knownConstructionBad = null;
//     if (k === 4 && n === 17) {
//       // Paley-type coloring on F_17: red iff difference is a nonzero square mod 17.
//       const squares = new Set([1, 2, 4, 8, 9, 13, 15, 16]);
//       const bits = new Uint8Array(n * n);
//       for (let i = 0; i < n; i += 1) {
//         for (let j = i + 1; j < n; j += 1) {
//           const d = (j - i + n) % n;
//           const red = squares.has(d) ? 1 : 0;
//           bits[i * n + j] = red;
//           bits[j * n + i] = red;
//         }
//       }
//       knownConstructionBad = countMonochK(n, k, bits);
//     }
// 
//     let foundZero = false;
//     let best = Infinity;
//     for (let t = 0; t < trials; t += 1) {
//       const bits = new Uint8Array(n * n);
//       for (let i = 0; i < n; i += 1) {
//         for (let j = i + 1; j < n; j += 1) {
//           const c = rng() < 0.5 ? 1 : 0;
//           bits[i * n + j] = c;
//           bits[j * n + i] = c;
//         }
//       }
//       const bad = countMonochK(n, k, bits);
//       if (bad < best) best = bad;
//       if (bad === 0) {
//         foundZero = true;
//         break;
//       }
//     }
//     rows.push({
//       k,
//       n_tested: n,
//       trials,
//       known_construction_monochromatic_Kk_count: knownConstructionBad,
//       found_explicit_coloring_without_monochromatic_Kk: foundZero,
//       best_monochromatic_Kk_count_found: best,
//     });
//   }
//   out.results.ep78 = {
//     description: 'Small-k explicit witness search by random 2-colorings.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
