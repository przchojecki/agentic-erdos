#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const N_LIST = (process.env.N_LIST || '5,6,7,8').split(',').map((x) => Number(x.trim())).filter(Boolean);
const GRAPHS_PER_N = Number(process.env.GRAPHS_PER_N || 60);

function makeRng(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 0x100000000);
  };
}
const rng = makeRng(20260313 ^ 719);

function edgeIndex(n, u, v) {
  if (u > v) [u, v] = [v, u];
  let idx = 0;
  for (let a = 0; a < u; a += 1) idx += (n - 1 - a);
  idx += (v - u - 1);
  return idx;
}

function allEdgeMasks(n) {
  const masks = [];
  for (let u = 0; u < n; u += 1) for (let v = u + 1; v < n; v += 1) masks.push(1n << BigInt(edgeIndex(n, u, v)));
  return masks;
}

function triangleMasks(n) {
  const out = [];
  for (let a = 0; a < n; a += 1) {
    for (let b = a + 1; b < n; b += 1) {
      for (let c = b + 1; c < n; c += 1) {
        const m = (1n << BigInt(edgeIndex(n, a, b))) |
                  (1n << BigInt(edgeIndex(n, a, c))) |
                  (1n << BigInt(edgeIndex(n, b, c)));
        out.push(m);
      }
    }
  }
  return out;
}

function minPiecesEdgeTriangle(n, graphMask) {
  const eMasks = allEdgeMasks(n);
  const tMasks = triangleMasks(n);
  const memo = new Map();

  function dfs(mask) {
    if (mask === 0n) return 0;
    const key = mask.toString();
    if (memo.has(key)) return memo.get(key);

    // pick first set edge
    let first = -1;
    for (let i = 0; i < eMasks.length; i += 1) {
      if (mask & eMasks[i]) { first = i; break; }
    }

    let best = 1 + dfs(mask & ~eMasks[first]);

    // try triangles containing the chosen edge and fully present
    const chosen = eMasks[first];
    for (const tm of tMasks) {
      if ((tm & chosen) === 0n) continue;
      if ((mask & tm) === tm) {
        const cand = 1 + dfs(mask & ~tm);
        if (cand < best) best = cand;
      }
    }

    memo.set(key, best);
    return best;
  }

  return dfs(graphMask);
}

function randomGraphMask(n, p = 0.45) {
  let mask = 0n;
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) {
      if (rng() < p) mask |= (1n << BigInt(edgeIndex(n, u, v)));
    }
  }
  return mask;
}

const t0 = Date.now();
const rows = [];
let worst = null;

for (const n of N_LIST) {
  const bound = Math.floor((n * n) / 4);
  let violations = 0;
  let maxPieces = 0;

  for (let t = 0; t < GRAPHS_PER_N; t += 1) {
    const g = randomGraphMask(n, 0.45);
    const pieces = minPiecesEdgeTriangle(n, g);
    if (pieces > maxPieces) maxPieces = pieces;
    if (pieces > bound) {
      violations += 1;
      if (!worst || pieces - bound > worst.excess) worst = { n, pieces, bound, excess: pieces - bound };
    }
  }

  rows.push({
    n,
    sampled_graphs: GRAPHS_PER_N,
    exact_max_pieces_sampled: maxPieces,
    turan_bound_floor_n2_over_4: bound,
    violations_over_sampled: violations,
  });
}

const out = {
  problem: 'EP-719',
  script: path.basename(process.argv[1]),
  method: 'exact_small_n_r_eq_2_decomposition_into_edges_and_triangles',
  interpretation: 'This tests the r=2 analogue suggested by the parsed statement fragment.',
  params: { N_LIST, GRAPHS_PER_N },
  rows,
  worst_sampled_violation: worst,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
