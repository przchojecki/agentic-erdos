#!/usr/bin/env node
// Canonical per-problem script for EP-460.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-460',
  source_count: 1,
  source_files: ["ep460_greedy_sequence_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-460 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep460_greedy_sequence_scan.mjs
// Kind: current_script_file
// Label: From ep460_greedy_sequence_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const N_MAX = Number(process.env.N_MAX || 12000);
// const START = Number(process.env.N_START || 30);
// 
// function sieveSpf(n) {
//   const spf = new Int32Array(n + 1);
//   for (let i = 2; i <= n; i++) {
//     if (spf[i] === 0) {
//       spf[i] = i;
//       if (i * i <= n) {
//         for (let j = i * i; j <= n; j += i) if (spf[j] === 0) spf[j] = i;
//       }
//     }
//   }
//   return spf;
// }
// 
// function primeFactorsUnique(x, spf) {
//   const out = [];
//   let n = x;
//   while (n > 1) {
//     const p = spf[n];
//     out.push(p);
//     while (n % p === 0) n = Math.floor(n / p);
//   }
//   return out;
// }
// 
// function leastPrimeFactor(x, spf) {
//   if (x <= 1) return Infinity;
//   return spf[x] || x;
// }
// 
// const spf = sieveSpf(N_MAX + 5);
// const rows = [];
// let maxS = -1;
// let maxN = -1;
// 
// for (let n = Math.max(3, START); n <= N_MAX; n++) {
//   const used = new Set(primeFactorsUnique(n, spf)); // from b0=n (a0=0)
//   const accepted = [];
//   let S = 0;
//   let S_smallPrime = 0;
//   let S_largePrime = 0;
// 
//   for (let a = 1; a < n; a++) {
//     const b = n - a;
//     const pf = primeFactorsUnique(b, spf);
//     let ok = true;
//     for (const p of pf) {
//       if (used.has(p)) {
//         ok = false;
//         break;
//       }
//     }
//     if (!ok) continue;
// 
//     accepted.push(a);
//     for (const p of pf) used.add(p);
// 
//     const term = 1 / a;
//     S += term;
//     const lpf = leastPrimeFactor(b, spf);
//     if (lpf <= a) S_smallPrime += term;
//     else S_largePrime += term;
//   }
// 
//   if (S > maxS) {
//     maxS = S;
//     maxN = n;
//   }
// 
//   if (n <= 200 || n % 100 === 0) {
//     rows.push({
//       n,
//       count_a_lt_n: accepted.length,
//       reciprocal_sum: Number(S.toFixed(8)),
//       reciprocal_sum_lpf_le_a: Number(S_smallPrime.toFixed(8)),
//       reciprocal_sum_lpf_gt_a: Number(S_largePrime.toFixed(8)),
//       first_terms: accepted.slice(0, 20),
//     });
//   }
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   n_start: START,
//   n_max: N_MAX,
//   sampled_rows: rows,
//   max_reciprocal_sum_observed: maxS,
//   argmax_n: maxN,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep460_greedy_sequence_scan.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, sampled_rows: rows.length, maxS, maxN }, null, 2));
// 
// ==== End Snippet ====

