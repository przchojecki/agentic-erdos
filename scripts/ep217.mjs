#!/usr/bin/env node
// Canonical per-problem script for EP-217.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-217',
  source_count: 1,
  source_files: ["ep217_distance_profile_search.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-217 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep217_distance_profile_search.mjs
// Kind: current_script_file
// Label: From ep217_distance_profile_search.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const GRID = Number(process.env.GRID || 10);
// const TRIALS = Number(process.env.TRIALS || 25000);
// const NS = (process.env.NS || '6,7,8,9').split(',').map((x) => Number(x.trim())).filter(Boolean);
// 
// function randInt(a, b) {
//   return a + Math.floor(Math.random() * (b - a + 1));
// }
// 
// function chooseRandomPoints(n) {
//   const set = new Set();
//   const pts = [];
//   while (pts.length < n) {
//     const x = randInt(0, GRID);
//     const y = randInt(0, GRID);
//     const k = `${x},${y}`;
//     if (set.has(k)) continue;
//     set.add(k);
//     pts.push([x, y]);
//   }
//   return pts;
// }
// 
// function noThreeCollinear(pts) {
//   const n = pts.length;
//   for (let i = 0; i < n; i++) {
//     for (let j = i + 1; j < n; j++) {
//       for (let k = j + 1; k < n; k++) {
//         const [x1, y1] = pts[i];
//         const [x2, y2] = pts[j];
//         const [x3, y3] = pts[k];
//         const area2 = (x2 - x1) * (y3 - y1) - (x3 - x1) * (y2 - y1);
//         if (area2 === 0) return false;
//       }
//     }
//   }
//   return true;
// }
// 
// function det3(a,b,c,d,e,f,g,h,i) {
//   return a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g);
// }
// 
// function det4(M) {
//   // Laplace expansion first row
//   const [r0,r1,r2,r3] = M;
//   const m00 = det3(r1[1],r1[2],r1[3], r2[1],r2[2],r2[3], r3[1],r3[2],r3[3]);
//   const m01 = det3(r1[0],r1[2],r1[3], r2[0],r2[2],r2[3], r3[0],r3[2],r3[3]);
//   const m02 = det3(r1[0],r1[1],r1[3], r2[0],r2[1],r2[3], r3[0],r3[1],r3[3]);
//   const m03 = det3(r1[0],r1[1],r1[2], r2[0],r2[1],r2[2], r3[0],r3[1],r3[2]);
//   return r0[0]*m00 - r0[1]*m01 + r0[2]*m02 - r0[3]*m03;
// }
// 
// function noFourConcyclic(pts) {
//   const n = pts.length;
//   for (let i = 0; i < n; i++) {
//     for (let j = i + 1; j < n; j++) {
//       for (let k = j + 1; k < n; k++) {
//         for (let l = k + 1; l < n; l++) {
//           const idx = [i,j,k,l];
//           const M = idx.map((t) => {
//             const [x,y] = pts[t];
//             return [x, y, x*x + y*y, 1];
//           });
//           if (det4(M) === 0) return false;
//         }
//       }
//     }
//   }
//   return true;
// }
// 
// function distanceProfile(pts) {
//   const n = pts.length;
//   const cnt = new Map();
//   for (let i = 0; i < n; i++) {
//     for (let j = i + 1; j < n; j++) {
//       const dx = pts[i][0] - pts[j][0];
//       const dy = pts[i][1] - pts[j][1];
//       const d2 = dx * dx + dy * dy;
//       cnt.set(d2, (cnt.get(d2) || 0) + 1);
//     }
//   }
//   const mult = [...cnt.values()].sort((a,b)=>a-b);
//   return { distinct: cnt.size, multiplicities: mult };
// }
// 
// function deficiency(mult, n) {
//   if (mult.length !== n - 1) return 1e9 + Math.abs(mult.length - (n - 1));
//   let s = 0;
//   for (let i = 1; i <= n - 1; i++) s += Math.abs(mult[i - 1] - i);
//   return s;
// }
// 
// const results = [];
// 
// for (const n of NS) {
//   let found = null;
//   let best = { score: Infinity, pts: null, multiplicities: null };
//   for (let t = 0; t < TRIALS; t++) {
//     const pts = chooseRandomPoints(n);
//     if (!noThreeCollinear(pts)) continue;
//     if (!noFourConcyclic(pts)) continue;
//     const prof = distanceProfile(pts);
//     const score = deficiency(prof.multiplicities, n);
//     if (score < best.score) {
//       best = { score, pts, multiplicities: prof.multiplicities };
//     }
//     if (score === 0) {
//       found = { pts, multiplicities: prof.multiplicities };
//       break;
//     }
//   }
//   results.push({
//     n,
//     trials: TRIALS,
//     found_exact_profile: !!found,
//     witness_points: found ? found.pts : null,
//     witness_multiplicities: found ? found.multiplicities : null,
//     best_deficiency: best.score,
//     best_points: best.pts,
//     best_multiplicities: best.multiplicities,
//   });
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   grid: GRID,
//   trials_per_n: TRIALS,
//   ns: NS,
//   results,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep217_distance_profile_search.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, ns: NS, trials: TRIALS }, null, 2));
// 
// ==== End Snippet ====

