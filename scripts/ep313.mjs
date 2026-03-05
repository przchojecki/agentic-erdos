#!/usr/bin/env node
// Canonical per-problem script for EP-313.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-313',
  source_count: 2,
  source_files: ["ep313_primary_pseudoperfect_scan.mjs","longterm_batch2_compute.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-313 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/2 ====
// Source: ep313_primary_pseudoperfect_scan.mjs
// Kind: current_script_file
// Label: From ep313_primary_pseudoperfect_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-313 finite scan:
// // m is primary pseudoperfect iff m is squarefree and
// //   sum_{p|m} (m/p) + 1 = m.
// 
// const MMAX = Number(process.env.MMAX || 20000000);
// if (!Number.isInteger(MMAX) || MMAX < 2) throw new Error('MMAX must be integer >=2');
// 
// const spf = new Uint32Array(MMAX + 1);
// const primes = [];
// for (let i = 2; i <= MMAX; i += 1) {
//   if (spf[i] === 0) {
//     spf[i] = i;
//     primes.push(i);
//   }
//   for (let j = 0; j < primes.length; j += 1) {
//     const p = primes[j];
//     const v = i * p;
//     if (v > MMAX) break;
//     spf[v] = p;
//     if (p === spf[i]) break;
//   }
// }
// 
// function distinctPrimeFactorsOfSquarefree(n) {
//   const fac = [];
//   let x = n;
//   let last = 0;
//   while (x > 1) {
//     const p = spf[x];
//     if (p === last) return null; // repeated factor => not squarefree
//     fac.push(p);
//     x = Math.floor(x / p);
//     last = p;
//   }
//   return fac;
// }
// 
// const hits = [];
// for (let m = 2; m <= MMAX; m += 1) {
//   const fac = distinctPrimeFactorsOfSquarefree(m);
//   if (!fac) continue;
//   let lhs = 1; // +1 term
//   for (const p of fac) lhs += Math.floor(m / p);
//   if (lhs === m) hits.push({ m, primes: fac });
// }
// 
// const out = {
//   problem: 'EP-313',
//   script: path.basename(process.argv[1]),
//   method: 'squarefree_scan_with_primary_pseudoperfect_identity',
//   params: { MMAX },
//   hits_count: hits.length,
//   hits,
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep313_primary_pseudoperfect_scan.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(
//   JSON.stringify(
//     {
//       outPath,
//       MMAX,
//       hits_count: hits.length,
//       largest_hit: hits.length ? hits[hits.length - 1].m : null,
//     },
//     null,
//     2
//   )
// );
// 
// ==== End Snippet ====

// ==== Integrated Snippet 2/2 ====
// Source: longterm_batch2_compute.mjs
// Kind: batch_ep_section_from_head
// Label: summarize primary pseudoperfect scan.
// // EP-313: summarize primary pseudoperfect scan.
// if (fs.existsSync('data/ep313_primary_pseudoperfect_scan.json')) {
//   const d = loadJSON('data/ep313_primary_pseudoperfect_scan.json');
//   out.results.ep313 = {
//     hits_count: d.hits_count ?? null,
//     largest_hit: Array.isArray(d.hits) && d.hits.length > 0 ? d.hits[d.hits.length - 1] : null,
//     last_row: pickLastRow(d),
//   };
// }
// ==== End Snippet ====

// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/longterm_batch2_compute.mjs | summarize primary pseudoperfect scan. ----
// // EP-313: summarize primary pseudoperfect scan.
// if (fs.existsSync('data/ep313_primary_pseudoperfect_scan.json')) {
//   const d = loadJSON('data/ep313_primary_pseudoperfect_scan.json');
//   out.results.ep313 = {
//     hits_count: d.hits_count ?? null,
//     largest_hit: Array.isArray(d.hits) && d.hits.length > 0 ? d.hits[d.hits.length - 1] : null,
//     last_row: pickLastRow(d),
//   };
// }
// ==== End Batch Split Integrations ====
