#!/usr/bin/env node
// Canonical per-problem script for EP-710.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-710',
  source_count: 1,
  source_files: ["ep710_matching_interval_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-710 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep710_matching_interval_scan.mjs
// Kind: current_script_file
// Label: From ep710_matching_interval_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const N_LIST = (process.env.N_LIST || '20,30,40,60,80,100,120').split(',').map((x) => Number(x.trim())).filter(Boolean);
// 
// function hopcroftKarp(adj, nL, nR) {
//   const INF = 1e9;
//   const pairU = new Int32Array(nL + 1);
//   const pairV = new Int32Array(nR + 1);
//   const dist = new Int32Array(nL + 1);
// 
//   function bfs() {
//     const q = [];
//     for (let u = 1; u <= nL; u++) {
//       if (pairU[u] === 0) {
//         dist[u] = 0;
//         q.push(u);
//       } else dist[u] = INF;
//     }
//     let found = false;
//     for (let qi = 0; qi < q.length; qi++) {
//       const u = q[qi];
//       for (const v of adj[u]) {
//         const pu = pairV[v];
//         if (pu === 0) found = true;
//         else if (dist[pu] === INF) {
//           dist[pu] = dist[u] + 1;
//           q.push(pu);
//         }
//       }
//     }
//     return found;
//   }
// 
//   function dfs(u) {
//     for (const v of adj[u]) {
//       const pu = pairV[v];
//       if (pu === 0 || (dist[pu] === dist[u] + 1 && dfs(pu))) {
//         pairU[u] = v;
//         pairV[v] = u;
//         return true;
//       }
//     }
//     dist[u] = 1e9;
//     return false;
//   }
// 
//   let matching = 0;
//   while (bfs()) {
//     for (let u = 1; u <= nL; u++) {
//       if (pairU[u] === 0 && dfs(u)) matching++;
//     }
//   }
//   return matching;
// }
// 
// function feasible(n, f) {
//   const L = f - 1; // interval (n,n+f) has integers n+1..n+f-1
//   if (L < n) return false;
//   const adj = Array.from({ length: n + 1 }, () => []);
//   for (let k = 1; k <= n; k++) {
//     const start = Math.ceil((n + 1) / k) * k;
//     for (let x = start; x <= n + f - 1; x += k) {
//       const v = x - n; // 1..L
//       adj[k].push(v);
//     }
//     if (adj[k].length === 0) return false;
//   }
//   return hopcroftKarp(adj, n, L) === n;
// }
// 
// const rows = [];
// for (const n of N_LIST) {
//   let lo = 1;
//   let hi = 2;
//   while (!feasible(n, hi)) hi *= 2;
//   while (lo < hi) {
//     const mid = Math.floor((lo + hi) / 2);
//     if (feasible(n, mid)) hi = mid;
//     else lo = mid + 1;
//   }
//   const f = lo;
//   rows.push({ n, exact_f_n_small: f, ratio_f_over_n: Number((f / n).toFixed(6)), ratio_f_over_n_sqrtlog: Number((f / (n * Math.sqrt(Math.log(n)))).toFixed(6)) });
// }
// 
// const out = { script: path.basename(process.argv[1]), n_list: N_LIST, rows, timestamp_utc: new Date().toISOString() };
// const outPath = path.join('data', 'ep710_matching_interval_scan.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, rows: rows.length }, null, 2));
// 
// ==== End Snippet ====

