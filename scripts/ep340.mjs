#!/usr/bin/env node
// Canonical per-problem script for EP-340.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-340',
  source_count: 1,
  source_files: ["ep340_mian_chowla_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-340 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep340_mian_chowla_scan.mjs
// Kind: current_script_file
// Label: From ep340_mian_chowla_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function generateMianChowla(limitValue) {
//   const A = [1];
//   const sums = new Set();
//   let next = 2;
// 
//   while (A[A.length - 1] <= limitValue) {
//     let x = next;
//     while (true) {
//       let ok = true;
//       for (let i = 0; i < A.length; i += 1) {
//         const s = A[i] + x;
//         if (sums.has(s)) {
//           ok = false;
//           break;
//         }
//       }
//       if (ok) break;
//       x += 1;
//     }
// 
//     for (let i = 0; i < A.length; i += 1) sums.add(A[i] + x);
//     A.push(x);
//     next = x + 1;
//   }
// 
//   return A;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep340_mian_chowla_scan.json');
// 
// const Nmax = Number(process.argv[2] || 5000000);
// const checkpoints = [100, 300, 1000, 3000, 10000, 30000, 100000, 300000, 1000000, 3000000, 5000000]
//   .filter((x) => x <= Nmax);
// 
// const A = generateMianChowla(Nmax);
// 
// const rows = [];
// let j = 0;
// for (const N of checkpoints) {
//   while (j < A.length && A[j] <= N) j += 1;
//   const cnt = j;
//   rows.push({
//     N,
//     count_A_le_N: cnt,
//     count_over_sqrtN: cnt / Math.sqrt(N),
//     count_over_Npow_045: cnt / (N ** 0.45),
//     count_over_Npow_049: cnt / (N ** 0.49),
//   });
// }
// 
// const out = {
//   problem: 'EP-340',
//   method: 'direct_generation_of_Mian-Chowla_greedy_Sidon_sequence',
//   params: { Nmax },
//   generated_terms: A.length,
//   last_term: A[A.length - 1],
//   first_terms: A.slice(0, 40),
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`generated_terms=${A.length}, last=${A[A.length - 1]}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

