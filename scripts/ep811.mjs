#!/usr/bin/env node
const meta={problem:'EP-811',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-811 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch18_quick_compute.mjs | balanced 6-colorings of K_13 via cyclic distance classes; rainbow K4/C6 checks. ----
// // EP-811: balanced 6-colorings of K_13 via cyclic distance classes; rainbow K4/C6 checks.
// {
//   const n = 13;
//   // Color by cyclic distance class in Z_13: colors 0..5 correspond to distances 1..6.
//   const color = Array.from({ length: n }, () => Array(n).fill(-1));
//   for (let u = 0; u < n; u += 1) {
//     for (let v = u + 1; v < n; v += 1) {
//       const d = Math.abs(u - v);
//       const dd = Math.min(d, n - d);
//       const c = dd - 1;
//       color[u][v] = color[v][u] = c;
//     }
//   }
// 
//   function hasRainbowK4() {
//     for (let a = 0; a < n; a += 1) {
//       for (let b = a + 1; b < n; b += 1) {
//         for (let c = b + 1; c < n; c += 1) {
//           for (let d = c + 1; d < n; d += 1) {
//             const cols = [
//               color[a][b], color[a][c], color[a][d],
//               color[b][c], color[b][d], color[c][d],
//             ];
//             const S = new Set(cols);
//             if (S.size === 6) return true;
//           }
//         }
//       }
//     }
//     return false;
//   }
// 
//   function hasRainbowC6() {
//     const used = Array(n).fill(false);
//     const path = [];
// 
//     for (let start = 0; start < n; start += 1) {
//       path.length = 0;
//       used.fill(false);
//       path.push(start);
//       used[start] = true;
// 
//       function dfs() {
//         if (path.length === 6) {
//           const cols = [];
//           for (let i = 0; i < 6; i += 1) {
//             const u = path[i];
//             const v = path[(i + 1) % 6];
//             cols.push(color[u][v]);
//           }
//           return new Set(cols).size === 6;
//         }
// 
//         const last = path[path.length - 1];
//         for (let v = 0; v < n; v += 1) {
//           if (used[v]) continue;
//           if (v < start) continue; // mild symmetry break
//           path.push(v);
//           used[v] = true;
//           if (dfs()) return true;
//           used[v] = false;
//           path.pop();
//         }
//         return false;
//       }
// 
//       if (dfs()) return true;
//     }
// 
//     return false;
//   }
// 
//   // Verify balance per vertex per color.
//   const deg = Array.from({ length: n }, () => Array(6).fill(0));
//   for (let u = 0; u < n; u += 1) {
//     for (let v = 0; v < n; v += 1) {
//       if (u === v) continue;
//       deg[u][color[u][v]] += 1;
//     }
//   }
// 
//   const balanced = deg.every((arr) => arr.every((x) => x === 2));
// 
//   out.results.ep811 = {
//     description: 'Structured balanced 6-coloring test on K_13 for rainbow K4 and C6.',
//     n,
//     colors: 6,
//     balanced_degrees_confirmed: balanced,
//     per_vertex_color_degree: 2,
//     has_rainbow_K4: hasRainbowK4(),
//     has_rainbow_C6: hasRainbowC6(),
//   };
// }
// ==== End Batch Split Integrations ====
