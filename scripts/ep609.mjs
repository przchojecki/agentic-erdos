#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function buildEdges(N) {
  const e = [];
  for (let i = 0; i < N; i += 1) for (let j = i + 1; j < N; j += 1) e.push([i, j]);
  return e;
}

function firstDiffBit(a, b, bits) {
  for (let k = 0; k < bits; k += 1) if (((a >> k) & 1) !== ((b >> k) & 1)) return k;
  return 0;
}

function initColoring(bits, rng) {
  const base = 1 << bits;
  const N = base + 1;
  const edges = buildEdges(N);
  const colors = new Int16Array(edges.length);
  for (let ei = 0; ei < edges.length; ei += 1) {
    const [u, v] = edges[ei];
    if (u < base && v < base) colors[ei] = firstDiffBit(u, v, bits);
    else colors[ei] = Math.floor(rng() * bits);
  }
  return { N, edges, colors };
}

function oddGirthOfColor(N, edges, colors, targetColor) {
  const neigh = Array.from({ length: N }, () => []);
  for (let i = 0; i < edges.length; i += 1) {
    if (colors[i] !== targetColor) continue;
    const [u, v] = edges[i];
    neigh[u].push(v); neigh[v].push(u);
  }
  let best = Infinity;
  for (let s = 0; s < N; s += 1) {
    const dist = Array(N).fill(-1);
    dist[s] = 0;
    const q = [s];
    for (let qi = 0; qi < q.length; qi += 1) {
      const u = q[qi];
      for (const v of neigh[u]) {
        if (dist[v] < 0) {
          dist[v] = dist[u] + 1;
          q.push(v);
        } else if ((dist[v] & 1) === (dist[u] & 1)) {
          const cand = dist[v] + dist[u] + 1;
          if (cand < best) best = cand;
        }
      }
    }
  }
  return best;
}

function evaluate(bits, conf) {
  let minOdd = Infinity;
  let bip = 0;
  for (let c = 0; c < bits; c += 1) {
    const og = oddGirthOfColor(conf.N, conf.edges, conf.colors, c);
    if (!Number.isFinite(og)) bip += 1;
    else if (og < minOdd) minOdd = og;
  }
  return { minMonochromaticOddCycleLength: Number.isFinite(minOdd) ? minOdd : null, bipartiteColorClasses: bip };
}

function better(a, b) {
  const aa = a.minMonochromaticOddCycleLength ?? 1e9;
  const bb = b.minMonochromaticOddCycleLength ?? 1e9;
  if (aa !== bb) return aa > bb;
  return a.bipartiteColorClasses > b.bipartiteColorClasses;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 609);
const rows = [];

for (const [bits, restarts, iters] of [[3, 24, 2600], [4, 14, 1700], [5, 6, 220]]) {
  let best = { minMonochromaticOddCycleLength: -1, bipartiteColorClasses: -1 };
  for (let r = 0; r < restarts; r += 1) {
    const conf = initColoring(bits, rng);
    let cur = evaluate(bits, conf);
    if (better(cur, best)) best = { ...cur };
    for (let it = 0; it < iters; it += 1) {
      const ei = Math.floor(rng() * conf.edges.length);
      const old = conf.colors[ei];
      let neu = old;
      while (neu === old) neu = Math.floor(rng() * bits);
      conf.colors[ei] = neu;
      const nxt = evaluate(bits, conf);
      if (better(nxt, cur) || rng() < 0.002) {
        cur = nxt;
        if (better(cur, best)) best = { ...cur };
      } else {
        conf.colors[ei] = old;
      }
    }
  }

  rows.push({
    n_colors: bits,
    complete_graph_vertices: (1 << bits) + 1,
    restarts,
    iters,
    best_min_monochromatic_odd_cycle_length_found: best.minMonochromaticOddCycleLength,
    best_bipartite_color_classes: best.bipartiteColorClasses,
  });
}

const out = {
  problem: 'EP-609',
  script: path.basename(process.argv[1]),
  method: 'deeper_odd_girth_search_in_n_colorings_of_K_2_pow_n_plus_1',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
