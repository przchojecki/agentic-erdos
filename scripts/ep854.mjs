#!/usr/bin/env node
// Canonical per-problem script for EP-854.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-854',
  source_count: 5,
  source_files: ["ep854_construct_fixed_gap_witness.mjs","ep854_constructive_lower_bound_profile.mjs","ep854_k6_dual_check.mjs","ep854_primorial_gap_scan.mjs","longterm_batch2_compute.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-854 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/5 ====
// Source: ep854_construct_fixed_gap_witness.mjs
// Kind: current_script_file
// Label: From ep854_construct_fixed_gap_witness.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-854 constructive witness search:
// // For given k and even t, try to construct x such that modulo n_k
// // - x and x+t are coprime to n_k
// // - every x+s (1<=s<t) is not coprime to n_k
// // and (linear, non-wrap) 1 <= x <= n_k-t-1.
// 
// const K = Number(process.env.K || 9);
// const T = Number(process.env.T || 20);
// const FLEX_PRIMES = Number(process.env.FLEX_PRIMES || 7);
// const CHOICES_PER_PRIME = Number(process.env.CHOICES_PER_PRIME || 3);
// 
// if (!Number.isInteger(K) || K < 1) throw new Error('K must be positive integer');
// if (!Number.isInteger(T) || T < 2 || T % 2 !== 0) throw new Error('T must be even integer >=2');
// 
// function firstPrimes(k) {
//   const out = [];
//   let n = 2;
//   while (out.length < k) {
//     let ok = true;
//     for (let d = 2; d * d <= n; d += 1) {
//       if (n % d === 0) {
//         ok = false;
//         break;
//       }
//     }
//     if (ok) out.push(n);
//     n += 1;
//   }
//   return out;
// }
// 
// function egcd(a, b) {
//   if (b === 0n) return [a, 1n, 0n];
//   const [g, x1, y1] = egcd(b, a % b);
//   return [g, y1, x1 - (a / b) * y1];
// }
// 
// function modInv(a, m) {
//   const [g, x] = egcd(a, m);
//   if (g !== 1n) throw new Error('inverse does not exist');
//   return ((x % m) + m) % m;
// }
// 
// function crtCombine(a, m, b, p) {
//   // x ≡ a (mod m), x ≡ b (mod p), gcd(m,p)=1.
//   const inv = modInv(m % p, p);
//   const delta = ((b - (a % p)) % p + p) % p;
//   const t = (delta * inv) % p;
//   const x = a + m * t;
//   return [x % (m * p), m * p];
// }
// 
// function residueMod(x, p) {
//   return Number(((x % BigInt(p)) + BigInt(p)) % BigInt(p));
// }
// 
// function isCoprimeToNk(x, primes) {
//   for (const p of primes) if (residueMod(x, p) === 0) return false;
//   return true;
// }
// 
// function verifyGap(x, t, primes, nk) {
//   if (x < 1n || x + BigInt(t) > nk - 1n) return false;
//   if (!isCoprimeToNk(x, primes)) return false;
//   if (!isCoprimeToNk(x + BigInt(t), primes)) return false;
//   for (let s = 1; s < t; s += 1) {
//     if (isCoprimeToNk(x + BigInt(s), primes)) return false;
//   }
//   return true;
// }
// 
// const primes = firstPrimes(K);
// let nk = 1n;
// for (const p of primes) nk *= BigInt(p);
// 
// const half = T / 2;
// const neededUsed = half - 1; // even interior points: 2,4,...,T-2
// const used = [];
// for (const p of primes) if (p > T && used.length < neededUsed) used.push(p);
// 
// if (used.length < neededUsed) {
//   console.log(
//     JSON.stringify(
//       {
//         ok: false,
//         reason: 'not_enough_primes_gt_t',
//         k: K,
//         t: T,
//         primes_gt_t_available: used.length,
//         required: neededUsed,
//       },
//       null,
//       2
//     )
//   );
//   process.exit(0);
// }
// 
// const usedSet = new Set(used);
// const remaining = primes.filter((p) => !usedSet.has(p));
// 
// // Base assignment:
// // used primes q_i: x ≡ -2i (mod q_i), covering odd interior numbers x+2i.
// // remaining primes p: x ≠ 0,-t (mod p), pick smallest allowed residue by default.
// const assign = new Map(); // prime -> residue
// for (let i = 1; i <= neededUsed; i += 1) {
//   const e = 2 * i;
//   const q = used[i - 1];
//   const r = ((-e % q) + q) % q;
//   assign.set(q, r);
// }
// 
// const allowedByPrime = new Map();
// for (const p of remaining) {
//   const forb0 = 0;
//   const forbT = ((-T % p) + p) % p;
//   const allowed = [];
//   for (let r = 0; r < p; r += 1) {
//     if (r === forb0 || r === forbT) continue;
//     allowed.push(r);
//   }
//   if (allowed.length === 0) {
//     console.log(JSON.stringify({ ok: false, reason: 'no_allowed_residue', prime: p }, null, 2));
//     process.exit(0);
//   }
//   allowedByPrime.set(p, allowed);
//   assign.set(p, allowed[0]);
// }
// 
// const flex = remaining.slice(0, Math.min(FLEX_PRIMES, remaining.length));
// 
// function solveFromAssign(mapAssign) {
//   let x = 0n;
//   let m = 1n;
//   for (const p of primes) {
//     const r = mapAssign.get(p);
//     const [nx, nm] = crtCombine(x, m, BigInt(r), BigInt(p));
//     x = nx;
//     m = nm;
//   }
//   return [x, m];
// }
// 
// let best = null;
// let tested = 0;
// 
// function dfsFlex(idx) {
//   if (idx === flex.length) {
//     tested += 1;
//     const [x] = solveFromAssign(assign);
//     if (verifyGap(x, T, primes, nk)) {
//       best = {
//         x: x.toString(),
//         x_plus_t: (x + BigInt(T)).toString(),
//       };
//       return true;
//     }
//     return false;
//   }
//   const p = flex[idx];
//   const allowed = allowedByPrime.get(p);
//   const lim = Math.min(CHOICES_PER_PRIME, allowed.length);
//   const old = assign.get(p);
//   for (let i = 0; i < lim; i += 1) {
//     assign.set(p, allowed[i]);
//     if (dfsFlex(idx + 1)) return true;
//   }
//   assign.set(p, old);
//   return false;
// }
// 
// dfsFlex(0);
// 
// const out = {
//   problem: 'EP-854',
//   script: path.basename(process.argv[1]),
//   params: {
//     k: K,
//     t: T,
//     flex_primes: FLEX_PRIMES,
//     choices_per_prime: CHOICES_PER_PRIME,
//   },
//   nk: nk.toString(),
//   primes,
//   used_primes_for_interior_points: used,
//   remaining_primes_count: remaining.length,
//   tested_assignments: tested,
//   witness_found: best != null,
//   witness: best,
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', `ep854_construct_witness_k${K}_t${T}.json`);
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(JSON.stringify({ outPath, witness_found: out.witness_found, tested_assignments: tested, witness: best }, null, 2));
// 
// ==== End Snippet ====

// ==== Integrated Snippet 2/5 ====
// Source: ep854_constructive_lower_bound_profile.mjs
// Kind: current_script_file
// Label: From ep854_constructive_lower_bound_profile.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // Build explicit constructive lower bound on represented even gaps for each k:
// // For even t, if there are at least t/2-1 odd primes among first k that exceed t,
// // then the distinct-large-prime CRT construction applies.
// // This yields guaranteed represented even gaps at least:
// //   2,4,...,T_k  where T_k is max even t satisfying condition.
// 
// const KMAX = Number(process.env.KMAX || 40);
// const SCAN_PATH = process.env.SCAN_PATH || 'data/ep854_primorial_gap_scan.json';
// 
// function firstPrimes(k) {
//   const out = [];
//   let n = 2;
//   while (out.length < k) {
//     let ok = true;
//     for (let d = 2; d * d <= n; d += 1) {
//       if (n % d === 0) {
//         ok = false;
//         break;
//       }
//     }
//     if (ok) out.push(n);
//     n += 1;
//   }
//   return out;
// }
// 
// const primes = firstPrimes(KMAX);
// let scan = null;
// if (fs.existsSync(SCAN_PATH)) {
//   scan = JSON.parse(fs.readFileSync(SCAN_PATH, 'utf8'));
// }
// 
// const rows = [];
// for (let k = 1; k <= KMAX; k += 1) {
//   const pk = primes[k - 1];
//   let Tk = 0;
//   for (let t = 2; t <= pk; t += 2) {
//     const need = t / 2 - 1;
//     let have = 0;
//     for (let i = 0; i < k; i += 1) {
//       const p = primes[i];
//       if (p > t && p % 2 === 1) have += 1;
//     }
//     if (have >= need) Tk = t;
//   }
//   rows.push({
//     k,
//     p_k: pk,
//     guaranteed_even_gaps_count: Tk / 2,
//     guaranteed_max_even_gap: Tk,
//   });
// }
// 
// if (scan && Array.isArray(scan.rows)) {
//   const byK = new Map(scan.rows.map((r) => [r.k, r]));
//   for (const r of rows) {
//     const s = byK.get(r.k);
//     if (!s) continue;
//     r.observed_max_gap = s.max_gap;
//     r.observed_represented_even_count = s.represented_even_gap_count_up_to_max;
//     if (s.max_gap > 0) {
//       r.guaranteed_count_over_observed_max = r.guaranteed_even_gaps_count / s.max_gap;
//       r.observed_count_over_observed_max = s.represented_even_gap_count_up_to_max / s.max_gap;
//     }
//   }
// }
// 
// const out = {
//   problem: 'EP-854',
//   script: path.basename(process.argv[1]),
//   method: 'explicit_distinct_large_prime_construction_lower_bound_profile',
//   params: { kmax: KMAX, scan_path: SCAN_PATH },
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep854_constructive_lower_bound_profile.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(JSON.stringify({ outPath, rows: rows.length }, null, 2));
// 
// ==== End Snippet ====

// ==== Integrated Snippet 3/5 ====
// Source: ep854_k6_dual_check.mjs
// Kind: current_script_file
// Label: From ep854_k6_dual_check.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-854: rigorous finite disproof artifact for the historical sub-conjecture.
// // n_6 = 2*3*5*7*11*13 = 30030.
// // Verify by two independent constructions that:
// //  - max consecutive reduced-residue gap is 22
// //  - gap 20 never appears.
// 
// const N = 30030;
// const P = [2, 3, 5, 7, 11, 13];
// 
// function gcd(a, b) {
//   let x = a;
//   let y = b;
//   while (y !== 0) {
//     const t = x % y;
//     x = y;
//     y = t;
//   }
//   return x;
// }
// 
// function residuesByGcd(n) {
//   const out = [];
//   for (let a = 1; a < n; a += 1) if (gcd(a, n) === 1) out.push(a);
//   return out;
// }
// 
// function residuesByMarking(n, primes) {
//   const isCoprime = new Uint8Array(n);
//   isCoprime.fill(1);
//   isCoprime[0] = 0;
//   for (const p of primes) for (let m = p; m < n; m += p) isCoprime[m] = 0;
//   const out = [];
//   for (let a = 1; a < n; a += 1) if (isCoprime[a]) out.push(a);
//   return out;
// }
// 
// function gapStats(residues) {
//   const gaps = [];
//   const gapSet = new Set();
//   let maxGap = 0;
//   for (let i = 0; i + 1 < residues.length; i += 1) {
//     const g = residues[i + 1] - residues[i];
//     gaps.push(g);
//     gapSet.add(g);
//     if (g > maxGap) maxGap = g;
//   }
//   const evenPresent = [];
//   const evenMissingUpToMax = [];
//   for (let t = 2; t <= maxGap; t += 2) {
//     if (gapSet.has(t)) evenPresent.push(t);
//     else evenMissingUpToMax.push(t);
//   }
//   return { maxGap, gapSet, evenPresent, evenMissingUpToMax };
// }
// 
// const r1 = residuesByGcd(N);
// const r2 = residuesByMarking(N, P);
// 
// const sameResidues =
//   r1.length === r2.length &&
//   r1.every((v, i) => v === r2[i]);
// 
// const s1 = gapStats(r1);
// const s2 = gapStats(r2);
// 
// const sameGapSet =
//   s1.gapSet.size === s2.gapSet.size &&
//   [...s1.gapSet].every((g) => s2.gapSet.has(g));
// 
// const result = {
//   problem: 'EP-854',
//   script: path.basename(process.argv[1]),
//   n6: N,
//   prime_factors: P,
//   checks: {
//     residues_equal_between_methods: sameResidues,
//     gap_set_equal_between_methods: sameGapSet,
//   },
//   gcd_method: {
//     phi_n6: r1.length,
//     max_gap: s1.maxGap,
//     even_present_up_to_max: s1.evenPresent,
//     even_missing_up_to_max: s1.evenMissingUpToMax,
//   },
//   marking_method: {
//     phi_n6: r2.length,
//     max_gap: s2.maxGap,
//     even_present_up_to_max: s2.evenPresent,
//     even_missing_up_to_max: s2.evenMissingUpToMax,
//   },
//   historical_subconjecture_all_even_up_to_max: s1.evenMissingUpToMax.length === 0,
//   verdict: s1.evenMissingUpToMax.length === 0 ? 'not_disproved' : 'disproved_at_n6',
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep854_k6_dual_check.json');
// fs.writeFileSync(outPath, `${JSON.stringify(result, null, 2)}\n`);
// console.log(
//   JSON.stringify(
//     {
//       outPath,
//       sameResidues,
//       sameGapSet,
//       maxGap: s1.maxGap,
//       missingEven: s1.evenMissingUpToMax,
//       verdict: result.verdict,
//     },
//     null,
//     2
//   )
// );
// 
// ==== End Snippet ====

// ==== Integrated Snippet 4/5 ====
// Source: ep854_primorial_gap_scan.mjs
// Kind: current_script_file
// Label: From ep854_primorial_gap_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-854 finite verification of residue-gap spectrum for primorial moduli.
// // For n_k = product of first k primes, with reduced residues
// // 1 = a_1 < ... < a_{phi(n_k)} = n_k - 1,
// // analyze gaps g_i = a_{i+1}-a_i.
// 
// const KMAX = Number(process.env.KMAX || 8);
// const N_LIMIT = Number(process.env.N_LIMIT || 12_000_000);
// 
// function firstPrimes(k) {
//   const out = [];
//   let n = 2;
//   while (out.length < k) {
//     let ok = true;
//     for (let d = 2; d * d <= n; d += 1) {
//       if (n % d === 0) {
//         ok = false;
//         break;
//       }
//     }
//     if (ok) out.push(n);
//     n += 1;
//   }
//   return out;
// }
// 
// function reducedResiduesMask(n, primeFactors) {
//   const isCoprime = new Uint8Array(n);
//   isCoprime.fill(1);
//   isCoprime[0] = 0;
//   for (const p of primeFactors) {
//     for (let m = p; m < n; m += p) isCoprime[m] = 0;
//   }
//   return isCoprime;
// }
// 
// function analyzeOne(k, n, primeFactors) {
//   const isCoprime = reducedResiduesMask(n, primeFactors);
//   let phi = 0;
//   const gapSet = new Set();
//   let maxGap = 0;
//   let maxGapCount = 0;
//   let firstMaxGapIndex = -1; // 1-based j with a_{j+1}-a_j=maxGap
//   let gapCount = 0;
//   let prev = -1;
// 
//   for (let a = 1; a < n; a += 1) {
//     if (!isCoprime[a]) continue;
//     phi += 1;
//     if (prev !== -1) {
//       const g = a - prev;
//       gapCount += 1;
//       gapSet.add(g);
//       if (g > maxGap) {
//         maxGap = g;
//         maxGapCount = 1;
//         firstMaxGapIndex = gapCount;
//       } else if (g === maxGap) {
//         maxGapCount += 1;
//       }
//     }
//     prev = a;
//   }
// 
//   // Encourage GC between large k.
//   // eslint-disable-next-line no-unused-vars
//   let _free = isCoprime;
//   _free = null;
// 
//   const missingEven = [];
//   for (let t = 2; t <= maxGap; t += 2) if (!gapSet.has(t)) missingEven.push(t);
//   const representedEvenCount = [...gapSet].filter((g) => g % 2 === 0).length;
// 
//   return {
//     k,
//     n_k: n,
//     prime_factors: primeFactors.slice(),
//     phi_nk: phi,
//     gap_count: gapCount,
//     max_gap: maxGap,
//     max_gap_occurrences: maxGapCount,
//     first_index_with_max_gap: firstMaxGapIndex,
//     represented_even_gap_count_up_to_max: representedEvenCount,
//     missing_even_gaps_up_to_max: missingEven,
//     first_missing_even_gap: missingEven.length ? missingEven[0] : null,
//   };
// }
// 
// const ps = firstPrimes(KMAX);
// const rows = [];
// let n = 1;
// for (let k = 1; k <= KMAX; k += 1) {
//   n *= ps[k - 1];
//   if (n > N_LIMIT) break;
//   const primeFactors = ps.slice(0, k);
//   rows.push(analyzeOne(k, n, primeFactors));
// }
// 
// // Ignore tiny trivial cases (k<3), where gap spectrum is too short.
// const firstFailure = rows.find((r) => r.k >= 3 && r.first_missing_even_gap != null);
// 
// const out = {
//   problem: 'EP-854',
//   script: path.basename(process.argv[1]),
//   method: 'exact_reduced_residue_gap_spectrum_scan_for_primorials',
//   params: { kmax: KMAX, n_limit: N_LIMIT },
//   rows,
//   first_k_with_missing_even_gap_up_to_max: firstFailure
//     ? { k: firstFailure.k, n_k: firstFailure.n_k, first_missing_even_gap: firstFailure.first_missing_even_gap }
//     : null,
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep854_primorial_gap_scan.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(
//   JSON.stringify(
//     {
//       outPath,
//       rows: rows.length,
//       first_failure: out.first_k_with_missing_even_gap_up_to_max,
//     },
//     null,
//     2
//   )
// );
// 
// ==== End Snippet ====

// ==== Integrated Snippet 5/5 ====
// Source: longterm_batch2_compute.mjs
// Kind: batch_ep_section_from_head
// Label: summarize constructive witness profile.
// // EP-854: summarize constructive witness profile.
// if (fs.existsSync('data/ep854_constructive_lower_bound_profile.json')) {
//   const d = loadJSON('data/ep854_constructive_lower_bound_profile.json');
//   out.results.ep854 = {
//     params: d.params || null,
//     last_row: pickLastRow(d),
//   };
// }
// 
// const outPath = path.join('data', 'longterm_batch2_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Snippet ====

// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/longterm_batch2_compute.mjs | summarize constructive witness profile. ----
// // EP-854: summarize constructive witness profile.
// if (fs.existsSync('data/ep854_constructive_lower_bound_profile.json')) {
//   const d = loadJSON('data/ep854_constructive_lower_bound_profile.json');
//   out.results.ep854 = {
//     params: d.params || null,
//     last_row: pickLastRow(d),
//   };
// }
// 
// const outPath = path.join('data', 'longterm_batch2_compute.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
// console.log(JSON.stringify({ outPath }, null, 2));
// ==== End Batch Split Integrations ====
