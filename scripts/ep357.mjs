#!/usr/bin/env node
// Canonical per-problem script for EP-357.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-357',
  source_count: 1,
  source_files: ["ep357_consecutive_sums_distinct_search.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-357 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep357_consecutive_sums_distinct_search.mjs
// Kind: current_script_file
// Label: From ep357_consecutive_sums_distinct_search.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const N_LIST = (process.env.N_LIST || '20,25,30,35,40').split(',').map(Number);
// 
// function maxKForN(n) {
//   let best = [];
// 
//   function dfs(seq, prefixSums, intervalSet, startVal) {
//     if (seq.length > best.length) best = seq.slice();
// 
//     // Upper bound by remaining values
//     if (seq.length + (n - startVal + 1) <= best.length) return;
// 
//     for (let a = startVal; a <= n; a++) {
//       const newPrefix = prefixSums[prefixSums.length - 1] + a;
//       const newSums = [];
//       let ok = true;
//       for (let i = 0; i < prefixSums.length; i++) {
//         const s = newPrefix - prefixSums[i];
//         if (intervalSet.has(s)) {
//           ok = false;
//           break;
//         }
//         newSums.push(s);
//       }
//       if (!ok) continue;
// 
//       // commit
//       for (const s of newSums) intervalSet.add(s);
//       prefixSums.push(newPrefix);
//       seq.push(a);
// 
//       dfs(seq, prefixSums, intervalSet, a + 1);
// 
//       // rollback
//       seq.pop();
//       prefixSums.pop();
//       for (const s of newSums) intervalSet.delete(s);
//     }
//   }
// 
//   dfs([], [0], new Set(), 1);
//   return best;
// }
// 
// const rows = [];
// for (const n of N_LIST) {
//   const best = maxKForN(n);
//   rows.push({ n, best_k_found: best.length, witness_sequence: best });
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   n_list: N_LIST,
//   rows,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep357_consecutive_sums_distinct_search.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, n_list: N_LIST, rows: rows.length }, null, 2));
// 
// ==== End Snippet ====

