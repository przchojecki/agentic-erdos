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

  function neighbors(v, set) {
    const out = [];
    for (const u of set) if (adj[v][u]) out.push(u);
    return out;
  }

  function bk(R, P, X) {
    if (P.length === 0 && X.length === 0) {
      if (R.length >= 2) cliques.push(R.slice());
      return;
    }
    const PuX = [...P, ...X];
    let pivot = PuX[0] ?? -1;
    let maxDeg = -1;
    for (const u of PuX) {
      let d = 0;
      for (const v of P) if (adj[u][v]) d += 1;
      if (d > maxDeg) { maxDeg = d; pivot = u; }
    }
    const cand = P.filter((v) => !(pivot >= 0 && adj[pivot][v]));
    for (const v of cand) {
      const P2 = neighbors(v, P);
      const X2 = neighbors(v, X);
      R.push(v);
      bk(R, P2, X2);
      R.pop();
      P.splice(P.indexOf(v), 1);
      X.push(v);
    }
  }

  bk([], Array.from({ length: n }, (_, i) => i), []);
  return cliques;
}

function cliqueTransversalNumberExact(G) {
  const clq = maximalCliques(G);
  const n = G.n;
  if (clq.length === 0) return 0;

  const onV = Array.from({ length: n }, () => []);
  for (let i = 0; i < clq.length; i += 1) for (const v of clq[i]) onV[v].push(i);

  const covered = new Uint8Array(clq.length);
  let coveredCount = 0;
  let best = n + 1;

  function chooseClique() {
    let idx = -1;
    let bestSz = 1e9;
    for (let i = 0; i < clq.length; i += 1) {
      if (covered[i]) continue;
      if (clq[i].length < bestSz) { bestSz = clq[i].length; idx = i; }
    }
    return idx;
  }

  function dfs(chosen) {
    if (chosen >= best) return;
    if (coveredCount === clq.length) { best = chosen; return; }
    const ci = chooseClique();
    if (ci < 0) { best = Math.min(best, chosen); return; }
    for (const v of clq[ci]) {
      const flipped = [];
      for (const j of onV[v]) {
        if (!covered[j]) {
          covered[j] = 1;
          flipped.push(j);
          coveredCount += 1;
        }
      }
      dfs(chosen + 1);
      for (const j of flipped) {
        covered[j] = 0;
        coveredCount -= 1;
      }
    }
  }

  dfs(0);
  return best;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 610);
const rows = [];

for (const [n, p, trials] of [[14, 0.25, 18], [16, 0.22, 14], [18, 0.2, 10]]) {
  let sumTau = 0;
  let sumBoundGap = 0;
  let maxTau = 0;
  for (let t = 0; t < trials; t += 1) {
    const G = randomGraph(n, p, rng);
    const tau = cliqueTransversalNumberExact(G);
    const b = n - Math.sqrt(2 * n);
    sumTau += tau;
    sumBoundGap += (tau - b);
    if (tau > maxTau) maxTau = tau;
  }
  rows.push({
    n,
    p,
    trials,
    avg_tau_exact: Number((sumTau / trials).toPrecision(8)),
    max_tau_exact: maxTau,
    avg_tau_minus_n_minus_sqrt_2n: Number((sumBoundGap / trials).toPrecision(8)),
    avg_tau_over_n: Number(((sumTau / trials) / n).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-610',
  script: path.basename(process.argv[1]),
  method: 'exact_small_n_clique_transversal_profile_vs_classical_sqrt_barrier',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
