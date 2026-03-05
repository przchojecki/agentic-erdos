#!/usr/bin/env node
// Canonical per-problem script for EP-40.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-40',
  source_count: 3,
  source_files: ["ep40_experiments.mjs","ep40_frontier_classifier.mjs","ep40_logN_greedy_bounded_rep.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-40 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/3 ====
// Source: ep40_experiments.mjs
// Kind: current_script_file
// Label: From ep40_experiments.mjs
// #!/usr/bin/env node
// 
// // EP-40 quick experiments on the lacunary counterexample A={2^k}.
// 
// const Ns = [1e4, 1e5, 1e6, 1e7].map((x) => Math.floor(x));
// 
// function buildPowersOfTwoUpTo(N) {
//   const arr = [];
//   let x = 1;
//   while (x <= N) {
//     arr.push(x);
//     x *= 2;
//   }
//   return arr;
// }
// 
// function maxConvolutionOrdered(A) {
//   const cnt = new Map();
//   for (let i = 0; i < A.length; i++) {
//     for (let j = 0; j < A.length; j++) {
//       const s = A[i] + A[j];
//       cnt.set(s, (cnt.get(s) || 0) + 1);
//     }
//   }
//   let mx = 0;
//   for (const v of cnt.values()) if (v > mx) mx = v;
//   return mx;
// }
// 
// function g1(N) {
//   return Math.sqrt(N) / Math.log(N);
// }
// function g2(N) {
//   return Math.sqrt(N) / Math.sqrt(Math.log(N));
// }
// function g3(N) {
//   return Math.sqrt(N) / (Math.log(N) ** 2);
// }
// 
// const rows = [];
// for (const N of Ns) {
//   const A = buildPowersOfTwoUpTo(N);
//   const m = A.length;
//   const rmax = maxConvolutionOrdered(A);
// 
//   const rhs1 = Math.sqrt(N) / g1(N); // log N
//   const rhs2 = Math.sqrt(N) / g2(N); // sqrt(log N)
//   const rhs3 = Math.sqrt(N) / g3(N); // (log N)^2
// 
//   rows.push({
//     N,
//     m,
//     rmax,
//     rhs_for_g_sqrtN_over_logN: rhs1,
//     ratio_m_over_rhs1: m / rhs1,
//     rhs_for_g_sqrtN_over_sqrtlogN: rhs2,
//     ratio_m_over_rhs2: m / rhs2,
//     rhs_for_g_sqrtN_over_log2N: rhs3,
//     ratio_m_over_rhs3: m / rhs3,
//   });
// }
// 
// console.log(JSON.stringify({
//   set: 'A={2^k}',
//   note: 'rmax is computed on finite truncation A∩[1,N]; for full infinite set, max ordered representations remains <=2.',
//   rows,
// }, null, 2));
// 
// ==== End Snippet ====

// ==== Integrated Snippet 2/3 ====
// Source: ep40_frontier_classifier.mjs
// Kind: current_script_file
// Label: From ep40_frontier_classifier.mjs
// #!/usr/bin/env node
// 
// // Frontier classifier for EP-40 based on known rigorous witnesses/results.
// 
// const Ns = [1e6, 1e8, 1e10, 1e12].map((x) => Math.floor(x));
// 
// const gFamilies = [
//   { name: 'log N', g: (N) => Math.log(N) },
//   { name: '(log N)^2', g: (N) => Math.log(N) ** 2 },
//   { name: 'exp(sqrt(log N))', g: (N) => Math.exp(Math.sqrt(Math.log(N))) },
//   { name: 'N^0.05', g: (N) => N ** 0.05 },
//   { name: 'N^0.1', g: (N) => N ** 0.1 },
//   { name: 'sqrt(N)/log N', g: (N) => Math.sqrt(N) / Math.log(N) },
// ];
// 
// // Witness W1: powers of two => A(N) ~ log_2 N, bounded representation function.
// function witnessPowers2Count(N) {
//   return Math.floor(Math.log2(N)) + 1;
// }
// 
// // Witness W2: Erdős–Rényi Theorem 8-style growth heuristic (for any eps>0, bounded r possible with A(N) ~ N^{1/2-eps}).
// function witnessErdosRenyiCount(N, eps) {
//   return N ** (0.5 - eps);
// }
// 
// function classifyFamily(fam) {
//   const row = {
//     family: fam.name,
//     thresholds: {},
//     sample_met_by_powers2_all_Ns: true,
//     sample_met_by_ER_eps_0p05_all_Ns: true,
//     sample_met_by_ER_eps_0p1_all_Ns: true,
//   };
// 
//   for (const N of Ns) {
//     const th = Math.sqrt(N) / fam.g(N);
//     row.thresholds[String(N)] = th;
// 
//     const p2ok = witnessPowers2Count(N) >= th;
//     const er05ok = witnessErdosRenyiCount(N, 0.05) >= th;
//     const er10ok = witnessErdosRenyiCount(N, 0.1) >= th;
// 
//     row.sample_met_by_powers2_all_Ns = row.sample_met_by_powers2_all_Ns && p2ok;
//     row.sample_met_by_ER_eps_0p05_all_Ns = row.sample_met_by_ER_eps_0p05_all_Ns && er05ok;
//     row.sample_met_by_ER_eps_0p1_all_Ns = row.sample_met_by_ER_eps_0p1_all_Ns && er10ok;
//   }
// 
//   row.classification = 'sample_only_not_asymptotic_proof';
// 
//   return row;
// }
// 
// const output = {
//   note: [
//     'This classifier is numerical and sample-based (finite N only).',
//     'Do not treat these rows as asymptotic proof/disproof on their own.',
//     'The rigorous theorem is existence of bounded-representation sequences with exponent 1/2-eps for every eps>0 (Erdos-Renyi 1960, Theorem 8 and following note).',
//     'A positive guarantee regime is still only partial (e.g. m(N)^2/N -> infinity implies unbounded limsup).',
//   ],
//   Ns,
//   families: gFamilies.map(classifyFamily),
// };
// 
// console.log(JSON.stringify(output, null, 2));
// 
// ==== End Snippet ====

// ==== Integrated Snippet 3/3 ====
// Source: ep40_logN_greedy_bounded_rep.mjs
// Kind: current_script_file
// Label: From ep40_logN_greedy_bounded_rep.mjs
// #!/usr/bin/env node
// 
// // Greedy construction for sets with bounded ordered representation counts:
// // maintain r_{A+A}(s) <= K for all s <= 2*Nmax while adding numbers in increasing order.
// //
// // Usage:
// //   node scripts/ep40_logN_greedy_bounded_rep.mjs [Nmax] [K1,K2,...]
// 
// const Nmax = Number(process.argv[2] || 200000);
// const kArg = process.argv[3] || '2,4,8';
// const sparseMode = process.argv.includes('--sparse');
// const Ks = kArg.split(',').map((x) => Number(x.trim())).filter((x) => Number.isInteger(x) && x > 0);
// 
// if (!Number.isInteger(Nmax) || Nmax < 1000 || Ks.length === 0) {
//   console.error('Usage: node scripts/ep40_logN_greedy_bounded_rep.mjs [Nmax>=1000] [K1,K2,...]');
//   process.exit(1);
// }
// 
// const samplePoints = [
//   1000,
//   3000,
//   10000,
//   30000,
//   100000,
//   300000,
//   1000000,
// ].filter((x) => x <= Nmax);
// 
// function buildGreedy(Nmax, K) {
//   const repDense = sparseMode ? null : new Uint32Array(2 * Nmax + 1);
//   const repSparse = sparseMode ? new Map() : null;
//   const inA = new Uint8Array(Nmax + 1);
//   const A = [];
//   const countsAtSample = new Map();
// 
//   let si = 0;
// 
//   function getRep(s) {
//     if (!sparseMode) return repDense[s];
//     return repSparse.get(s) || 0;
//   }
// 
//   function addRep(s, delta) {
//     if (!sparseMode) {
//       repDense[s] += delta;
//       return;
//     }
//     const v = (repSparse.get(s) || 0) + delta;
//     if (v === 0) repSparse.delete(s);
//     else repSparse.set(s, v);
//   }
// 
//   function canAdd(x) {
//     // (x,x) contributes +1 to sum 2x
//     if (getRep(2 * x) + 1 > K) return false;
// 
//     // For each a in A, (a,x) and (x,a) contribute +2 to sum a+x.
//     for (let i = 0; i < A.length; i++) {
//       const s = A[i] + x;
//       if (getRep(s) + 2 > K) return false;
//     }
//     return true;
//   }
// 
//   function add(x) {
//     addRep(2 * x, 1);
//     for (let i = 0; i < A.length; i++) {
//       const s = A[i] + x;
//       addRep(s, 2);
//     }
//     A.push(x);
//     inA[x] = 1;
//   }
// 
//   for (let x = 1; x <= Nmax; x++) {
//     if (canAdd(x)) add(x);
// 
//     while (si < samplePoints.length && samplePoints[si] === x) {
//       const N = samplePoints[si];
//       const m = A.length;
//       const ratio = (m * Math.log(N)) / Math.sqrt(N);
//       countsAtSample.set(N, { N, m, ratio_m_log_over_sqrtN: ratio });
//       si += 1;
//     }
//   }
// 
//   let maxRep = 0;
//   if (!sparseMode) {
//     for (let s = 0; s < repDense.length; s++) if (repDense[s] > maxRep) maxRep = repDense[s];
//   } else {
//     for (const v of repSparse.values()) if (v > maxRep) maxRep = v;
//   }
// 
//   return {
//     K,
//     Nmax,
//     mode: sparseMode ? 'sparse' : 'dense',
//     size: A.length,
//     max_ordered_rep_observed: maxRep,
//     final_ratio_m_log_over_sqrtN: (A.length * Math.log(Nmax)) / Math.sqrt(Nmax),
//     sample: samplePoints.map((N) => countsAtSample.get(N)),
//   };
// }
// 
// const results = Ks.map((K) => buildGreedy(Nmax, K));
// 
// console.log(JSON.stringify({
//   Nmax,
//   Ks,
//   note: 'Greedy sequence is heuristic, not extremal. Ratio shown is m(N)*log(N)/sqrt(N). If this stays bounded away from 0, it is suggestive but not a proof.',
//   results,
// }, null, 2));
// 
// ==== End Snippet ====

