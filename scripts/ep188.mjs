#!/usr/bin/env node
const meta={problem:'EP-188',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-188 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch7_quick_compute.mjs | finite triangular-lattice proxy. ----
// // EP-188: finite triangular-lattice proxy.
// {
//   function triPatch(m) {
//     const pts = [];
//     const id = new Map();
//     for (let x = 0; x < m; x += 1) {
//       for (let y = 0; y < m; y += 1) {
//         const k = `${x},${y}`;
//         id.set(k, pts.length);
//         pts.push([x, y]);
//       }
//     }
//     const dirs = [
//       [1, 0],
//       [0, 1],
//       [1, -1],
//       [-1, 0],
//       [0, -1],
//       [-1, 1],
//     ];
//     const neigh = Array.from({ length: pts.length }, () => []);
//     for (let i = 0; i < pts.length; i += 1) {
//       const [x, y] = pts[i];
//       for (const [dx, dy] of dirs) {
//         const j = id.get(`${x + dx},${y + dy}`);
//         if (j !== undefined) neigh[i].push(j);
//       }
//     }
//     return { pts, neigh, m };
//   }
// 
//   function maxBlueRun(colors, patch) {
//     const { pts, m } = patch;
//     const id = new Map(pts.map((p, i) => [`${p[0]},${p[1]}`, i]));
//     const dirs = [
//       [1, 0],
//       [0, 1],
//       [1, -1],
//     ];
//     let best = 0;
// 
//     for (let i = 0; i < pts.length; i += 1) {
//       const [x, y] = pts[i];
//       for (const [dx, dy] of dirs) {
//         const prev = id.get(`${x - dx},${y - dy}`);
//         if (prev !== undefined) continue;
//         let cx = x;
//         let cy = y;
//         let cur = 0;
//         while (cx >= 0 && cx < m && cy >= 0 && cy < m) {
//           const j = id.get(`${cx},${cy}`);
//           if (j === undefined) break;
//           if (colors[j] === 0) {
//             cur += 1;
//             if (cur > best) best = cur;
//           } else {
//             cur = 0;
//           }
//           cx += dx;
//           cy += dy;
//         }
//       }
//     }
// 
//     return best;
//   }
// 
//   function redConflicts(colors, patch) {
//     let c = 0;
//     const { neigh } = patch;
//     for (let i = 0; i < neigh.length; i += 1) {
//       if (colors[i] !== 1) continue;
//       for (const j of neigh[i]) if (j > i && colors[j] === 1) c += 1;
//     }
//     return c;
//   }
// 
//   function optimize(m, restarts = 40, steps = 12000) {
//     const patch = triPatch(m);
//     let bestRun = Infinity;
//     for (let rep = 0; rep < restarts; rep += 1) {
//       const colors = new Uint8Array(patch.pts.length);
//       for (let i = 0; i < colors.length; i += 1) colors[i] = rng() < 0.35 ? 1 : 0;
// 
//       let conf = redConflicts(colors, patch);
//       let run = maxBlueRun(colors, patch);
//       let score = conf * 1000 + run;
// 
//       for (let step = 0; step < steps; step += 1) {
//         const v = Math.floor(rng() * colors.length);
//         colors[v] ^= 1;
//         const nConf = redConflicts(colors, patch);
//         const nRun = maxBlueRun(colors, patch);
//         const nScore = nConf * 1000 + nRun;
//         if (nScore <= score || rng() < 0.002) {
//           conf = nConf;
//           run = nRun;
//           score = nScore;
//         } else {
//           colors[v] ^= 1;
//         }
//       }
// 
//       if (conf === 0 && run < bestRun) bestRun = run;
//     }
//     return bestRun;
//   }
// 
//   const rows = [];
//   for (const m of [8, 10, 12, 14]) {
//     const run = optimize(m, 36, 10000);
//     rows.push({
//       lattice_side_m: m,
//       vertices: m * m,
//       best_max_blue_unit_step_AP_run_found: run,
//       proxy_k_upper_bound_from_found_coloring: run < Infinity ? run + 1 : null,
//     });
//   }
// 
//   out.results.ep188 = {
//     description: 'Finite triangular-lattice proxy balancing red unit-distance avoidance vs blue unit-step AP runs.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
