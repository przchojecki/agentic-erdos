#!/usr/bin/env node
// Canonical per-problem script for EP-190.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-190',
  source_count: 1,
  source_files: ["ep190_k3_coloring_exact.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-190 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep190_k3_coloring_exact.mjs
// Kind: current_script_file
// Label: From ep190_k3_coloring_exact.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-190 finite exact search for k=3:
// // color [1..N] so every 3-term AP is neither monochromatic nor rainbow.
// // (So each 3-AP must use exactly 2 colors.)
// 
// const N_MAX = Number(process.env.N_MAX || 40);
// if (!Number.isInteger(N_MAX) || N_MAX < 3) {
//   throw new Error('N_MAX must be an integer >= 3');
// }
// 
// function apPairsEndingAt(k) {
//   const out = [];
//   for (let a = 1; a < k; a += 1) {
//     const s = a + k;
//     if (s % 2 !== 0) continue;
//     const b = s / 2;
//     if (a < b && b < k) out.push([a, b]);
//   }
//   return out;
// }
// 
// function findColoring(N) {
//   const apsByK = Array.from({ length: N + 1 }, (_, i) => (i >= 3 ? apPairsEndingAt(i) : []));
//   const color = new Int16Array(N + 1);
//   color.fill(-1);
// 
//   let maxColor = -1;
// 
//   function okAt(k, c) {
//     for (const [a, b] of apsByK[k]) {
//       const ca = color[a];
//       const cb = color[b];
//       if (ca < 0 || cb < 0) continue;
//       if (ca === cb && cb === c) return false; // monochromatic 3-AP
//       if (ca !== cb && ca !== c && cb !== c) return false; // rainbow 3-AP
//     }
//     return true;
//   }
// 
//   function dfs(pos) {
//     if (pos > N) return true;
// 
//     const oldMax = maxColor;
//     const lim = maxColor + 1; // allow one fresh color (canonical labeling)
//     for (let c = 0; c <= lim; c += 1) {
//       if (!okAt(pos, c)) continue;
//       color[pos] = c;
//       if (c > maxColor) maxColor = c;
//       if (dfs(pos + 1)) return true;
//       color[pos] = -1;
//       maxColor = oldMax;
//     }
//     return false;
//   }
// 
//   const exists = dfs(1);
//   if (!exists) return { exists: false, coloring: null, color_count: null };
// 
//   const col = Array.from(color.slice(1));
//   const used = new Set(col);
//   return { exists: true, coloring: col, color_count: used.size };
// }
// 
// const rows = [];
// let lastGood = null;
// for (let N = 3; N <= N_MAX; N += 1) {
//   const t0 = Date.now();
//   const r = findColoring(N);
//   const row = {
//     N,
//     avoider_exists: r.exists,
//     color_count: r.color_count,
//     coloring_prefix: r.coloring ? r.coloring.slice(0, 40) : null,
//     runtime_ms: Date.now() - t0,
//   };
//   rows.push(row);
//   if (r.exists) lastGood = row;
// }
// 
// const firstNo = rows.find((r) => !r.avoider_exists)?.N ?? null;
// const out = {
//   problem: 'EP-190',
//   script: path.basename(process.argv[1]),
//   method: 'exact_backtracking_canonical_color_labels_for_k3',
//   n_max: N_MAX,
//   rows,
//   summary: {
//     max_N_with_avoider: lastGood?.N ?? null,
//     first_N_without_avoider: firstNo,
//     lower_bound_H3: firstNo == null ? null : firstNo,
//   },
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep190_k3_coloring_exact.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(JSON.stringify({ outPath, n_max: N_MAX, summary: out.summary }, null, 2));
// 
// ==== End Snippet ====

