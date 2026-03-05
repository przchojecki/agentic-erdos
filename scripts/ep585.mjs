#!/usr/bin/env node
const meta={problem:'EP-585',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-585 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch15_quick_compute.mjs | finite exact search (small n) for avoiding two edge-disjoint cycles with same vertex set. ----
// // EP-585: finite exact search (small n) for avoiding two edge-disjoint cycles with same vertex set.
// {
//   function hasK5(G) {
//     const { n, adj } = G;
//     for (let a = 0; a < n; a += 1) {
//       for (let b = a + 1; b < n; b += 1) {
//         if (!adj[a][b]) continue;
//         for (let c = b + 1; c < n; c += 1) {
//           if (!adj[a][c] || !adj[b][c]) continue;
//           for (let d = c + 1; d < n; d += 1) {
//             if (!adj[a][d] || !adj[b][d] || !adj[c][d]) continue;
//             for (let e = d + 1; e < n; e += 1) {
//               if (adj[a][e] && adj[b][e] && adj[c][e] && adj[d][e]) return true;
//             }
//           }
//         }
//       }
//     }
//     return false;
//   }
// 
//   function hasTwoEdgeDisjointCyclesSameVertexSet(G) {
//     if (hasK5(G)) return true;
// 
//     const { n, adj, neigh } = G;
//     const edgePos = Array.from({ length: n }, () => Array(n).fill(-1));
//     let e = 0;
//     for (let u = 0; u < n; u += 1) {
//       for (let v = u + 1; v < n; v += 1) {
//         edgePos[u][v] = e;
//         edgePos[v][u] = e;
//         e += 1;
//       }
//     }
// 
//     const cycByVertexMask = new Map();
//     const seenCycleEdgeMasks = new Set();
// 
//     for (let s = 0; s < n; s += 1) {
//       const visited = Array(n).fill(false);
//       const path = [s];
//       visited[s] = true;
// 
//       function dfs(u) {
//         for (const v of neigh[u]) {
//           if (v === s) {
//             if (path.length >= 3) {
//               const verts = path;
//               let vMask = 0;
//               for (const x of verts) vMask |= 1 << x;
// 
//               let em = 0n;
//               for (let i = 0; i < verts.length; i += 1) {
//                 const a = verts[i];
//                 const b = verts[(i + 1) % verts.length];
//                 const pos = edgePos[a][b];
//                 em |= 1n << BigInt(pos);
//               }
// 
//               const key = em.toString();
//               if (!seenCycleEdgeMasks.has(key)) {
//                 seenCycleEdgeMasks.add(key);
//                 if (!cycByVertexMask.has(vMask)) cycByVertexMask.set(vMask, []);
//                 cycByVertexMask.get(vMask).push(em);
//               }
//             }
//             continue;
//           }
// 
//           if (v < s || visited[v]) continue;
//           visited[v] = true;
//           path.push(v);
//           dfs(v);
//           path.pop();
//           visited[v] = false;
//         }
//       }
// 
//       dfs(s);
//     }
// 
//     for (const cycles of cycByVertexMask.values()) {
//       for (let i = 0; i < cycles.length; i += 1) {
//         for (let j = i + 1; j < cycles.length; j += 1) {
//           if ((cycles[i] & cycles[j]) === 0n) return true;
//         }
//       }
//     }
// 
//     return false;
//   }
// 
//   function greedyMaxEdgesNoViolation(n, restarts, rng) {
//     const edges = allEdges(n);
//     let best = 0;
// 
//     for (let r = 0; r < restarts; r += 1) {
//       const G = makeGraph(n);
//       shuffle(edges, rng);
// 
//       for (const [u, v] of edges) {
//         addEdge(G, u, v);
//         if (hasTwoEdgeDisjointCyclesSameVertexSet(G)) removeEdge(G, u, v);
//       }
// 
//       if (G.m > best) best = G.m;
//     }
// 
//     return best;
//   }
// 
//   const rng = makeRng(20260303 ^ 1503);
//   const rows = [];
// 
//   for (const [n, restarts] of [[8, 18], [9, 14], [10, 10]]) {
//     const best = greedyMaxEdgesNoViolation(n, restarts, rng);
//     rows.push({
//       n,
//       restarts,
//       best_edges_found_no_two_edge_disjoint_same_vertex_set_cycles: best,
//       best_over_n_loglogn: Number((best / Math.max(1, n * Math.log(Math.log(Math.max(4, n))))).toPrecision(7)),
//       best_over_n_logn: Number((best / Math.max(1, n * Math.log(n))).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep585 = {
//     description: 'Small-n exact greedy maxima under the forbidden same-vertex-set disjoint-cycle condition.',
//     rows,
//   };
// }
// 
// // Geometry helpers for EP-588/589/604.
// function lineKeyFromPoints(p, q) {
//   let A = q[1] - p[1];
//   let B = p[0] - q[0];
//   let C = A * p[0] + B * p[1];
// 
//   const g = gcd(gcd(Math.abs(A), Math.abs(B)), Math.abs(C));
//   if (g > 0) {
//     A /= g;
//     B /= g;
//     C /= g;
//   }
// 
//   if (A < 0 || (A === 0 && B < 0) || (A === 0 && B === 0 && C < 0)) {
//     A = -A;
//     B = -B;
//     C = -C;
//   }
// 
//   return `${A},${B},${C}`;
// }
// 
// function lineStats(points) {
//   const n = points.length;
//   const mp = new Map();
// 
//   for (let i = 0; i < n; i += 1) {
//     for (let j = i + 1; j < n; j += 1) {
//       const key = lineKeyFromPoints(points[i], points[j]);
//       if (!mp.has(key)) mp.set(key, new Set());
//       const S = mp.get(key);
//       S.add(i);
//       S.add(j);
//     }
//   }
// 
//   let maxCollinear = 1;
//   const lineSizes = [];
//   for (const S of mp.values()) {
//     const sz = S.size;
//     lineSizes.push(sz);
//     if (sz > maxCollinear) maxCollinear = sz;
//   }
// 
//   return { maxCollinear, lineSizes, lineMap: mp };
// }
// 
// function randomDistinctPoints(n, grid, rng) {
//   const used = new Set();
//   const pts = [];
//   while (pts.length < n) {
//     const x = Math.floor(rng() * grid);
//     const y = Math.floor(rng() * grid);
//     const key = `${x},${y}`;
//     if (used.has(key)) continue;
//     used.add(key);
//     pts.push([x, y]);
//   }
//   return pts;
// }
// ==== End Batch Split Integrations ====
