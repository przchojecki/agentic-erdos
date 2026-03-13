#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function shuffle(a, rng) {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
}

function canAddWithout3AP(S, x) {
  for (const a of S) {
    if (S.has(2 * a - x)) return false;
    if ((a + x) % 2 === 0 && S.has((a + x) / 2)) return false;
    if (S.has(2 * x - a)) return false;
  }
  return true;
}

function diffCount(S) {
  const arr = [...S].sort((a, b) => a - b);
  const D = new Set();
  for (let i = 0; i < arr.length; i += 1) {
    for (let j = i + 1; j < arr.length; j += 1) D.add(arr[j] - arr[i]);
  }
  return D.size;
}

function randomAPFreeSet(n, M, rng) {
  for (let attempt = 0; attempt < 400; attempt += 1) {
    const perm = Array.from({ length: M }, (_, i) => i + 1);
    shuffle(perm, rng);
    const S = new Set();
    for (const x of perm) {
      if (S.size >= n) break;
      if (canAddWithout3AP(S, x)) S.add(x);
    }
    if (S.size === n) return S;
  }
  return null;
}

function improveSet(S, M, iters, rng) {
  let best = diffCount(S);
  for (let it = 0; it < iters; it += 1) {
    const arr = [...S];
    const rem = arr[Math.floor(rng() * arr.length)];
    S.delete(rem);

    let added = null;
    for (let tr = 0; tr < 80; tr += 1) {
      const x = 1 + Math.floor(rng() * M);
      if (S.has(x)) continue;
      if (!canAddWithout3AP(S, x)) continue;
      added = x;
      break;
    }

    if (added === null) {
      S.add(rem);
      continue;
    }

    S.add(added);
    const cur = diffCount(S);
    if (cur <= best || rng() < 0.003) {
      best = Math.min(best, cur);
    } else {
      S.delete(added);
      S.add(rem);
    }
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 657);
const rows = [];

for (const n of [10, 12, 14, 16, 18, 20, 22, 24, 26]) {
  const M = 9 * n;
  const restarts = n <= 16 ? 48 : 36;
  let best = Infinity;

  for (let r = 0; r < restarts; r += 1) {
    const S = randomAPFreeSet(n, M, rng);
    if (!S) continue;
    const cur = improveSet(S, M, 2600, rng);
    if (cur < best) best = cur;
  }

  rows.push({
    n,
    ambient_interval_size_M: M,
    restarts,
    best_distinct_differences_found: best,
    best_over_n: Number((best / n).toPrecision(8)),
    best_over_n_log_n: Number((best / (n * Math.log(n))).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-657',
  script: path.basename(process.argv[1]),
  method: 'deeper_1D_AP_free_difference_minimization_surrogate',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
