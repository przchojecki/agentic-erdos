#!/usr/bin/env node
const meta={problem:'EP-488',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-488 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch13_quick_compute.mjs | density-ratio inequality profile for multiples-union sets. ----
// // EP-488: density-ratio inequality profile for multiples-union sets.
// {
//   function buildPrefix(A, Nmax) {
//     const mark = new Uint8Array(Nmax + 1);
//     for (const a of A) {
//       for (let m = a; m <= Nmax; m += a) mark[m] = 1;
//     }
//     const pref = new Uint32Array(Nmax + 1);
//     for (let i = 1; i <= Nmax; i += 1) pref[i] = pref[i - 1] + mark[i];
//     return pref;
//   }
// 
//   function maxRatioForA(A, Nmax) {
//     const n0 = Math.max(...A);
//     const pref = buildPrefix(A, Nmax);
//     const dens = new Float64Array(Nmax + 1);
//     for (let n = 1; n <= Nmax; n += 1) dens[n] = pref[n] / n;
// 
//     const sufMax = new Float64Array(Nmax + 2);
//     const sufArg = new Int32Array(Nmax + 2);
//     for (let n = Nmax; n >= 1; n -= 1) {
//       if (dens[n] >= sufMax[n + 1]) {
//         sufMax[n] = dens[n];
//         sufArg[n] = n;
//       } else {
//         sufMax[n] = sufMax[n + 1];
//         sufArg[n] = sufArg[n + 1];
//       }
//     }
// 
//     let best = 0;
//     let bestN = n0;
//     let bestM = n0 + 1;
// 
//     for (let n = n0; n < Nmax; n += 1) {
//       if (dens[n] === 0) continue;
//       const r = sufMax[n + 1] / dens[n];
//       if (r > best) {
//         best = r;
//         bestN = n;
//         bestM = sufArg[n + 1];
//       }
//     }
// 
//     return {
//       ratio: best,
//       n: bestN,
//       m: bestM,
//       density_n: dens[bestN],
//       density_m: dens[bestM],
//     };
//   }
// 
//   const rows = [];
// 
//   // Near-tight singleton witnesses.
//   for (const a of [10, 25, 50, 100, 200]) {
//     const n = 2 * a - 1;
//     const m = 2 * a;
//     const dn = Math.floor(n / a) / n;
//     const dm = Math.floor(m / a) / m;
//     rows.push({
//       family: `singleton_a_${a}`,
//       n,
//       m,
//       ratio_dm_over_dn: Number((dm / dn).toPrecision(8)),
//       gap_to_2: Number((2 - dm / dn).toPrecision(8)),
//     });
//   }
// 
//   const rng = makeRng(20260303 ^ 1302);
//   let bestGlobal = { ratio: 0, n: 0, m: 0, A: [] };
//   for (let t = 0; t < 250; t += 1) {
//     const size = 2 + Math.floor(rng() * 6);
//     const Aset = new Set();
//     while (Aset.size < size) Aset.add(2 + Math.floor(rng() * 120));
//     const A = [...Aset].sort((x, y) => x - y);
//     const r = maxRatioForA(A, 20000);
//     if (r.ratio > bestGlobal.ratio) bestGlobal = { ...r, A };
//   }
// 
//   out.results.ep488 = {
//     description: 'Finite ratio profiles for density(B∩[1,m])/m relative to density at n.',
//     singleton_rows: rows,
//     random_search_best: {
//       A: bestGlobal.A,
//       ratio: Number(bestGlobal.ratio.toPrecision(8)),
//       n: bestGlobal.n,
//       m: bestGlobal.m,
//       density_n: Number(bestGlobal.density_n.toPrecision(8)),
//       density_m: Number(bestGlobal.density_m.toPrecision(8)),
//     },
//   };
// }
// ==== End Batch Split Integrations ====
