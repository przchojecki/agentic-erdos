#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-62 finite analogue probe:
// Look for pairs of finite graphs G1,G2 on the same n-vertex label set with:
//   chi(G1) >= 4, chi(G2) >= 4, but chi(G1 ∩ G2) <= 3.
//
// This is only a labeled finite analogue of the infinitary statement.

const N_LIST = (process.env.N_LIST || '10,12,14')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => Number.isInteger(x) && x >= 4 && x <= 28);
const P_LIST = (process.env.P_LIST || '0.35,0.45,0.55,0.65')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => Number.isFinite(x) && x > 0 && x < 1);
const SAMPLES_PER_CFG = Number(process.env.SAMPLES_PER_CFG || 800);
const SEED = Number(process.env.SEED || 20260303);

function makeRng(seed) {
  let x = (seed >>> 0) || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function popcount32(v) {
  let x = v >>> 0;
  x -= (x >>> 1) & 0x55555555;
  x = (x & 0x33333333) + ((x >>> 2) & 0x33333333);
  return (((x + (x >>> 4)) & 0x0f0f0f0f) * 0x01010101) >>> 24;
}

function buildOrder(adj, n) {
  const arr = Array.from({ length: n }, (_, i) => ({
    v: i,
    d: popcount32(adj[i]),
  }));
  arr.sort((a, b) => b.d - a.d || a.v - b.v);
  return arr.map((x) => x.v);
}

function isKColorable(adj, n, k) {
  const order = buildOrder(adj, n);
  const color = new Int8Array(n);
  color.fill(-1);

  function rec(pos) {
    if (pos === n) return true;
    const v = order[pos];
    const mask = adj[v];
    for (let c = 0; c < k; c += 1) {
      let ok = true;
      for (let i = 0; i < n; i += 1) {
        if (((mask >>> i) & 1) && color[i] === c) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      color[v] = c;
      if (rec(pos + 1)) return true;
      color[v] = -1;
    }
    return false;
  }

  return rec(0);
}

function randomGraphAdj(n, p, rng) {
  const adj = new Uint32Array(n);
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (rng() < p) {
        adj[i] |= 1 << j;
        adj[j] |= 1 << i;
      }
    }
  }
  return adj;
}

function edgeCount(adj, n) {
  let s = 0;
  for (let i = 0; i < n; i += 1) s += popcount32(adj[i]);
  return s / 2;
}

function intersectionAdj(a, b, n) {
  const out = new Uint32Array(n);
  for (let i = 0; i < n; i += 1) out[i] = a[i] & b[i];
  return out;
}

function adjToEdgeList(adj, n, maxEdges = 120) {
  const out = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if ((adj[i] >>> j) & 1) {
        out.push([i, j]);
        if (out.length >= maxEdges) return out;
      }
    }
  }
  return out;
}

const rng = makeRng(SEED);
const rows = [];

for (const n of N_LIST) {
  for (const p of P_LIST) {
    let cfgWitness = null;
    let pairTried = 0;
    let bothHighChiCount = 0;

    for (let s = 0; s < SAMPLES_PER_CFG; s += 1) {
      const g1 = randomGraphAdj(n, p, rng);
      const g2 = randomGraphAdj(n, p, rng);
      pairTried += 1;

      const g1High = !isKColorable(g1, n, 3); // chi>=4
      const g2High = !isKColorable(g2, n, 3); // chi>=4
      if (!g1High || !g2High) continue;
      bothHighChiCount += 1;

      const gi = intersectionAdj(g1, g2, n);
      const iAtMost3 = isKColorable(gi, n, 3); // chi<=3
      if (iAtMost3) {
        cfgWitness = {
          n,
          p,
          sample_index: s + 1,
          edges_g1: edgeCount(g1, n),
          edges_g2: edgeCount(g2, n),
          edges_intersection: edgeCount(gi, n),
          edge_list_g1_sample: adjToEdgeList(g1, n),
          edge_list_g2_sample: adjToEdgeList(g2, n),
          edge_list_intersection_sample: adjToEdgeList(gi, n),
        };
        break;
      }
    }

    rows.push({
      n,
      p,
      samples_per_cfg: SAMPLES_PER_CFG,
      pairs_tried: pairTried,
      pairs_with_both_chi_ge_4: bothHighChiCount,
      found_finite_analogue_witness: cfgWitness !== null,
      witness: cfgWitness,
    });

    process.stderr.write(
      `n=${n}, p=${p.toFixed(2)}: found=${cfgWitness !== null}, high-pairs=${bothHighChiCount}\n`
    );
  }
}

const out = {
  problem: 'EP-62',
  script: path.basename(process.argv[1]),
  method: 'finite_labeled_intersection_analogue_chromatic_scan',
  params: {
    n_list: N_LIST,
    p_list: P_LIST,
    samples_per_cfg: SAMPLES_PER_CFG,
    seed: SEED,
  },
  rows,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep62_finite_intersection_analogue_scan.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      outPath,
      summary: rows.map((r) => ({
        n: r.n,
        p: r.p,
        found: r.found_finite_analogue_witness,
        high_pairs: r.pairs_with_both_chi_ge_4,
      })),
    },
    null,
    2
  )
);
