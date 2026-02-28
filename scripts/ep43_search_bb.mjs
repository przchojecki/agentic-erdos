#!/usr/bin/env node

// Exact EP-43 search with symmetry reduction + branch-and-bound.
// Usage:
//   node scripts/ep43_search_bb.mjs 40
//   node scripts/ep43_search_bb.mjs 25 40

const a1 = process.argv[2];
const a2 = process.argv[3];

let startN;
let endN;
if (a1 && a2) {
  startN = Number(a1);
  endN = Number(a2);
} else {
  startN = 2;
  endN = Number(a1 || 40);
}

if (!Number.isInteger(startN) || !Number.isInteger(endN) || startN < 2 || endN < startN) {
  console.error('Invalid arguments. Use: node scripts/ep43_search_bb.mjs [N] or [startN endN]');
  process.exit(1);
}

function choose2(x) {
  return (x * (x - 1)) / 2;
}

function popcountBigInt(x) {
  let c = 0;
  let v = x;
  while (v !== 0n) {
    v &= v - 1n;
    c += 1;
  }
  return c;
}

function diffBit(d) {
  // difference d in [1, N-1] -> bit (d-1)
  return 1n << BigInt(d - 1);
}

function canonicalSidonMasks(N) {
  // Keep unique masks; for each mask store one representative canonical set.
  const byMask = new Map();
  let maxSetSize = 0;

  function put(mask, arr) {
    const key = mask.toString();
    if (!byMask.has(key)) {
      byMask.set(key, {
        mask,
        weight: choose2(arr.length),
        size: arr.length,
        set: arr.slice(),
      });
    }
  }

  // Empty set
  put(0n, []);

  // Canonical non-empty sets: min element fixed to 1.
  const arr = [1];
  let mask = 0n;
  put(mask, arr);
  maxSetSize = 1;

  function rec(next) {
    for (let x = next; x <= N; x++) {
      let ok = true;
      let addMask = 0n;
      for (let i = 0; i < arr.length; i++) {
        const d = x - arr[i];
        const bit = diffBit(d);
        if ((mask & bit) !== 0n || (addMask & bit) !== 0n) {
          ok = false;
          break;
        }
        addMask |= bit;
      }
      if (!ok) continue;

      arr.push(x);
      mask |= addMask;
      if (arr.length > maxSetSize) maxSetSize = arr.length;
      put(mask, arr);

      rec(x + 1);

      mask ^= addMask;
      arr.pop();
    }
  }

  rec(2);

  const entries = [...byMask.values()];
  entries.sort((u, v) => {
    if (v.weight !== u.weight) return v.weight - u.weight;
    if (v.size !== u.size) return v.size - u.size;
    return 0;
  });

  return { entries, maxSetSize };
}

function bestDisjointPair(entries) {
  const m = entries.length;
  if (m === 0) {
    return { best: 0, i: -1, j: -1, checkedPairs: 0 };
  }

  const topWeight = entries[0].weight;
  let best = -1;
  let bestI = -1;
  let bestJ = -1;
  let checkedPairs = 0;

  for (let i = 0; i < m; i++) {
    const wi = entries[i].weight;
    if (wi + topWeight < best) break;

    for (let j = i; j < m; j++) {
      const wj = entries[j].weight;
      const ub = wi + wj;
      if (ub < best) break;

      checkedPairs += 1;
      if ((entries[i].mask & entries[j].mask) === 0n) {
        if (ub > best) {
          best = ub;
          bestI = i;
          bestJ = j;
        }
      }
    }
  }

  return { best, i: bestI, j: bestJ, checkedPairs };
}

for (let N = startN; N <= endN; N++) {
  const t0 = Date.now();
  const { entries, maxSetSize } = canonicalSidonMasks(N);
  const t1 = Date.now();

  const { best, i, j, checkedPairs } = bestDisjointPair(entries);
  const t2 = Date.now();

  const rhs = choose2(maxSetSize);
  const A = i >= 0 ? entries[i].set : [];
  const B = j >= 0 ? entries[j].set : [];

  const weightHistogram = {};
  for (const e of entries) {
    const k = String(e.weight);
    weightHistogram[k] = (weightHistogram[k] || 0) + 1;
  }

  console.log(
    JSON.stringify({
      N,
      canonical_masks_count: entries.length,
      fN: maxSetSize,
      rhs_choose2_fN: rhs,
      best_lhs: best,
      gap_best_minus_rhs: best - rhs,
      best_A_size: A.length,
      best_B_size: B.length,
      best_A: A,
      best_B: B,
      checked_pairs: checkedPairs,
      gen_ms: t1 - t0,
      pair_ms: t2 - t1,
      total_ms: t2 - t0,
      top_weight: entries[0]?.weight ?? 0,
      top_weight_count: weightHistogram[String(entries[0]?.weight ?? 0)] || 0,
    })
  );
}
