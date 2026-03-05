#!/usr/bin/env node
const meta={problem:'EP-52',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-52 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch2_quick_compute.mjs | sum-product finite exponent proxies. ----
// // EP-52: sum-product finite exponent proxies.
// {
//   const mList = [20, 30, 40, 60];
//   const rows = [];
//   for (const m of mList) {
//     const AP = Array.from({ length: m }, (_, i) => i + 1);
//     const apStats = sumProductStats(AP);
//     let bestRandom = Infinity;
//     let bestRandomPair = null;
//     const trials = 240;
//     for (let t = 0; t < trials; t += 1) {
//       const base = Array.from({ length: 8 * m }, (_, i) => i + 1);
//       shuffle(base, rng);
//       const A = base.slice(0, m).sort((a, b) => a - b);
//       const st = sumProductStats(A);
//       const mx = Math.max(st.sumset, st.prodset);
//       const exp = Math.log(mx) / Math.log(m);
//       if (exp < bestRandom) {
//         bestRandom = exp;
//         bestRandomPair = { sumset: st.sumset, prodset: st.prodset };
//       }
//     }
//     rows.push({
//       m,
//       AP_max_sum_or_product_size: Math.max(apStats.sumset, apStats.prodset),
//       AP_effective_exponent: Number((Math.log(Math.max(apStats.sumset, apStats.prodset)) / Math.log(m)).toFixed(6)),
//       random_trials: trials,
//       best_random_effective_exponent: Number(bestRandom.toFixed(6)),
//       best_random_pair: bestRandomPair,
//     });
//   }
//   out.results.ep52 = {
//     description: 'Finite effective exponent profile for max(|A+A|,|AA|).',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
