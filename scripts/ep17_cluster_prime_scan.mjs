#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-17 counterexample-oriented finite scan:
// list cluster primes up to P_MAX.

const P_MAX = Number(process.env.P_MAX || 300000);

function sieve(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= n; i++) {
    if (!isPrime[i]) continue;
    for (let j = i * i; j <= n; j += i) isPrime[j] = 0;
  }
  const ps = [];
  for (let i = 2; i <= n; i++) if (isPrime[i]) ps.push(i);
  return { isPrime, primes: ps };
}

const { primes } = sieve(P_MAX);
const canDiff = new Uint8Array(P_MAX + 1); // canDiff[n]=1 if n=q1-q2 for primes in current prefix
const clusterPrimes = [];
const checkpoints = [];

const pref = [];
for (const p of primes) {
  // add differences p-q for previous q
  for (const q of pref) {
    const d = p - q;
    if (d <= P_MAX) canDiff[d] = 1;
  }
  pref.push(p);

  let ok = true;
  for (let n = 2; n <= p - 3; n += 2) {
    if (!canDiff[n]) {
      ok = false;
      break;
    }
  }
  if (ok) clusterPrimes.push(p);
  if (p <= 2000 || p % 50000 === 1) checkpoints.push({ p, cluster_count: clusterPrimes.length });
}

const out = {
  script: path.basename(process.argv[1]),
  p_max: P_MAX,
  cluster_primes_count: clusterPrimes.length,
  largest_cluster_prime_found: clusterPrimes.length ? clusterPrimes[clusterPrimes.length - 1] : null,
  first_cluster_primes: clusterPrimes.slice(0, 80),
  last_cluster_primes: clusterPrimes.slice(-40),
  checkpoints,
  timestamp_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep17_cluster_prime_scan.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2));
console.log(JSON.stringify({ outPath, p_max: P_MAX, count: clusterPrimes.length }, null, 2));
