#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function mycielski(adj) {
  const n = adj.length;
  const m = 2 * n + 1;
  const out = Array.from({ length: m }, () => new Uint8Array(m));

  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (!adj[i][j]) continue;
      out[i][j] = out[j][i] = 1;
      out[i][j + n] = out[j + n][i] = 1;
      out[j][i + n] = out[i + n][j] = 1;
    }
  }
  const z = 2 * n;
  for (let i = 0; i < n; i += 1) {
    out[i + n][z] = 1;
    out[z][i + n] = 1;
  }
  return out;
}

function cycle5() {
  const n = 5;
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < n; i += 1) {
    const j = (i + 1) % n;
    adj[i][j] = 1;
    adj[j][i] = 1;
  }
  return adj;
}

function edgesCount(adj) {
  const n = adj.length;
  let m = 0;
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) if (adj[i][j]) m += 1;
  return m;
}

function greedyColorUpperBound(adj) {
  const n = adj.length;
  const deg = Array.from({ length: n }, (_, i) => adj[i].reduce((a, b) => a + b, 0));
  const ord = Array.from({ length: n }, (_, i) => i).sort((a, b) => deg[b] - deg[a]);
  const col = Array(n).fill(-1);
  let used = 0;
  for (const v of ord) {
    const blocked = new Uint8Array(used + 1);
    for (let u = 0; u < n; u += 1) {
      const c = col[u];
      if (c >= 0 && adj[v][u]) blocked[c] = 1;
    }
    let c = 0;
    while (blocked[c]) c += 1;
    col[v] = c;
    if (c + 1 > used) used = c + 1;
  }
  return used;
}

function maxIndependentSetExact(adj, verts) {
  const n = verts.length;
  const idx = new Map(verts.map((v, i) => [v, i]));
  const comp = Array.from({ length: n }, () => 0n);

  for (let i = 0; i < n; i += 1) {
    let mask = 0n;
    for (let j = 0; j < n; j += 1) {
      if (i === j) continue;
      const vi = verts[i];
      const vj = verts[j];
      if (!adj[vi][vj]) mask |= (1n << BigInt(j));
    }
    comp[i] = mask;
  }

  const memo = new Map();
  function dfs(mask) {
    if (mask === 0n) return 0;
    const k = mask.toString();
    if (memo.has(k)) return memo.get(k);

    let i = 0;
    while (((mask >> BigInt(i)) & 1n) === 0n) i += 1;

    const without = dfs(mask & ~(1n << BigInt(i)));
    const withI = 1 + dfs((mask & comp[i]) & ~(1n << BigInt(i)));
    const ans = Math.max(without, withI);
    memo.set(k, ans);
    return ans;
  }

  const full = (1n << BigInt(n)) - 1n;
  return dfs(full);
}

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function sampleSubsets(n, m, samples, rng) {
  const out = [];
  for (let s = 0; s < samples; s += 1) {
    const arr = Array.from({ length: n }, (_, i) => i);
    for (let i = 0; i < m; i += 1) {
      const j = i + Math.floor(rng() * (n - i));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    out.push(arr.slice(0, m).sort((a, b) => a - b));
  }
  return out;
}

const LEVELS = Number(process.env.LEVELS || 3); // C5 -> M(C5) -> M^2(C5) -> M^3(C5)
const M_LIST = (process.env.M_LIST || '8,10,12').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const SAMPLES = Number(process.env.SAMPLES || 80);
const SEED = Number(process.env.SEED || 7502026);
const OUT = process.env.OUT || '';

let g = cycle5();
for (let t = 0; t < LEVELS; t += 1) g = mycielski(g);
const n = g.length;

const rng = makeRng(SEED);
const rows = [];
for (const m of M_LIST) {
  if (m > n) continue;
  const sets = sampleSubsets(n, m, SAMPLES, rng);
  let minAlpha = Infinity;
  let maxAlpha = -1;
  let sumAlpha = 0;
  for (const verts of sets) {
    const a = maxIndependentSetExact(g, verts);
    minAlpha = Math.min(minAlpha, a);
    maxAlpha = Math.max(maxAlpha, a);
    sumAlpha += a;
  }
  rows.push({
    m,
    samples: sets.length,
    min_independent_size: minAlpha,
    avg_independent_size: Number((sumAlpha / sets.length).toFixed(4)),
    max_independent_size: maxAlpha,
    min_ratio: Number((minAlpha / m).toFixed(4)),
  });
}

const out = {
  problem: 'EP-75',
  script: path.basename(process.argv[1]),
  method: 'mycielski_finite_proxy_independent_set_profile',
  params: { LEVELS, M_LIST, SAMPLES, SEED },
  graph: {
    vertices: n,
    edges: edgesCount(g),
    greedy_coloring_upper_bound: greedyColorUpperBound(g),
  },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
