#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';
const MAX_TREE_ORDER = Number(process.env.MAX_TREE_ORDER || 7);

function mycielski(adj) {
  const n = adj.length;
  const m = 2 * n + 1;
  const g = Array.from({ length: m }, () => new Set());
  for (let u = 0; u < n; u += 1) {
    for (const v of adj[u]) if (u < v) { g[u].add(v); g[v].add(u); }
  }
  for (let u = 0; u < n; u += 1) {
    for (const v of adj[u]) {
      g[u].add(n + v);
      g[n + v].add(u);
    }
  }
  const w = 2 * n;
  for (let u = 0; u < n; u += 1) { g[n + u].add(w); g[w].add(n + u); }
  return g.map((s) => [...s]);
}

function k2() { return [[1],[0]]; }

function isTriangleFree(adj) {
  const n = adj.length;
  const mat = Array.from({ length: n }, () => Array(n).fill(false));
  for (let u = 0; u < n; u += 1) for (const v of adj[u]) mat[u][v] = true;
  for (let a = 0; a < n; a += 1) for (let b = a + 1; b < n; b += 1) if (mat[a][b]) for (let c = b + 1; c < n; c += 1) if (mat[a][c] && mat[b][c]) return false;
  return true;
}

function genTrees(h) {
  if (h === 1) return [Array.from({ length: 1 }, () => [])];
  const seqCount = h ** (h - 2);
  const seen = new Set();
  const trees = [];

  function canonical(adj) {
    const n = adj.length;
    const perm = Array.from({ length: n }, (_, i) => i);
    let best = null;
    function rec(i) {
      if (i === n) {
        let bits = '';
        for (let a = 0; a < n; a += 1) for (let b = a + 1; b < n; b += 1) bits += adj[perm[a]].includes(perm[b]) ? '1' : '0';
        if (best == null || bits < best) best = bits;
        return;
      }
      for (let j = i; j < n; j += 1) {
        [perm[i], perm[j]] = [perm[j], perm[i]];
        rec(i + 1);
        [perm[i], perm[j]] = [perm[j], perm[i]];
      }
    }
    rec(0);
    return best;
  }

  for (let code = 0; code < seqCount; code += 1) {
    let x = code;
    const prufer = [];
    for (let i = 0; i < h - 2; i += 1) {
      prufer.push(x % h);
      x = Math.floor(x / h);
    }
    const deg = Array(h).fill(1);
    for (const v of prufer) deg[v] += 1;
    const adj = Array.from({ length: h }, () => []);
    for (const v of prufer) {
      let leaf = 0;
      while (deg[leaf] !== 1) leaf += 1;
      adj[leaf].push(v); adj[v].push(leaf);
      deg[leaf] -= 1; deg[v] -= 1;
    }
    const rem = [];
    for (let i = 0; i < h; i += 1) if (deg[i] === 1) rem.push(i);
    adj[rem[0]].push(rem[1]); adj[rem[1]].push(rem[0]);
    const c = canonical(adj);
    if (!seen.has(c)) { seen.add(c); trees.push(adj); }
  }
  return trees;
}

function containsInducedTree(adj, treeAdj) {
  const n = adj.length;
  const h = treeAdj.length;
  const needEdges = treeAdj.reduce((s, x) => s + x.length, 0) / 2;

  const nodes = Array.from({ length: n }, (_, i) => i);
  const choose = [];
  function rec(start) {
    if (choose.length === h) {
      let edges = 0;
      const map = new Map(choose.map((v, i) => [v, i]));
      const sub = Array.from({ length: h }, () => []);
      for (let i = 0; i < h; i += 1) {
        const u = choose[i];
        for (const v of adj[u]) {
          if (map.has(v)) {
            const j = map.get(v);
            if (i < j) { edges += 1; sub[i].push(j); sub[j].push(i); }
          }
        }
      }
      if (edges !== needEdges) return false;
      // tree isomorphism brute via permutation
      const p = Array.from({ length: h }, (_, i) => i);
      let ok = false;
      function permute(i) {
        if (ok) return;
        if (i === h) {
          for (let a = 0; a < h; a += 1) {
            for (let b = a + 1; b < h; b += 1) {
              const in1 = sub[a].includes(b);
              const in2 = treeAdj[p[a]].includes(p[b]);
              if (in1 !== in2) return;
            }
          }
          ok = true;
          return;
        }
        for (let j = i; j < h; j += 1) {
          [p[i], p[j]] = [p[j], p[i]];
          permute(i + 1);
          [p[i], p[j]] = [p[j], p[i]];
        }
      }
      permute(0);
      return ok;
    }
    for (let i = start; i <= n - (h - choose.length); i += 1) {
      choose.push(nodes[i]);
      if (rec(i + 1)) return true;
      choose.pop();
    }
    return false;
  }
  return rec(0);
}

const t0 = Date.now();
const graphs = [];
let g = k2();
graphs.push(g);
for (let i = 0; i < 3; i += 1) { g = mycielski(g); graphs.push(g); } // up to 23 vertices

const rows = [];
for (let level = 0; level < graphs.length; level += 1) {
  const adj = graphs[level];
  const n = adj.length;
  if (n > 23) continue;
  for (let h = 3; h <= MAX_TREE_ORDER; h += 1) {
    const trees = genTrees(h);
    let covered = 0;
    for (const tAdj of trees) if (containsInducedTree(adj, tAdj)) covered += 1;
    rows.push({
      mycielski_level: level,
      n,
      triangle_free: isTriangleFree(adj),
      tree_order_h: h,
      nonisomorphic_trees_count: trees.length,
      induced_tree_shapes_found: covered,
      coverage_fraction: Number((covered / trees.length).toPrecision(8)),
    });
  }
}

const out = {
  problem: 'EP-738',
  script: path.basename(process.argv[1]),
  method: 'mycielski_triangle_free_high_chromatic_graphs_induced_tree_coverage_proxy',
  warning: 'Finite proxy under repaired statement interpretation.',
  params: { MAX_TREE_ORDER },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
