#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Exact EP-42 (M=3) scan for a range of N.
// For each N, checks whether there exists a Sidon A subset [1..N]
// with no disjoint Sidon triple B (equivalently: complement of D(A)
// has no distinct Schur triple).

const START_N = Number(process.env.START_N || 74);
const END_N = Number(process.env.END_N || 90);

if (!Number.isInteger(START_N) || !Number.isInteger(END_N) || START_N < 6 || END_N < START_N) {
  console.error('Usage: START_N=74 END_N=90 node scripts/ep42_m3_exact_threshold_scan.mjs');
  process.exit(1);
}

function choose2(k) {
  return (k * (k - 1)) / 2;
}

function weaklySumFreeMax(n) {
  // max |C| in [1..n] with no distinct a,b,c in C satisfying a+b=c
  return Math.floor((n + 2) / 2);
}

function minFeasibleK(n) {
  const maxC = weaklySumFreeMax(n);
  const needDiffs = n - maxC;
  let k = 1;
  while (choose2(k) < needDiffs) k += 1;
  return k;
}

function maxFeasibleK(n) {
  let k = 1;
  while (choose2(k + 1) <= n) k += 1;
  return k;
}

function makePairList(n) {
  const pairs = [];
  for (let a = 1; a <= n; a += 1) {
    for (let b = a + 1; a + b <= n; b += 1) {
      pairs.push([a, b, a + b]);
    }
  }
  return pairs;
}

function hasDistinctSchurTripleInComplement(usedDiff, pairs) {
  for (let i = 0; i < pairs.length; i += 1) {
    const [a, b, s] = pairs[i];
    if (!usedDiff[a] && !usedDiff[b] && !usedDiff[s]) {
      return [a, b, s];
    }
  }
  return null;
}

function findDisjointSidonTriple(usedDiff, N) {
  for (let x = 1; x <= N - 2; x += 1) {
    for (let y = x + 1; y <= N - 1; y += 1) {
      const d1 = y - x;
      if (usedDiff[d1]) continue;
      for (let z = y + 1; z <= N; z += 1) {
        const d2 = z - y;
        const d3 = z - x;
        if (d1 === d2) continue;
        if (!usedDiff[d2] && !usedDiff[d3]) {
          return { B: [x, y, z], differences: [d1, d2, d3] };
        }
      }
    }
  }
  return null;
}

function exactSearchForK(N, k, pairs) {
  const A = [1];
  const usedDiff = new Uint8Array(N);

  let nodes = 0;
  let leavesChecked = 0;
  let witnessA = null;

  function rec(start) {
    if (witnessA) return;
    if (A.length === k) {
      leavesChecked += 1;
      const bad = hasDistinctSchurTripleInComplement(usedDiff, pairs);
      if (bad === null) {
        witnessA = A.slice();
      }
      return;
    }

    nodes += 1;
    for (let x = start; x <= N; x += 1) {
      const add = [];
      let ok = true;
      for (let i = 0; i < A.length; i += 1) {
        const d = x - A[i];
        if (usedDiff[d]) {
          ok = false;
          break;
        }
        add.push(d);
      }
      if (!ok) continue;

      for (let i = 0; i < add.length; i += 1) usedDiff[add[i]] = 1;
      A.push(x);
      rec(x + 1);
      A.pop();
      for (let i = 0; i < add.length; i += 1) usedDiff[add[i]] = 0;

      if (witnessA) return;
    }
  }

  const t0 = Date.now();
  rec(2);
  const runtimeMs = Date.now() - t0;

  return {
    k,
    nodes,
    leaves_checked: leavesChecked,
    runtime_ms: runtimeMs,
    witness_A: witnessA,
  };
}

const rows = [];

for (let N = START_N; N <= END_N; N += 1) {
  const n = N - 1;
  const kMin = minFeasibleK(n);
  const kMax = maxFeasibleK(n);
  const pairs = makePairList(n);
  const started = Date.now();

  const byK = [];
  let found = null;

  for (let k = kMin; k <= kMax; k += 1) {
    const part = exactSearchForK(N, k, pairs);
    byK.push({
      k: part.k,
      nodes: part.nodes,
      leaves_checked: part.leaves_checked,
      runtime_ms: part.runtime_ms,
      found_witness: part.witness_A !== null,
    });

    if (part.witness_A) {
      const used = new Uint8Array(N);
      for (let i = 0; i < part.witness_A.length; i += 1) {
        for (let j = i + 1; j < part.witness_A.length; j += 1) {
          used[part.witness_A[j] - part.witness_A[i]] = 1;
        }
      }
      const directWitness = findDisjointSidonTriple(used, N);
      found = {
        k,
        A: part.witness_A,
        direct_disjoint_sidon_triple_exists: directWitness !== null,
        direct_disjoint_sidon_triple_witness: directWitness,
      };
      break;
    }
  }

  const row = {
    N,
    n,
    k_min_feasible: kMin,
    k_max_feasible: kMax,
    found_counterexample_A_for_M3: found !== null,
    witness: found,
    by_k: byK,
    total_runtime_ms: Date.now() - started,
  };
  rows.push(row);

  process.stderr.write(
    `N=${N} done: found=${row.found_counterexample_A_for_M3} runtime_ms=${row.total_runtime_ms}\n`
  );
}

const out = {
  problem: 'EP-42',
  script: path.basename(process.argv[1]),
  method: 'exact_search_over_sidon_A_for_M3_via_distinct_schur_obstruction',
  params: {
    start_n: START_N,
    end_n: END_N,
  },
  rows,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', `ep42_m3_exact_threshold_scan_${START_N}_${END_N}.json`);
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      outPath,
      summary: rows.map((r) => ({
        N: r.N,
        found_counterexample_A_for_M3: r.found_counterexample_A_for_M3,
        witness_k: r.witness?.k ?? null,
      })),
    },
    null,
    2
  )
);
