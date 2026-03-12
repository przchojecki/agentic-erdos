#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function tuplesK2(N) {
  const t = [];
  for (let a = 1; a <= N; a += 1) {
    for (let b = a + 1; b <= N; b += 1) {
      const s = a + b;
      if (s <= N) t.push([a, b, s]);
    }
  }
  return t;
}

function tuplesK3(N) {
  const t = [];
  for (let a = 1; a <= N; a += 1) {
    for (let b = a + 1; b <= N; b += 1) {
      for (let c = b + 1; c <= N; c += 1) {
        const sums = [a, b, c, a + b, a + c, b + c, a + b + c];
        if (Math.max(...sums) <= N) t.push(sums);
      }
    }
  }
  return t;
}

function avoidableK2(N) {
  const tuples = tuplesK2(N);
  const touched = Array.from({ length: N + 1 }, () => []);
  for (let i = 0; i < tuples.length; i += 1) for (const x of tuples[i]) touched[x].push(i);

  const col = new Int8Array(N + 1);
  col.fill(-1);

  function badAt(i) {
    const tp = tuples[i];
    const c0 = col[tp[0]];
    if (c0 < 0) return false;
    for (let j = 1; j < tp.length; j += 1) if (col[tp[j]] !== c0) return false;
    return true;
  }

  function dfs(x) {
    if (x > N) return true;
    for (let c = 0; c <= 1; c += 1) {
      col[x] = c;
      let bad = false;
      for (const ti of touched[x]) if (badAt(ti)) { bad = true; break; }
      if (!bad && dfs(x + 1)) return true;
    }
    col[x] = -1;
    return false;
  }

  return dfs(1);
}

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function greedyAvoidK3(N, rng) {
  const tuples = tuplesK3(N);
  const touched = Array.from({ length: N + 1 }, () => []);
  for (let i = 0; i < tuples.length; i += 1) for (const x of tuples[i]) touched[x].push(i);

  const col = new Int8Array(N + 1);
  col.fill(-1);

  function badAt(i) {
    const tp = tuples[i];
    const c0 = col[tp[0]];
    if (c0 < 0) return false;
    for (let j = 1; j < tp.length; j += 1) if (col[tp[j]] !== c0) return false;
    return true;
  }

  for (let x = 1; x <= N; x += 1) {
    const options = [];
    for (let c = 0; c <= 1; c += 1) {
      col[x] = c;
      let bad = false;
      for (const ti of touched[x]) if (badAt(ti)) { bad = true; break; }
      if (!bad) options.push(c);
    }
    if (!options.length) return x - 1;
    col[x] = options[Math.floor(rng() * options.length)];
  }
  return N;
}

const t0 = Date.now();
let maxAvoid2 = 0;
for (let N = 1; N <= 12; N += 1) {
  if (avoidableK2(N)) maxAvoid2 = N;
  else break;
}

const rng = makeRng(20260312 ^ 531);
const rows = [];
for (const [N, trials] of [[30, 180], [40, 160], [50, 140], [60, 120]]) {
  let best = 0;
  let avg = 0;
  for (let t = 0; t < trials; t += 1) {
    const len = greedyAvoidK3(N, rng);
    avg += len;
    if (len > best) best = len;
  }
  rows.push({
    N,
    trials,
    best_avoidable_prefix_length_for_k3: best,
    avg_avoidable_prefix_length_for_k3: Number((avg / trials).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-531',
  script: path.basename(process.argv[1]),
  method: 'exact_small_k2_and_deeper_randomized_k3_finite_sums_coloring_profile',
  params: {},
  exact: {
    F_2_exact: maxAvoid2 + 1,
    max_2color_avoidable_prefix_for_k2: maxAvoid2,
  },
  heuristic_k3_rows: rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
