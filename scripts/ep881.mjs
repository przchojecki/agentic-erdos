#!/usr/bin/env node
import fs from 'fs';

// EP-881 finite analog (k=2 -> k+1=3):
// find finite minimal 2-bases on [L..U], test whether deleting a finite subset
// can yield a 3-basis on [L..U].

const OUT = process.env.OUT || 'data/ep881_standalone_deeper.json';
const CASES = [
  [36, 20, 60, 120],
  [48, 30, 90, 100],
];

function makeRng(seed = 881_2026) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
const rng = makeRng();

function randomSet(N, p = 0.32) {
  const A = [];
  for (let x = 0; x <= N; x += 1) if (rng() < p) A.push(x);
  return A;
}

function covers2(A, L, U) {
  const hit = new Uint8Array(U + 1);
  for (let i = 0; i < A.length; i += 1) {
    for (let j = i; j < A.length; j += 1) {
      const s = A[i] + A[j];
      if (s >= L && s <= U) hit[s] = 1;
    }
  }
  for (let n = L; n <= U; n += 1) if (!hit[n]) return false;
  return true;
}

function covers3(A, L, U) {
  const hit = new Uint8Array(U + 1);
  for (let i = 0; i < A.length; i += 1) {
    for (let j = i; j < A.length; j += 1) {
      for (let k = j; k < A.length; k += 1) {
        const s = A[i] + A[j] + A[k];
        if (s >= L && s <= U) hit[s] = 1;
      }
    }
  }
  for (let n = L; n <= U; n += 1) if (!hit[n]) return false;
  return true;
}

function finiteMinimal2Basis(A, L, U) {
  const B = A.slice().sort((a, b) => a - b);
  if (!covers2(B, L, U)) return null;
  let changed = true;
  while (changed) {
    changed = false;
    for (let i = 0; i < B.length; i += 1) {
      const C = B.slice(0, i).concat(B.slice(i + 1));
      if (covers2(C, L, U)) {
        B.splice(i, 1);
        changed = true;
        break;
      }
    }
  }
  for (let i = 0; i < B.length; i += 1) {
    const C = B.slice(0, i).concat(B.slice(i + 1));
    if (covers2(C, L, U)) return null;
  }
  return B;
}

function existsRemovalTo3Basis(B, L, U, maxRemove = 4) {
  const n = B.length;
  function rec(start, left, rem) {
    if (left === 0) {
      const R = B.filter((_, i) => !rem.has(i));
      return covers3(R, L, U);
    }
    for (let i = start; i < n; i += 1) {
      rem.add(i);
      if (rec(i + 1, left - 1, rem)) return true;
      rem.delete(i);
    }
    return false;
  }
  for (let r = 1; r <= Math.min(maxRemove, n); r += 1) {
    if (rec(0, r, new Set())) return r;
  }
  return null;
}

const t0 = Date.now();
const rows = [];
for (const [N, L, U, trials] of CASES) {
  let foundMinimal2 = 0;
  let foundRemovalTo3 = 0;
  let bestMinimalSize = 0;
  let bestRemovalSize = null;
  for (let t = 0; t < trials; t += 1) {
    const A = randomSet(N);
    const B = finiteMinimal2Basis(A, L, U);
    if (!B) continue;
    foundMinimal2 += 1;
    if (B.length > bestMinimalSize) bestMinimalSize = B.length;
    const rr = existsRemovalTo3Basis(B, L, U, 4);
    if (rr !== null) {
      foundRemovalTo3 += 1;
      if (bestRemovalSize === null || rr < bestRemovalSize) bestRemovalSize = rr;
    }
  }
  rows.push({
    N, L, U, trials,
    finite_minimal_2basis_instances: foundMinimal2,
    instances_with_small_removal_to_3basis: foundRemovalTo3,
    best_minimal_2basis_size_found: bestMinimalSize,
    smallest_removal_size_found_for_3basis: bestRemovalSize,
  });
}

const out = {
  problem: 'EP-881',
  script: 'ep881.mjs',
  method: 'finite_k2_to_k3_minimal_basis_transition_probe',
  warning: 'Finite horizon proxy only; does not resolve the infinite-set statement.',
  params: { CASES },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
