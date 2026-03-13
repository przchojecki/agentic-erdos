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

function maximalCliques(G) {
  const { n, adj } = G;
  const cliques = [];
  function neighbors(v, set) { return set.filter((u) => adj[v][u]); }
  function bk(R, P, X) {
    if (P.length === 0 && X.length === 0) {
      if (R.length >= 2) cliques.push(R.slice());
      return;
    }
    const pivot = (P[0] ?? X[0] ?? -1);
    const cand = pivot < 0 ? P.slice() : P.filter((v) => !adj[pivot][v]);
    for (const v of cand) {
      const P2 = neighbors(v, P);
      const X2 = neighbors(v, X);
      R.push(v); bk(R, P2, X2); R.pop();
      P.splice(P.indexOf(v), 1);
      X.push(v);
    }
  }
  bk([], Array.from({ length: n }, (_, i) => i), []);
  return cliques;
}

function tauExactFromCliques(n, clq) {
  if (clq.length === 0) return 0;
  const onV = Array.from({ length: n }, () => []);
  for (let i = 0; i < clq.length; i += 1) for (const v of clq[i]) onV[v].push(i);
  const covered = new Uint8Array(clq.length);
  let coveredCount = 0;
  let best = n + 1;
  function chooseClique() {
    let idx = -1; let sz = 1e9;
    for (let i = 0; i < clq.length; i += 1) if (!covered[i] && clq[i].length < sz) { sz = clq[i].length; idx = i; }
    return idx;
  }
  function dfs(chosen) {
    if (chosen >= best) return;
    if (coveredCount === clq.length) { best = chosen; return; }
    const ci = chooseClique(); if (ci < 0) { best = Math.min(best, chosen); return; }
    for (const v of clq[ci]) {
      const flip = [];
      for (const j of onV[v]) if (!covered[j]) { covered[j] = 1; flip.push(j); coveredCount += 1; }
      dfs(chosen + 1);
      for (const j of flip) { covered[j] = 0; coveredCount -= 1; }
    }
  }
  dfs(0);
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 611);
const rows = [];

function completeGraph(n) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) { adj[i][j] = 1; adj[j][i] = 1; }
  return { n, adj };
}

function completeMinusMatching(n) {
  const G = completeGraph(n);
  for (let i = 0; i + 1 < n; i += 2) {
    G.adj[i][i + 1] = 0;
    G.adj[i + 1][i] = 0;
  }
  return G;
}

for (const [family, n, G] of [
  ['complete_graph', 14, completeGraph(14)],
  ['complete_graph', 18, completeGraph(18)],
  ['complete_minus_perfect_matching', 14, completeMinusMatching(14)],
  ['complete_minus_perfect_matching', 18, completeMinusMatching(18)],
]) {
  const clq = maximalCliques(G);
  const minMaxClique = Math.min(...clq.map((x) => x.length));
  const tau = tauExactFromCliques(n, clq);
  rows.push({
    mode: 'deterministic_family',
    family,
    n,
    min_maximal_clique_size: minMaxClique,
    min_maximal_clique_over_n: Number((minMaxClique / n).toPrecision(8)),
    tau_exact: tau,
    tau_over_n: Number((tau / n).toPrecision(8)),
  });
}

for (const [n, c, p, trials] of [[14, 0.15, 0.46, 80], [16, 0.18, 0.44, 70], [18, 0.2, 0.42, 60]]) {
  let accepted = 0;
  let sumTau = 0;
  let sumMinMaxClique = 0;
  let bestTau = 0;
  for (let t = 0; t < trials; t += 1) {
    const G = randomGraph(n, p, rng);
    const clq = maximalCliques(G);
    if (clq.length === 0) continue;
    const minMaxClique = Math.min(...clq.map((x) => x.length));
    if (minMaxClique < Math.ceil(c * n)) continue;
    accepted += 1;
    const tau = tauExactFromCliques(n, clq);
    sumTau += tau;
    sumMinMaxClique += minMaxClique;
    if (tau > bestTau) bestTau = tau;
  }
  rows.push({
    mode: 'random_filtered',
    n,
    c,
    p,
    trials,
    accepted_with_min_maximal_clique_at_least_cn: accepted,
    avg_min_maximal_clique_size: accepted ? Number((sumMinMaxClique / accepted).toPrecision(8)) : null,
    avg_tau_exact: accepted ? Number((sumTau / accepted).toPrecision(8)) : null,
    max_tau_exact: accepted ? bestTau : null,
    avg_tau_over_n: accepted ? Number(((sumTau / accepted) / n).toPrecision(8)) : null,
  });
}

const out = {
  problem: 'EP-611',
  script: path.basename(process.argv[1]),
  method: 'finite_exact_tau_profile_under_linear_minimal_maximal_clique_constraint',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
