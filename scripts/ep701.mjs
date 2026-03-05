#!/usr/bin/env node
const meta={problem:'EP-701',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-701 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch17_quick_compute.mjs | random finite downset checks against the star-max intersecting property. ----
// // EP-701: random finite downset checks against the star-max intersecting property.
// {
//   const rng = makeRng(20260304 ^ 1704);
// 
//   function randomDownset(n, maxSets = 24) {
//     const universe = 1 << n;
// 
//     for (let attempt = 0; attempt < 200; attempt += 1) {
//       const tops = [];
//       const topCount = 1 + Math.floor(rng() * (n + 2));
// 
//       for (let t = 0; t < topCount; t += 1) {
//         // Prefer small-support maxima so closure stays tractable.
//         let m = 0;
//         for (let b = 0; b < n; b += 1) {
//           if (rng() < 0.35) m |= 1 << b;
//         }
//         if (m >= universe) m = universe - 1;
//         tops.push(m);
//       }
// 
//       const F = new Set([0]);
//       for (const m of tops) {
//         let s = m;
//         while (true) {
//           F.add(s);
//           if (s === 0) break;
//           s = (s - 1) & m;
//         }
//       }
// 
//       if (F.size <= maxSets) return [...F];
//     }
// 
//     // Guaranteed downset fallback.
//     return [0];
//   }
// 
//   function maxIntersectingExact(family) {
//     const fam = family.filter((s) => s !== 0); // standard intersecting-family convention excludes the empty set
//     const m = fam.length;
//     let best = 0;
// 
//     function dfs(i, chosen) {
//       if (chosen + (m - i) <= best) return;
//       if (i === m) {
//         if (chosen > best) best = chosen;
//         return;
//       }
// 
//       // skip
//       dfs(i + 1, chosen);
// 
//       // take if intersecting with all currently selected
//       const x = fam[i];
//       let ok = true;
//       for (let j = 0; j < i; j += 1) {
//         if (!((maskChosen >> BigInt(j)) & 1n)) continue;
//         if ((x & fam[j]) === 0) {
//           ok = false;
//           break;
//         }
//       }
//       if (ok) {
//         maskChosen |= 1n << BigInt(i);
//         dfs(i + 1, chosen + 1);
//         maskChosen &= ~(1n << BigInt(i));
//       }
//     }
// 
//     let maskChosen = 0n;
//     dfs(0, 0);
//     return best;
//   }
// 
//   function bestStar(family, n) {
//     let best = 0;
//     for (let x = 0; x < n; x += 1) {
//       const b = 1 << x;
//       let c = 0;
//       for (const s of family) if (s & b) c += 1;
//       if (c > best) best = c;
//     }
//     return best;
//   }
// 
//   const rows = [];
//   for (const [n, samples] of [[5, 60], [6, 60], [7, 50]]) {
//     let violations = 0;
//     let avgGap = 0;
// 
//     for (let t = 0; t < samples; t += 1) {
//       const F = randomDownset(n, 24);
//       const mInt = maxIntersectingExact(F);
//       const star = bestStar(F, n);
//       const gap = star - mInt;
//       avgGap += gap;
//       if (gap < 0) violations += 1;
//     }
// 
//     rows.push({
//       n,
//       samples,
//       max_family_size_sampled: 24,
//       violations_of_star_bound: violations,
//       avg_star_minus_max_intersecting: Number((avgGap / samples).toPrecision(7)),
//     });
//   }
// 
//   out.results.ep701 = {
//     description: 'Finite random-downset checks for Chvatal-type star dominance.',
//     rows,
//   };
// }
// ==== End Batch Split Integrations ====
