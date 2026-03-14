#!/usr/bin/env node
import fs from 'fs';

// EP-869 finite-horizon proxy:
// Build disjoint A1,A2 in [1..N] with strong 2-sum coverage on [L..U],
// then test whether A=A1∪A2 has a finite minimal 2-basis subfamily on [L..U].

const OUT = process.env.OUT || 'data/ep869_standalone_deeper.json';
const CASES = [
  [80, 70, 130, 80],
  [120, 110, 210, 70],
];

function makeRng(seed = 869_2026) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
const rng = makeRng();

function randomDisjoint(N, p1 = 0.33, p2 = 0.33) {
  const A1 = [];
  const A2 = [];
  for (let x = 1; x <= N; x += 1) {
    const u = rng();
    if (u < p1) A1.push(x);
    else if (u < p1 + p2) A2.push(x);
  }
  return { A1, A2 };
}

function coverage2(A, L, U) {
  const hit = new Uint8Array(U + 1);
  for (let i = 0; i < A.length; i += 1) {
    for (let j = i; j < A.length; j += 1) {
      const s = A[i] + A[j];
      if (s >= L && s <= U) hit[s] = 1;
    }
  }
  let cnt = 0;
  for (let n = L; n <= U; n += 1) cnt += hit[n];
  return { cnt, total: U - L + 1 };
}

function finiteMinimalCore(A, L, U) {
  const B = A.slice().sort((a, b) => a - b);
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < B.length; i += 1) {
      const C = B.slice(0, i).concat(B.slice(i + 1));
      const cov = coverage2(C, L, U);
      if (cov.cnt === cov.total) {
        B.splice(i, 1);
        changed = true;
        break;
      }
    }
  }
  // Verify minimality in finite horizon.
  let finiteMinimal = true;
  for (let i = 0; i < B.length; i += 1) {
    const C = B.slice(0, i).concat(B.slice(i + 1));
    const cov = coverage2(C, L, U);
    if (cov.cnt === cov.total) {
      finiteMinimal = false;
      break;
    }
  }
  return { coreSize: B.length, finiteMinimal };
}

const t0 = Date.now();
const rows = [];
for (const [N, L, U, trials] of CASES) {
  let bestUnionCov = 0;
  let bestA1Cov = 0;
  let bestA2Cov = 0;
  let foundFiniteMinimal = 0;
  let bestCoreSize = 0;
  for (let t = 0; t < trials; t += 1) {
    const { A1, A2 } = randomDisjoint(N);
    const c1 = coverage2(A1, L, U);
    const c2 = coverage2(A2, L, U);
    const A = A1.concat(A2);
    const cu = coverage2(A, L, U);
    if (cu.cnt > bestUnionCov) bestUnionCov = cu.cnt;
    if (c1.cnt > bestA1Cov) bestA1Cov = c1.cnt;
    if (c2.cnt > bestA2Cov) bestA2Cov = c2.cnt;
    if (c1.cnt === c1.total && c2.cnt === c2.total && cu.cnt === cu.total) {
      const m = finiteMinimalCore(A, L, U);
      if (m.finiteMinimal) foundFiniteMinimal += 1;
      if (m.coreSize > bestCoreSize) bestCoreSize = m.coreSize;
    }
  }
  rows.push({
    N, L, U, trials,
    interval_len: U - L + 1,
    best_A1_coverage_count: bestA1Cov,
    best_A2_coverage_count: bestA2Cov,
    best_union_coverage_count: bestUnionCov,
    finite_minimal_core_instances_found: foundFiniteMinimal,
    max_finite_minimal_core_size_found: bestCoreSize,
  });
}

const out = {
  problem: 'EP-869',
  script: 'ep869.mjs',
  method: 'finite_horizon_disjoint_bases_and_minimal_core_search',
  warning: 'Finite interval proxy only; not a proof for infinite additive bases.',
  params: { CASES },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
