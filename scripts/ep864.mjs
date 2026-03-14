#!/usr/bin/env node
import fs from 'fs';

// EP-864 finite proxy:
// at most one sum value may have multiplicity > 1 among unordered pairs a<=b.
const OUT = process.env.OUT || 'data/ep864_standalone_deeper.json';
const N_LIST = [60, 100, 160, 240, 320];
const TRIALS = 240;

function makeRng(seed = 864_2026) {
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

function canAdd(A, x, cnt) {
  const touched = [];
  const inc = new Map();
  const upd = (s) => inc.set(s, (inc.get(s) || 0) + 1);
  for (const a of A) upd(a + x);
  upd(x + x);
  for (const [s, add] of inc.entries()) {
    const c = (cnt.get(s) || 0) + add;
    if (c > 1) touched.push(s);
  }
  let bad = 0;
  for (const [s, c0] of cnt.entries()) if (c0 > 1) bad += 1;
  for (const s of touched) if ((cnt.get(s) || 0) <= 1) bad += 1;
  return bad <= 1;
}

function greedyBuild(N) {
  const vals = Array.from({ length: N }, (_, i) => i + 1);
  shuffle(vals);
  const A = [];
  const cnt = new Map();
  for (const x of vals) {
    if (!canAdd(A, x, cnt)) continue;
    for (const a of A) cnt.set(a + x, (cnt.get(a + x) || 0) + 1);
    cnt.set(x + x, (cnt.get(x + x) || 0) + 1);
    A.push(x);
  }
  return A.length;
}

const t0 = Date.now();
const rows = [];
const c0 = 2 / Math.sqrt(3);
for (const N of N_LIST) {
  let best = 0;
  let avg = 0;
  for (let t = 0; t < TRIALS; t += 1) {
    const s = greedyBuild(N);
    if (s > best) best = s;
    avg += s;
  }
  avg /= TRIALS;
  rows.push({
    N,
    trials: TRIALS,
    best_size_found: best,
    avg_size_found: Number(avg.toPrecision(8)),
    best_over_sqrtN: Number((best / Math.sqrt(N)).toPrecision(8)),
    avg_over_sqrtN: Number((avg / Math.sqrt(N)).toPrecision(8)),
    best_over_conjectured_constant_sqrtN: Number((best / (c0 * Math.sqrt(N))).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-864',
  script: 'ep864.mjs',
  method: 'finite_random_greedy_profile_for_single_exception_sum_multiplicity',
  warning: 'Finite heuristic lower-bound profile only.',
  params: { N_LIST, TRIALS },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
