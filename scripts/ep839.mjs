#!/usr/bin/env node
// Canonical per-problem script for EP-839.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-839',
  source_count: 1,
  source_files: ["ep839_consecutive_sum_free_greedy.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-839 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep839_consecutive_sum_free_greedy.mjs
// Kind: current_script_file
// Label: From ep839_consecutive_sum_free_greedy.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-839 finite heuristic:
// // Build the lexicographically-greedy sequence a_1<a_2<... such that
// // no term equals a sum of consecutive earlier terms.
// 
// const N_TERMS = Number(process.env.N_TERMS || 3000);
// const CHECKPOINTS = (process.env.CHECKPOINTS || '50,100,200,400,800,1200,1800,2400,3000')
//   .split(',')
//   .map((x) => Number(x.trim()))
//   .filter((x) => x >= 1 && x <= N_TERMS);
// 
// const a = [1];
// const forbidden = new Set(); // consecutive sums among already-built terms
// 
// function addNewForbiddenWithTail(arr) {
//   let s = 0;
//   for (let i = arr.length - 1; i >= 0; i--) {
//     s += arr[i];
//     forbidden.add(s);
//   }
// }
// 
// addNewForbiddenWithTail(a);
// 
// while (a.length < N_TERMS) {
//   let cand = a[a.length - 1] + 1;
//   while (forbidden.has(cand)) cand++;
//   a.push(cand);
//   addNewForbiddenWithTail(a);
// }
// 
// const prefixReciprocal = new Array(a.length + 1).fill(0);
// for (let i = 1; i <= a.length; i++) prefixReciprocal[i] = prefixReciprocal[i - 1] + 1 / a[i - 1];
// 
// const rows = [];
// for (const n of CHECKPOINTS) {
//   const an = a[n - 1];
//   const ratio = an / n;
//   const x = an;
//   const recipOverLog = prefixReciprocal[n] / Math.log(Math.max(3, x));
//   rows.push({
//     n,
//     a_n: an,
//     ratio_a_n_over_n: Number(ratio.toFixed(6)),
//     reciprocal_prefix_sum: Number(prefixReciprocal[n].toFixed(6)),
//     reciprocal_prefix_over_log_a_n: Number(recipOverLog.toFixed(6)),
//   });
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   n_terms: N_TERMS,
//   first_terms: a.slice(0, 40),
//   rows,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep839_consecutive_sum_free_greedy.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, n_terms: N_TERMS, rows: rows.length }, null, 2));
// 
// ==== End Snippet ====

