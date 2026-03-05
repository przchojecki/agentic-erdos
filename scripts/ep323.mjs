#!/usr/bin/env node
// Canonical per-problem script for EP-323.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-323',
  source_count: 2,
  source_files: ["ep323_power_sum_count_scan.mjs","longterm_batch2_compute.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-323 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/2 ====
// Source: ep323_power_sum_count_scan.mjs
// Kind: current_script_file
// Label: From ep323_power_sum_count_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-323 finite profile:
// // f_{k,m}(x): count of n<=x representable as sum of m nonnegative k-th powers.
// 
// const X_LIST = (process.env.X_LIST || '10000,100000,1000000')
//   .split(',')
//   .map((x) => Number(x.trim()))
//   .filter((x) => Number.isInteger(x) && x >= 1000)
//   .sort((a, b) => a - b);
// const PAIRS = (process.env.PAIRS || '3:2,3:3,4:2,4:4,5:2,5:5')
//   .split(',')
//   .map((s) => s.trim())
//   .filter(Boolean)
//   .map((s) => {
//     const [k, m] = s.split(':').map(Number);
//     return { k, m };
//   })
//   .filter(({ k, m }) => Number.isInteger(k) && Number.isInteger(m) && k >= 2 && m >= 1 && m <= k);
// 
// if (X_LIST.length === 0 || PAIRS.length === 0) throw new Error('Bad X_LIST/PAIRS configuration');
// 
// function kthPowers(k, x) {
//   const arr = [];
//   for (let a = 0; ; a += 1) {
//     const v = a ** k;
//     if (v > x) break;
//     arr.push(v);
//   }
//   return arr;
// }
// 
// function countRepresentable(k, m, x) {
//   const pw = kthPowers(k, x);
//   const mark = new Uint8Array(x + 1);
// 
//   function rec(pos, startIdx, sum) {
//     if (pos === m) {
//       mark[sum] = 1;
//       return;
//     }
//     for (let i = startIdx; i < pw.length; i += 1) {
//       const ns = sum + pw[i];
//       if (ns > x) break;
//       rec(pos + 1, i, ns); // nondecreasing indices, order ignored
//     }
//   }
// 
//   rec(0, 0, 0);
//   let cnt = 0;
//   for (let n = 1; n <= x; n += 1) if (mark[n]) cnt += 1;
//   return { count: cnt, basis_size: pw.length };
// }
// 
// const rows = [];
// for (const { k, m } of PAIRS) {
//   for (const x of X_LIST) {
//     const t0 = Date.now();
//     const r = countRepresentable(k, m, x);
//     const row = {
//       k,
//       m,
//       x,
//       representable_count: r.count,
//       basis_size: r.basis_size,
//       ratio_over_x: Number((r.count / x).toFixed(8)),
//       ratio_over_x_m_over_k: Number((r.count / (x ** (m / k))).toFixed(8)),
//       runtime_ms: Date.now() - t0,
//     };
//     rows.push(row);
//   }
// }
// 
// const out = {
//   problem: 'EP-323',
//   script: path.basename(process.argv[1]),
//   method: 'exact_enumeration_of_m_term_kth_power_sums_nonnegative',
//   params: { X_LIST, PAIRS },
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep323_power_sum_count_scan.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(JSON.stringify({ outPath, rows: rows.length }, null, 2));
// 
// ==== End Snippet ====

// ==== Integrated Snippet 2/2 ====
// Source: longterm_batch2_compute.mjs
// Kind: batch_ep_section_from_head
// Label: summarize power sum count scan.
// // EP-323: summarize power sum count scan.
// if (fs.existsSync('data/ep323_power_sum_count_scan.json')) {
//   const d = loadJSON('data/ep323_power_sum_count_scan.json');
//   out.results.ep323 = {
//     params: d.params || null,
//     last_row: pickLastRow(d),
//   };
// }
// ==== End Snippet ====

// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/longterm_batch2_compute.mjs | summarize power sum count scan. ----
// // EP-323: summarize power sum count scan.
// if (fs.existsSync('data/ep323_power_sum_count_scan.json')) {
//   const d = loadJSON('data/ep323_power_sum_count_scan.json');
//   out.results.ep323 = {
//     params: d.params || null,
//     last_row: pickLastRow(d),
//   };
// }
// ==== End Batch Split Integrations ====
