#!/usr/bin/env node
const meta={problem:'EP-320',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-320 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch9_quick_compute.mjs | exact distinct subset-sum counts S(N) for small N via common-denominator DP. ----
// // EP-320: exact distinct subset-sum counts S(N) for small N via common-denominator DP.
// {
//   function exactSofN(N) {
//     let L = 1n;
//     for (let i = 1; i <= N; i += 1) L = lcmBig(L, BigInt(i));
//     let sums = new Set([0n]);
//     for (let i = 1; i <= N; i += 1) {
//       const w = L / BigInt(i);
//       const next = new Set(sums);
//       for (const s of sums) next.add(s + w);
//       sums = next;
//     }
//     return { S: sums.size, lcm_digits: L.toString().length };
//   }
// 
//   const rows = [];
//   for (const N of [8, 10, 12, 14, 16, 18, 20]) {
//     const { S, lcm_digits } = exactSofN(N);
//     rows.push({
//       N,
//       S_N: S,
//       log_S_N: Number(Math.log(S).toPrecision(8)),
//       lcm_digits,
//       log_S_over_N_over_logN: Number((Math.log(S) / (N / Math.log(N))).toPrecision(6)),
//     });
//   }
// 
//   out.results.ep320 = {
//     description: 'Exact S(N) for small N using subset-sum DP over common denominator lcm(1..N).',
//     rows,
//   };
// }
// 
// const outPath = path.join('data', 'harder_batch9_quick_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
