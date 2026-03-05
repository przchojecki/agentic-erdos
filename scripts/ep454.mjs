#!/usr/bin/env node
// Canonical per-problem script for EP-454.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-454',
  source_count: 1,
  source_files: ["ep454_prime_graph_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-454 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep454_prime_graph_scan.mjs
// Kind: current_script_file
// Label: From ep454_prime_graph_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// function sieve(limit) {
//   const isPrime = new Uint8Array(limit + 1);
//   isPrime.fill(1);
//   isPrime[0] = 0;
//   isPrime[1] = 0;
//   for (let p = 2; p * p <= limit; p += 1) {
//     if (!isPrime[p]) continue;
//     for (let q = p * p; q <= limit; q += p) isPrime[q] = 0;
//   }
//   const primes = [];
//   for (let i = 2; i <= limit; i += 1) if (isPrime[i]) primes.push(i);
//   return { isPrime, primes };
// }
// 
// function upperForNthPrime(n) {
//   if (n < 6) return 15;
//   return Math.ceil(n * (Math.log(n) + Math.log(Math.log(n)) + 3));
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep454_prime_graph_scan.json');
// 
// const Nmax = Number(process.argv[2] || 12000);
// 
// const needPrimeCount = 2 * Nmax + 100;
// let lim = upperForNthPrime(needPrimeCount);
// let primes = [];
// while (true) {
//   const r = sieve(lim);
//   primes = r.primes;
//   if (primes.length >= needPrimeCount) break;
//   lim *= 2;
// }
// 
// const P = [0, ...primes]; // 1-indexed
// 
// let bestDelta = -1e18;
// let bestN = null;
// let bestI = null;
// const firstAtLeast = {};
// for (let t = 1; t <= 20; t += 1) firstAtLeast[t] = null;
// 
// const checkpoints = [];
// for (let n = 2; n <= Nmax; n += 1) {
//   let mn = Number.POSITIVE_INFINITY;
//   let arg = -1;
//   const pn = P[n];
// 
//   for (let i = 1; i < n; i += 1) {
//     const s = P[n + i] + P[n - i];
//     if (s < mn) {
//       mn = s;
//       arg = i;
//     }
//   }
// 
//   const delta = mn - 2 * pn;
//   if (delta > bestDelta) {
//     bestDelta = delta;
//     bestN = n;
//     bestI = arg;
//   }
// 
//   for (let t = 1; t <= 20; t += 1) {
//     if (delta >= t && firstAtLeast[t] == null) firstAtLeast[t] = n;
//   }
// 
//   if (n % 1000 === 0) {
//     checkpoints.push({ n, best_delta_up_to_n: bestDelta, best_n_up_to_n: bestN });
//     process.stderr.write(`n=${n}, bestDelta=${bestDelta}, bestN=${bestN}\n`);
//   }
// }
// 
// const out = {
//   problem: 'EP-454',
//   method: 'exact_scan_of_f(n)=min_{1<=i<n}(p_{n+i}+p_{n-i})',
//   params: { Nmax, prime_limit_used: lim },
//   best_record: { n: bestN, i: bestI, delta: bestDelta },
//   first_n_with_delta_at_least_t: firstAtLeast,
//   checkpoints,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

