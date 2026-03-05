#!/usr/bin/env node
// Canonical per-problem script for EP-42.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-42',
  source_count: 3,
  source_files: ["ep42_m3_counterexample_search.mjs","ep42_m3_exact_threshold_scan.mjs","ep42_scan_smallN.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-42 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/3 ====
// Source: ep42_m3_counterexample_search.mjs
// Kind: current_script_file
// Label: From ep42_m3_counterexample_search.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-42 focused search for M=3 counterexamples at larger N.
// // We seek a Sidon set A subset [1..N] such that there is NO Sidon triple
// // B={x<y<z} with (A-A) ∩ (B-B) = {0}.
// //
// // For triples B, this is equivalent to:
// // there are no distinct a,b in C with a+b in C, where
// // C = {1,...,N-1} \ D(A), D(A)=positive differences of A.
// //
// // So we search Sidon A minimizing the count of distinct Schur triples in C.
// 
// const N_LIST = (process.env.N_LIST || '64,72,80,96,120')
//   .split(',')
//   .map((x) => Number(x.trim()))
//   .filter((x) => Number.isInteger(x) && x >= 10);
// const M_MIN = Number(process.env.M_MIN || 8);
// const M_MAX = Number(process.env.M_MAX || 18);
// const RESTARTS = Number(process.env.RESTARTS || 60);
// const STEPS = Number(process.env.STEPS || 18000);
// const SEED = Number(process.env.SEED || 20260303);
// const VERIFY_DIRECT = Number(process.env.VERIFY_DIRECT || 1) !== 0;
// 
// function makeRng(seed) {
//   let x = (seed >>> 0) || 1;
//   return () => {
//     x ^= x << 13;
//     x ^= x >>> 17;
//     x ^= x << 5;
//     return (x >>> 0) / 4294967296;
//   };
// }
// 
// function shuffleInPlace(arr, rng) {
//   for (let i = arr.length - 1; i > 0; i -= 1) {
//     const j = Math.floor(rng() * (i + 1));
//     const t = arr[i];
//     arr[i] = arr[j];
//     arr[j] = t;
//   }
// }
// 
// function buildDiffUsed(A, N) {
//   const used = new Uint8Array(N);
//   for (let i = 0; i < A.length; i += 1) {
//     for (let j = i + 1; j < A.length; j += 1) {
//       const d = Math.abs(A[j] - A[i]);
//       if (d <= 0 || d >= N || used[d]) return null;
//       used[d] = 1;
//     }
//   }
//   return used;
// }
// 
// function randomSidonSet(N, m, rng) {
//   const base = Array.from({ length: N }, (_, i) => i + 1);
//   for (let attempt = 0; attempt < 300; attempt += 1) {
//     const perm = base.slice();
//     shuffleInPlace(perm, rng);
//     const A = [];
//     const used = new Uint8Array(N);
// 
//     for (const x of perm) {
//       let ok = true;
//       const toAdd = [];
//       for (const y of A) {
//         const d = Math.abs(x - y);
//         if (used[d]) {
//           ok = false;
//           break;
//         }
//         toAdd.push(d);
//       }
//       if (!ok) continue;
//       A.push(x);
//       for (const d of toAdd) used[d] = 1;
//       if (A.length >= m) break;
//     }
// 
//     if (A.length >= m) {
//       A.length = m;
//       A.sort((a, b) => a - b);
//       return A;
//     }
//   }
//   return null;
// }
// 
// function evaluateBadDistinctSchur(usedDiff, N) {
//   const inC = new Uint8Array(N);
//   let cSize = 0;
//   for (let d = 1; d <= N - 1; d += 1) {
//     if (!usedDiff[d]) {
//       inC[d] = 1;
//       cSize += 1;
//     }
//   }
// 
//   let bad = 0;
//   let sample = null;
//   for (let a = 1; a <= N - 1; a += 1) {
//     if (!inC[a]) continue;
//     for (let b = a + 1; a + b <= N - 1; b += 1) {
//       if (!inC[b]) continue;
//       if (inC[a + b]) {
//         bad += 1;
//         if (!sample) sample = [a, b, a + b];
//       }
//     }
//   }
// 
//   return { bad, cSize, sample };
// }
// 
// function directWitnessB(usedDiff, N) {
//   for (let x = 1; x <= N - 2; x += 1) {
//     for (let y = x + 1; y <= N - 1; y += 1) {
//       const d1 = y - x;
//       if (usedDiff[d1]) continue;
//       for (let z = y + 1; z <= N; z += 1) {
//         const d2 = z - y;
//         const d3 = z - x;
//         if (d1 === d2) continue; // non-Sidon triple (3-term AP)
//         if (!usedDiff[d2] && !usedDiff[d3]) {
//           return { B: [x, y, z], differences: [d1, d2, d3] };
//         }
//       }
//     }
//   }
//   return null;
// }
// 
// function hasDuplicateValues(A) {
//   for (let i = 1; i < A.length; i += 1) if (A[i] === A[i - 1]) return true;
//   return false;
// }
// 
// const rng = makeRng(SEED);
// const results = [];
// 
// for (const N of N_LIST) {
//   const started = Date.now();
//   let globalBest = null;
//   let foundExact = null;
//   const tried = [];
// 
//   for (let m = M_MIN; m <= M_MAX; m += 1) {
//     let bestForM = null;
// 
//     for (let r = 0; r < RESTARTS; r += 1) {
//       let cur = randomSidonSet(N, m, rng);
//       if (!cur) continue;
//       let curUsed = buildDiffUsed(cur, N);
//       if (!curUsed) continue;
//       let curEval = evaluateBadDistinctSchur(curUsed, N);
// 
//       let bestLocal = { A: cur.slice(), used: curUsed, ...curEval };
// 
//       for (let step = 0; step < STEPS; step += 1) {
//         const idx = Math.floor(rng() * m);
//         let x = 1 + Math.floor(rng() * N);
//         let guard = 0;
//         while (cur.includes(x) && guard < 25) {
//           x = 1 + Math.floor(rng() * N);
//           guard += 1;
//         }
//         if (cur.includes(x)) continue;
// 
//         const cand = cur.slice();
//         cand[idx] = x;
//         cand.sort((a, b) => a - b);
//         if (hasDuplicateValues(cand)) continue;
// 
//         const candUsed = buildDiffUsed(cand, N);
//         if (!candUsed) continue;
//         const candEval = evaluateBadDistinctSchur(candUsed, N);
// 
//         const temp = 0.02 + 0.25 * (1 - step / Math.max(1, STEPS - 1));
//         const delta = curEval.bad - candEval.bad;
//         const accept = delta >= 0 || rng() < Math.exp(delta / temp);
// 
//         if (accept) {
//           cur = cand;
//           curUsed = candUsed;
//           curEval = candEval;
//         }
// 
//         if (
//           candEval.bad < bestLocal.bad ||
//           (candEval.bad === bestLocal.bad && candEval.cSize > bestLocal.cSize)
//         ) {
//           bestLocal = { A: cand.slice(), used: candUsed, ...candEval };
//         }
// 
//         if (bestLocal.bad === 0) break;
//       }
// 
//       if (
//         !bestForM ||
//         bestLocal.bad < bestForM.bad ||
//         (bestLocal.bad === bestForM.bad && bestLocal.cSize > bestForM.cSize)
//       ) {
//         bestForM = { ...bestLocal, m, restart: r + 1 };
//       }
// 
//       if (
//         !globalBest ||
//         bestLocal.bad < globalBest.bad ||
//         (bestLocal.bad === globalBest.bad && bestLocal.cSize > globalBest.cSize)
//       ) {
//         globalBest = { ...bestLocal, m, restart: r + 1 };
//       }
// 
//       if (bestLocal.bad === 0) {
//         foundExact = { ...bestLocal, m, restart: r + 1 };
//         break;
//       }
//     }
// 
//     if (bestForM) {
//       tried.push({
//         m,
//         best_bad_distinct_schur: bestForM.bad,
//         best_c_size: bestForM.cSize,
//         sample_bad_triple: bestForM.sample,
//       });
//     }
// 
//     if (foundExact) break;
//   }
// 
//   let certification = null;
//   if (VERIFY_DIRECT && foundExact) {
//     const witness = directWitnessB(foundExact.used, N);
//     certification = {
//       direct_B_witness_exists: witness !== null,
//       witness,
//     };
//   }
// 
//   const row = {
//     N,
//     params: {
//       m_min: M_MIN,
//       m_max: M_MAX,
//       restarts: RESTARTS,
//       steps: STEPS,
//     },
//     found_exact_bad0: foundExact
//       ? {
//           m: foundExact.m,
//           restart: foundExact.restart,
//           A: foundExact.A,
//           c_size: foundExact.cSize,
//         }
//       : null,
//     certification,
//     global_best: globalBest
//       ? {
//           m: globalBest.m,
//           restart: globalBest.restart,
//           best_bad_distinct_schur: globalBest.bad,
//           best_c_size: globalBest.cSize,
//           sample_bad_triple: globalBest.sample,
//           A: globalBest.A,
//         }
//       : null,
//     tried_by_m: tried,
//     runtime_ms: Date.now() - started,
//   };
// 
//   results.push(row);
//   process.stderr.write(
//     `N=${N} done: found_bad0=${Boolean(foundExact)} best_bad=${row.global_best?.best_bad_distinct_schur}\n`
//   );
// }
// 
// const out = {
//   problem: 'EP-42',
//   script: path.basename(process.argv[1]),
//   method: 'annealed_search_for_M3_counterexample_via_complement_distinct_schur_obstruction',
//   params: {
//     n_list: N_LIST,
//     m_min: M_MIN,
//     m_max: M_MAX,
//     restarts: RESTARTS,
//     steps: STEPS,
//     verify_direct: VERIFY_DIRECT,
//     seed: SEED,
//   },
//   results,
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep42_m3_counterexample_search.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(
//   JSON.stringify(
//     {
//       outPath,
//       summary: results.map((r) => ({
//         N: r.N,
//         found_bad0: Boolean(r.found_exact_bad0),
//         best_bad: r.global_best?.best_bad_distinct_schur,
//         best_m: r.global_best?.m,
//       })),
//     },
//     null,
//     2
//   )
// );
// 
// ==== End Snippet ====

// ==== Integrated Snippet 2/3 ====
// Source: ep42_m3_exact_threshold_scan.mjs
// Kind: current_script_file
// Label: From ep42_m3_exact_threshold_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // Exact EP-42 (M=3) scan for a range of N.
// // For each N, checks whether there exists a Sidon A subset [1..N]
// // with no disjoint Sidon triple B (equivalently: complement of D(A)
// // has no distinct Schur triple).
// 
// const START_N = Number(process.env.START_N || 74);
// const END_N = Number(process.env.END_N || 90);
// const OUT_PATH = process.env.OUT_PATH || '';
// 
// if (!Number.isInteger(START_N) || !Number.isInteger(END_N) || START_N < 6 || END_N < START_N) {
//   console.error('Usage: START_N=74 END_N=90 node scripts/ep42_m3_exact_threshold_scan.mjs');
//   process.exit(1);
// }
// 
// function choose2(k) {
//   return (k * (k - 1)) / 2;
// }
// 
// function weaklySumFreeMax(n) {
//   // max |C| in [1..n] with no distinct a,b,c in C satisfying a+b=c
//   return Math.floor((n + 2) / 2);
// }
// 
// function minFeasibleK(n) {
//   const maxC = weaklySumFreeMax(n);
//   const needDiffs = n - maxC;
//   let k = 1;
//   while (choose2(k) < needDiffs) k += 1;
//   return k;
// }
// 
// function maxFeasibleK(n) {
//   let k = 1;
//   while (choose2(k + 1) <= n) k += 1;
//   return k;
// }
// 
// function makePairList(n) {
//   const pairs = [];
//   for (let a = 1; a <= n; a += 1) {
//     for (let b = a + 1; a + b <= n; b += 1) {
//       pairs.push([a, b, a + b]);
//     }
//   }
//   return pairs;
// }
// 
// function hasDistinctSchurTripleInComplement(usedDiff, pairs) {
//   for (let i = 0; i < pairs.length; i += 1) {
//     const [a, b, s] = pairs[i];
//     if (!usedDiff[a] && !usedDiff[b] && !usedDiff[s]) {
//       return [a, b, s];
//     }
//   }
//   return null;
// }
// 
// function findDisjointSidonTriple(usedDiff, N) {
//   for (let x = 1; x <= N - 2; x += 1) {
//     for (let y = x + 1; y <= N - 1; y += 1) {
//       const d1 = y - x;
//       if (usedDiff[d1]) continue;
//       for (let z = y + 1; z <= N; z += 1) {
//         const d2 = z - y;
//         const d3 = z - x;
//         if (d1 === d2) continue;
//         if (!usedDiff[d2] && !usedDiff[d3]) {
//           return { B: [x, y, z], differences: [d1, d2, d3] };
//         }
//       }
//     }
//   }
//   return null;
// }
// 
// function exactSearchForK(N, k, pairs) {
//   const A = [1];
//   const usedDiff = new Uint8Array(N);
// 
//   let nodes = 0;
//   let leavesChecked = 0;
//   let witnessA = null;
// 
//   function rec(start) {
//     if (witnessA) return;
//     if (A.length === k) {
//       leavesChecked += 1;
//       const bad = hasDistinctSchurTripleInComplement(usedDiff, pairs);
//       if (bad === null) {
//         witnessA = A.slice();
//       }
//       return;
//     }
// 
//     nodes += 1;
//     for (let x = start; x <= N; x += 1) {
//       const add = [];
//       let ok = true;
//       for (let i = 0; i < A.length; i += 1) {
//         const d = x - A[i];
//         if (usedDiff[d]) {
//           ok = false;
//           break;
//         }
//         add.push(d);
//       }
//       if (!ok) continue;
// 
//       for (let i = 0; i < add.length; i += 1) usedDiff[add[i]] = 1;
//       A.push(x);
//       rec(x + 1);
//       A.pop();
//       for (let i = 0; i < add.length; i += 1) usedDiff[add[i]] = 0;
// 
//       if (witnessA) return;
//     }
//   }
// 
//   const t0 = Date.now();
//   rec(2);
//   const runtimeMs = Date.now() - t0;
// 
//   return {
//     k,
//     nodes,
//     leaves_checked: leavesChecked,
//     runtime_ms: runtimeMs,
//     witness_A: witnessA,
//   };
// }
// 
// const rows = [];
// 
// for (let N = START_N; N <= END_N; N += 1) {
//   const n = N - 1;
//   const kMin = minFeasibleK(n);
//   const kMax = maxFeasibleK(n);
//   const pairs = makePairList(n);
//   const started = Date.now();
// 
//   const byK = [];
//   let found = null;
// 
//   for (let k = kMin; k <= kMax; k += 1) {
//     const part = exactSearchForK(N, k, pairs);
//     byK.push({
//       k: part.k,
//       nodes: part.nodes,
//       leaves_checked: part.leaves_checked,
//       runtime_ms: part.runtime_ms,
//       found_witness: part.witness_A !== null,
//     });
// 
//     if (part.witness_A) {
//       const used = new Uint8Array(N);
//       for (let i = 0; i < part.witness_A.length; i += 1) {
//         for (let j = i + 1; j < part.witness_A.length; j += 1) {
//           used[part.witness_A[j] - part.witness_A[i]] = 1;
//         }
//       }
//       const directWitness = findDisjointSidonTriple(used, N);
//       found = {
//         k,
//         A: part.witness_A,
//         direct_disjoint_sidon_triple_exists: directWitness !== null,
//         direct_disjoint_sidon_triple_witness: directWitness,
//       };
//       break;
//     }
//   }
// 
//   const row = {
//     N,
//     n,
//     k_min_feasible: kMin,
//     k_max_feasible: kMax,
//     found_counterexample_A_for_M3: found !== null,
//     witness: found,
//     by_k: byK,
//     total_runtime_ms: Date.now() - started,
//   };
//   rows.push(row);
// 
//   process.stderr.write(
//     `N=${N} done: found=${row.found_counterexample_A_for_M3} runtime_ms=${row.total_runtime_ms}\n`
//   );
// 
//   if (OUT_PATH) {
//     const partialOut = {
//       problem: 'EP-42',
//       script: path.basename(process.argv[1]),
//       method: 'exact_search_over_sidon_A_for_M3_via_distinct_schur_obstruction',
//       params: {
//         start_n: START_N,
//         end_n: END_N,
//       },
//       rows,
//       generated_utc: new Date().toISOString(),
//       partial: true,
//     };
//     fs.writeFileSync(OUT_PATH, `${JSON.stringify(partialOut, null, 2)}\n`);
//   }
// }
// 
// const out = {
//   problem: 'EP-42',
//   script: path.basename(process.argv[1]),
//   method: 'exact_search_over_sidon_A_for_M3_via_distinct_schur_obstruction',
//   params: {
//     start_n: START_N,
//     end_n: END_N,
//   },
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', `ep42_m3_exact_threshold_scan_${START_N}_${END_N}.json`);
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(
//   JSON.stringify(
//     {
//       outPath,
//       summary: rows.map((r) => ({
//         N: r.N,
//         found_counterexample_A_for_M3: r.found_counterexample_A_for_M3,
//         witness_k: r.witness?.k ?? null,
//       })),
//     },
//     null,
//     2
//   )
// );
// 
// ==== End Snippet ====

// ==== Integrated Snippet 3/3 ====
// Source: ep42_scan_smallN.mjs
// Kind: current_script_file
// Label: From ep42_scan_smallN.mjs
// #!/usr/bin/env node
// 
// // EP-42 small-N exhaustive scan:
// // For each N and M, checks whether EVERY Sidon A subset [1..N]
// // admits a Sidon B subset [1..N], |B|=M, with (A-A)∩(B-B)={0}.
// 
// const startN = Number(process.argv[2] || 10);
// const endN = Number(process.argv[3] || 40);
// const mArg = process.argv[4] || '2,3,4';
// const Ms = mArg.split(',').map((x) => Number(x.trim())).filter((x) => Number.isInteger(x) && x >= 1);
// 
// if (!Number.isInteger(startN) || !Number.isInteger(endN) || startN < 2 || endN < startN || Ms.length === 0) {
//   console.error('Usage: node scripts/ep42_scan_smallN.mjs [startN] [endN] [Mlist]');
//   process.exit(1);
// }
// 
// function diffBit(d) {
//   return 1n << BigInt(d - 1);
// }
// 
// function canonicalSidonEntries(N) {
//   const byMask = new Map();
// 
//   function put(mask, arr) {
//     const key = mask.toString();
//     if (!byMask.has(key)) {
//       byMask.set(key, {
//         mask,
//         size: arr.length,
//         set: arr.slice(),
//       });
//     }
//   }
// 
//   put(0n, []);
//   const arr = [1];
//   let mask = 0n;
//   put(mask, arr);
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
//       put(mask, arr);
//       rec(x + 1);
//       mask ^= addMask;
//       arr.pop();
//     }
//   }
// 
//   rec(2);
//   return [...byMask.values()];
// }
// 
// function existsDisjoint(A_mask, B_entries) {
//   for (let i = 0; i < B_entries.length; i++) {
//     if ((A_mask & B_entries[i].mask) === 0n) return B_entries[i];
//   }
//   return null;
// }
// 
// const out = [];
// 
// for (let N = startN; N <= endN; N++) {
//   const t0 = Date.now();
//   const entries = canonicalSidonEntries(N);
//   const t1 = Date.now();
// 
//   const bySize = new Map();
//   for (const e of entries) {
//     if (!bySize.has(e.size)) bySize.set(e.size, []);
//     bySize.get(e.size).push(e);
//   }
// 
//   const row = {
//     N,
//     sidon_masks_count: entries.length,
//     by_M: {},
//     gen_ms: t1 - t0,
//   };
// 
//   for (const M of Ms) {
//     const B_entries = bySize.get(M) || [];
//     const t2 = Date.now();
// 
//     let allGood = true;
//     let worstA = null;
//     let checked = 0;
// 
//     for (const A of entries) {
//       checked += 1;
//       const B = existsDisjoint(A.mask, B_entries);
//       if (!B) {
//         allGood = false;
//         worstA = A;
//         break;
//       }
//     }
// 
//     const t3 = Date.now();
// 
//     row.by_M[String(M)] = {
//       M,
//       B_count: B_entries.length,
//       all_A_have_B: allGood,
//       checked_A_count: checked,
//       scan_ms: t3 - t2,
//       counterexample_A: worstA ? worstA.set : null,
//     };
//   }
// 
//   row.total_ms = Date.now() - t0;
//   out.push(row);
//   console.error(`N=${N} done, masks=${entries.length}`);
// }
// 
// console.log(JSON.stringify({ startN, endN, Ms, rows: out }, null, 2));
// 
// ==== End Snippet ====

