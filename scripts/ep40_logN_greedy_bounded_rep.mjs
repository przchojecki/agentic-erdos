#!/usr/bin/env node

// Greedy construction for sets with bounded ordered representation counts:
// maintain r_{A+A}(s) <= K for all s <= 2*Nmax while adding numbers in increasing order.
//
// Usage:
//   node scripts/ep40_logN_greedy_bounded_rep.mjs [Nmax] [K1,K2,...]

const Nmax = Number(process.argv[2] || 200000);
const kArg = process.argv[3] || '2,4,8';
const sparseMode = process.argv.includes('--sparse');
const Ks = kArg.split(',').map((x) => Number(x.trim())).filter((x) => Number.isInteger(x) && x > 0);

if (!Number.isInteger(Nmax) || Nmax < 1000 || Ks.length === 0) {
  console.error('Usage: node scripts/ep40_logN_greedy_bounded_rep.mjs [Nmax>=1000] [K1,K2,...]');
  process.exit(1);
}

const samplePoints = [
  1000,
  3000,
  10000,
  30000,
  100000,
  300000,
  1000000,
].filter((x) => x <= Nmax);

function buildGreedy(Nmax, K) {
  const repDense = sparseMode ? null : new Uint32Array(2 * Nmax + 1);
  const repSparse = sparseMode ? new Map() : null;
  const inA = new Uint8Array(Nmax + 1);
  const A = [];
  const countsAtSample = new Map();

  let si = 0;

  function getRep(s) {
    if (!sparseMode) return repDense[s];
    return repSparse.get(s) || 0;
  }

  function addRep(s, delta) {
    if (!sparseMode) {
      repDense[s] += delta;
      return;
    }
    const v = (repSparse.get(s) || 0) + delta;
    if (v === 0) repSparse.delete(s);
    else repSparse.set(s, v);
  }

  function canAdd(x) {
    // (x,x) contributes +1 to sum 2x
    if (getRep(2 * x) + 1 > K) return false;

    // For each a in A, (a,x) and (x,a) contribute +2 to sum a+x.
    for (let i = 0; i < A.length; i++) {
      const s = A[i] + x;
      if (getRep(s) + 2 > K) return false;
    }
    return true;
  }

  function add(x) {
    addRep(2 * x, 1);
    for (let i = 0; i < A.length; i++) {
      const s = A[i] + x;
      addRep(s, 2);
    }
    A.push(x);
    inA[x] = 1;
  }

  for (let x = 1; x <= Nmax; x++) {
    if (canAdd(x)) add(x);

    while (si < samplePoints.length && samplePoints[si] === x) {
      const N = samplePoints[si];
      const m = A.length;
      const ratio = (m * Math.log(N)) / Math.sqrt(N);
      countsAtSample.set(N, { N, m, ratio_m_log_over_sqrtN: ratio });
      si += 1;
    }
  }

  let maxRep = 0;
  if (!sparseMode) {
    for (let s = 0; s < repDense.length; s++) if (repDense[s] > maxRep) maxRep = repDense[s];
  } else {
    for (const v of repSparse.values()) if (v > maxRep) maxRep = v;
  }

  return {
    K,
    Nmax,
    mode: sparseMode ? 'sparse' : 'dense',
    size: A.length,
    max_ordered_rep_observed: maxRep,
    final_ratio_m_log_over_sqrtN: (A.length * Math.log(Nmax)) / Math.sqrt(Nmax),
    sample: samplePoints.map((N) => countsAtSample.get(N)),
  };
}

const results = Ks.map((K) => buildGreedy(Nmax, K));

console.log(JSON.stringify({
  Nmax,
  Ks,
  note: 'Greedy sequence is heuristic, not extremal. Ratio shown is m(N)*log(N)/sqrt(N). If this stays bounded away from 0, it is suggestive but not a proof.',
  results,
}, null, 2));
