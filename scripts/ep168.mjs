#!/usr/bin/env node
// Canonical per-problem script for EP-168.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-168',
  source_count: 1,
  source_files: ["ep168_exact_small_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-168 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep168_exact_small_scan.mjs
// Kind: current_script_file
// Label: From ep168_exact_small_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function solveN(N) {
//   const edgesByV = Array.from({ length: N + 1 }, () => []);
//   const edges = [];
//   for (let n = 1; 3 * n <= N; n += 1) {
//     const e = [n, 2 * n, 3 * n];
//     const id = edges.length;
//     edges.push(e);
//     for (const v of e) edgesByV[v].push(id);
//   }
// 
//   const state = new Int8Array(N + 1); // -1 excluded, 0 undecided, 1 included
//   const edgeCount = edges.length;
//   const incInEdge = new Int8Array(edgeCount);
//   const undecInEdge = new Int8Array(edgeCount);
//   for (let i = 0; i < edgeCount; i += 1) undecInEdge[i] = 3;
// 
//   let current = 0;
//   let best = 0;
//   let bestSet = [];
// 
//   function applyAssign(v, val, trail) {
//     if (state[v] === val) return true;
//     if (state[v] !== 0) return false;
// 
//     state[v] = val;
//     trail.push(['state', v]);
//     if (val === 1) current += 1;
// 
//     for (const eId of edgesByV[v]) {
//       if (val === 1) {
//         const before = incInEdge[eId];
//         incInEdge[eId] += 1;
//         trail.push(['inc', eId, before]);
//       }
// 
//       const ubefore = undecInEdge[eId];
//       undecInEdge[eId] -= 1;
//       trail.push(['undec', eId, ubefore]);
// 
//       if (incInEdge[eId] === 3) return false;
// 
//       if (incInEdge[eId] === 2 && undecInEdge[eId] === 1) {
//         // force third vertex out
//         const [a, b, c] = edges[eId];
//         let t = a;
//         if (state[a] !== 0) t = b;
//         if (state[b] !== 0) t = c;
//         if (!applyAssign(t, -1, trail)) return false;
//       }
//     }
// 
//     return true;
//   }
// 
//   function undo(trail) {
//     for (let i = trail.length - 1; i >= 0; i -= 1) {
//       const t = trail[i];
//       if (t[0] === 'undec') {
//         undecInEdge[t[1]] = t[2];
//       } else if (t[0] === 'inc') {
//         incInEdge[t[1]] = t[2];
//       } else {
//         const v = t[1];
//         if (state[v] === 1) current -= 1;
//         state[v] = 0;
//       }
//     }
//   }
// 
//   function chooseVertex() {
//     let bestV = -1;
//     let bestDeg = -1;
//     for (let v = 1; v <= N; v += 1) {
//       if (state[v] !== 0) continue;
//       let d = 0;
//       for (const eId of edgesByV[v]) if (incInEdge[eId] < 3) d += 1;
//       if (d > bestDeg) {
//         bestDeg = d;
//         bestV = v;
//       }
//     }
//     return bestV;
//   }
// 
//   function upperBound() {
//     let undec = 0;
//     for (let v = 1; v <= N; v += 1) if (state[v] === 0) undec += 1;
//     return current + undec;
//   }
// 
//   function snapshotIfBest() {
//     if (current > best) {
//       best = current;
//       bestSet = [];
//       for (let v = 1; v <= N; v += 1) if (state[v] === 1) bestSet.push(v);
//     }
//   }
// 
//   function dfs() {
//     if (upperBound() <= best) return;
// 
//     const v = chooseVertex();
//     if (v < 0) {
//       snapshotIfBest();
//       return;
//     }
// 
//     // Include branch first.
//     {
//       const tr = [];
//       if (applyAssign(v, 1, tr)) dfs();
//       undo(tr);
//     }
// 
//     // Exclude branch.
//     {
//       const tr = [];
//       if (applyAssign(v, -1, tr)) dfs();
//       undo(tr);
//     }
//   }
// 
//   dfs();
// 
//   return {
//     N,
//     F_exact_small: best,
//     ratio_F_over_N: best / N,
//     witness_set: bestSet,
//   };
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep168_exact_small_scan.json');
// 
// const Nmax = Number(process.argv[2] || 140);
// const rows = [];
// for (let N = 20; N <= Nmax; N += 5) {
//   const t0 = Date.now();
//   const r = solveN(N);
//   r.runtime_ms = Date.now() - t0;
//   rows.push(r);
//   process.stderr.write(`N=${N}, F=${r.F_exact_small}, ratio=${r.ratio_F_over_N.toFixed(4)}, ms=${r.runtime_ms}\n`);
// }
// 
// const out = {
//   problem: 'EP-168',
//   method: 'exact_branch_and_bound_maximum_3-uniform_independent_set_for_edges_{n,2n,3n}',
//   Nmax,
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

