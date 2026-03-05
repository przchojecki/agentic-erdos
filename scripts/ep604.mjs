#!/usr/bin/env node
const meta={problem:'EP-604',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-604 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch15_quick_compute.mjs | pinned-distance profile on grid and random sets. ----
// // EP-604: pinned-distance profile on grid and random sets.
// {
//   function pinnedStats(points) {
//     const n = points.length;
//     let maxPinned = 0;
//     let sumPinned = 0;
// 
//     for (let i = 0; i < n; i += 1) {
//       const D = new Set();
//       const [x1, y1] = points[i];
//       for (let j = 0; j < n; j += 1) {
//         if (i === j) continue;
//         const [x2, y2] = points[j];
//         const dx = x1 - x2;
//         const dy = y1 - y2;
//         D.add(dx * dx + dy * dy);
//       }
//       const c = D.size;
//       sumPinned += c;
//       if (c > maxPinned) maxPinned = c;
//     }
// 
//     return {
//       maxPinned,
//       avgPinned: sumPinned / n,
//     };
//   }
// 
//   const rng = makeRng(20260303 ^ 1506);
//   const rows = [];
// 
//   for (const m of [10, 16, 22]) {
//     const gridPts = [];
//     for (let x = 0; x < m; x += 1) {
//       for (let y = 0; y < m; y += 1) gridPts.push([x, y]);
//     }
//     const n = gridPts.length;
//     const gs = pinnedStats(gridPts);
// 
//     const randPts = randomDistinctPoints(n, 1500, rng);
//     const rs = pinnedStats(randPts);
// 
//     const scale = n / Math.sqrt(Math.log(Math.max(3, n)));
// 
//     rows.push({
//       n,
//       family: 'grid_m_by_m',
//       m,
//       max_pinned_distinct_distances: gs.maxPinned,
//       avg_pinned_distinct_distances: Number(gs.avgPinned.toPrecision(7)),
//       max_over_n_over_sqrt_log_n: Number((gs.maxPinned / scale).toPrecision(7)),
//       max_over_n: Number((gs.maxPinned / n).toPrecision(7)),
//     });
// 
//     rows.push({
//       n,
//       family: 'random_integer_points',
//       grid_side: 1500,
//       max_pinned_distinct_distances: rs.maxPinned,
//       avg_pinned_distinct_distances: Number(rs.avgPinned.toPrecision(7)),
//       max_over_n_over_sqrt_log_n: Number((rs.maxPinned / scale).toPrecision(7)),
//       max_over_n: Number((rs.maxPinned / n).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep604 = {
//     description: 'Pinned-distance maxima and averages on structured (grid) vs random point sets.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
