#!/usr/bin/env node
// Canonical per-problem script for EP-876.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-876',
  source_count: 1,
  source_files: ["ep876_gap_less_than_n_backtrack.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-876 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep876_gap_less_than_n_backtrack.mjs
// Kind: current_script_file
// Label: From ep876_gap_less_than_n_backtrack.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-876 counterexample-oriented finite search:
// // can we build long prefixes with a_{i+1}-a_i < i ?
// // and no term representable as sum of distinct earlier terms.
// 
// const TARGET_LEN = Number(process.env.TARGET_LEN || 22);
// const A1_MAX = Number(process.env.A1_MAX || 60);
// const A2_MAX = Number(process.env.A2_MAX || 400);
// const MAX_NEXT = Number(process.env.MAX_NEXT || 2000);
// 
// function cloneBits(bits) {
//   return bits.slice();
// }
// 
// // subset sum bitset up to MAX_NEXT * TARGET_LEN (safe cap)
// const LIM = MAX_NEXT * TARGET_LEN;
// const baseBits = new Uint8Array(LIM + 1);
// baseBits[0] = 1;
// 
// let best = [];
// let bestGapViolationAt = null;
// 
// function addElement(bits, x) {
//   for (let s = LIM - x; s >= 0; s--) {
//     if (bits[s]) bits[s + x] = 1;
//   }
// }
// 
// function dfs(a, bits) {
//   if (a.length > best.length) best = a.slice();
//   if (a.length >= TARGET_LEN) return true;
// 
//   const i = a.length; // current n in a_n before choosing a_{n+1}
//   const prev = a[a.length - 1];
//   const gapCap = (i >= 2) ? (i - 1) : MAX_NEXT; // ignore n=1 trivial obstruction
//   const maxAllowed = Math.min(MAX_NEXT, prev + gapCap); // a_{i+1}-a_i < i for i>=2
//   if (maxAllowed <= prev) return false;
// 
//   for (let x = prev + 1; x <= maxAllowed; x++) {
//     if (bits[x]) continue; // forbidden: x is sum of distinct previous terms
//     const nextBits = cloneBits(bits);
//     addElement(nextBits, x);
//     a.push(x);
//     if (dfs(a, nextBits)) return true;
//     a.pop();
//   }
//   if (bestGapViolationAt == null) bestGapViolationAt = a.length + 1;
//   return false;
// }
// 
// let full = false;
// for (let a1 = 1; a1 <= A1_MAX && !full; a1++) {
//   for (let a2 = a1 + 1; a2 <= A2_MAX && !full; a2++) {
//     const bits0 = cloneBits(baseBits);
//     addElement(bits0, a1);
//     addElement(bits0, a2);
//     const cur = [a1, a2];
//     if (cur.length > best.length) best = cur.slice();
//     if (dfs(cur, bits0)) {
//       full = true;
//       break;
//     }
//   }
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   target_len: TARGET_LEN,
//   a1_max: A1_MAX,
//   a2_max: A2_MAX,
//   max_next: MAX_NEXT,
//   found_full_length_prefix: full,
//   longest_prefix_len_found: best.length,
//   best_prefix: best,
//   first_failure_next_index_guess: bestGapViolationAt,
//   interpretation: 'failure to reach long prefix with gap<a_index is finite evidence against possibility but not a proof',
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep876_gap_less_than_n_backtrack.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, found_full: full, best_len: best.length }, null, 2));
// 
// ==== End Snippet ====

