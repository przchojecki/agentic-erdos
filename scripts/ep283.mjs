#!/usr/bin/env node
const meta={problem:'EP-283',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-283 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch9_quick_compute.mjs | random split-generated Egyptian decompositions of 1; induced polynomial-sum coverage proxies. ----
// // EP-283: random split-generated Egyptian decompositions of 1; induced polynomial-sum coverage proxies.
// {
//   function splitStep(D, maxDen) {
//     const present = new Set(D);
//     const options = [];
//     for (let i = 0; i < D.length; i += 1) {
//       const d = D[i];
//       const a = d + 1;
//       const b = d * (d + 1);
//       if (b > maxDen) continue;
//       if (present.has(a) || present.has(b)) continue;
//       options.push(i);
//     }
//     if (!options.length) return false;
//     const i = options[Math.floor(rng() * options.length)];
//     const d = D[i];
//     D.splice(i, 1, d + 1, d * (d + 1));
//     D.sort((x, y) => x - y);
//     return true;
//   }
// 
//   const m1Set = new Set();
//   const m2Set = new Set();
//   let bestTerms = 0;
// 
//   const restarts = 6000;
//   const maxSteps = 14;
//   const maxDen = 200000;
// 
//   for (let r = 0; r < restarts; r += 1) {
//     const D = [2, 3, 6];
//     const steps = 1 + Math.floor(rng() * maxSteps);
//     for (let s = 0; s < steps; s += 1) {
//       if (!splitStep(D, maxDen)) break;
//     }
// 
//     let m1 = 0;
//     let m2 = 0;
//     for (const d of D) {
//       m1 += d;
//       m2 += d * d;
//     }
//     m1Set.add(m1);
//     m2Set.add(m2);
//     if (D.length > bestTerms) bestTerms = D.length;
//   }
// 
//   function coverageStats(set, M, tail) {
//     let c = 0;
//     let t = 0;
//     for (let x = 1; x <= M; x += 1) {
//       if (set.has(x)) c += 1;
//       if (x > M - tail && set.has(x)) t += 1;
//     }
//     return {
//       M,
//       covered_count: c,
//       covered_density: Number((c / M).toPrecision(6)),
//       tail_window: tail,
//       tail_density: Number((t / tail).toPrecision(6)),
//     };
//   }
// 
//   out.results.ep283 = {
//     description: 'Random split-generated Egyptian decompositions and resulting m=Σp(n_i) coverage proxies for p(x)=x and p(x)=x^2.',
//     generation: { restarts, maxSteps, maxDen, best_terms_found: bestTerms },
//     linear_p_of_x_rows: [
//       coverageStats(m1Set, 10000, 2000),
//       coverageStats(m1Set, 25000, 5000),
//       coverageStats(m1Set, 50000, 10000),
//     ],
//     quadratic_p_of_x_rows: [
//       coverageStats(m2Set, 20000, 4000),
//       coverageStats(m2Set, 50000, 10000),
//       coverageStats(m2Set, 100000, 20000),
//     ],
//   };
// }
// ==== End Batch Split Integrations ====
