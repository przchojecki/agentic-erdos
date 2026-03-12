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

function edgesK(N) {
  const e = [];
  for (let i = 0; i < N; i += 1) for (let j = i + 1; j < N; j += 1) e.push([i, j]);
  return e;
}

function randMask(E, rng) {
  let m = 0n;
  for (let i = 0; i < E; i += 1) if (rng() < 0.5) m |= 1n << BigInt(i);
  return m;
}

function idxMat(N) {
  const idx = Array.from({ length: N }, () => Array(N).fill(-1));
  let e = 0;
  for (let i = 0; i < N; i += 1) {
    for (let j = i + 1; j < N; j += 1) {
      idx[i][j] = e;
      idx[j][i] = e;
      e += 1;
    }
  }
  return idx;
}

function combinations(n, k) {
  const out = [];
  const cur = [];
  function dfs(s, need) {
    if (need === 0) {
      out.push(cur.slice());
      return;
    }
    for (let x = s; x <= n - need; x += 1) {
      cur.push(x);
      dfs(x + 1, need - 1);
      cur.pop();
    }
  }
  dfs(0, k);
  return out;
}

function hasMonoTree(mask, N, treeEdges, red, idx) {
  const t = Math.max(...treeEdges.flat()) + 1;
  const vs = combinations(N, t);
  for (const subset of vs) {
    const map = subset;
    let ok = true;
    for (const [a, b] of treeEdges) {
      const bit = ((mask >> BigInt(idx[map[a]][map[b]])) & 1n) === 1n;
      const col = red ? bit : !bit;
      if (!col) {
        ok = false;
        break;
      }
    }
    if (ok) return true;
  }
  return false;
}

function hasBlueCompleteMultipartite(mask, N, parts, idx) {
  const total = parts.reduce((a, b) => a + b, 0);
  if (total > N) return false;

  const all = Array.from({ length: N }, (_, i) => i);
  function choose(arr, k, start, cur, out) {
    if (k === 0) {
      out.push(cur.slice());
      return;
    }
    for (let i = start; i <= arr.length - k; i += 1) {
      cur.push(arr[i]);
      choose(arr, k - 1, i + 1, cur, out);
      cur.pop();
    }
  }

  const picks = [];
  function dfsPart(pi, avail, acc) {
    if (pi === parts.length) {
      picks.push(acc.map((x) => x.slice()));
      return;
    }
    const options = [];
    choose(avail, parts[pi], 0, [], options);
    for (const op of options) {
      const remSet = new Set(op);
      const rem = avail.filter((x) => !remSet.has(x));
      acc.push(op);
      dfsPart(pi + 1, rem, acc);
      acc.pop();
      if (picks.length > 1400) return;
    }
  }
  dfsPart(0, all, []);

  for (const cls of picks) {
    let ok = true;
    for (let i = 0; i < cls.length && ok; i += 1) {
      for (let j = i + 1; j < cls.length && ok; j += 1) {
        for (const u of cls[i]) {
          for (const v of cls[j]) {
            const red = ((mask >> BigInt(idx[u][v])) & 1n) === 1n;
            if (red) {
              ok = false;
              break;
            }
          }
        }
      }
    }
    if (ok) return true;
  }
  return false;
}

function randomAvoidHits(N, treeEdges, parts, trials, rng) {
  const idx = idxMat(N);
  const E = (N * (N - 1)) / 2;
  let hits = 0;
  for (let t = 0; t < trials; t += 1) {
    const mask = randMask(E, rng);
    const redTree = hasMonoTree(mask, N, treeEdges, true, idx);
    const blueG = hasBlueCompleteMultipartite(mask, N, parts, idx);
    if (!redTree && !blueG) hits += 1;
  }
  return hits;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 550);

const P5 = [[0,1],[1,2],[2,3],[3,4]];
const S5 = [[0,1],[0,2],[0,3],[0,4]];

const tasks = [
  { tree: 'P5', treeEdges: P5, nTree: 5, parts: [2,2,2], Ns: [8,9,10], trials: 240 },
  { tree: 'P5', treeEdges: P5, nTree: 5, parts: [2,3,3], Ns: [10,11,12], trials: 200 },
  { tree: 'S5', treeEdges: S5, nTree: 5, parts: [2,2,3], Ns: [9,10,11], trials: 220 },
];

const rows = [];
for (const task of tasks) {
  for (const N of task.Ns) {
    const hits = randomAvoidHits(N, task.treeEdges, task.parts, task.trials, rng);
    const m1 = Math.min(...task.parts);
    rows.push({
      tree: task.tree,
      tree_order_n: task.nTree,
      multipartite_parts: task.parts.join('+'),
      N,
      trials: task.trials,
      random_avoiding_hits: hits,
      rhs_shape_reference_for_k_part: `(k-1)*(R(T,K_{m1,m2})-1)+m1 with k=${task.parts.length}, m1=${m1}`,
    });
  }
}

const out = {
  problem: 'EP-550',
  script: path.basename(process.argv[1]),
  method: 'random_2color_avoidance_profile_for_tree_vs_complete_multipartite_instances',
  params: { tasks },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
