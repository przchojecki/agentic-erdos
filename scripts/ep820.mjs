#!/usr/bin/env node
// Canonical per-problem script for EP-820.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-820',
  source_count: 5,
  source_files: ["ep820_Hn_scan.mjs","ep820_h3_density_scan.mjs","ep820_h3_structure_scan.mjs","ep820_order_moduli_covering_metrics.mjs","ep820_order_moduli_covering_metrics_fast.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-820 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/5 ====
// Source: ep820_Hn_scan.mjs
// Kind: current_script_file
// Label: From ep820_Hn_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function gcdBig(a, b) {
//   let x = a;
//   let y = b;
//   while (y !== 0n) {
//     const t = x % y;
//     x = y;
//     y = t;
//   }
//   return x < 0n ? -x : x;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep820_Hn_scan.json');
// 
// const nMax = Number(process.argv[2] || 140);
// const lMax = Number(process.argv[3] || 220);
// 
// const rows = [];
// let countH3 = 0;
// 
// for (let n = 1; n <= nMax; n += 1) {
//   const nBig = BigInt(n);
//   const vals = new Array(lMax + 1).fill(0n);
//   for (let b = 2; b <= lMax; b += 1) {
//     vals[b] = BigInt(b) ** nBig - 1n;
//   }
// 
//   let bestL = null;
//   let bestK = null;
// 
//   outer: for (let l = 3; l <= lMax; l += 1) {
//     for (let k = 2; k < l; k += 1) {
//       if (gcdBig(vals[k], vals[l]) === 1n) {
//         bestL = l;
//         bestK = k;
//         break outer;
//       }
//     }
//   }
// 
//   const g23 = gcdBig((2n ** nBig) - 1n, (3n ** nBig) - 1n);
//   const pair23Coprime = g23 === 1n;
//   if (bestL === 3) countH3 += 1;
// 
//   rows.push({
//     n,
//     H_n_within_scan: bestL,
//     witness_k: bestK,
//     pair_2_3_coprime: pair23Coprime,
//     gcd_2n_1_3n_1: g23.toString(),
//   });
// 
//   if (n % 10 === 0) process.stderr.write(`n=${n}/${nMax}, H3_count=${countH3}\n`);
// }
// 
// const valid = rows.filter((r) => r.H_n_within_scan != null);
// const unresolved = rows.filter((r) => r.H_n_within_scan == null).map((r) => r.n);
// 
// const out = {
//   problem: 'EP-820',
//   method: 'direct_bigint_gcd_search_for_minimal_l',
//   params: { nMax, lMax },
//   rows,
//   summary: {
//     resolved_count: valid.length,
//     unresolved_n_values: unresolved,
//     count_H_n_eq_3_within_range: rows.filter((r) => r.H_n_within_scan === 3).length,
//     count_pair_2_3_coprime: rows.filter((r) => r.pair_2_3_coprime).length,
//   },
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

// ==== Integrated Snippet 2/5 ====
// Source: ep820_h3_density_scan.mjs
// Kind: current_script_file
// Label: From ep820_h3_density_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function gcd(a, b) {
//   let x = a;
//   let y = b;
//   while (y !== 0n) {
//     const t = x % y;
//     x = y;
//     y = t;
//   }
//   return x < 0n ? -x : x;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep820_h3_density_scan.json');
// 
// const N = Number(process.argv[2] || 20000);
// const checkpoints = [1000, 2000, 5000, 10000, 15000, 20000].filter((x) => x <= N);
// 
// let a = 1n; // 2^1 - 1
// let b = 2n; // 3^1 - 1
// let count = 0;
// let lastHit = 0;
// let maxGap = 0;
// 
// const rows = [];
// for (let n = 1; n <= N; n += 1) {
//   if (gcd(a, b) === 1n) {
//     count += 1;
//     if (lastHit > 0 && n - lastHit > maxGap) maxGap = n - lastHit;
//     lastHit = n;
//   }
// 
//   if (checkpoints.includes(n)) {
//     rows.push({ upto: n, h3_count: count, h3_density: count / n });
//   }
// 
//   a = 2n * a + 1n;
//   b = 3n * b + 2n;
// 
//   if (n % 2000 === 0) process.stderr.write(`n=${n}/${N}\n`);
// }
// 
// const out = {
//   problem: 'EP-820',
//   method: 'exact_recurrence_scan_for_h3_indicator',
//   N,
//   final: {
//     count,
//     density: count / N,
//     max_gap_between_h3_hits: maxGap,
//     last_hit: lastHit,
//   },
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

// ==== Integrated Snippet 3/5 ====
// Source: ep820_h3_structure_scan.mjs
// Kind: current_script_file
// Label: From ep820_h3_structure_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function gcd(a, b) {
//   let x = a;
//   let y = b;
//   while (y !== 0n) {
//     const t = x % y;
//     x = y;
//     y = t;
//   }
//   return x < 0n ? -x : x;
// }
// 
// function gcdInt(a, b) {
//   let x = a;
//   let y = b;
//   while (y !== 0) {
//     const t = x % y;
//     x = y;
//     y = t;
//   }
//   return Math.abs(x);
// }
// 
// function lcmInt(a, b) {
//   return (a / gcdInt(a, b)) * b;
// }
// 
// function sievePrimes(n) {
//   const isPrime = new Uint8Array(n + 1);
//   isPrime.fill(1);
//   isPrime[0] = 0;
//   isPrime[1] = 0;
//   for (let p = 2; p * p <= n; p += 1) {
//     if (!isPrime[p]) continue;
//     for (let q = p * p; q <= n; q += p) isPrime[q] = 0;
//   }
//   const out = [];
//   for (let i = 2; i <= n; i += 1) if (isPrime[i]) out.push(i);
//   return out;
// }
// 
// function buildSpf(n) {
//   const spf = new Uint32Array(n + 1);
//   for (let i = 2; i <= n; i += 1) {
//     if (spf[i] === 0) {
//       spf[i] = i;
//       if (i <= Math.floor(n / i)) {
//         for (let j = i * i; j <= n; j += i) {
//           if (spf[j] === 0) spf[j] = i;
//         }
//       }
//     }
//   }
//   return spf;
// }
// 
// function factorInt(n, spf) {
//   const out = [];
//   let x = n;
//   while (x > 1) {
//     const p = spf[x];
//     let e = 0;
//     while (x % p === 0) {
//       x = Math.floor(x / p);
//       e += 1;
//     }
//     out.push([p, e]);
//   }
//   return out;
// }
// 
// function modPow(base, exp, mod) {
//   let b = BigInt(base % mod);
//   let e = BigInt(exp);
//   let m = BigInt(mod);
//   let r = 1n;
//   while (e > 0n) {
//     if (e & 1n) r = (r * b) % m;
//     b = (b * b) % m;
//     e >>= 1n;
//   }
//   return Number(r);
// }
// 
// function orderMod(a, p, spf) {
//   if (gcdInt(a, p) !== 1) return 0;
//   let ord = p - 1;
//   const fac = factorInt(p - 1, spf);
//   for (const [q] of fac) {
//     while (ord % q === 0) {
//       const cand = ord / q;
//       if (modPow(a, cand, p) === 1) ord = cand;
//       else break;
//     }
//   }
//   return ord;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep820_h3_structure_scan.json');
// 
// const N = Number(process.argv[2] || 12000);
// const pMax = Number(process.argv[3] || 5000);
// 
// // Exact H(n)=3 indicator via recurrence for gcd(2^n-1,3^n-1)
// const isH3 = new Uint8Array(N + 1);
// let a = 1n; // 2^1-1
// let b = 2n; // 3^1-1
// const hits = [];
// const misses = [];
// let lastHit = 0;
// let maxHitGap = 0;
// 
// for (let n = 1; n <= N; n += 1) {
//   const g = gcd(a, b);
//   if (g === 1n) {
//     isH3[n] = 1;
//     hits.push(n);
//     if (lastHit > 0 && n - lastHit > maxHitGap) maxHitGap = n - lastHit;
//     lastHit = n;
//   } else {
//     misses.push(n);
//   }
// 
//   a = 2n * a + 1n;
//   b = 3n * b + 2n;
//   if (n % 2000 === 0) process.stderr.write(`gcd-scan n=${n}/${N}\n`);
// }
// 
// // Prime-order witness decomposition
// const primes = sievePrimes(pMax).filter((p) => p > 3);
// const spf = buildSpf(pMax + 10);
// const mRows = [];
// for (const p of primes) {
//   const o2 = orderMod(2, p, spf);
//   const o3 = orderMod(3, p, spf);
//   const m = lcmInt(o2, o3);
//   mRows.push({ p, ord2: o2, ord3: o3, m });
// }
// 
// mRows.sort((u, v) => u.m - v.m || u.p - v.p);
// 
// const witnessCount = new Map();
// let coveredMisses = 0;
// let uncoveredMisses = 0;
// const uncoveredSample = [];
// 
// for (const n of misses) {
//   let witness = null;
//   for (const row of mRows) {
//     if (row.m > n) break;
//     if (n % row.m === 0) {
//       witness = row.p;
//       break;
//     }
//   }
//   if (witness == null) {
//     uncoveredMisses += 1;
//     if (uncoveredSample.length < 80) uncoveredSample.push(n);
//   } else {
//     coveredMisses += 1;
//     witnessCount.set(witness, (witnessCount.get(witness) || 0) + 1);
//   }
// }
// 
// const topWitnesses = [...witnessCount.entries()]
//   .map(([p, count]) => ({ p, count }))
//   .sort((a, b) => b.count - a.count || a.p - b.p)
//   .slice(0, 30);
// 
// const buckets = [1000, 2000, 5000, 8000, 10000, 12000].filter((x) => x <= N);
// const densityRows = buckets.map((u) => {
//   let c = 0;
//   for (const n of hits) if (n <= u) c += 1;
//   return { upto: u, h3_count: c, h3_density: c / u };
// });
// 
// const out = {
//   problem: 'EP-820',
//   method: 'exact_h3_indicator_plus_prime-order_witness_decomposition',
//   params: { N, pMax },
//   h3_summary: {
//     count: hits.length,
//     density: hits.length / N,
//     max_hit_gap: maxHitGap,
//     first_hits: hits.slice(0, 120),
//     last_hits: hits.slice(Math.max(0, hits.length - 120)),
//     density_rows: densityRows,
//   },
//   miss_summary: {
//     count: misses.length,
//     covered_by_prime_order_table: coveredMisses,
//     uncovered_by_prime_order_table: uncoveredMisses,
//     uncovered_sample: uncoveredSample,
//     top_witness_primes: topWitnesses,
//   },
//   prime_order_rows_small_m: mRows.slice(0, 120),
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

// ==== Integrated Snippet 4/5 ====
// Source: ep820_order_moduli_covering_metrics.mjs
// Kind: current_script_file
// Label: From ep820_order_moduli_covering_metrics.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function gcdBig(a, b) {
//   let x = a;
//   let y = b;
//   while (y !== 0n) {
//     const t = x % y;
//     x = y;
//     y = t;
//   }
//   return x < 0n ? -x : x;
// }
// 
// function gcdInt(a, b) {
//   let x = a;
//   let y = b;
//   while (y !== 0) {
//     const t = x % y;
//     x = y;
//     y = t;
//   }
//   return Math.abs(x);
// }
// 
// function lcmInt(a, b) {
//   return (a / gcdInt(a, b)) * b;
// }
// 
// function sievePrimes(n) {
//   const isPrime = new Uint8Array(n + 1);
//   isPrime.fill(1);
//   isPrime[0] = 0;
//   isPrime[1] = 0;
//   for (let p = 2; p * p <= n; p += 1) {
//     if (!isPrime[p]) continue;
//     for (let q = p * p; q <= n; q += p) isPrime[q] = 0;
//   }
//   const out = [];
//   for (let i = 2; i <= n; i += 1) if (isPrime[i]) out.push(i);
//   return out;
// }
// 
// function buildSpf(n) {
//   const spf = new Uint32Array(n + 1);
//   for (let i = 2; i <= n; i += 1) {
//     if (spf[i] === 0) {
//       spf[i] = i;
//       if (i <= Math.floor(n / i)) {
//         for (let j = i * i; j <= n; j += i) {
//           if (spf[j] === 0) spf[j] = i;
//         }
//       }
//     }
//   }
//   return spf;
// }
// 
// function factorInt(n, spf) {
//   const out = [];
//   let x = n;
//   while (x > 1) {
//     const p = spf[x];
//     let e = 0;
//     while (x % p === 0) {
//       x = Math.floor(x / p);
//       e += 1;
//     }
//     out.push([p, e]);
//   }
//   return out;
// }
// 
// function modPow(base, exp, mod) {
//   let b = BigInt(base % mod);
//   let e = BigInt(exp);
//   let m = BigInt(mod);
//   let r = 1n;
//   while (e > 0n) {
//     if (e & 1n) r = (r * b) % m;
//     b = (b * b) % m;
//     e >>= 1n;
//   }
//   return Number(r);
// }
// 
// function orderMod(a, p, spf) {
//   if (gcdInt(a, p) !== 1) return 0;
//   let ord = p - 1;
//   const fac = factorInt(p - 1, spf);
//   for (const [q] of fac) {
//     while (ord % q === 0) {
//       const cand = ord / q;
//       if (modPow(a, cand, p) === 1) ord = cand;
//       else break;
//     }
//   }
//   return ord;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep820_order_moduli_covering_metrics.json');
// 
// const N = Number(process.argv[2] || 20000);
// const pCutoffs = (process.argv[3] || '100,200,500,1000,2000,3000,5000').split(',').map((x) => Number(x));
// const pMax = Math.max(...pCutoffs);
// 
// const primes = sievePrimes(pMax).filter((p) => p > 3);
// const spf = buildSpf(pMax + 10);
// 
// // exact H3 indicator
// const isH3 = new Uint8Array(N + 1);
// let hitCount = 0;
// let a = 1n;
// let b = 2n;
// for (let n = 1; n <= N; n += 1) {
//   if (gcdBig(a, b) === 1n) {
//     isH3[n] = 1;
//     hitCount += 1;
//   }
//   a = 2n * a + 1n;
//   b = 3n * b + 2n;
// }
// 
// const missCount = N - hitCount;
// 
// const mRows = [];
// for (const p of primes) {
//   const o2 = orderMod(2, p, spf);
//   const o3 = orderMod(3, p, spf);
//   const m = lcmInt(o2, o3);
//   mRows.push({ p, ord2: o2, ord3: o3, m });
// }
// 
// const cutoffRows = [];
// for (const pc of pCutoffs) {
//   const moduli = [...new Set(mRows.filter((r) => r.p <= pc).map((r) => r.m))].sort((u, v) => u - v);
//   const covered = new Uint8Array(N + 1);
//   for (const m of moduli) {
//     for (let n = m; n <= N; n += m) covered[n] = 1;
//   }
// 
//   let predictedMiss = 0;
//   let explainedActualMiss = 0;
//   let unexplainedActualMiss = 0;
//   for (let n = 1; n <= N; n += 1) {
//     if (covered[n]) predictedMiss += 1;
//     if (isH3[n] === 0 && covered[n]) explainedActualMiss += 1;
//     if (isH3[n] === 0 && !covered[n]) unexplainedActualMiss += 1;
//   }
// 
//   cutoffRows.push({
//     p_cutoff: pc,
//     distinct_moduli_count: moduli.length,
//     max_modulus: moduli.length ? moduli[moduli.length - 1] : null,
//     predicted_miss_count_from_cutoff_moduli: predictedMiss,
//     predicted_miss_density: predictedMiss / N,
//     implied_good_density_from_cutoff_moduli: 1 - predictedMiss / N,
//     actual_h3_density: hitCount / N,
//     explained_actual_misses: explainedActualMiss,
//     unexplained_actual_misses: unexplainedActualMiss,
//     miss_explained_fraction: missCount > 0 ? explainedActualMiss / missCount : 1,
//   });
// }
// 
// const out = {
//   problem: 'EP-820',
//   method: 'exact_h3_vs_finite_prime-order_moduli_coverings',
//   params: { N, p_cutoffs: pCutoffs },
//   exact_h3: {
//     count: hitCount,
//     density: hitCount / N,
//     miss_count: missCount,
//   },
//   cutoff_rows: cutoffRows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

// ==== Integrated Snippet 5/5 ====
// Source: ep820_order_moduli_covering_metrics_fast.mjs
// Kind: current_script_file
// Label: From ep820_order_moduli_covering_metrics_fast.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function gcdBig(a, b) {
//   let x = a;
//   let y = b;
//   while (y !== 0n) {
//     const t = x % y;
//     x = y;
//     y = t;
//   }
//   return x < 0n ? -x : x;
// }
// 
// function gcdInt(a, b) {
//   let x = a;
//   let y = b;
//   while (y !== 0) {
//     const t = x % y;
//     x = y;
//     y = t;
//   }
//   return Math.abs(x);
// }
// 
// function lcmInt(a, b) {
//   return (a / gcdInt(a, b)) * b;
// }
// 
// function sievePrimes(n) {
//   const isPrime = new Uint8Array(n + 1);
//   isPrime.fill(1);
//   isPrime[0] = 0;
//   isPrime[1] = 0;
//   for (let p = 2; p * p <= n; p += 1) {
//     if (!isPrime[p]) continue;
//     for (let q = p * p; q <= n; q += p) isPrime[q] = 0;
//   }
//   const out = [];
//   for (let i = 2; i <= n; i += 1) if (isPrime[i]) out.push(i);
//   return out;
// }
// 
// function buildSpf(n) {
//   const spf = new Uint32Array(n + 1);
//   for (let i = 2; i <= n; i += 1) {
//     if (spf[i] === 0) {
//       spf[i] = i;
//       if (i <= Math.floor(n / i)) {
//         for (let j = i * i; j <= n; j += i) {
//           if (spf[j] === 0) spf[j] = i;
//         }
//       }
//     }
//   }
//   return spf;
// }
// 
// function factorDistinct(n, spf) {
//   const out = [];
//   let x = n;
//   while (x > 1) {
//     const p = spf[x];
//     out.push(p);
//     while (x % p === 0) x = Math.floor(x / p);
//   }
//   return out;
// }
// 
// function modPow(base, exp, mod) {
//   let b = BigInt(base % mod);
//   let e = BigInt(exp);
//   let m = BigInt(mod);
//   let r = 1n;
//   while (e > 0n) {
//     if (e & 1n) r = (r * b) % m;
//     b = (b * b) % m;
//     e >>= 1n;
//   }
//   return Number(r);
// }
// 
// function orderModWithFactors(a, p, factors) {
//   if (gcdInt(a, p) !== 1) return 0;
//   let ord = p - 1;
//   for (const q of factors) {
//     while (ord % q === 0) {
//       const cand = ord / q;
//       if (modPow(a, cand, p) === 1) ord = cand;
//       else break;
//     }
//   }
//   return ord;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep820_order_moduli_covering_metrics_fast.json');
// 
// const N = Number(process.argv[2] || 12000);
// const pCutoffs = (process.argv[3] || '100,200,500,1000,2000,3000').split(',').map((x) => Number(x));
// const pMax = Math.max(...pCutoffs);
// 
// const primes = sievePrimes(pMax).filter((p) => p > 3);
// const spf = buildSpf(pMax + 10);
// 
// const factorsCache = new Map();
// for (const p of primes) factorsCache.set(p, factorDistinct(p - 1, spf));
// 
// // exact H3 indicator
// const isH3 = new Uint8Array(N + 1);
// let hitCount = 0;
// let a = 1n;
// let b = 2n;
// for (let n = 1; n <= N; n += 1) {
//   if (gcdBig(a, b) === 1n) {
//     isH3[n] = 1;
//     hitCount += 1;
//   }
//   a = 2n * a + 1n;
//   b = 3n * b + 2n;
// }
// 
// const missCount = N - hitCount;
// 
// const mRows = [];
// for (const p of primes) {
//   const fac = factorsCache.get(p);
//   const o2 = orderModWithFactors(2, p, fac);
//   const o3 = orderModWithFactors(3, p, fac);
//   mRows.push({ p, m: lcmInt(o2, o3) });
// }
// 
// const cutoffRows = [];
// for (const pc of pCutoffs) {
//   const moduli = [...new Set(mRows.filter((r) => r.p <= pc).map((r) => r.m))].sort((u, v) => u - v);
//   const covered = new Uint8Array(N + 1);
//   for (const m of moduli) {
//     for (let n = m; n <= N; n += m) covered[n] = 1;
//   }
// 
//   let predictedMiss = 0;
//   let explainedActualMiss = 0;
//   let unexplainedActualMiss = 0;
//   for (let n = 1; n <= N; n += 1) {
//     if (covered[n]) predictedMiss += 1;
//     if (isH3[n] === 0 && covered[n]) explainedActualMiss += 1;
//     if (isH3[n] === 0 && !covered[n]) unexplainedActualMiss += 1;
//   }
// 
//   cutoffRows.push({
//     p_cutoff: pc,
//     distinct_moduli_count: moduli.length,
//     max_modulus: moduli.length ? moduli[moduli.length - 1] : null,
//     predicted_miss_density: predictedMiss / N,
//     implied_good_density: 1 - predictedMiss / N,
//     actual_h3_density: hitCount / N,
//     miss_explained_fraction: missCount > 0 ? explainedActualMiss / missCount : 1,
//     unexplained_actual_misses: unexplainedActualMiss,
//   });
// }
// 
// const out = {
//   problem: 'EP-820',
//   method: 'exact_h3_vs_finite_order_moduli_coverings_fast',
//   params: { N, p_cutoffs: pCutoffs },
//   exact_h3: {
//     count: hitCount,
//     density: hitCount / N,
//     miss_count: missCount,
//   },
//   cutoff_rows: cutoffRows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

