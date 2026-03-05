#!/usr/bin/env node
const meta={problem:'EP-959',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-959 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch21_quick_compute.mjs | finite multiplicity-gap search over sampled point configurations. ----
// // EP-959: finite multiplicity-gap search over sampled point configurations.
// {
//   const rng = makeRng(20260304 ^ 959);
// 
//   function distGap(points) {
//     const mp = new Map();
//     for (let i = 0; i < points.length; i += 1) {
//       for (let j = i + 1; j < points.length; j += 1) {
//         const dx = points[i][0] - points[j][0];
//         const dy = points[i][1] - points[j][1];
//         const d2 = dx * dx + dy * dy;
//         mp.set(d2, (mp.get(d2) || 0) + 1);
//       }
//     }
//     const vals = [...mp.values()].sort((a, b) => b - a);
//     const f1 = vals.length ? vals[0] : 0;
//     const f2 = vals.length > 1 ? vals[1] : 0;
//     return { f1, f2, gap: f1 - f2, distinct_distances: vals.length };
//   }
// 
//   function gridPoints(n) {
//     const w = Math.floor(Math.sqrt(n));
//     const h = Math.ceil(n / w);
//     const pts = [];
//     for (let y = 0; y < h && pts.length < n; y += 1) {
//       for (let x = 0; x < w && pts.length < n; x += 1) pts.push([x, y]);
//     }
//     return pts;
//   }
// 
//   function twoLines(n) {
//     const a = Math.floor(n / 2);
//     const b = n - a;
//     const pts = [];
//     for (let i = 0; i < a; i += 1) pts.push([i, 0]);
//     for (let j = 0; j < b; j += 1) pts.push([j, 1]);
//     return pts;
//   }
// 
//   function randomPoints(n, side) {
//     const pts = [];
//     const seen = new Set();
//     while (pts.length < n) {
//       const x = Math.floor(rng() * side);
//       const y = Math.floor(rng() * side);
//       const key = `${x},${y}`;
//       if (seen.has(key)) continue;
//       seen.add(key);
//       pts.push([x, y]);
//     }
//     return pts;
//   }
// 
//   const rows = [];
//   for (const n of [40, 60, 80, 100]) {
//     let best = { gap: -1, family: 'none', f1: 0, f2: 0, distinct_distances: 0 };
// 
//     const g = distGap(gridPoints(n));
//     if (g.gap > best.gap) best = { ...g, family: 'grid' };
// 
//     const t = distGap(twoLines(n));
//     if (t.gap > best.gap) best = { ...t, family: 'two_lines' };
// 
//     for (let trial = 0; trial < 220; trial += 1) {
//       const pts = randomPoints(n, 6 * n);
//       const r = distGap(pts);
//       if (r.gap > best.gap) best = { ...r, family: 'random' };
//     }
// 
//     rows.push({
//       n,
//       best_family_found: best.family,
//       best_gap_f1_minus_f2: best.gap,
//       f1: best.f1,
//       f2: best.f2,
//       best_gap_over_n_log_n: Number((best.gap / (n * Math.log(n))).toPrecision(7)),
//       distinct_distances_in_best: best.distinct_distances,
//     });
//   }
// 
//   out.results.ep959 = {
//     description: 'Finite sampled search for large multiplicity gaps f(d1)-f(d2) in planar point sets.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
