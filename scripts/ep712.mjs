#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const R = Number(process.env.R || 3);
const K = Number(process.env.K || 4);
const N_LIST = (process.env.N_LIST || '12,16,20,24,28,32').split(',').map((x) => Number(x.trim())).filter(Boolean);
const TRIALS = Number(process.env.TRIALS || 220);

function makeRng(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 0x100000000);
  };
}
const rng = makeRng(20260313 ^ 712);

function choose(n, r) {
  if (r < 0 || r > n) return 0;
  let num = 1;
  for (let i = 1; i <= r; i += 1) num = (num * (n - r + i)) / i;
  return Math.round(num);
}

function tuples(n, r) {
  const out = [];
  const cur = [];
  function rec(start) {
    if (cur.length === r) {
      out.push(cur.slice());
      return;
    }
    for (let x = start; x < n; x += 1) {
      cur.push(x);
      rec(x + 1);
      cur.pop();
    }
  }
  rec(0);
  return out;
}

function key(t) { return t.join(','); }

function isBadKset(Hset, kset, r) {
  const need = tuples(kset.length, r).map((idxs) => key(idxs.map((i) => kset[i]).sort((a, b) => a - b)));
  return need.every((e) => Hset.has(e));
}

function randomGreedyKrFree(n, r, k, trials) {
  const allEdges = tuples(n, r);
  const allKsets = tuples(n, k);
  let best = 0;

  for (let t = 0; t < trials; t += 1) {
    // shuffle edge order
    const edges = allEdges.slice();
    for (let i = edges.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      [edges[i], edges[j]] = [edges[j], edges[i]];
    }

    const H = new Set();
    for (const e of edges) {
      const ek = key(e);
      H.add(ek);
      let ok = true;
      for (const ks of allKsets) {
        // quick skip if e not subset of ks
        let includes = true;
        for (const v of e) if (!ks.includes(v)) { includes = false; break; }
        if (!includes) continue;
        if (isBadKset(H, ks, r)) { ok = false; break; }
      }
      if (!ok) H.delete(ek);
    }
    if (H.size > best) best = H.size;
  }
  return best;
}

// Balanced complete (k-1)-partite r-graph density proxy.
function balancedPartiteEdgeCount(n, r, parts) {
  const sizes = Array(parts).fill(Math.floor(n / parts));
  for (let i = 0; i < n % parts; i += 1) sizes[i] += 1;
  let total = 0;
  // count r-subsets intersecting each part in at most 1 vertex
  const idx = Array.from({ length: parts }, (_, i) => i);
  const pTuples = tuples(parts, r);
  for (const tt of pTuples) {
    let prod = 1;
    for (const p of tt) prod *= sizes[p];
    total += prod;
  }
  return total;
}

const t0 = Date.now();
const rows = [];
for (const n of N_LIST) {
  const total = choose(n, R);
  const greedy = randomGreedyKrFree(n, R, K, TRIALS);
  const partite = balancedPartiteEdgeCount(n, R, K - 1);
  rows.push({
    n,
    r: R,
    k: K,
    total_r_edges: total,
    random_greedy_best_Kk_free_edges: greedy,
    greedy_density: Number((greedy / total).toPrecision(8)),
    balanced_k_minus_1_partite_edges: partite,
    partite_density: Number((partite / total).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-712',
  script: path.basename(process.argv[1]),
  method: 'finite_Kk_r_free_hypergraph_density_experiment',
  warning: 'Finite random-greedy lower bounds only; not asymptotic determination of ex_r(n,K_k^r).',
  params: { R, K, N_LIST, TRIALS },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
