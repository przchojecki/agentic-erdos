#!/usr/bin/env node
// Canonical per-problem script for EP-455.
// Auto-generated during repository normalization.

const meta = {
  problem: 'EP-455',
  source_count: 1,
  source_files: ["ep455_prime_convex_gap_greedy_scan.mjs"],
};

if (process.argv.includes('--json')) {
  console.log(JSON.stringify(meta, null, 2));
} else {
  console.log('EP-455 canonical script');
  console.log(`Integrated sections: ${meta.source_count}`);
  console.log('Use --json for machine-readable metadata.');
}

// ==== Integrated Snippet 1/1 ====
// Source: ep455_prime_convex_gap_greedy_scan.mjs
// Kind: current_script_file
// Label: From ep455_prime_convex_gap_greedy_scan.mjs
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
//   const out = [];
//   for (let i = 2; i <= n; i += 1) if (isPrime[i]) out.push(i);
//   return out;
// }
// 
// function lowerBound(arr, x, lo = 0) {
//   let l = lo;
//   let r = arr.length;
//   while (l < r) {
//     const m = (l + r) >> 1;
//     if (arr[m] < x) l = m + 1;
//     else r = m;
//   }
//   return l;
// }
// 
// function greedyFromStart(primes, i, j, targetLen) {
//   const seq = [primes[i], primes[j]];
//   let idx = j;
//   let gap = primes[j] - primes[i];
// 
//   while (seq.length < targetLen) {
//     const need = primes[idx] + gap;
//     const nx = lowerBound(primes, need, idx + 1);
//     if (nx >= primes.length) break;
//     const newGap = primes[nx] - primes[idx];
//     seq.push(primes[nx]);
//     idx = nx;
//     gap = newGap;
//   }
// 
//   return seq;
// }
// 
// const root = process.cwd();
// const outPath = path.join(root, 'data', 'ep455_prime_convex_gap_greedy_scan.json');
// 
// const Pmax = Number(process.argv[2] || 2000000);
// const lenMax = Number(process.argv[3] || 30);
// 
// const primes = sieve(Pmax);
// 
// const startPairs = [];
// for (let i = 0; i < Math.min(60, primes.length); i += 1) {
//   for (let j = i + 1; j < Math.min(140, primes.length); j += 1) {
//     startPairs.push([i, j]);
//   }
// }
// 
// const bestEnd = Array(lenMax + 1).fill(Number.POSITIVE_INFINITY);
// const bestSeq = Array(lenMax + 1).fill(null);
// 
// for (const [i, j] of startPairs) {
//   const seq = greedyFromStart(primes, i, j, lenMax);
//   for (let L = 2; L <= seq.length; L += 1) {
//     const qL = seq[L - 1];
//     if (qL < bestEnd[L]) {
//       bestEnd[L] = qL;
//       bestSeq[L] = seq.slice(0, L);
//     }
//   }
// }
// 
// const rows = [];
// for (let L = 2; L <= lenMax; L += 1) {
//   if (!Number.isFinite(bestEnd[L])) continue;
//   rows.push({
//     length: L,
//     best_end_prime_found: bestEnd[L],
//     best_end_over_L2: bestEnd[L] / (L * L),
//     sequence_prefix: bestSeq[L],
//   });
// }
// 
// const out = {
//   problem: 'EP-455',
//   method: 'greedy_extension_from_many_starts_for_nondecreasing_prime-gap_sequences',
//   params: { Pmax, lenMax, start_pairs: startPairs.length },
//   rows,
//   generated_utc: new Date().toISOString(),
// };
// 
// fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
// process.stderr.write(`Wrote ${outPath}\n`);
// 
// ==== End Snippet ====

