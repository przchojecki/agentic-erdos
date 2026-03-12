#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function colorK(N, k, rng) {
  const C = Array.from({ length: N }, () => Array(N).fill(-1));
  for (let i = 0; i < N; i += 1) for (let j = i + 1; j < N; j += 1) C[i][j] = C[j][i] = Math.floor(rng() * k);
  return C;
}

function combinations(n, k) {
  const out = [];
  const cur = [];
  function dfs(s, need) {
    if (need === 0) { out.push(cur.slice()); return; }
    for (let x = s; x <= n - need; x += 1) {
      cur.push(x);
      dfs(x + 1, need - 1);
      cur.pop();
    }
  }
  dfs(0, k);
  return out;
}

function hasMonoTree(C, treeEdges, color) {
  const N = C.length;
  const t = Math.max(...treeEdges.flat()) + 1;
  const subs = combinations(N, t);
  for (const map of subs) {
    let ok = true;
    for (const [a, b] of treeEdges) {
      if (C[map[a]][map[b]] !== color) { ok = false; break; }
    }
    if (ok) return true;
  }
  return false;
}

function randomAvoidHits(k, N, treeEdges, trials, rng) {
  let hits = 0;
  for (let t = 0; t < trials; t += 1) {
    const C = colorK(N, k, rng);
    let bad = false;
    for (let c = 0; c < k; c += 1) {
      if (hasMonoTree(C, treeEdges, c)) { bad = true; break; }
    }
    if (!bad) hits += 1;
  }
  return hits;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 557);

const P6 = [[0,1],[1,2],[2,3],[3,4],[4,5]];
const S6 = [[0,1],[0,2],[0,3],[0,4],[0,5]];

const tasks = [
  { tree: 'P6', nTree: 6, edges: P6, k: 3, Ns: [14,16,18], trials: 120 },
  { tree: 'P6', nTree: 6, edges: P6, k: 4, Ns: [18,20,22], trials: 90 },
  { tree: 'S6', nTree: 6, edges: S6, k: 3, Ns: [14,16,18], trials: 120 },
];

const rows = [];
for (const task of tasks) {
  for (const N of task.Ns) {
    rows.push({
      tree: task.tree,
      n_tree: task.nTree,
      k_colors: task.k,
      N,
      trials: task.trials,
      random_avoiding_hits: randomAvoidHits(task.k, N, task.edges, task.trials, rng),
      kn_reference: task.k * task.nTree,
      N_over_kn: Number((N / (task.k * task.nTree)).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-557',
  script: path.basename(process.argv[1]),
  method: 'multicolor_random_avoidance_profile_for_tree_ramsey_linear_kn_reference',
  params: { tasks },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
