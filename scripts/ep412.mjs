#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function sieveSpf(n) {
  const spf = new Int32Array(n + 1);
  const primes = [];
  for (let i = 2; i <= n; i += 1) {
    if (!spf[i]) {
      spf[i] = i;
      primes.push(i);
      if (i * i <= n) for (let j = i * i; j <= n; j += i) if (!spf[j]) spf[j] = i;
    }
  }
  return { spf, primes };
}

function sigmaByFactorization(n, spf, primes, lim) {
  let x = n;
  let res = 1;
  if (x <= lim) {
    while (x > 1) {
      const p = spf[x];
      let pe = 1;
      let sum = 1;
      while (x % p === 0) {
        x = Math.floor(x / p);
        pe *= p;
        sum += pe;
      }
      res *= sum;
      if (!Number.isFinite(res)) return null;
    }
    return res;
  }
  for (const p of primes) {
    if (p * p > x) break;
    if (x % p !== 0) continue;
    let pe = 1;
    let sum = 1;
    while (x % p === 0) {
      x = Math.floor(x / p);
      pe *= p;
      sum += pe;
    }
    res *= sum;
    if (!Number.isFinite(res)) return null;
  }
  if (x > 1) res *= (1 + x);
  return Number.isFinite(res) ? res : null;
}

const N = Number(process.env.N || 800);
const STEPS = Number(process.env.STEPS || 20);
const CAP = Number(process.env.CAP || 1000000000000000);
const SPFLIM = Number(process.env.SPFLIM || 3000000);
const OUT = process.env.OUT || '';

const { spf, primes } = sieveSpf(SPFLIM);

const trailSets = [];
for (let n = 2; n <= N; n += 1) {
  let x = n;
  const s = new Set([x]);
  let stopped = false;
  for (let i = 0; i < STEPS; i += 1) {
    const y = sigmaByFactorization(x, spf, primes, SPFLIM);
    if (y === null || y > CAP) {
      stopped = true;
      break;
    }
    x = Math.round(y);
    s.add(x);
  }
  trailSets.push({ n, set: s, stopped });
}

const parent = Array(N + 2).fill(0).map((_, i) => i);
function find(x) { while (parent[x] !== x) { parent[x] = parent[parent[x]]; x = parent[x]; } return x; }
function uni(a, b) { const ra = find(a), rb = find(b); if (ra !== rb) parent[rb] = ra; }

let pairsChecked = 0;
let collidingPairs = 0;
let disjointPairs = 0;
const disjointExamples = [];

for (let i = 0; i < trailSets.length; i += 1) {
  const A = trailSets[i];
  for (let j = i + 1; j < trailSets.length; j += 1) {
    const B = trailSets[j];
    pairsChecked += 1;
    let hit = false;
    const small = A.set.size <= B.set.size ? A.set : B.set;
    const big = A.set.size <= B.set.size ? B.set : A.set;
    for (const v of small) {
      if (big.has(v)) {
        hit = true;
        break;
      }
    }
    if (hit) {
      collidingPairs += 1;
      uni(A.n, B.n);
    } else {
      disjointPairs += 1;
      if (disjointExamples.length < 25) disjointExamples.push({ m: A.n, n: B.n });
    }
  }
}

const comp = new Map();
for (let n = 2; n <= N; n += 1) {
  const r = find(n);
  comp.set(r, (comp.get(r) || 0) + 1);
}
const componentSizes = [...comp.values()].sort((a, b) => b - a);

const out = {
  problem: 'EP-412',
  script: path.basename(process.argv[1]),
  method: 'finite_collision_component_profile_for_sigma_iterates',
  params: { N, STEPS, CAP, SPFLIM },
  seeds_considered: N - 1,
  pairs_checked: pairsChecked,
  colliding_pairs_within_window: collidingPairs,
  disjoint_pairs_within_window: disjointPairs,
  disjoint_examples_first_25: disjointExamples,
  connected_component_count: componentSizes.length,
  largest_components: componentSizes.slice(0, 12),
  stopped_early_count: trailSets.filter((x) => x.stopped).length,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
