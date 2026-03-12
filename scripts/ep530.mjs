#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function maxSidonSubset(A) {
  const n = A.length;
  let best = 0;

  function dfs(i, chosen, sums) {
    if (i === n) {
      if (chosen.length > best) best = chosen.length;
      return;
    }
    if (chosen.length + (n - i) <= best) return;

    dfs(i + 1, chosen, sums);

    const x = A[i];
    const newSums = [];
    let ok = true;

    const s2 = 2 * x;
    if (sums.has(s2)) ok = false;
    else newSums.push(s2);

    if (ok) {
      for (const a of chosen) {
        const s = a + x;
        if (sums.has(s)) { ok = false; break; }
        newSums.push(s);
      }
    }

    if (ok) {
      for (const s of newSums) sums.add(s);
      chosen.push(x);
      dfs(i + 1, chosen, sums);
      chosen.pop();
      for (const s of newSums) sums.delete(s);
    }
  }

  dfs(0, [], new Set());
  return best;
}

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function randSet(size, maxVal, rng) {
  const S = new Set();
  while (S.size < size) S.add(1 + Math.floor(rng() * maxVal));
  return [...S].sort((a, b) => a - b);
}

function greedySidonLowerBound(A, restarts, rng) {
  let best = 0;
  for (let t = 0; t < restarts; t += 1) {
    const ord = [...A];
    for (let i = ord.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const tmp = ord[i];
      ord[i] = ord[j];
      ord[j] = tmp;
    }
    const chosen = [];
    const sums = new Set();
    for (const x of ord) {
      let ok = true;
      if (sums.has(2 * x)) ok = false;
      if (ok) {
        for (const a of chosen) {
          if (sums.has(a + x)) {
            ok = false;
            break;
          }
        }
      }
      if (ok) {
        sums.add(2 * x);
        for (const a of chosen) sums.add(a + x);
        chosen.push(x);
      }
    }
    if (chosen.length > best) best = chosen.length;
  }
  return best;
}

const t0 = Date.now();
const rows = [];
const rng = makeRng(20260312 ^ 530);

for (const N of [20, 24, 28]) {
  const A = Array.from({ length: N }, (_, i) => i + 1);
  const m = maxSidonSubset(A);
  rows.push({
    family: 'interval',
    N,
    max_sidon_size: m,
    ratio_over_sqrtN: Number((m / Math.sqrt(N)).toPrecision(8)),
  });
}

for (const [N, trials, restarts] of [[20, 30, 220], [28, 22, 200], [34, 16, 180]]) {
  let best = 0;
  let avg = 0;
  for (let t = 0; t < trials; t += 1) {
    const A = randSet(N, 10 * N, rng);
    const m = greedySidonLowerBound(A, restarts, rng);
    avg += m;
    if (m > best) best = m;
  }
  rows.push({
    family: 'random_distinct_integers_greedy_lower',
    N,
    trials,
    restarts_per_instance: restarts,
    best_max_sidon_size: best,
    avg_max_sidon_size: Number((avg / trials).toPrecision(8)),
    best_over_sqrtN: Number((best / Math.sqrt(N)).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-530',
  script: path.basename(process.argv[1]),
  method: 'exact_interval_plus_deep_greedy_random_sidon_profile',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
