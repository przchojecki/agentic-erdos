#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseListInt(value, fallback, minVal = 2) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((v) => Number(v.trim()))
    .filter((v) => Number.isInteger(v) && v >= minVal)
    .sort((a, b) => a - b);
  return out.length ? [...new Set(out)] : fallback;
}

function keyEdge(edge) {
  return edge.join(',');
}

function buildEdgesK2(N) {
  const set = new Set();
  for (let a = 1; a <= N; a += 1) {
    for (let b = a + 1; b <= N; b += 1) {
      const den = b - a;
      const num = a * b;
      if (num % den !== 0) continue;
      const c = num / den;
      if (c <= b || c > N) continue;
      if (c === a || c === b) continue;
      const e = [a, b, c].sort((x, y) => x - y);
      set.add(keyEdge(e));
    }
  }
  return [...set].map((s) => s.split(',').map(Number));
}

function buildEdgesK3(N) {
  const set = new Set();
  for (let a = 1; a <= N; a += 1) {
    for (let b = a + 1; b <= N; b += 1) {
      for (let c = b + 1; c <= N; c += 1) {
        const t = b * c - a * (b + c);
        if (t <= 0) continue;
        const num = a * b * c;
        if (num % t !== 0) continue;
        const d = num / t;
        if (d < 1 || d > N) continue;
        if (d === a || d === b || d === c) continue;
        const e = [a, b, c, d].sort((x, y) => x - y);
        set.add(keyEdge(e));
      }
    }
  }
  return [...set].map((s) => s.split(',').map(Number));
}

function exactMaxIndependentInHypergraph(N, edges) {
  const incident = Array.from({ length: N + 1 }, () => []);
  for (let i = 0; i < edges.length; i += 1) {
    for (const v of edges[i]) incident[v].push(i);
  }

  const status = new Int8Array(N + 1); // 0 undecided, 1 included, -1 excluded
  let included = 0;
  let undecided = N;
  let best = 0;

  function pickVertex() {
    let bestV = -1;
    let bestDeg = -1;
    for (let v = 1; v <= N; v += 1) {
      if (status[v] !== 0) continue;
      const d = incident[v].length;
      if (d > bestDeg) {
        bestDeg = d;
        bestV = v;
      }
    }
    return bestV;
  }

  function canInclude(v) {
    for (const ei of incident[v]) {
      let allIn = true;
      for (const u of edges[ei]) {
        if (u === v) continue;
        if (status[u] !== 1) {
          allIn = false;
          break;
        }
      }
      if (allIn) return false;
    }
    return true;
  }

  function dfs() {
    if (included + undecided <= best) return;
    if (undecided === 0) {
      if (included > best) best = included;
      return;
    }

    const v = pickVertex();
    if (v < 0) {
      if (included > best) best = included;
      return;
    }

    // Branch include-first for stronger lower bounds early.
    if (canInclude(v)) {
      status[v] = 1;
      included += 1;
      undecided -= 1;
      dfs();
      undecided += 1;
      included -= 1;
      status[v] = 0;
    }

    status[v] = -1;
    undecided -= 1;
    dfs();
    undecided += 1;
    status[v] = 0;
  }

  dfs();
  return best;
}

const N_LIST_K2 = parseListInt(process.env.N_LIST_K2, [20, 25, 30, 35, 40, 45, 50], 6);
const N_LIST_K3 = parseListInt(process.env.N_LIST_K3, [16, 20, 24, 28, 32, 36], 6);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows_k2 = [];
for (const N of N_LIST_K2) {
  const edges = buildEdgesK2(N);
  const maxA = exactMaxIndependentInHypergraph(N, edges);
  rows_k2.push({
    k: 2,
    N,
    forbidden_configurations: edges.length,
    f_k_N_exact: maxA,
    density: Number((maxA / N).toFixed(8)),
  });
}

const rows_k3 = [];
for (const N of N_LIST_K3) {
  const edges = buildEdgesK3(N);
  const maxA = exactMaxIndependentInHypergraph(N, edges);
  rows_k3.push({
    k: 3,
    N,
    forbidden_configurations: edges.length,
    f_k_N_exact: maxA,
    density: Number((maxA / N).toFixed(8)),
  });
}

const out = {
  problem: 'EP-301',
  script: path.basename(process.argv[1]),
  method: 'exact_branch_and_bound_max_subset_avoiding_reciprocal_equation_configs',
  params: { N_LIST_K2, N_LIST_K3 },
  rows_k2,
  rows_k3,
  runtime_seconds: Number(((Date.now() - t0) / 1000).toFixed(3)),
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
