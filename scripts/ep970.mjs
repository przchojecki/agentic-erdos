#!/usr/bin/env node
const meta={problem:'EP-970',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-970 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch22_quick_compute.mjs | Jacobsthal-function finite profile for primorial and sampled squarefree n. ----
// // EP-970: Jacobsthal-function finite profile for primorial and sampled squarefree n.
// {
//   const rng = makeRng(20260304 ^ 970);
//   const plist = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31];
// 
//   function jacobsthalFromFactors(factors) {
//     let n = 1;
//     for (const p of factors) n *= p;
//     const blocked = new Uint8Array(n);
//     for (const p of factors) {
//       for (let i = 0; i < n; i += p) blocked[i] = 1;
//     }
// 
//     let maxRun = 0;
//     let cur = 0;
//     for (let i = 0; i < n; i += 1) {
//       if (blocked[i]) {
//         cur += 1;
//         if (cur > maxRun) maxRun = cur;
//       } else cur = 0;
//     }
//     // Circular wrap.
//     let pref = 0;
//     while (pref < n && blocked[pref]) pref += 1;
//     let suff = 0;
//     while (suff < n && blocked[n - 1 - suff]) suff += 1;
//     if (pref + suff > maxRun) maxRun = pref + suff;
// 
//     return { n, j_of_n: maxRun + 1 };
//   }
// 
//   const primorialRows = [];
//   let prod = 1;
//   for (let k = 1; k <= 8; k += 1) {
//     prod *= plist[k - 1];
//     const factors = plist.slice(0, k);
//     const { j_of_n } = jacobsthalFromFactors(factors);
//     primorialRows.push({ k, n: prod, j_of_n, j_over_k2: Number((j_of_n / (k * k)).toPrecision(7)) });
//   }
// 
//   const sampledRows = [];
//   for (let k = 2; k <= 7; k += 1) {
//     let best = { j: -1, n: 1, factors: [] };
//     for (let t = 0; t < 140; t += 1) {
//       const idx = [...Array(plist.length).keys()];
//       shuffle(idx, rng);
//       const pick = idx.slice(0, k).map((i) => plist[i]).sort((a, b) => a - b);
//       let n = 1;
//       for (const p of pick) n *= p;
//       if (n > 2_000_000) continue;
//       const { j_of_n } = jacobsthalFromFactors(pick);
//       if (j_of_n > best.j) best = { j: j_of_n, n, factors: pick };
//     }
//     sampledRows.push({
//       k,
//       best_sampled_n: best.n,
//       best_sampled_j_n: best.j,
//       factorization: best.factors.join(' * '),
//     });
//   }
// 
//   out.results.ep970 = {
//     description: 'Finite Jacobsthal-profile computation for squarefree moduli (primorial baseline + random samples).',
//     primorial_rows: primorialRows,
//     sampled_rows: sampledRows,
//   };
// }
// ==== End Batch Split Integrations ====
