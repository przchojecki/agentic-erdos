#!/usr/bin/env node

const maxN = Number(process.argv[2] || 36);

function choose2(x) {
  return (x * (x - 1)) / 2;
}

function makeSidonSets(N) {
  const sets = [];
  const diffs = [];

  function rec(next, arr, diffSet) {
    // record every set (including empty/singleton)
    sets.push(arr.slice());
    diffs.push(new Set(diffSet));

    for (let x = next; x <= N; x++) {
      let ok = true;
      const newDiffs = [];
      for (let i = 0; i < arr.length; i++) {
        const d = x - arr[i];
        if (diffSet.has(d)) {
          ok = false;
          break;
        }
        newDiffs.push(d);
      }
      if (!ok) continue;

      arr.push(x);
      for (const d of newDiffs) diffSet.add(d);
      rec(x + 1, arr, diffSet);
      for (const d of newDiffs) diffSet.delete(d);
      arr.pop();
    }
  }

  rec(1, [], new Set());
  return { sets, diffs };
}

function maxSidonSize(sets) {
  let best = 0;
  for (const s of sets) if (s.length > best) best = s.length;
  return best;
}

function disjointDiffs(d1, d2) {
  // d1,d2 are positive-difference sets; A-A and B-B intersect only at 0 iff d1,d2 disjoint
  if (d1.size > d2.size) {
    const tmp = d1;
    d1 = d2;
    d2 = tmp;
  }
  for (const x of d1) if (d2.has(x)) return false;
  return true;
}

for (let N = 2; N <= maxN; N++) {
  const { sets, diffs } = makeSidonSets(N);
  const fN = maxSidonSize(sets);
  const rhs = choose2(fN);

  let best = -1;
  let bestPair = null;

  for (let i = 0; i < sets.length; i++) {
    const Ai = sets[i];
    const di = diffs[i];
    const valA = choose2(Ai.length);
    if (valA > best) {
      // B empty always valid, quick lower bound
      best = valA;
      bestPair = [Ai, []];
    }

    for (let j = i; j < sets.length; j++) {
      const Bj = sets[j];
      const dj = diffs[j];
      if (!disjointDiffs(di, dj)) continue;
      const val = choose2(Ai.length) + choose2(Bj.length);
      if (val > best) {
        best = val;
        bestPair = [Ai, Bj];
      }
    }
  }

  const gap = best - rhs;
  const [A, B] = bestPair;
  console.log(
    JSON.stringify({
      N,
      sidon_sets_count: sets.length,
      fN,
      rhs_choose2_fN: rhs,
      best_lhs: best,
      gap_best_minus_rhs: gap,
      best_A_size: A.length,
      best_B_size: B.length,
      best_A: A,
      best_B: B,
    })
  );
}
