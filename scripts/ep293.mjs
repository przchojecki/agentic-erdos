#!/usr/bin/env node
const meta={problem:'EP-293',source_count:0,source_files:[]};
if(process.argv.includes('--json')) console.log(JSON.stringify(meta,null,2));
else {console.log('EP-293 canonical script');console.log('Integrated sections: 0');}
// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/harder_batch9_quick_compute.mjs | small-k exact denominator-appearance profile in Egyptian decompositions of 1. ----
// // EP-293: small-k exact denominator-appearance profile in Egyptian decompositions of 1.
// {
//   function collectDenominatorsForK(k, maxDen) {
//     const usedDenoms = new Set();
//     let solutionCount = 0;
// 
//     function dfs(num, den, start, termsLeft, chosen) {
//       if (termsLeft === 1) {
//         if (num <= 0n) return;
//         if (den % num !== 0n) return;
//         const d = Number(den / num);
//         if (!Number.isFinite(d) || d < start || d > maxDen) return;
//         solutionCount += 1;
//         for (const x of chosen) usedDenoms.add(x);
//         usedDenoms.add(d);
//         return;
//       }
// 
//       // Upper-bound pruning: with termsLeft denominators >= start, total <= termsLeft/start.
//       if (num * BigInt(start) > den * BigInt(termsLeft)) return;
// 
//       let dMin = Number(ceilDivBig(den, num));
//       if (dMin < start) dMin = start;
// 
//       for (let d = dMin; d <= maxDen; d += 1) {
//         const bd = BigInt(d);
//         const newNumRaw = num * bd - den;
//         if (newNumRaw <= 0n) continue;
//         const newDenRaw = den * bd;
//         const [newNum, newDen] = reduceFrac(newNumRaw, newDenRaw);
// 
//         const t = termsLeft - 1;
//         if (newNum * BigInt(d + 1) > newDen * BigInt(t)) continue;
// 
//         chosen.push(d);
//         dfs(newNum, newDen, d + 1, t, chosen);
//         chosen.pop();
//       }
//     }
// 
//     dfs(1n, 1n, 2, k, []);
// 
//     let vProxy = 2;
//     while (usedDenoms.has(vProxy)) vProxy += 1;
// 
//     return {
//       k,
//       max_denom_searched: maxDen,
//       solution_count: solutionCount,
//       distinct_denominators_seen: usedDenoms.size,
//       v_proxy_min_missing_from_2: vProxy,
//     };
//   }
// 
//   const rows = [
//     collectDenominatorsForK(3, 400),
//     collectDenominatorsForK(4, 800),
//     collectDenominatorsForK(5, 1500),
//     collectDenominatorsForK(6, 2200),
//   ];
// 
//   out.results.ep293 = {
//     description: 'Exact finite-k denominator-appearance scan for 1=sum 1/n_i, yielding a proxy for v(k).',
//     rows,
//   };
// }
// 
// // Shared DFS for EP-304 style Egyptian length search (all denominators >1, distinct).
// function minEgyptLengthGeneral(targetNum, targetDen, cfg) {
//   const { maxDen, kMax } = cfg;
// 
//   function canAtDepth(num, den, start, termsLeft, memo) {
//     const key = `${num}/${den}|${start}|${termsLeft}`;
//     if (memo.has(key)) return memo.get(key);
// 
//     if (termsLeft === 1) {
//       if (num <= 0n || den % num !== 0n) {
//         memo.set(key, false);
//         return false;
//       }
//       const d = Number(den / num);
//       const ok = Number.isFinite(d) && d >= start && d <= maxDen && d > 1;
//       memo.set(key, ok);
//       return ok;
//     }
// 
//     if (num * BigInt(start) > den * BigInt(termsLeft)) {
//       memo.set(key, false);
//       return false;
//     }
// 
//     let dMin = Number(ceilDivBig(den, num));
//     if (dMin < start) dMin = start;
// 
//     for (let d = dMin; d <= maxDen; d += 1) {
//       const bd = BigInt(d);
//       const newNumRaw = num * bd - den;
//       if (newNumRaw <= 0n) continue;
//       const newDenRaw = den * bd;
//       const [newNum, newDen] = reduceFrac(newNumRaw, newDenRaw);
//       const t = termsLeft - 1;
//       if (newNum * BigInt(d + 1) > newDen * BigInt(t)) continue;
//       if (canAtDepth(newNum, newDen, d + 1, t, memo)) {
//         memo.set(key, true);
//         return true;
//       }
//     }
// 
//     memo.set(key, false);
//     return false;
//   }
// 
//   const [num0, den0] = reduceFrac(BigInt(targetNum), BigInt(targetDen));
//   for (let k = 1; k <= kMax; k += 1) {
//     const memo = new Map();
//     if (canAtDepth(num0, den0, 2, k, memo)) return k;
//   }
//   return null;
// }
// ==== End Batch Split Integrations ====
