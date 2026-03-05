#!/usr/bin/env node
const meta={problem:'EP-1054',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-1054 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch23_quick_compute.mjs | bounded computation of f(n)-style representability via smallest divisors. ----
// // EP-1054: bounded computation of f(n)-style representability via smallest divisors.
// {
//   const N_TARGET = 700;
//   const M_MAX = 20_000;
//   const best = new Int32Array(N_TARGET + 1);
//   best.fill(0);
// 
//   for (let m = 1; m <= M_MAX; m += 1) {
//     const divs = divisorsSorted(m, spf);
//     let pref = 0;
//     for (const d of divs) {
//       pref += d;
//       if (pref > N_TARGET) break;
//       if (best[pref] === 0 || m < best[pref]) best[pref] = m;
//     }
//   }
// 
//   const probes = [6, 10, 20, 50, 100, 200, 400, 700];
//   const probeRows = probes.map((n) => ({
//     n,
//     best_m_found: best[n] || null,
//     ratio_m_over_n: best[n] ? Number((best[n] / n).toPrecision(7)) : null,
//   }));
// 
//   const unresolved = [];
//   for (let n = 1; n <= N_TARGET; n += 1) if (best[n] === 0) unresolved.push(n);
// 
//   let maxRatio = 0;
//   let argN = -1;
//   for (let n = 6; n <= N_TARGET; n += 1) {
//     if (best[n] === 0) continue;
//     const r = best[n] / n;
//     if (r > maxRatio) {
//       maxRatio = r;
//       argN = n;
//     }
//   }
// 
//   out.results.ep1054 = {
//     description: 'Bounded search for minimal m where n is a prefix sum of sorted divisors of m.',
//     N_TARGET,
//     M_MAX,
//     unresolved_n_up_to_target_under_MMAX: unresolved,
//     probe_rows: probeRows,
//     max_ratio_m_over_n_found: Number(maxRatio.toPrecision(7)),
//     n_attaining_max_ratio: argN,
//   };
// }
// ==== End Batch Split Integrations ====
