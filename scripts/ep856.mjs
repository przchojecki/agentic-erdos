#!/usr/bin/env node
import fs from 'fs';

const OUT = process.env.OUT || 'data/ep856_standalone_deeper.json';
const CASES = [
  { k: 3, N: 320, restarts: 18 },
  { k: 3, N: 500, restarts: 14 },
  { k: 3, N: 700, restarts: 10 },
  { k: 4, N: 180, restarts: 8 },
  { k: 4, N: 260, restarts: 6 },
  { k: 4, N: 340, restarts: 4 },
];

function makeRng(seed = 856_2026) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}
const rng = makeRng();

function shuffle(arr) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function gcd(a, b) {
  while (b !== 0) {
    const t = a % b;
    a = b;
    b = t;
  }
  return a;
}
function lcm(a, b) {
  return (a / gcd(a, b)) * b;
}

function violatesWithX(A, x, k) {
  if (k === 3) {
    for (let i = 0; i < A.length; i += 1) {
      for (let j = i + 1; j < A.length; j += 1) {
        const l1 = lcm(A[i], A[j]);
        if (l1 === lcm(A[i], x) && l1 === lcm(A[j], x)) return true;
      }
    }
    return false;
  }
  for (let i = 0; i < A.length; i += 1) {
    for (let j = i + 1; j < A.length; j += 1) {
      for (let t = j + 1; t < A.length; t += 1) {
        const vals = [A[i], A[j], A[t], x];
        let target = null;
        let same = true;
        for (let u = 0; u < 4 && same; u += 1) {
          for (let v = u + 1; v < 4; v += 1) {
            const ll = lcm(vals[u], vals[v]);
            if (target === null) target = ll;
            else if (ll !== target) {
              same = false;
              break;
            }
          }
        }
        if (same) return true;
      }
    }
  }
  return false;
}

function harmonic(A) {
  let s = 0;
  for (const a of A) s += 1 / a;
  return s;
}

function greedyRandom(N, k) {
  const vals = Array.from({ length: N }, (_, i) => i + 1);
  shuffle(vals);
  const A = [];
  for (const x of vals) if (!violatesWithX(A, x, k)) A.push(x);
  return A.sort((a, b) => a - b);
}

const t0 = Date.now();
const rows = [];
for (const C of CASES) {
  let bestA = [];
  let bestH = -1;
  for (let r = 0; r < C.restarts; r += 1) {
    const A = greedyRandom(C.N, C.k);
    const h = harmonic(A);
    if (h > bestH) {
      bestH = h;
      bestA = A;
    }
  }
  rows.push({
    k: C.k,
    N: C.N,
    restarts: C.restarts,
    best_set_size: bestA.length,
    best_harmonic_sum: Number(bestH.toPrecision(8)),
    best_harmonic_over_logN: Number((bestH / Math.log(C.N)).toPrecision(8)),
    sample_first_25_elements: bestA.slice(0, 25),
  });
}

const out = {
  problem: 'EP-856',
  script: 'ep856.mjs',
  method: 'deeper_random_greedy_profile_for_lcm_pattern_avoidance',
  params: { CASES },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
