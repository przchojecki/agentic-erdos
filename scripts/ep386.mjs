#!/usr/bin/env node
// Canonical per-problem script for EP-386.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-386',
  source_count: 2,
  source_files: ["ep386_binomial_consecutive_primes_scan.mjs","longterm_batch2_compute.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-386 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/2 ====
// Source: ep386_binomial_consecutive_primes_scan.mjs
// Kind: current_script_file
// Label: From ep386_binomial_consecutive_primes_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// // EP-386 finite scan:
// // Find (n,k) such that C(n,k) is a product of consecutive primes.
// 
// const NMAX = Number(process.env.NMAX || 200000);
// const KMAX = Number(process.env.KMAX || 8);
// 
// function buildSpf(limit) {
//   const spf = new Uint32Array(limit + 1);
//   for (let i = 2; i <= limit; i += 1) {
//     if (spf[i] !== 0) continue;
//     spf[i] = i;
//     if (i <= Math.floor(limit / i)) {
//       for (let j = i * i; j <= limit; j += i) if (spf[j] === 0) spf[j] = i;
//     }
//   }
//   return spf;
// }
// 
// function primesFromSpf(spf) {
//   const out = [];
//   for (let i = 2; i < spf.length; i += 1) if (spf[i] === i) out.push(i);
//   return out;
// }
// 
// function factorInto(x, delta, exps, spf) {
//   let v = x;
//   while (v > 1) {
//     const p = spf[v];
//     let e = 0;
//     while (v % p === 0) {
//       v = Math.floor(v / p);
//       e += 1;
//     }
//     const old = exps.get(p) || 0;
//     const neu = old + delta * e;
//     if (neu === 0) exps.delete(p);
//     else exps.set(p, neu);
//   }
// }
// 
// const spf = buildSpf(NMAX + 5);
// const primes = primesFromSpf(spf);
// const primeIdx = new Map();
// for (let i = 0; i < primes.length; i += 1) primeIdx.set(primes[i], i);
// 
// const hits = [];
// const perK = [];
// 
// for (let k = 2; k <= KMAX; k += 1) {
//   // Start from n=k: C(k,k)=1.
//   const exps = new Map();
//   let hitCount = 0;
//   let firstHit = null;
// 
//   for (let n = k + 1; n <= NMAX; n += 1) {
//     // C(n,k) = C(n-1,k) * n / (n-k)
//     factorInto(n, +1, exps, spf);
//     factorInto(n - k, -1, exps, spf);
// 
//     // Problem range requires k <= n-2.
//     if (n < k + 2) continue;
//     // Avoid symmetric duplicates C(n,k)=C(n,n-k) by keeping k <= n/2.
//     if (k > Math.floor(n / 2)) continue;
// 
//     if (exps.size === 0) continue;
// 
//     // Must be squarefree (all exponents 1) and prime indices consecutive.
//     let squarefree = true;
//     const ps = [];
//     for (const [p, e] of exps.entries()) {
//       if (e !== 1) {
//         squarefree = false;
//         break;
//       }
//       ps.push(p);
//     }
//     if (!squarefree) continue;
//     ps.sort((a, b) => a - b);
// 
//     let consecutive = true;
//     for (let i = 1; i < ps.length; i += 1) {
//       const a = primeIdx.get(ps[i - 1]);
//       const b = primeIdx.get(ps[i]);
//       if (a == null || b == null || b !== a + 1) {
//         consecutive = false;
//         break;
//       }
//     }
//     if (!consecutive) continue;
// 
//     const row = {
//       n,
//       k,
//       prime_factors: ps,
//       product_is_from: ps[0],
//       product_is_to: ps[ps.length - 1],
//     };
//     hits.push(row);
//     hitCount += 1;
//     if (!firstHit) firstHit = row;
//   }
// 
//   perK.push({
//     k,
//     hit_count: hitCount,
//     first_hit: firstHit,
//   });
// }
// 
// const out = {
//   problem: 'EP-386',
//   script: path.basename(process.argv[1]),
//   method: 'exact_incremental_factorization_scan_of_binomials',
//   params: { nmax: NMAX, kmax: KMAX },
//   total_hits: hits.length,
//   per_k: perK,
//   hits_first_200: hits.slice(0, 200),
//   generated_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep386_binomial_consecutive_primes_scan.json');
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// console.log(
//   JSON.stringify(
//     {
//       outPath,
//       nmax: NMAX,
//       kmax: KMAX,
//       total_hits: hits.length,
//       per_k: perK,
//     },
//     null,
//     2
//   )
// );
// 
// ==== End Snippet ====

// ==== Integrated Snippet 2/2 ====
// Source: longterm_batch2_compute.mjs
// Kind: batch_ep_section_from_head
// Label: summarize binomial consecutive primes scans.
// // EP-386: summarize binomial consecutive primes scans.
// if (fs.existsSync('data/ep386_binomial_consecutive_primes_scan.json')) {
//   const d = loadJSON('data/ep386_binomial_consecutive_primes_scan.json');
//   out.results.ep386 = {
//     total_hits: d.total_hits ?? null,
//     per_k: d.per_k || null,
//     last_row: pickLastRow(d),
//   };
// }
// ==== End Snippet ====

// ==== Batch Split Integrations (From HEAD) ====
// Integrated UTC: 2026-03-05T08:56:18.891Z
// ---- Source 1: scripts/longterm_batch2_compute.mjs | summarize binomial consecutive primes scans. ----
// // EP-386: summarize binomial consecutive primes scans.
// if (fs.existsSync('data/ep386_binomial_consecutive_primes_scan.json')) {
//   const d = loadJSON('data/ep386_binomial_consecutive_primes_scan.json');
//   out.results.ep386 = {
//     total_hits: d.total_hits ?? null,
//     per_k: d.per_k || null,
//     last_row: pickLastRow(d),
//   };
// }
// ==== End Batch Split Integrations ====
