#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveSpf(n) {
  const spf = new Int32Array(n + 1);
  for (let i = 2; i <= n; i += 1) if (!spf[i]) {
    spf[i] = i;
    if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
  }
  return spf;
}

function primeList(n, spf) {
  const ps = [];
  for (let i = 2; i <= n; i += 1) if (spf[i] === i) ps.push(i);
  return ps;
}

const M = Number(process.env.M || 1200);
const OUT = process.env.OUT || '';

const spf = sieveSpf(M);
const primes = primeList(M, spf);
const pIndex = new Map(primes.map((p, i) => [p, i]));

const sig = Array(M + 1).fill(0n);
for (let n = 1; n <= M; n += 1) {
  let x = n;
  let delta = 0n;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    if (e & 1) delta ^= 1n << BigInt(pIndex.get(p));
  }
  sig[n] = sig[n - 1] ^ delta;
}

const best = new Int8Array(M + 1);
best.fill(99);
const seenSig = new Set([sig[1]]);
const pairXor = new Set();

for (let m = 2; m <= M; m += 1) {
  if (seenSig.has(sig[m])) best[m] = 2;
  if (pairXor.has(sig[m].toString()) && best[m] > 3) best[m] = 3;
  for (let i = 1; i < m; i += 1) pairXor.add((sig[i] ^ sig[m]).toString());
  seenSig.add(sig[m]);
}

const milestones = [200, 400, 600, 800, 1000, 1200].filter((x) => x <= M);
const rows = [];
for (const X of milestones) {
  let d2 = 0, d3 = 0, unresolved = 0, primeIn = 0;
  for (let m = 2; m <= X; m += 1) {
    if (best[m] === 2) {
      d2 += 1;
      if (spf[m] === m) primeIn += 1;
    } else if (best[m] === 3) {
      d3 += 1;
      if (spf[m] === m) primeIn += 1;
    } else unresolved += 1;
  }
  rows.push({ X, D2_count: d2, D3_count: d3, unresolved_or_ge4_count: unresolved, prime_count_in_D2_or_D3: primeIn });
}

const out = {
  problem: 'EP-374',
  script: path.basename(process.argv[1]),
  method: 'extended_exact_D2_D3_profile_via_factorial_parity_signatures',
  params: { M },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
