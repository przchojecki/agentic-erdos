#!/usr/bin/env node
import fs from 'fs';

const OUT = process.env.OUT || 'data/ep840_standalone_deeper.json';
const N_LIST = [500, 1000, 2000, 3000, 5000];
const TAU_LIST = [0.9, 0.95, 0.98, 0.99];
const TRIALS = 80;

function makeRng(seed = 840_2026) {
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

function greedyQuasiSidon(N, tau) {
  const A = [];
  const sums = new Set();
  const vals = Array.from({ length: N }, (_, i) => i + 1);
  shuffle(vals);

  function ratioIfAdd(newDistinct) {
    const m = A.length + 1;
    if (m < 2) return 1;
    const bin = (m * (m - 1)) / 2;
    return (sums.size + newDistinct) / bin;
  }

  for (const x of vals) {
    let newDistinct = 0;
    const touched = [];
    for (const a of A) {
      const s = a + x;
      if (!sums.has(s)) {
        newDistinct += 1;
        touched.push(s);
      }
    }
    const d = x + x;
    if (!sums.has(d) && !touched.includes(d)) {
      newDistinct += 1;
      touched.push(d);
    }
    if (ratioIfAdd(newDistinct) >= tau) {
      A.push(x);
      for (const s of touched) sums.add(s);
    }
  }
  return A.length;
}

const t0 = Date.now();
const rows = [];
for (const N of N_LIST) {
  for (const tau of TAU_LIST) {
    let best = 0;
    let sum = 0;
    for (let t = 0; t < TRIALS; t += 1) {
      const v = greedyQuasiSidon(N, tau);
      if (v > best) best = v;
      sum += v;
    }
    rows.push({
      N,
      tau_ratio_threshold: tau,
      trials: TRIALS,
      best_size_found: best,
      avg_size_found: Number((sum / TRIALS).toPrecision(8)),
      best_over_sqrtN: Number((best / Math.sqrt(N)).toPrecision(8)),
      avg_over_sqrtN: Number(((sum / TRIALS) / Math.sqrt(N)).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-840',
  script: 'ep840.mjs',
  method: 'deeper_random_greedy_quasi_sidon_profile',
  params: { N_LIST, TAU_LIST, TRIALS },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
