#!/usr/bin/env node
const meta={problem:'EP-1105',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1105 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch25_quick_compute.mjs | exact small-n anti-Ramsey for triangles (C3 case) via backtracking. ----
// // EP-1105: exact small-n anti-Ramsey for triangles (C3 case) via backtracking.
// {
//   function maxColorsNoRainbowTriangle(n) {
//     const edges = [];
//     for (let i = 0; i < n; i += 1) {
//       for (let j = i + 1; j < n; j += 1) edges.push([i, j]);
//     }
//     const m = edges.length;
//     const color = new Int16Array(m);
//     color.fill(-1);
// 
//     // Triangles as edge-index triples.
//     const edgeId = new Map();
//     edges.forEach(([u, v], idx) => edgeId.set(`${u},${v}`, idx));
//     const trianglesByEdge = Array.from({ length: m }, () => []);
//     for (let a = 0; a < n; a += 1) {
//       for (let b = a + 1; b < n; b += 1) {
//         for (let c = b + 1; c < n; c += 1) {
//           const e1 = edgeId.get(`${a},${b}`);
//           const e2 = edgeId.get(`${a},${c}`);
//           const e3 = edgeId.get(`${b},${c}`);
//           trianglesByEdge[e1].push([e1, e2, e3]);
//           trianglesByEdge[e2].push([e1, e2, e3]);
//           trianglesByEdge[e3].push([e1, e2, e3]);
//         }
//       }
//     }
// 
//     let best = 0;
//     function dfs(pos, usedColors) {
//       if (pos === m) {
//         if (usedColors > best) best = usedColors;
//         return;
//       }
//       if (usedColors + (m - pos) <= best) return;
// 
//       const maxTry = usedColors;
//       for (let c = 0; c <= maxTry; c += 1) {
//         color[pos] = c;
//         let ok = true;
//         for (const tri of trianglesByEdge[pos]) {
//           const [e1, e2, e3] = tri;
//           const c1 = color[e1];
//           const c2 = color[e2];
//           const c3 = color[e3];
//           if (c1 === -1 || c2 === -1 || c3 === -1) continue;
//           if (c1 !== c2 && c1 !== c3 && c2 !== c3) {
//             ok = false;
//             break;
//           }
//         }
//         if (ok) dfs(pos + 1, Math.max(usedColors, c + 1));
//         color[pos] = -1;
//       }
//     }
// 
//     dfs(0, 0);
//     return best;
//   }
// 
//   const rows = [];
//   for (const n of [4, 5, 6]) {
//     const ar = maxColorsNoRainbowTriangle(n);
//     rows.push({
//       n,
//       exact_ar_n_C3: ar,
//       n_minus_1: n - 1,
//       matches_n_minus_1: ar === n - 1,
//     });
//   }
// 
//   out.results.ep1105 = {
//     description: 'Exact small-n anti-Ramsey computation for C3 (rainbow-triangle avoidance).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
