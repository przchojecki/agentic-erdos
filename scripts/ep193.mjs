#!/usr/bin/env node
// Canonical per-problem script for EP-193.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-193',
  source_count: 1,
  source_files: ["ep193_swalk_collinear_search.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-193 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep193_swalk_collinear_search.mjs
// Kind: current_script_file
// Label: From ep193_swalk_collinear_search.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function cross(u, v) {
//   return [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
// }
// 
// function isZero(v) {
//   return v[0] === 0 && v[1] === 0 && v[2] === 0;
// }
// 
// function add(a, b) {
//   return [a[0] + b[0], a[1] + b[1], a[2] + b[2]];
// }
// 
// function key(p) {
//   return `${p[0]},${p[1]},${p[2]}`;
// }
// 
// function canAdd(points, q) {
//   const m = points.length;
//   for (let i = 0; i < m; i += 1) {
//     const a = points[i];
//     const u = [q[0] - a[0], q[1] - a[1], q[2] - a[2]];
//     for (let j = i + 1; j < m; j += 1) {
//       const b = points[j];
//       const v = [b[0] - a[0], b[1] - a[1], b[2] - a[2]];
//       if (isZero(cross(u, v))) return false;
//     }
//   }
//   return true;
// }
// 
// function shuffle(arr) {
//   for (let i = arr.length - 1; i > 0; i -= 1) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [arr[i], arr[j]] = [arr[j], arr[i]];
//   }
// }
// 
// function tryBuild(S, targetLen, restarts = 120) {
//   let best = [[0, 0, 0]];
// 
//   for (let t = 0; t < restarts; t += 1) {
//     const pts = [[0, 0, 0]];
//     const used = new Set([key(pts[0])]);
// 
//     let stuck = false;
//     while (pts.length < targetLen && !stuck) {
//       const cur = pts[pts.length - 1];
//       const cand = S.slice();
//       shuffle(cand);
// 
//       let moved = false;
//       for (const s of cand) {
//         const q = add(cur, s);
//         const k = key(q);
//         if (used.has(k)) continue;
//         if (!canAdd(pts, q)) continue;
//         pts.push(q);
//         used.add(k);
//         moved = true;
//         if (pts.length > best.length) best = pts.slice();
//         break;
//       }
//       if (!moved) stuck = true;
//     }
// 
//     if (pts.length >= targetLen) return { ok: true, points: pts, restarts_used: t + 1 };
//   }
// 
//   return { ok: false, best_points: best, best_length: best.length };
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep193_swalk_collinear_search.json');
// 
// const targetLen = Number(process.argv[2] || 160);
// const restarts = Number(process.argv[3] || 160);
// 
// const families = [
//   { name: 'axis6', S: [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]] },
//   { name: 'positive3', S: [[1,0,0],[0,1,0],[0,0,1]] },
//   { name: 'diag6', S: [[1,1,0],[1,0,1],[0,1,1],[-1,1,0],[-1,0,1],[0,-1,1]] },
//   { name: 'mixed8', S: [[1,0,0],[0,1,0],[0,0,1],[1,1,0],[1,0,1],[0,1,1],[-1,1,0],[1,-1,0]] },
// ];
// 
// const rows = [];
// for (const fam of families) {
//   const t0 = Date.now();
//   const r = tryBuild(fam.S, targetLen, restarts);
//   rows.push({
//     family: fam.name,
//     step_set: fam.S,
//     targetLen,
//     restarts,
//     ok_reached_target: r.ok,
//     achieved_length: r.ok ? r.points.length : r.best_length,
//     sample_prefix: (r.ok ? r.points : r.best_points).slice(0, 20),
//     runtime_ms: Date.now() - t0,
//   });
//   process.stderr.write(`${fam.name}: ok=${r.ok}, len=${r.ok ? r.points.length : r.best_length}\n`);
// }
// 
// const out = {
//   problem: 'EP-193',
//   method: 'randomized_greedy_construction_of_long_S-walks_avoiding_any_collinear_triple',
//   params: { targetLen, restarts },
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

