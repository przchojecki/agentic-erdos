#!/usr/bin/env node
import fs from 'fs';

// EP-870 finite proxy (k=3):
// Compare lower representation threshold on [L..U]
// with existence of finite minimal 3-basis core on [L..U].

const OUT = process.env.OUT || 'data/ep870_standalone_deeper.json';
const CASES = [
  [120, 120, 260, 120],
  [160, 180, 360, 100],
];

function makeRng(seed = 870_2026) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
const rng = makeRng();

function randomSet(N, p = 0.28) {
  const A = [];
  for (let x = 1; x <= N; x += 1) if (rng() < p) A.push(x);
  return A;
}

function rep3(A, L, U) {
  const R = new Uint16Array(U + 1);
  for (let i = 0; i < A.length; i += 1) {
    for (let j = i; j < A.length; j += 1) {
      for (let k = j; k < A.length; k += 1) {
        const s = A[i] + A[j] + A[k];
        if (s >= L && s <= U && R[s] < 65535) R[s] += 1;
      }
    }
  }
  let minPos = Infinity;
  let covered = 0;
  for (let n = L; n <= U; n += 1) {
    if (R[n] > 0) covered += 1;
    if (R[n] > 0 && R[n] < minPos) minPos = R[n];
    if (R[n] === 0) minPos = 0;
  }
  return { R, covered, total: U - L + 1, minRep: minPos === Infinity ? 0 : minPos };
}

function finiteMinimalCore3(A, L, U) {
  const B = A.slice().sort((a, b) => a - b);
  function covers(C) {
    const r = rep3(C, L, U);
    return r.covered === r.total;
  }
  if (!covers(B)) return { exists: false, coreSize: 0 };
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < B.length; i += 1) {
      const C = B.slice(0, i).concat(B.slice(i + 1));
      if (covers(C)) {
        B.splice(i, 1);
        changed = true;
        break;
      }
    }
  }
  let minimal = true;
  for (let i = 0; i < B.length; i += 1) {
    const C = B.slice(0, i).concat(B.slice(i + 1));
    if (covers(C)) {
      minimal = false;
      break;
    }
  }
  return { exists: minimal, coreSize: B.length };
}

const t0 = Date.now();
const rows = [];
for (const [N, L, U, trials] of CASES) {
  let bestMinRep = 0;
  let bestCoverage = 0;
  let withMinimalCore = 0;
  let bestCoreSize = 0;
  for (let t = 0; t < trials; t += 1) {
    const A = randomSet(N);
    const r = rep3(A, L, U);
    if (r.covered === r.total) {
      if (r.minRep > bestMinRep) bestMinRep = r.minRep;
      const m = finiteMinimalCore3(A, L, U);
      if (m.exists) withMinimalCore += 1;
      if (m.coreSize > bestCoreSize) bestCoreSize = m.coreSize;
    }
    if (r.covered > bestCoverage) bestCoverage = r.covered;
  }
  rows.push({
    N, L, U, trials,
    interval_len: U - L + 1,
    best_covered_count: bestCoverage,
    best_min_rep_when_fully_covered: bestMinRep,
    finite_minimal_core_instances_found: withMinimalCore,
    max_finite_minimal_core_size_found: bestCoreSize,
  });
}

const out = {
  problem: 'EP-870',
  script: 'ep870.mjs',
  method: 'finite_k3_representation_threshold_vs_minimal_core_probe',
  warning: 'Finite horizon proxy only; does not resolve k>=3 infinite statement.',
  params: { CASES },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
