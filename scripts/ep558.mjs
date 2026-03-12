#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function colorCompleteGraph(n, k, rng) {
  const C = Array.from({ length: n }, () => Array(n).fill(-1));
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const c = Math.floor(rng() * k);
      C[i][j] = C[j][i] = c;
    }
  }
  return C;
}

function comb(arr, need, start, cur, out) {
  if (need === 0) {
    out.push(cur.slice());
    return;
  }
  for (let i = start; i <= arr.length - need; i += 1) {
    cur.push(arr[i]);
    comb(arr, need - 1, i + 1, cur, out);
    cur.pop();
  }
}

function hasMonoKst(C, color, s, t) {
  const n = C.length;
  const V = Array.from({ length: n }, (_, i) => i);
  const lefts = [];
  comb(V, s, 0, [], lefts);

  for (const L of lefts) {
    const inL = new Uint8Array(n);
    for (const x of L) inL[x] = 1;
    const rem = V.filter((x) => !inL[x]);
    const rights = [];
    comb(rem, t, 0, [], rights);

    for (const R of rights) {
      let ok = true;
      for (const u of L) {
        for (const v of R) {
          if (C[u][v] !== color) {
            ok = false;
            break;
          }
        }
        if (!ok) break;
      }
      if (ok) return true;
    }
  }
  return false;
}

function randomAvoidHits(k, s, t, n, trials, rng) {
  let hits = 0;
  for (let r = 0; r < trials; r += 1) {
    const C = colorCompleteGraph(n, k, rng);
    let bad = false;
    for (let c = 0; c < k; c += 1) {
      if (hasMonoKst(C, c, s, t)) {
        bad = true;
        break;
      }
    }
    if (!bad) hits += 1;
  }
  return hits;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 558);

const tasks = [
  { k: 2, s: 2, t: 3, ns: [8, 9, 10, 11], trials: 800 },
  { k: 2, s: 3, t: 3, ns: [10, 11, 12, 13], trials: 700 },
  { k: 3, s: 2, t: 2, ns: [12, 13, 14, 15], trials: 700 },
];

const rows = [];
for (const task of tasks) {
  let bestAvoidN = 0;
  for (const n of task.ns) {
    const h = randomAvoidHits(task.k, task.s, task.t, n, task.trials, rng);
    if (h > 0) bestAvoidN = Math.max(bestAvoidN, n);
    rows.push({
      k_colors: task.k,
      s: task.s,
      t: task.t,
      n,
      trials: task.trials,
      random_avoiding_hits: h,
      avoiding_hit_rate: Number((h / task.trials).toPrecision(8)),
    });
  }
  rows.push({
    k_colors: task.k,
    s: task.s,
    t: task.t,
    summary_best_n_with_avoiding_hits: bestAvoidN,
  });
}

const out = {
  problem: 'EP-558',
  script: path.basename(process.argv[1]),
  method: 'multicolor_random_avoidance_profile_for_Kst_ramsey_instances',
  params: { tasks },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
