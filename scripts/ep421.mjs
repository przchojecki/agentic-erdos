#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function buildByForbiddenPrime(N, p) {
  const a = [];
  for (let n = 1; n <= N; n += 1) if (n % p !== 0) a.push(n);
  return a;
}

function greedyCollisionFreePrefix(N, targetLen) {
  const seq = [];
  const seen = new Set();
  // use two modular fingerprints for interval products to avoid huge integers
  const MOD1 = 1000000007n;
  const MOD2 = 1000000009n;
  const pref1 = [1n];
  const pref2 = [1n];

  function modPow(a, e, mod) {
    let b = a % mod;
    let exp = e;
    let res = 1n;
    while (exp > 0n) {
      if (exp & 1n) res = (res * b) % mod;
      b = (b * b) % mod;
      exp >>= 1n;
    }
    return res;
  }
  function modInv(a, mod) {
    return modPow(a, mod - 2n, mod);
  }

  for (let cand = 2; cand <= N && seq.length < targetLen; cand += 1) {
    const c1 = BigInt(cand) % MOD1;
    const c2 = BigInt(cand) % MOD2;
    pref1.push((pref1[pref1.length - 1] * c1) % MOD1);
    pref2.push((pref2[pref2.length - 1] * c2) % MOD2);
    seq.push(cand);

    let ok = true;
    const m = seq.length;
    const newKeys = [];
    for (let u = 1; u <= m; u += 1) {
      const inv1 = modInv(pref1[u - 1], MOD1);
      const inv2 = modInv(pref2[u - 1], MOD2);
      const k1 = (pref1[m] * inv1) % MOD1;
      const k2 = (pref2[m] * inv2) % MOD2;
      const key = `${k1.toString()}:${k2.toString()}`;
      if (seen.has(key)) {
        ok = false;
        break;
      }
      newKeys.push(key);
    }

    if (!ok) {
      seq.pop();
      pref1.pop();
      pref2.pop();
      continue;
    }
    for (const k of newKeys) seen.add(k);
  }
  return seq;
}

function intervalCollisionStats(seq) {
  const MOD1 = 1000000007n;
  const MOD2 = 1000000009n;
  const pref1 = [1n], pref2 = [1n];
  for (const x of seq) {
    pref1.push((pref1[pref1.length - 1] * (BigInt(x) % MOD1)) % MOD1);
    pref2.push((pref2[pref2.length - 1] * (BigInt(x) % MOD2)) % MOD2);
  }
  function modPow(a, e, mod) {
    let b = a % mod;
    let exp = e;
    let res = 1n;
    while (exp > 0n) {
      if (exp & 1n) res = (res * b) % mod;
      b = (b * b) % mod;
      exp >>= 1n;
    }
    return res;
  }
  function modInv(a, mod) {
    return modPow(a, mod - 2n, mod);
  }
  const seen = new Set();
  let coll = 0;
  for (let u = 1; u <= seq.length; u += 1) {
    for (let v = u; v <= seq.length; v += 1) {
      const k1 = (pref1[v] * modInv(pref1[u - 1], MOD1)) % MOD1;
      const k2 = (pref2[v] * modInv(pref2[u - 1], MOD2)) % MOD2;
      const key = `${k1.toString()}:${k2.toString()}`;
      if (seen.has(key)) coll += 1;
      else seen.add(key);
    }
  }
  return { interval_count: (seq.length * (seq.length + 1)) / 2, collisions: coll };
}

const N = Number(process.env.N || 2000);
const GREEDY_LEN = Number(process.env.GREEDY_LEN || 220);
const OUT = process.env.OUT || '';

const oddSeq = buildByForbiddenPrime(N, 2);
const no3Seq = buildByForbiddenPrime(N, 3);
const greedy = greedyCollisionFreePrefix(N, GREEDY_LEN);

const out = {
  problem: 'EP-421',
  script: path.basename(process.argv[1]),
  method: 'finite_density_and_collision_profiles_for_candidate_sequences',
  params: { N, GREEDY_LEN },
  candidates: [
    {
      name: 'all_odd_numbers_up_to_N',
      length: oddSeq.length,
      density: Number((oddSeq.length / N).toPrecision(8)),
      stats_prefix_140: intervalCollisionStats(oddSeq.slice(0, 140)),
    },
    {
      name: 'all_nonmultiples_of_3_up_to_N',
      length: no3Seq.length,
      density: Number((no3Seq.length / N).toPrecision(8)),
      stats_prefix_140: intervalCollisionStats(no3Seq.slice(0, 140)),
    },
    {
      name: 'greedy_collision_free_prefix',
      length: greedy.length,
      density_relative_to_N: Number((greedy.length / N).toPrecision(8)),
      first_80_terms: greedy.slice(0, 80),
      stats_full: intervalCollisionStats(greedy),
    },
  ],
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
