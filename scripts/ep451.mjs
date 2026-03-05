#!/usr/bin/env node
// Canonical per-problem script for EP-451.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-451',
  source_count: 1,
  source_files: ["ep451_nk_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-451 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep451_nk_scan.mjs
// Kind: current_script_file
// Label: From ep451_nk_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function sieve(n) {
//   const isPrime = new Uint8Array(n + 1);
//   isPrime.fill(1);
//   isPrime[0] = 0;
//   isPrime[1] = 0;
//   for (let p = 2; p * p <= n; p += 1) {
//     if (!isPrime[p]) continue;
//     for (let q = p * p; q <= n; q += p) isPrime[q] = 0;
//   }
//   const primes = [];
//   for (let i = 2; i <= n; i += 1) if (isPrime[i]) primes.push(i);
//   return { isPrime, primes };
// }
// 
// function findNk(k, cap, primesInWindow) {
//   for (let n = 2 * k + 1; n <= cap; n += 1) {
//     let ok = true;
//     for (const p of primesInWindow) {
//       // Need no i in [1..k] with p | (n-i), i.e. n mod p not in {1..k} modulo p.
//       const r = n % p;
//       const bad = r === 0 ? p : r;
//       if (bad <= k) {
//         ok = false;
//         break;
//       }
//     }
//     if (ok) return n;
//   }
//   return null;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep451_nk_scan.json');
// 
// const Kmax = Number(process.argv[2] || 140);
// const capFactor = Number(process.argv[3] || 600);
// 
// const { primes } = sieve(2 * Kmax + 200);
// 
// const rows = [];
// for (let k = 2; k <= Kmax; k += 1) {
//   const pw = primes.filter((p) => p > k && p < 2 * k);
//   const cap = Math.max(2 * k + 20, capFactor * k);
//   const nk = findNk(k, cap, pw);
//   rows.push({
//     k,
//     prime_count_in_k_2k: pw.length,
//     search_cap: cap,
//     n_k_found: nk,
//     ratio_nk_over_k: nk ? nk / k : null,
//     ratio_nk_over_k_logk: nk ? nk / (k * Math.log(k)) : null,
//   });
//   process.stderr.write(`k=${k}, nk=${nk}, ratio=${nk ? (nk / k).toFixed(3) : 'null'}\n`);
// }
// 
// const unresolved = rows.filter((r) => r.n_k_found == null).length;
// 
// const out = {
//   problem: 'EP-451',
//   method: 'direct_modular_scan_for_smallest_n_avoiding_prime_divisors_in_(k,2k)',
//   params: { Kmax, capFactor },
//   unresolved_count: unresolved,
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

