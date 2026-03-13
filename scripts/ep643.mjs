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

function combinations(arr, k) {
  const out = [];
  const cur = [];
  function dfs(i) {
    if (cur.length === k) {
      out.push(cur.slice());
      return;
    }
    for (let j = i; j < arr.length; j += 1) {
      cur.push(arr[j]);
      dfs(j + 1);
      cur.pop();
    }
  }
  dfs(0);
  return out;
}

function choose2(n) {
  return (n * (n - 1)) / 2;
}

function shuffle(a, rng) {
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = a[i];
    a[i] = a[j];
    a[j] = t;
  }
}

function disjoint3(a, b) {
  return !(
    a[0] === b[0] || a[0] === b[1] || a[0] === b[2] ||
    a[1] === b[0] || a[1] === b[1] || a[1] === b[2] ||
    a[2] === b[0] || a[2] === b[1] || a[2] === b[2]
  );
}

function union6Key(a, b) {
  const U = [a[0], a[1], a[2], b[0], b[1], b[2]].sort((x, y) => x - y);
  return `${U[0]},${U[1]},${U[2]},${U[3]},${U[4]},${U[5]}`;
}

function greedyMax(n, restarts, rng) {
  const verts = Array.from({ length: n }, (_, i) => i);
  const triples = combinations(verts, 3);
  let best = 0;

  for (let r = 0; r < restarts; r += 1) {
    const order = [...triples];
    shuffle(order, rng);
    const chosen = [];
    const pairCount = new Map();

    for (const e of order) {
      const touched = [];
      let bad = false;
      for (const f of chosen) {
        if (!disjoint3(e, f)) continue;
        const key = union6Key(e, f);
        const c = pairCount.get(key) || 0;
        if (c >= 1) {
          bad = true;
          break;
        }
        touched.push(key);
      }
      if (bad) continue;
      chosen.push(e);
      for (const key of touched) pairCount.set(key, (pairCount.get(key) || 0) + 1);
    }
    if (chosen.length > best) best = chosen.length;
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 643);
const rows = [];
for (const [n, restarts] of [[12, 60], [15, 48], [18, 40], [21, 30], [24, 24]]) {
  const best = greedyMax(n, restarts, rng);
  rows.push({
    n,
    restarts,
    best_edges_found_t3: best,
    binom_n_2: choose2(n),
    best_over_binom_n_2: Number((best / choose2(n)).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-643',
  script: path.basename(process.argv[1]),
  method: 'deeper_greedy_lower_bound_search_for_t3_union_equality_obstruction',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
