#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function gcd(a, b) {
  let x = a;
  let y = b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x < 0n ? -x : x;
}

function gcdInt(a, b) {
  let x = a;
  let y = b;
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return Math.abs(x);
}

function lcmInt(a, b) {
  return (a / gcdInt(a, b)) * b;
}

function sievePrimes(n) {
  const isPrime = new Uint8Array(n + 1);
  isPrime.fill(1);
  isPrime[0] = 0;
  isPrime[1] = 0;
  for (let p = 2; p * p <= n; p += 1) {
    if (!isPrime[p]) continue;
    for (let q = p * p; q <= n; q += p) isPrime[q] = 0;
  }
  const out = [];
  for (let i = 2; i <= n; i += 1) if (isPrime[i]) out.push(i);
  return out;
}

function buildSpf(n) {
  const spf = new Uint32Array(n + 1);
  for (let i = 2; i <= n; i += 1) {
    if (spf[i] === 0) {
      spf[i] = i;
      if (i <= Math.floor(n / i)) {
        for (let j = i * i; j <= n; j += i) {
          if (spf[j] === 0) spf[j] = i;
        }
      }
    }
  }
  return spf;
}

function factorInt(n, spf) {
  const out = [];
  let x = n;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    out.push([p, e]);
  }
  return out;
}

function modPow(base, exp, mod) {
  let b = BigInt(base % mod);
  let e = BigInt(exp);
  let m = BigInt(mod);
  let r = 1n;
  while (e > 0n) {
    if (e & 1n) r = (r * b) % m;
    b = (b * b) % m;
    e >>= 1n;
  }
  return Number(r);
}

function orderMod(a, p, spf) {
  if (gcdInt(a, p) !== 1) return 0;
  let ord = p - 1;
  const fac = factorInt(p - 1, spf);
  for (const [q] of fac) {
    while (ord % q === 0) {
      const cand = ord / q;
      if (modPow(a, cand, p) === 1) ord = cand;
      else break;
    }
  }
  return ord;
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep820_h3_structure_scan.json');

const N = Number(process.argv[2] || 12000);
const pMax = Number(process.argv[3] || 5000);

// Exact H(n)=3 indicator via recurrence for gcd(2^n-1,3^n-1)
const isH3 = new Uint8Array(N + 1);
let a = 1n; // 2^1-1
let b = 2n; // 3^1-1
const hits = [];
const misses = [];
let lastHit = 0;
let maxHitGap = 0;

for (let n = 1; n <= N; n += 1) {
  const g = gcd(a, b);
  if (g === 1n) {
    isH3[n] = 1;
    hits.push(n);
    if (lastHit > 0 && n - lastHit > maxHitGap) maxHitGap = n - lastHit;
    lastHit = n;
  } else {
    misses.push(n);
  }

  a = 2n * a + 1n;
  b = 3n * b + 2n;
  if (n % 2000 === 0) process.stderr.write(`gcd-scan n=${n}/${N}\n`);
}

// Prime-order witness decomposition
const primes = sievePrimes(pMax).filter((p) => p > 3);
const spf = buildSpf(pMax + 10);
const mRows = [];
for (const p of primes) {
  const o2 = orderMod(2, p, spf);
  const o3 = orderMod(3, p, spf);
  const m = lcmInt(o2, o3);
  mRows.push({ p, ord2: o2, ord3: o3, m });
}

mRows.sort((u, v) => u.m - v.m || u.p - v.p);

const witnessCount = new Map();
let coveredMisses = 0;
let uncoveredMisses = 0;
const uncoveredSample = [];

for (const n of misses) {
  let witness = null;
  for (const row of mRows) {
    if (row.m > n) break;
    if (n % row.m === 0) {
      witness = row.p;
      break;
    }
  }
  if (witness == null) {
    uncoveredMisses += 1;
    if (uncoveredSample.length < 80) uncoveredSample.push(n);
  } else {
    coveredMisses += 1;
    witnessCount.set(witness, (witnessCount.get(witness) || 0) + 1);
  }
}

const topWitnesses = [...witnessCount.entries()]
  .map(([p, count]) => ({ p, count }))
  .sort((a, b) => b.count - a.count || a.p - b.p)
  .slice(0, 30);

const buckets = [1000, 2000, 5000, 8000, 10000, 12000].filter((x) => x <= N);
const densityRows = buckets.map((u) => {
  let c = 0;
  for (const n of hits) if (n <= u) c += 1;
  return { upto: u, h3_count: c, h3_density: c / u };
});

const out = {
  problem: 'EP-820',
  method: 'exact_h3_indicator_plus_prime-order_witness_decomposition',
  params: { N, pMax },
  h3_summary: {
    count: hits.length,
    density: hits.length / N,
    max_hit_gap: maxHitGap,
    first_hits: hits.slice(0, 120),
    last_hits: hits.slice(Math.max(0, hits.length - 120)),
    density_rows: densityRows,
  },
  miss_summary: {
    count: misses.length,
    covered_by_prime_order_table: coveredMisses,
    uncovered_by_prime_order_table: uncoveredMisses,
    uncovered_sample: uncoveredSample,
    top_witness_primes: topWitnesses,
  },
  prime_order_rows_small_m: mRows.slice(0, 120),
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
