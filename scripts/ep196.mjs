#!/usr/bin/env node
// Canonical per-problem script for EP-196.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-196',
  source_count: 1,
  source_files: ["ep196_permutation_avoidance_search.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-196 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep196_permutation_avoidance_search.mjs
// Kind: current_script_file
// Label: From ep196_permutation_avoidance_search.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function hasBadWithTail(arr) {
//   const t = arr.length - 1;
//   const d = arr[t];
//   for (let i = 0; i < t; i += 1) {
//     const a = arr[i];
//     for (let j = i + 1; j < t; j += 1) {
//       const b = arr[j];
//       const diff = b - a;
//       for (let k = j + 1; k < t; k += 1) {
//         const c = arr[k];
//         if (c - b === diff && d - c === diff) return true;
//       }
//     }
//   }
//   return false;
// }
// 
// function shuffle(a) {
//   for (let i = a.length - 1; i > 0; i -= 1) {
//     const j = Math.floor(Math.random() * (i + 1));
//     [a[i], a[j]] = [a[j], a[i]];
//   }
// }
// 
// function findPermutation(N, restarts = 80, backtrackCap = 200000) {
//   const all = Array.from({ length: N }, (_, i) => i + 1);
// 
//   let bestPrefix = [];
// 
//   for (let attempt = 0; attempt < restarts; attempt += 1) {
//     const arr = [];
//     const unused = all.slice();
//     const triedStack = [];
// 
//     let backtracks = 0;
//     while (true) {
//       if (arr.length === N) return { ok: true, perm: arr.slice(), attempts: attempt + 1 };
// 
//       if (!triedStack[arr.length]) {
//         const cand = unused.slice();
//         shuffle(cand);
//         // Prefer extreme values to reduce AP regularity.
//         cand.sort((x, y) => Math.abs(y - (N + 1) / 2) - Math.abs(x - (N + 1) / 2));
//         triedStack[arr.length] = cand;
//       }
// 
//       let moved = false;
//       while (triedStack[arr.length].length > 0) {
//         const v = triedStack[arr.length].pop();
//         const idx = unused.indexOf(v);
//         if (idx < 0) continue;
// 
//         arr.push(v);
//         unused.splice(idx, 1);
// 
//         if (!hasBadWithTail(arr)) {
//           moved = true;
//           if (arr.length > bestPrefix.length) bestPrefix = arr.slice();
//           break;
//         }
// 
//         // undo immediate fail
//         arr.pop();
//         unused.splice(idx, 0, v);
//       }
// 
//       if (moved) continue;
// 
//       // backtrack
//       if (arr.length === 0) break;
//       backtracks += 1;
//       if (backtracks > backtrackCap) break;
// 
//       const last = arr.pop();
//       unused.push(last);
//       triedStack[arr.length + 1] = null;
//     }
//   }
// 
//   return { ok: false, best_prefix: bestPrefix, best_length: bestPrefix.length };
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep196_permutation_avoidance_search.json');
// 
// const Nmax = Number(process.argv[2] || 70);
// const restarts = Number(process.argv[3] || 120);
// const backtrackCap = Number(process.argv[4] || 260000);
// 
// const rows = [];
// let largestSolvedN = 0;
// let witnessAtLargest = [];
// 
// for (let N = 12; N <= Nmax; N += 2) {
//   const t0 = Date.now();
//   const r = findPermutation(N, restarts, backtrackCap);
//   const row = {
//     N,
//     solved_full_permutation_found: r.ok,
//     runtime_ms: Date.now() - t0,
//   };
// 
//   if (r.ok) {
//     row.witness_permutation_prefix = r.perm.slice(0, Math.min(24, r.perm.length));
//     row.witness_permutation_length = r.perm.length;
//     if (N > largestSolvedN) {
//       largestSolvedN = N;
//       witnessAtLargest = r.perm.slice();
//     }
//   } else {
//     row.best_prefix_length_found = r.best_length;
//     row.best_prefix_sample = r.best_prefix.slice(0, Math.min(24, r.best_prefix.length));
//   }
// 
//   rows.push(row);
//   process.stderr.write(`N=${N}, solved=${r.ok ? 'yes' : 'no'}, best=${r.ok ? N : r.best_length}, ms=${row.runtime_ms}\n`);
// 
//   if (!r.ok && N - largestSolvedN >= 8) break;
// }
// 
// const out = {
//   problem: 'EP-196',
//   method: 'randomized_backtracking_for_permutations_avoiding_4-term_AP_subsequences',
//   params: { Nmax, restarts, backtrackCap },
//   largest_N_with_full_witness_found: largestSolvedN,
//   witness_at_largest_N: witnessAtLargest,
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

