#!/usr/bin/env node

// Targeted exact solver for EP-43 at larger N.
// Uses canonical Sidon masks + weight-class disjointness checks.
//
// Usage:
//   node scripts/ep43_search_targeted.mjs 50

const N = Number(process.argv[2] || 50);
if (!Number.isInteger(N) || N < 2) {
  console.error('Usage: node scripts/ep43_search_targeted.mjs <N>=50');
  process.exit(1);
}

const U = N - 1; // difference universe size: {1,...,N-1}
const U_MASK = (1n << BigInt(U)) - 1n;
const MASK16 = (1n << 16n) - 1n;

function choose2(x) {
  return (x * (x - 1)) / 2;
}

function diffBit(d) {
  return 1n << BigInt(d - 1);
}

function buildPopcount16() {
  const pc = new Uint8Array(1 << 16);
  for (let i = 1; i < pc.length; i++) pc[i] = pc[i >> 1] + (i & 1);
  return pc;
}

const POP16 = buildPopcount16();

function canonicalEntries(N) {
  const byMask = new Map();
  const arr = [];
  let mask = 0n;

  function putCurrent() {
    const key = mask.toString();
    if (!byMask.has(key)) {
      byMask.set(key, {
        mask,
        size: arr.length,
        weight: choose2(arr.length),
        set: arr.slice(),
      });
    }
  }

  // Empty set
  putCurrent();

  // Canonical non-empty sets: minimum fixed to 1.
  arr.push(1);
  putCurrent();

  function rec(next) {
    for (let x = next; x <= N; x++) {
      let ok = true;
      let addMask = 0n;
      for (let i = 0; i < arr.length; i++) {
        const bit = diffBit(x - arr[i]);
        if ((mask & bit) !== 0n || (addMask & bit) !== 0n) {
          ok = false;
          break;
        }
        addMask |= bit;
      }
      if (!ok) continue;

      arr.push(x);
      mask |= addMask;
      putCurrent();
      rec(x + 1);
      mask ^= addMask;
      arr.pop();
    }
  }

  rec(2);
  arr.pop();

  const entries = [...byMask.values()];
  return { entries, byMask };
}

function byWeight(entries) {
  const map = new Map();
  for (const e of entries) {
    if (!map.has(e.weight)) map.set(e.weight, []);
    map.get(e.weight).push(e);
  }
  return map;
}

function weightPairsForSum(sum, weightsDesc) {
  const pairs = [];
  for (let i = 0; i < weightsDesc.length; i++) {
    const wa = weightsDesc[i];
    const wb = sum - wa;
    if (wb > wa) continue;
    if (!weightsDesc.includes(wb)) continue;
    pairs.push([wa, wb]);
  }
  return pairs;
}

function bruteExistsDisjoint(A, B, sameClass) {
  if (!sameClass) {
    for (let i = 0; i < A.length; i++) {
      const a = A[i];
      for (let j = 0; j < B.length; j++) {
        const b = B[j];
        if ((a.mask & b.mask) === 0n) return [a, b];
      }
    }
    return null;
  }

  for (let i = 0; i < A.length; i++) {
    const a = A[i];
    for (let j = i + 1; j < A.length; j++) {
      const b = A[j];
      if ((a.mask & b.mask) === 0n) return [a, b];
    }
  }
  return null;
}

function buildChunkIndex(B) {
  const low = new Map();
  const mid = new Map();

  for (const b of B) {
    const kLow = Number(b.mask & MASK16);
    const kMid = Number((b.mask >> 16n) & MASK16);

    if (!low.has(kLow)) low.set(kLow, []);
    if (!mid.has(kMid)) mid.set(kMid, []);
    low.get(kLow).push(b);
    mid.get(kMid).push(b);
  }

  return { low, mid };
}

function existsDisjointIndexed(A, B, sameClass) {
  const { low, mid } = buildChunkIndex(B);

  function testList(a, list) {
    if (!list) return null;
    for (let i = 0; i < list.length; i++) {
      const b = list[i];
      if (sameClass && a.mask === b.mask) continue;
      if ((a.mask & b.mask) === 0n) return [a, b];
    }
    return null;
  }

  for (let i = 0; i < A.length; i++) {
    const a = A[i];
    const c = U_MASK ^ a.mask;

    const cLow = Number(c & MASK16);
    const cMid = Number((c >> 16n) & MASK16);
    const tLow = POP16[cLow];
    const tMid = POP16[cMid];

    if (tLow <= tMid) {
      for (let s = cLow; ; s = (s - 1) & cLow) {
        const hit = testList(a, low.get(s));
        if (hit) return hit;
        if (s === 0) break;
      }
    } else {
      for (let s = cMid; ; s = (s - 1) & cMid) {
        const hit = testList(a, mid.get(s));
        if (hit) return hit;
        if (s === 0) break;
      }
    }
  }

  return null;
}

function existsDisjoint(A, B, sameClass) {
  const pairCount = sameClass
    ? (A.length * (A.length - 1)) / 2
    : A.length * B.length;

  // Cheap direct scan when candidate space is modest.
  if (pairCount <= 5e7) {
    return bruteExistsDisjoint(A, B, sameClass);
  }

  // For large candidate space, use chunk-indexed disjoint lookup.
  return existsDisjointIndexed(A, B, sameClass);
}

const t0 = Date.now();
const { entries } = canonicalEntries(N);
const t1 = Date.now();

const weightMap = byWeight(entries);
const weights = [...weightMap.keys()].sort((a, b) => b - a);
let fN = 0;
for (const e of entries) {
  if (e.size > fN) fN = e.size;
}
const rhs = choose2(fN);

// Candidate sums are exactly sums of two existing weights, bounded by U.
const candidateSums = [...new Set(
  weights.flatMap((wa) => weights.map((wb) => wa + wb))
)]
  .filter((s) => s <= U)
  .sort((a, b) => b - a);

let best = -1;
let bestPair = null;
let bestWeightPair = null;
const checks = [];

for (const sum of candidateSums) {
  const pairs = weightPairsForSum(sum, weights);
  let foundForSum = null;
  let foundWeightPair = null;

  for (const [wa, wb] of pairs) {
    const A = weightMap.get(wa) || [];
    const B = weightMap.get(wb) || [];
    if (A.length === 0 || B.length === 0) continue;

    const sameClass = wa === wb;
    const tStart = Date.now();
    const found = existsDisjoint(A, B, sameClass);
    const tEnd = Date.now();

    checks.push({
      sum,
      wa,
      wb,
      countA: A.length,
      countB: B.length,
      found: Boolean(found),
      check_ms: tEnd - tStart,
    });

    if (found) {
      foundForSum = found;
      foundWeightPair = [wa, wb];
      break;
    }
  }

  if (foundForSum) {
    best = sum;
    bestPair = foundForSum;
    bestWeightPair = foundWeightPair;
    break;
  }
}

const t2 = Date.now();

if (bestPair == null) {
  console.error('No disjoint pair found at any candidate sum (unexpected).');
  process.exit(2);
}

const [A, B] = bestPair;

const result = {
  N,
  universe_differences: U,
  canonical_masks_count: entries.length,
  fN,
  rhs_choose2_fN: rhs,
  best_lhs: best,
  gap_best_minus_rhs: best - rhs,
  best_weight_pair: bestWeightPair,
  best_A_size: A.size,
  best_B_size: B.size,
  best_A: A.set,
  best_B: B.set,
  candidate_sums_desc: candidateSums,
  checks,
  generation_ms: t1 - t0,
  solve_ms: t2 - t1,
  total_ms: t2 - t0,
  method: 'targeted_weight_sum_exact_v1',
};

console.log(JSON.stringify(result, null, 2));
