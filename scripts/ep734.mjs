#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_LIST = (process.env.N_LIST || '25,36,49,64,81,100').split(',').map((x) => Number(x.trim())).filter(Boolean);
const TRIALS = Number(process.env.TRIALS || 24);

function makeRng(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 0x100000000);
  };
}
const rng = makeRng(20260313 ^ 734);

function key(u, v) { return u < v ? `${u},${v}` : `${v},${u}`; }

function randomPbdLikeDecomposition(n) {
  const uncovered = new Set();
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) uncovered.add(key(i, j));
  const blocks = [];

  function neighborsInUncovered(v) {
    const out = [];
    for (let u = 0; u < n; u += 1) {
      if (u === v) continue;
      if (uncovered.has(key(u, v))) out.push(u);
    }
    return out;
  }

  while (uncovered.size > 0) {
    const any = [...uncovered][Math.floor(rng() * uncovered.size)];
    const [a0, b0] = any.split(',').map(Number);
    const clique = [a0, b0];

    let candidates = neighborsInUncovered(a0).filter((x) => x !== b0 && uncovered.has(key(x, b0)));
    // greedy random extension of uncovered-clique
    while (candidates.length > 0 && clique.length < 10) {
      const v = candidates[Math.floor(rng() * candidates.length)];
      if (clique.every((u) => uncovered.has(key(u, v)))) clique.push(v);
      candidates = candidates.filter((x) => x !== v && clique.every((u) => uncovered.has(key(u, x))));
    }

    // remove all edges of block
    for (let i = 0; i < clique.length; i += 1) {
      for (let j = i + 1; j < clique.length; j += 1) uncovered.delete(key(clique[i], clique[j]));
    }
    blocks.push(clique.length);
  }

  const mult = new Map();
  for (const s of blocks) mult.set(s, (mult.get(s) || 0) + 1);
  let maxMult = 0;
  for (const v of mult.values()) if (v > maxMult) maxMult = v;

  return { block_count: blocks.length, multiplicities: Object.fromEntries([...mult.entries()].sort((a, b) => a[0] - b[0])), max_multiplicity_any_size: maxMult };
}

const t0 = Date.now();
const rows = [];
for (const n of N_LIST) {
  let best = null;
  for (let t = 0; t < TRIALS; t += 1) {
    const cur = randomPbdLikeDecomposition(n);
    // prefer smaller max multiplicity
    if (!best || cur.max_multiplicity_any_size < best.max_multiplicity_any_size) best = cur;
  }
  rows.push({
    n,
    trials: TRIALS,
    best_found_block_count: best.block_count,
    best_found_max_multiplicity_any_size: best.max_multiplicity_any_size,
    sqrt_n: Number(Math.sqrt(n).toPrecision(8)),
    ratio_max_mult_over_sqrt_n: Number((best.max_multiplicity_any_size / Math.sqrt(n)).toPrecision(8)),
    multiplicities_by_block_size_for_best: best.multiplicities,
  });
}

const out = {
  problem: 'EP-734',
  script: path.basename(process.argv[1]),
  method: 'random_edge_partition_of_complete_graph_into_cliques_as_PBD_proxy',
  warning: 'Heuristic finite construction proxy; not a proof-level PBD existence theorem.',
  params: { N_LIST, TRIALS },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
