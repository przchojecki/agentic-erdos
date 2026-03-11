#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function threeAPs(setVals) {
  const S = new Set(setVals);
  const arr = [...setVals].sort((a, b) => a - b);
  const out = [];
  for (let i = 0; i < arr.length; i += 1) {
    for (let j = i + 1; j < arr.length; j += 1) {
      const a = arr[i], b = arr[j];
      const c = 2 * b - a;
      if (S.has(c)) out.push([a, b, c]);
    }
  }
  return out;
}

function avoidMonotone3APPermutation(vals) {
  const aps = threeAPs(vals);
  const n = vals.length;
  const pos = new Map();
  const used = new Set();

  function checkWithPlaced(v) {
    for (const [a, b, c] of aps) {
      if (!pos.has(a) || !pos.has(b) || !pos.has(c)) continue;
      const pa = pos.get(a), pb = pos.get(b), pc = pos.get(c);
      if ((pa < pb && pb < pc) || (pa > pb && pb > pc)) return false;
    }
    return true;
  }

  const deg = new Map(vals.map((v) => [v, 0]));
  for (const [a, b, c] of aps) {
    deg.set(a, deg.get(a) + 1);
    deg.set(b, deg.get(b) + 1);
    deg.set(c, deg.get(c) + 1);
  }
  const order = [...vals].sort((x, y) => deg.get(y) - deg.get(x));

  function dfs(idx) {
    if (idx === n) return true;
    for (const v of order) {
      if (used.has(v)) continue;
      used.add(v);
      pos.set(v, idx);
      if (checkWithPlaced(v) && dfs(idx + 1)) return true;
      pos.delete(v);
      used.delete(v);
    }
    return false;
  }

  return dfs(0);
}

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function randomPartition(N, rng) {
  const A = [], B = [];
  for (let v = 1; v <= N; v += 1) {
    if (rng() < 0.5) A.push(v);
    else B.push(v);
  }
  if (!A.length || !B.length) return null;
  return [A, B];
}

const N_LIST = (process.env.N_LIST || '12,14,16,18').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const TRIALS = Number(process.env.TRIALS || 1600);
const SEED = Number(process.env.SEED || 19702026);
const OUT = process.env.OUT || '';

const rng = makeRng(SEED);
const rows = [];
for (const N of N_LIST) {
  let found = false;
  let witness = null;
  for (let t = 0; t < TRIALS; t += 1) {
    const part = randomPartition(N, rng);
    if (!part) continue;
    const [A, B] = part;
    if (avoidMonotone3APPermutation(A) && avoidMonotone3APPermutation(B)) {
      found = true;
      witness = { trial: t, sizeA: A.length, sizeB: B.length, A_prefix: A.slice(0, 10), B_prefix: B.slice(0, 10) };
      break;
    }
  }
  rows.push({ N, trials: TRIALS, partition_found_with_both_permutable_3AP_avoiding: found, witness });
}

const out = {
  problem: 'EP-197',
  script: path.basename(process.argv[1]),
  method: 'random_partition_plus_backtracking_permutation_avoidance_search',
  params: { N_LIST, TRIALS, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
