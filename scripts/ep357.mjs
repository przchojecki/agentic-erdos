#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x > 0)
    .sort((a, b) => a - b);
  return out.length ? out : fallback;
}

function greedySeed(n) {
  const seq = [];
  const pref = [0];
  const used = new Set();
  for (let a = 1; a <= n; a += 1) {
    const np = pref[pref.length - 1] + a;
    let ok = true;
    for (let i = 0; i < pref.length; i += 1) {
      const s = np - pref[i];
      if (used.has(s)) {
        ok = false;
        break;
      }
    }
    if (!ok) continue;
    for (let i = 0; i < pref.length; i += 1) used.add(np - pref[i]);
    pref.push(np);
    seq.push(a);
  }
  return seq;
}

function exactMaxK(n, startBest = [], maxNodes) {
  let best = [...startBest];
  let nodes = 0;
  let aborted = false;
  const seq = [];
  const pref = [0];
  const used = new Set();

  function place(a) {
    const np = pref[pref.length - 1] + a;
    const newSums = [];
    for (let i = 0; i < pref.length; i += 1) {
      const s = np - pref[i];
      if (used.has(s)) return null;
      newSums.push(s);
    }
    return { np, newSums };
  }

  function dfs(startVal) {
    if (aborted) return;
    nodes += 1;
    if (nodes >= maxNodes) {
      aborted = true;
      return;
    }
    if (seq.length > best.length) best = seq.slice();
    if (seq.length + (n - startVal + 1) <= best.length) return;

    for (let a = n; a >= startVal; a -= 1) {
      const plc = place(a);
      if (!plc) continue;
      const { np, newSums } = plc;
      for (const s of newSums) used.add(s);
      pref.push(np);
      seq.push(a);
      dfs(a + 1);
      seq.pop();
      pref.pop();
      for (const s of newSums) used.delete(s);
    }
  }

  dfs(1);
  return { best, nodes, aborted };
}

const N_LIST = parseIntList(process.env.N_LIST, [42, 44, 46]);
const MAX_NODES = Number(process.env.MAX_NODES || 12000000);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const n of N_LIST) {
  const t1 = Date.now();
  const seed = greedySeed(n);
  const { best, nodes, aborted } = exactMaxK(n, seed, MAX_NODES);
  rows.push({
    n,
    greedy_seed_k: seed.length,
    best_k_found: best.length,
    search_nodes: nodes,
    aborted_at_node_limit: aborted,
    witness_sequence: best,
    runtime_ms: Date.now() - t1,
  });
}
const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));

const out = {
  problem: 'EP-357',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_exact_branch_and_bound_for_distinct_consecutive_sums',
  params: { N_LIST, MAX_NODES },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
