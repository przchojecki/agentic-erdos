#!/usr/bin/env node
// Canonical per-problem script for EP-218.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-218',
  source_count: 1,
  source_files: ["ep218_prime_gap_monotonicity_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-218 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep218_prime_gap_monotonicity_scan.mjs
// Kind: current_script_file
// Label: From ep218_prime_gap_monotonicity_scan.mjs
// #!/usr/bin/env node
// import fs from 'node:fs';
// import path from 'node:path';
// 
// const N_MAX = Number(process.env.N_MAX || 1000000);
// 
// function sievePrimes(n) {
//   const isPrime = new Uint8Array(n + 1);
//   isPrime.fill(1);
//   isPrime[0] = 0;
//   isPrime[1] = 0;
//   for (let i = 2; i * i <= n; i++) if (isPrime[i]) for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
//   const primes = [];
//   for (let i = 2; i <= n; i++) if (isPrime[i]) primes.push(i);
//   return primes;
// }
// 
// const approxPrimeUpper = Math.max(1000, Math.floor(N_MAX * (Math.log(Math.max(3, N_MAX)) + Math.log(Math.log(Math.max(3, N_MAX)))) + 10000));
// const primes = sievePrimes(approxPrimeUpper);
// const d = [];
// for (let i = 0; i + 1 < primes.length && i + 1 <= N_MAX + 1; i++) {
//   const p = primes[i];
//   d.push(primes[i + 1] - p);
// }
// 
// const checkpoints = [10000, 30000, 100000, 300000, N_MAX].filter((x, i, a) => x <= N_MAX && a.indexOf(x) === i);
// let cpIdx = 0;
// let ge = 0;
// let le = 0;
// let eq = 0;
// const rows = [];
// 
// for (let i = 0; i + 1 < d.length; i++) {
//   if (d[i + 1] >= d[i]) ge++;
//   if (d[i + 1] <= d[i]) le++;
//   if (d[i + 1] === d[i]) eq++;
// 
//   const nIndex = i + 1;
//   while (cpIdx < checkpoints.length && nIndex >= checkpoints[cpIdx]) {
//     const m = i + 1;
//     rows.push({
//       x: checkpoints[cpIdx],
//       comparisons_used: m,
//       proportion_ge: Number((ge / m).toFixed(6)),
//       proportion_le: Number((le / m).toFixed(6)),
//       equal_count: eq,
//       equal_frequency: Number((eq / m).toFixed(6)),
//     });
//     cpIdx++;
//   }
// }
// 
// const out = {
//   script: path.basename(process.argv[1]),
//   n_max: N_MAX,
//   checkpoints: rows,
//   timestamp_utc: new Date().toISOString(),
// };
// 
// const outPath = path.join('data', 'ep218_prime_gap_monotonicity_scan.json');
// fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
// console.log(JSON.stringify({ outPath, n_max: N_MAX, rows: rows.length }, null, 2));
// 
// ==== End Snippet ====

