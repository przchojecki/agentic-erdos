#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function randomGraph(n, p, rng) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) {
    if (rng() < p) { adj[i][j] = 1; adj[j][i] = 1; }
  }
  return { n, adj };
}

function longestPathHeuristic(G, tries, rng) {
  const { n, adj } = G;
  let best = 1;
  function extend(start) {
    const used = new Uint8Array(n);
    const path = [start];
    used[start] = 1;
    let improved = true;
    while (improved) {
      improved = false;
      const v = path[path.length - 1];
      const cand = [];
      for (let u = 0; u < n; u += 1) if (!used[u] && adj[v][u]) cand.push(u);
      if (cand.length) {
        const u = cand[Math.floor(rng() * cand.length)];
        path.push(u);
        used[u] = 1;
        improved = true;
      }
    }
    return path.length;
  }

  for (let t = 0; t < tries; t += 1) {
    const s = Math.floor(rng() * n);
    const len = extend(s);
    if (len > best) best = len;
  }
  return best;
}

function indepHeuristic(G, tries, rng) {
  const { n, adj } = G;
  let best = 0;
  for (let t = 0; t < tries; t += 1) {
    const ord = Array.from({ length: n }, (_, i) => i);
    for (let i = ord.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const x = ord[i]; ord[i] = ord[j]; ord[j] = x;
    }
    const S = [];
    for (const v of ord) {
      let ok = true;
      for (const u of S) if (adj[u][v]) { ok = false; break; }
      if (ok) S.push(v);
    }
    if (S.length > best) best = S.length;
  }
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 601);
const rows = [];

for (const [n, pList, trials] of [[40, [0.15, 0.25, 0.35, 0.5], 80], [60, [0.1, 0.18, 0.28, 0.4], 60]]) {
  for (const p of pList) {
    let minMaxRatio = 1;
    let avgPathRatio = 0;
    let avgIndRatio = 0;
    for (let t = 0; t < trials; t += 1) {
      const G = randomGraph(n, p, rng);
      const lp = longestPathHeuristic(G, 120, rng);
      const al = indepHeuristic(G, 180, rng);
      const pr = lp / n;
      const ar = al / n;
      avgPathRatio += pr;
      avgIndRatio += ar;
      const mr = Math.max(pr, ar);
      if (mr < minMaxRatio) minMaxRatio = mr;
    }
    rows.push({
      n,
      p,
      trials,
      avg_longest_path_ratio_lb: Number((avgPathRatio / trials).toPrecision(8)),
      avg_independence_ratio_lb: Number((avgIndRatio / trials).toPrecision(8)),
      sampled_min_of_max_ratio_lb: Number(minMaxRatio.toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-601',
  script: path.basename(process.argv[1]),
  method: 'finite_limit_ordinal_proxy_long_path_vs_large_independent_set',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
