#!/usr/bin/env node
const meta={problem:'EP-508',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-508 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch13_quick_compute.mjs | finite unit-distance graph coloring checks. ----
// // EP-508: finite unit-distance graph coloring checks.
// {
//   function chromaticNumber(n, edges) {
//     const adj = Array.from({ length: n }, () => []);
//     for (const [u, v] of edges) {
//       adj[u].push(v);
//       adj[v].push(u);
//     }
//     const ord = Array.from({ length: n }, (_, i) => i).sort((a, b) => adj[b].length - adj[a].length);
// 
//     function colorable(k) {
//       const col = new Int8Array(n);
//       col.fill(-1);
//       function dfs(t) {
//         if (t === n) return true;
//         const v = ord[t];
//         for (let c = 0; c < k; c += 1) {
//           let ok = true;
//           for (const u of adj[v]) {
//             if (col[u] === c) {
//               ok = false;
//               break;
//             }
//           }
//           if (!ok) continue;
//           col[v] = c;
//           if (dfs(t + 1)) return true;
//           col[v] = -1;
//         }
//         return false;
//       }
//       return dfs(0);
//     }
// 
//     for (let k = 1; k <= n; k += 1) if (colorable(k)) return k;
//     return n;
//   }
// 
//   function unitEdges(points, eps = 1e-9) {
//     const e = [];
//     for (let i = 0; i < points.length; i += 1) {
//       for (let j = i + 1; j < points.length; j += 1) {
//         const dx = points[i][0] - points[j][0];
//         const dy = points[i][1] - points[j][1];
//         const d = Math.hypot(dx, dy);
//         if (Math.abs(d - 1) < eps) e.push([i, j]);
//       }
//     }
//     return e;
//   }
// 
//   // Moser spindle from two rhombi sharing one acute vertex.
//   const s = Math.sqrt(3) / 2;
//   const t = 0.5856855434571508;
//   const O = [0, 0];
//   const A = [1, 0];
//   const B = [0.5, s];
//   const C = [1.5, s];
//   const D = [Math.cos(t), Math.sin(t)];
//   const E = [Math.cos(t + Math.PI / 3), Math.sin(t + Math.PI / 3)];
//   const F = [D[0] + E[0], D[1] + E[1]];
//   const moserPts = [O, A, B, C, D, E, F];
//   const moserEdges = unitEdges(moserPts);
// 
//   // Triangular-lattice patches (unit-distance induced graph).
//   function triPatch(m) {
//     const pts = [];
//     const s3 = Math.sqrt(3) / 2;
//     for (let y = 0; y <= m; y += 1) {
//       for (let x = 0; x <= m; x += 1) {
//         pts.push([x + 0.5 * y, s3 * y]);
//       }
//     }
//     return pts;
//   }
// 
//   const rows = [];
//   rows.push({
//     graph: 'moser_spindle_7v',
//     vertices: moserPts.length,
//     edges: moserEdges.length,
//     chromatic_number_exact: chromaticNumber(moserPts.length, moserEdges),
//   });
// 
//   for (const m of [2, 3, 4]) {
//     const pts = triPatch(m);
//     const e = unitEdges(pts);
//     rows.push({
//       graph: `triangular_patch_m_${m}`,
//       vertices: pts.length,
//       edges: e.length,
//       chromatic_number_exact: chromaticNumber(pts.length, e),
//     });
//   }
// 
//   out.results.ep508 = {
//     description: 'Finite chromatic checks on benchmark unit-distance graphs in the plane.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
