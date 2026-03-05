#!/usr/bin/env node
// Canonical per-problem script for EP-43.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-43',
  source_count: 5,
  source_files: ["ep43_search.mjs","ep43_search_bb.mjs","ep43_search_sizepair.mjs","ep43_search_targeted.mjs","ep43_search_targeted_bitset.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-43 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/5 ====
// Source: ep43_search.mjs
// Kind: current_script_file
// Label: From ep43_search.mjs
// #!/usr/bin/env node
// 
// const maxN = Number(process.argv[2] || 36);
// 
// function choose2(x) {
//   return (x * (x - 1)) / 2;
// }
// 
// function makeSidonSets(N) {
//   const sets = [];
//   const diffs = [];
// 
//   function rec(next, arr, diffSet) {
//     // record every set (including empty/singleton)
//     sets.push(arr.slice());
//     diffs.push(new Set(diffSet));
// 
//     for (let x = next; x <= N; x++) {
//       let ok = true;
//       const newDiffs = [];
//       for (let i = 0; i < arr.length; i++) {
//         const d = x - arr[i];
//         if (diffSet.has(d)) {
//           ok = false;
//           break;
//         }
//         newDiffs.push(d);
//       }
//       if (!ok) continue;
// 
//       arr.push(x);
//       for (const d of newDiffs) diffSet.add(d);
//       rec(x + 1, arr, diffSet);
//       for (const d of newDiffs) diffSet.delete(d);
//       arr.pop();
//     }
//   }
// 
//   rec(1, [], new Set());
//   return { sets, diffs };
// }
// 
// function maxSidonSize(sets) {
//   let best = 0;
//   for (const s of sets) if (s.length > best) best = s.length;
//   return best;
// }
// 
// function disjointDiffs(d1, d2) {
//   // d1,d2 are positive-difference sets; A-A and B-B intersect only at 0 iff d1,d2 disjoint
//   if (d1.size > d2.size) {
//     const tmp = d1;
//     d1 = d2;
//     d2 = tmp;
//   }
//   for (const x of d1) if (d2.has(x)) return false;
//   return true;
// }
// 
// for (let N = 2; N <= maxN; N++) {
//   const { sets, diffs } = makeSidonSets(N);
//   const fN = maxSidonSize(sets);
//   const rhs = choose2(fN);
// 
//   let best = -1;
//   let bestPair = null;
// 
//   for (let i = 0; i < sets.length; i++) {
//     const Ai = sets[i];
//     const di = diffs[i];
//     const valA = choose2(Ai.length);
//     if (valA > best) {
//       // B empty always valid, quick lower bound
//       best = valA;
//       bestPair = [Ai, []];
//     }
// 
//     for (let j = i; j < sets.length; j++) {
//       const Bj = sets[j];
//       const dj = diffs[j];
//       if (!disjointDiffs(di, dj)) continue;
//       const val = choose2(Ai.length) + choose2(Bj.length);
//       if (val > best) {
//         best = val;
//         bestPair = [Ai, Bj];
//       }
//     }
//   }
// 
//   const gap = best - rhs;
//   const [A, B] = bestPair;
//   console.log(
//     JSON.stringify({
//       N,
//       sidon_sets_count: sets.length,
//       fN,
//       rhs_choose2_fN: rhs,
//       best_lhs: best,
//       gap_best_minus_rhs: gap,
//       best_A_size: A.length,
//       best_B_size: B.length,
//       best_A: A,
//       best_B: B,
//     })
//   );
// }
// 
// ==== End Snippet ====

// ==== Integrated Snippet 2/5 ====
// Source: ep43_search_bb.mjs
// Kind: current_script_file
// Label: From ep43_search_bb.mjs
// #!/usr/bin/env node
// 
// // Exact EP-43 search with symmetry reduction + branch-and-bound.
// // Usage:
// //   node scripts/ep43_search_bb.mjs 40
// //   node scripts/ep43_search_bb.mjs 25 40
// 
// const a1 = process.argv[2];
// const a2 = process.argv[3];
// 
// let startN;
// let endN;
// if (a1 && a2) {
//   startN = Number(a1);
//   endN = Number(a2);
// } else {
//   startN = 2;
//   endN = Number(a1 || 40);
// }
// 
// if (!Number.isInteger(startN) || !Number.isInteger(endN) || startN < 2 || endN < startN) {
//   console.error('Invalid arguments. Use: node scripts/ep43_search_bb.mjs [N] or [startN endN]');
//   process.exit(1);
// }
// 
// function choose2(x) {
//   return (x * (x - 1)) / 2;
// }
// 
// function popcountBigInt(x) {
//   let c = 0;
//   let v = x;
//   while (v !== 0n) {
//     v &= v - 1n;
//     c += 1;
//   }
//   return c;
// }
// 
// function diffBit(d) {
//   // difference d in [1, N-1] -> bit (d-1)
//   return 1n << BigInt(d - 1);
// }
// 
// function canonicalSidonMasks(N) {
//   // Keep unique masks; for each mask store one representative canonical set.
//   const byMask = new Map();
//   let maxSetSize = 0;
// 
//   function put(mask, arr) {
//     const key = mask.toString();
//     if (!byMask.has(key)) {
//       byMask.set(key, {
//         mask,
//         weight: choose2(arr.length),
//         size: arr.length,
//         set: arr.slice(),
//       });
//     }
//   }
// 
//   // Empty set
//   put(0n, []);
// 
//   // Canonical non-empty sets: min element fixed to 1.
//   const arr = [1];
//   let mask = 0n;
//   put(mask, arr);
//   maxSetSize = 1;
// 
//   function rec(next) {
//     for (let x = next; x <= N; x++) {
//       let ok = true;
//       let addMask = 0n;
//       for (let i = 0; i < arr.length; i++) {
//         const d = x - arr[i];
//         const bit = diffBit(d);
//         if ((mask & bit) !== 0n || (addMask & bit) !== 0n) {
//           ok = false;
//           break;
//         }
//         addMask |= bit;
//       }
//       if (!ok) continue;
// 
//       arr.push(x);
//       mask |= addMask;
//       if (arr.length > maxSetSize) maxSetSize = arr.length;
//       put(mask, arr);
// 
//       rec(x + 1);
// 
//       mask ^= addMask;
//       arr.pop();
//     }
//   }
// 
//   rec(2);
// 
//   const entries = [...byMask.values()];
//   entries.sort((u, v) => {
//     if (v.weight !== u.weight) return v.weight - u.weight;
//     if (v.size !== u.size) return v.size - u.size;
//     return 0;
//   });
// 
//   return { entries, maxSetSize };
// }
// 
// function bestDisjointPair(entries) {
//   const m = entries.length;
//   if (m === 0) {
//     return { best: 0, i: -1, j: -1, checkedPairs: 0 };
//   }
// 
//   const topWeight = entries[0].weight;
//   let best = -1;
//   let bestI = -1;
//   let bestJ = -1;
//   let checkedPairs = 0;
// 
//   for (let i = 0; i < m; i++) {
//     const wi = entries[i].weight;
//     if (wi + topWeight < best) break;
// 
//     for (let j = i; j < m; j++) {
//       const wj = entries[j].weight;
//       const ub = wi + wj;
//       if (ub < best) break;
// 
//       checkedPairs += 1;
//       if ((entries[i].mask & entries[j].mask) === 0n) {
//         if (ub > best) {
//           best = ub;
//           bestI = i;
//           bestJ = j;
//         }
//       }
//     }
//   }
// 
//   return { best, i: bestI, j: bestJ, checkedPairs };
// }
// 
// for (let N = startN; N <= endN; N++) {
//   const t0 = Date.now();
//   const { entries, maxSetSize } = canonicalSidonMasks(N);
//   const t1 = Date.now();
// 
//   const { best, i, j, checkedPairs } = bestDisjointPair(entries);
//   const t2 = Date.now();
// 
//   const rhs = choose2(maxSetSize);
//   const A = i >= 0 ? entries[i].set : [];
//   const B = j >= 0 ? entries[j].set : [];
// 
//   const weightHistogram = {};
//   for (const e of entries) {
//     const k = String(e.weight);
//     weightHistogram[k] = (weightHistogram[k] || 0) + 1;
//   }
// 
//   console.log(
//     JSON.stringify({
//       N,
//       canonical_masks_count: entries.length,
//       fN: maxSetSize,
//       rhs_choose2_fN: rhs,
//       best_lhs: best,
//       gap_best_minus_rhs: best - rhs,
//       best_A_size: A.length,
//       best_B_size: B.length,
//       best_A: A,
//       best_B: B,
//       checked_pairs: checkedPairs,
//       gen_ms: t1 - t0,
//       pair_ms: t2 - t1,
//       total_ms: t2 - t0,
//       top_weight: entries[0]?.weight ?? 0,
//       top_weight_count: weightHistogram[String(entries[0]?.weight ?? 0)] || 0,
//     })
//   );
// }
// 
// ==== End Snippet ====

// ==== Integrated Snippet 3/5 ====
// Source: ep43_search_sizepair.mjs
// Kind: current_script_file
// Label: From ep43_search_sizepair.mjs
// #!/usr/bin/env node
// 
// // Exact existence search for EP-43 given sizes |A|=aSize, |B|=bSize.
// // Backtracks A (with min=1) and for each candidate A, searches B with disjoint differences.
// //
// // Usage:
// //   N=80 ASIZE=11 BSIZE=10 node scripts/ep43_search_sizepair.mjs
// 
// const N = Number(process.env.N || 80);
// const ASIZE = Number(process.env.ASIZE || 11);
// const BSIZE = Number(process.env.BSIZE || 10);
// 
// if (!Number.isInteger(N) || N < 2 || !Number.isInteger(ASIZE) || !Number.isInteger(BSIZE)) {
//   console.error('Usage: N=80 ASIZE=11 BSIZE=10 node scripts/ep43_search_sizepair.mjs');
//   process.exit(1);
// }
// 
// const U = N - 1;
// const WORDS = Math.ceil(U / 32);
// 
// function makeMask() {
//   return new Uint32Array(WORDS);
// }
// 
// function setBit(mask, d) {
//   const idx = (d - 1) >>> 5;
//   const bit = 1 << ((d - 1) & 31);
//   mask[idx] |= bit;
// }
// 
// function testBit(mask, d) {
//   const idx = (d - 1) >>> 5;
//   const bit = 1 << ((d - 1) & 31);
//   return (mask[idx] & bit) !== 0;
// }
// 
// function addDiffs(arr, x, used) {
//   const add = makeMask();
//   for (let i = 0; i < arr.length; i += 1) {
//     const d = Math.abs(x - arr[i]);
//     if (d === 0) continue;
//     if (testBit(used, d) || testBit(add, d)) return null;
//     setBit(add, d);
//   }
//   return add;
// }
// 
// function applyMask(dst, add) {
//   for (let i = 0; i < WORDS; i += 1) dst[i] |= add[i];
// }
// 
// function removeMask(dst, add) {
//   for (let i = 0; i < WORDS; i += 1) dst[i] ^= add[i];
// }
// 
// const usedA = makeMask();
// let best = null;
// let nodesA = 0;
// let nodesB = 0;
// 
// function searchB(A, used, start, B) {
//   if (best) return true;
//   if (B.length === BSIZE) {
//     best = { A: A.slice(), B: B.slice() };
//     return true;
//   }
//   const remaining = N - start + 1;
//   if (B.length + remaining < BSIZE) return false;
// 
//   nodesB += 1;
//   for (let x = start; x <= N; x += 1) {
//     const add = addDiffs(B, x, used);
//     if (!add) continue;
//     applyMask(used, add);
//     B.push(x);
//     if (searchB(A, used, x + 1, B)) return true;
//     B.pop();
//     removeMask(used, add);
//   }
//   return false;
// }
// 
// function searchA(start, A) {
//   if (best) return true;
//   if (A.length === ASIZE) {
//     const used = Uint32Array.from(usedA);
//     return searchB(A, used, 1, []);
//   }
//   const remaining = N - start + 1;
//   if (A.length + remaining < ASIZE) return false;
// 
//   nodesA += 1;
//   for (let x = start; x <= N; x += 1) {
//     const add = addDiffs(A, x, usedA);
//     if (!add) continue;
//     applyMask(usedA, add);
//     A.push(x);
//     if (searchA(x + 1, A)) return true;
//     A.pop();
//     removeMask(usedA, add);
//   }
//   return false;
// }
// 
// const t0 = Date.now();
// const A = [1];
// searchA(2, A);
// const t1 = Date.now();
// 
// console.log(JSON.stringify({
//   N,
//   ASIZE,
//   BSIZE,
//   found: Boolean(best),
//   witness: best,
//   nodesA,
//   nodesB,
//   runtime_ms: t1 - t0,
// }, null, 2));
// 
// ==== End Snippet ====

// ==== Integrated Snippet 4/5 ====
// Source: ep43_search_targeted.mjs
// Kind: current_script_file
// Label: From ep43_search_targeted.mjs
// #!/usr/bin/env node
// 
// // Targeted exact solver for EP-43 at larger N.
// // Uses canonical Sidon masks + weight-class disjointness checks.
// //
// // Usage:
// //   node scripts/ep43_search_targeted.mjs 50
// 
// const N = Number(process.argv[2] || 50);
// if (!Number.isInteger(N) || N < 2) {
//   console.error('Usage: node scripts/ep43_search_targeted.mjs <N>=50');
//   process.exit(1);
// }
// 
// const U = N - 1; // difference universe size: {1,...,N-1}
// const U_MASK = (1n << BigInt(U)) - 1n;
// const MASK16 = (1n << 16n) - 1n;
// 
// function choose2(x) {
//   return (x * (x - 1)) / 2;
// }
// 
// function diffBit(d) {
//   return 1n << BigInt(d - 1);
// }
// 
// function buildPopcount16() {
//   const pc = new Uint8Array(1 << 16);
//   for (let i = 1; i < pc.length; i++) pc[i] = pc[i >> 1] + (i & 1);
//   return pc;
// }
// 
// const POP16 = buildPopcount16();
// 
// function canonicalEntries(N) {
//   const byMask = new Map();
//   const arr = [];
//   let mask = 0n;
// 
//   function putCurrent() {
//     const key = mask.toString();
//     if (!byMask.has(key)) {
//       byMask.set(key, {
//         mask,
//         size: arr.length,
//         weight: choose2(arr.length),
//         set: arr.slice(),
//       });
//     }
//   }
// 
//   // Empty set
//   putCurrent();
// 
//   // Canonical non-empty sets: minimum fixed to 1.
//   arr.push(1);
//   putCurrent();
// 
//   function rec(next) {
//     for (let x = next; x <= N; x++) {
//       let ok = true;
//       let addMask = 0n;
//       for (let i = 0; i < arr.length; i++) {
//         const bit = diffBit(x - arr[i]);
//         if ((mask & bit) !== 0n || (addMask & bit) !== 0n) {
//           ok = false;
//           break;
//         }
//         addMask |= bit;
//       }
//       if (!ok) continue;
// 
//       arr.push(x);
//       mask |= addMask;
//       putCurrent();
//       rec(x + 1);
//       mask ^= addMask;
//       arr.pop();
//     }
//   }
// 
//   rec(2);
//   arr.pop();
// 
//   const entries = [...byMask.values()];
//   return { entries, byMask };
// }
// 
// function byWeight(entries) {
//   const map = new Map();
//   for (const e of entries) {
//     if (!map.has(e.weight)) map.set(e.weight, []);
//     map.get(e.weight).push(e);
//   }
//   return map;
// }
// 
// function weightPairsForSum(sum, weightsDesc) {
//   const pairs = [];
//   for (let i = 0; i < weightsDesc.length; i++) {
//     const wa = weightsDesc[i];
//     const wb = sum - wa;
//     if (wb > wa) continue;
//     if (!weightsDesc.includes(wb)) continue;
//     pairs.push([wa, wb]);
//   }
//   return pairs;
// }
// 
// function bruteExistsDisjoint(A, B, sameClass) {
//   if (!sameClass) {
//     for (let i = 0; i < A.length; i++) {
//       const a = A[i];
//       for (let j = 0; j < B.length; j++) {
//         const b = B[j];
//         if ((a.mask & b.mask) === 0n) return [a, b];
//       }
//     }
//     return null;
//   }
// 
//   for (let i = 0; i < A.length; i++) {
//     const a = A[i];
//     for (let j = i + 1; j < A.length; j++) {
//       const b = A[j];
//       if ((a.mask & b.mask) === 0n) return [a, b];
//     }
//   }
//   return null;
// }
// 
// function buildChunkIndex(B) {
//   const low = new Map();
//   const mid = new Map();
// 
//   for (const b of B) {
//     const kLow = Number(b.mask & MASK16);
//     const kMid = Number((b.mask >> 16n) & MASK16);
// 
//     if (!low.has(kLow)) low.set(kLow, []);
//     if (!mid.has(kMid)) mid.set(kMid, []);
//     low.get(kLow).push(b);
//     mid.get(kMid).push(b);
//   }
// 
//   return { low, mid };
// }
// 
// function existsDisjointIndexed(A, B, sameClass) {
//   const { low, mid } = buildChunkIndex(B);
// 
//   function testList(a, list) {
//     if (!list) return null;
//     for (let i = 0; i < list.length; i++) {
//       const b = list[i];
//       if (sameClass && a.mask === b.mask) continue;
//       if ((a.mask & b.mask) === 0n) return [a, b];
//     }
//     return null;
//   }
// 
//   for (let i = 0; i < A.length; i++) {
//     const a = A[i];
//     const c = U_MASK ^ a.mask;
// 
//     const cLow = Number(c & MASK16);
//     const cMid = Number((c >> 16n) & MASK16);
//     const tLow = POP16[cLow];
//     const tMid = POP16[cMid];
// 
//     if (tLow <= tMid) {
//       for (let s = cLow; ; s = (s - 1) & cLow) {
//         const hit = testList(a, low.get(s));
//         if (hit) return hit;
//         if (s === 0) break;
//       }
//     } else {
//       for (let s = cMid; ; s = (s - 1) & cMid) {
//         const hit = testList(a, mid.get(s));
//         if (hit) return hit;
//         if (s === 0) break;
//       }
//     }
//   }
// 
//   return null;
// }
// 
// function existsDisjoint(A, B, sameClass) {
//   const pairCount = sameClass
//     ? (A.length * (A.length - 1)) / 2
//     : A.length * B.length;
// 
//   // Cheap direct scan when candidate space is modest.
//   if (pairCount <= 5e7) {
//     return bruteExistsDisjoint(A, B, sameClass);
//   }
// 
//   // For large candidate space, use chunk-indexed disjoint lookup.
//   return existsDisjointIndexed(A, B, sameClass);
// }
// 
// const t0 = Date.now();
// const { entries } = canonicalEntries(N);
// const t1 = Date.now();
// 
// const weightMap = byWeight(entries);
// const weights = [...weightMap.keys()].sort((a, b) => b - a);
// let fN = 0;
// for (const e of entries) {
//   if (e.size > fN) fN = e.size;
// }
// const rhs = choose2(fN);
// 
// // Candidate sums are exactly sums of two existing weights, bounded by U.
// const candidateSums = [...new Set(
//   weights.flatMap((wa) => weights.map((wb) => wa + wb))
// )]
//   .filter((s) => s <= U)
//   .sort((a, b) => b - a);
// 
// let best = -1;
// let bestPair = null;
// let bestWeightPair = null;
// const checks = [];
// 
// for (const sum of candidateSums) {
//   const pairs = weightPairsForSum(sum, weights);
//   let foundForSum = null;
//   let foundWeightPair = null;
// 
//   for (const [wa, wb] of pairs) {
//     const A = weightMap.get(wa) || [];
//     const B = weightMap.get(wb) || [];
//     if (A.length === 0 || B.length === 0) continue;
// 
//     const sameClass = wa === wb;
//     const tStart = Date.now();
//     const found = existsDisjoint(A, B, sameClass);
//     const tEnd = Date.now();
// 
//     checks.push({
//       sum,
//       wa,
//       wb,
//       countA: A.length,
//       countB: B.length,
//       found: Boolean(found),
//       check_ms: tEnd - tStart,
//     });
// 
//     if (found) {
//       foundForSum = found;
//       foundWeightPair = [wa, wb];
//       break;
//     }
//   }
// 
//   if (foundForSum) {
//     best = sum;
//     bestPair = foundForSum;
//     bestWeightPair = foundWeightPair;
//     break;
//   }
// }
// 
// const t2 = Date.now();
// 
// if (bestPair == null) {
//   console.error('No disjoint pair found at any candidate sum (unexpected).');
//   process.exit(2);
// }
// 
// const [A, B] = bestPair;
// 
// const result = {
//   N,
//   universe_differences: U,
//   canonical_masks_count: entries.length,
//   fN,
//   rhs_choose2_fN: rhs,
//   best_lhs: best,
//   gap_best_minus_rhs: best - rhs,
//   best_weight_pair: bestWeightPair,
//   best_A_size: A.size,
//   best_B_size: B.size,
//   best_A: A.set,
//   best_B: B.set,
//   candidate_sums_desc: candidateSums,
//   checks,
//   generation_ms: t1 - t0,
//   solve_ms: t2 - t1,
//   total_ms: t2 - t0,
//   method: 'targeted_weight_sum_exact_v1',
// };
// 
// console.log(JSON.stringify(result, null, 2));
// 
// ==== End Snippet ====

// ==== Integrated Snippet 5/5 ====
// Source: ep43_search_targeted_bitset.mjs
// Kind: current_script_file
// Label: From ep43_search_targeted_bitset.mjs
// #!/usr/bin/env node
// 
// // Targeted exact solver for EP-43 using compact bitset masks and size filtering.
// // Generates canonical Sidon sets with min=1 and size >= MIN_SIZE, then searches
// // for disjoint-difference pairs achieving maximum choose2(|A|)+choose2(|B|).
// //
// // Usage:
// //   N=80 MIN_SIZE=9 node scripts/ep43_search_targeted_bitset.mjs
// 
// import fs from 'node:fs';
// 
// const N = Number(process.env.N || 80);
// const MIN_SIZE = Number(process.env.MIN_SIZE || 8);
// const MAX_SIZE = Number(process.env.MAX_SIZE || 0);
// if (!Number.isInteger(N) || N < 2) {
//   console.error('Usage: N=80 MIN_SIZE=8 node scripts/ep43_search_targeted_bitset.mjs');
//   process.exit(1);
// }
// if (!Number.isInteger(MIN_SIZE) || MIN_SIZE < 1) {
//   console.error('MIN_SIZE must be an integer >=1');
//   process.exit(1);
// }
// if (MAX_SIZE && (!Number.isInteger(MAX_SIZE) || MAX_SIZE < MIN_SIZE)) {
//   console.error('MAX_SIZE must be 0 (unset) or an integer >= MIN_SIZE');
//   process.exit(1);
// }
// 
// const U = N - 1;
// const WORDS = Math.ceil(U / 32);
// 
// function choose2(x) {
//   return (x * (x - 1)) / 2;
// }
// 
// function makeMask() {
//   return new Uint32Array(WORDS);
// }
// 
// function setBit(mask, d) {
//   const idx = (d - 1) >>> 5;
//   const bit = 1 << ((d - 1) & 31);
//   mask[idx] |= bit;
// }
// 
// function testBit(mask, d) {
//   const idx = (d - 1) >>> 5;
//   const bit = 1 << ((d - 1) & 31);
//   return (mask[idx] & bit) !== 0;
// }
// 
// function maskAndNonzero(a, b) {
//   for (let i = 0; i < WORDS; i += 1) if ((a[i] & b[i]) !== 0) return true;
//   return false;
// }
// 
// function maskKey(mask) {
//   let s = '';
//   for (let i = 0; i < WORDS; i += 1) {
//     if (i) s += ',';
//     s += mask[i];
//   }
//   return s;
// }
// 
// function maxSidonSizeFromProfile(n) {
//   try {
//     const data = JSON.parse(fs.readFileSync('data/ep155_increment_profile_exact_to72.json', 'utf8'));
//     const row = data.rows.find((r) => r.N === n);
//     return row ? row.fN : null;
//   } catch {
//     return null;
//   }
// }
// 
// const fN = maxSidonSizeFromProfile(N);
// const effectiveMinSize = Math.max(MIN_SIZE, fN ? Math.max(2, fN - 2) : MIN_SIZE);
// const effectiveMaxSize = MAX_SIZE || (fN ? fN : N);
// 
// const byWeight = new Map();
// 
// const current = [1];
// const used = makeMask();
// 
// function addEntry(mask, set) {
//   const size = set.length;
//   if (size < effectiveMinSize || size > effectiveMaxSize) return;
//   const w = choose2(size);
//   const key = maskKey(mask);
//   if (!byWeight.has(w)) byWeight.set(w, { list: [], seen: new Set() });
//   const bucket = byWeight.get(w);
//   if (bucket.seen.has(key)) return;
//   bucket.seen.add(key);
//   bucket.list.push({ mask: Uint32Array.from(mask), set: set.slice(), size });
// }
// 
// function rec(next) {
//   const remaining = N - next + 1;
//   if (current.length > effectiveMaxSize) return;
//   if (current.length + remaining < effectiveMinSize) return;
// 
//   addEntry(used, current);
// 
//   for (let x = next; x <= N; x += 1) {
//     let ok = true;
//     const add = makeMask();
//     for (let i = 0; i < current.length; i += 1) {
//       const d = x - current[i];
//       if (testBit(used, d) || testBit(add, d)) {
//         ok = false;
//         break;
//       }
//       setBit(add, d);
//     }
//     if (!ok) continue;
// 
//     for (let i = 0; i < WORDS; i += 1) used[i] |= add[i];
//     current.push(x);
//     rec(x + 1);
//     current.pop();
//     for (let i = 0; i < WORDS; i += 1) used[i] ^= add[i];
//   }
// }
// 
// const t0 = Date.now();
// rec(2);
// const t1 = Date.now();
// 
// const weights = [...byWeight.keys()].sort((a, b) => b - a);
// 
// function weightPairs(sum) {
//   const pairs = [];
//   for (let i = 0; i < weights.length; i += 1) {
//     const wa = weights[i];
//     if (wa > sum) continue;
//     const wb = sum - wa;
//     if (wb > wa) continue;
//     if (!byWeight.has(wb)) continue;
//     pairs.push([wa, wb]);
//   }
//   return pairs;
// }
// 
// function existsDisjoint(A, B, sameClass) {
//   if (!sameClass) {
//     for (let i = 0; i < A.length; i += 1) {
//       const a = A[i];
//       for (let j = 0; j < B.length; j += 1) {
//         const b = B[j];
//         if (!maskAndNonzero(a.mask, b.mask)) return [a, b];
//       }
//     }
//     return null;
//   }
//   for (let i = 0; i < A.length; i += 1) {
//     const a = A[i];
//     for (let j = i + 1; j < A.length; j += 1) {
//       const b = A[j];
//       if (!maskAndNonzero(a.mask, b.mask)) return [a, b];
//     }
//   }
//   return null;
// }
// 
// const candidateSums = [...new Set(
//   weights.flatMap((wa) => weights.map((wb) => wa + wb))
// )]
//   .filter((s) => s <= U)
//   .sort((a, b) => b - a);
// 
// let best = -1;
// let bestPair = null;
// let bestWeightPair = null;
// const checks = [];
// 
// for (const sum of candidateSums) {
//   const pairs = weightPairs(sum);
//   let foundForSum = null;
//   let foundWeightPair = null;
// 
//   for (const [wa, wb] of pairs) {
//     const A = byWeight.get(wa).list;
//     const B = byWeight.get(wb).list;
//     if (A.length === 0 || B.length === 0) continue;
//     const sameClass = wa === wb;
//     const tStart = Date.now();
//     const found = existsDisjoint(A, B, sameClass);
//     const tEnd = Date.now();
//     checks.push({ sum, wa, wb, countA: A.length, countB: B.length, found: Boolean(found), check_ms: tEnd - tStart });
//     if (found) {
//       foundForSum = found;
//       foundWeightPair = [wa, wb];
//       break;
//     }
//   }
// 
//   if (foundForSum) {
//     best = sum;
//     bestPair = foundForSum;
//     bestWeightPair = foundWeightPair;
//     break;
//   }
// }
// 
// const t2 = Date.now();
// 
// if (!bestPair) {
//   console.error('No disjoint pair found with current size filter; try lowering MIN_SIZE.');
//   process.exit(2);
// }
// 
// const [A, B] = bestPair;
// 
// const result = {
//   N,
//   min_size: effectiveMinSize,
//   fN_est: fN,
//   universe_differences: U,
//   weights_considered: weights,
//   candidate_sums_desc: candidateSums,
//   best_lhs: best,
//   best_weight_pair: bestWeightPair,
//   best_A_size: A.size,
//   best_B_size: B.size,
//   best_A: A.set,
//   best_B: B.set,
//   checks,
//   generation_ms: t1 - t0,
//   solve_ms: t2 - t1,
//   total_ms: t2 - t0,
//   method: 'targeted_weight_sum_exact_bitset_v1',
// };
// 
// console.log(JSON.stringify(result, null, 2));
// 
// ==== End Snippet ====

