#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 7:
// EP-184, EP-188, EP-195, EP-202, EP-208, EP-212, EP-213, EP-222, EP-233, EP-236.

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function sieve(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= limit; i += 1) {
    if (!isPrime[i]) continue;
    for (let j = i * i; j <= limit; j += i) isPrime[j] = 0;
  }
  const primes = [];
  for (let i = 2; i <= limit; i += 1) if (isPrime[i]) primes.push(i);
  return { isPrime, primes };
}

function isPerfectSquare(n) {
  const r = Math.floor(Math.sqrt(n));
  return r * r === n;
}

const rng = makeRng(20260303 ^ 709);
const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};


// EP-184: edge-disjoint cycle+edge decomposition proxy.
{
  function graphFromEdges(n, edges) {
    const adj = Array.from({ length: n }, () => new Set());
    for (const [u, v] of edges) {
      adj[u].add(v);
      adj[v].add(u);
    }
    return adj;
  }

  function findAnyCycle(adj) {
    const n = adj.length;
    const state = new Int8Array(n); // 0=unseen,1=active,2=done
    const parent = new Int32Array(n);
    parent.fill(-1);

    function dfs(u) {
      state[u] = 1;
      for (const v of adj[u]) {
        if (v === parent[u]) continue;
        if (state[v] === 0) {
          parent[v] = u;
          const cyc = dfs(v);
          if (cyc) return cyc;
        } else if (state[v] === 1) {
          // back edge u-v gives a cycle
          const path = [u];
          let x = u;
          while (x !== v) {
            x = parent[x];
            path.push(x);
          }
          const cycleEdges = [];
          for (let i = 0; i + 1 < path.length; i += 1) {
            const a = path[i];
            const b = path[i + 1];
            cycleEdges.push(a < b ? [a, b] : [b, a]);
          }
          const a = u < v ? [u, v] : [v, u];
          cycleEdges.push(a);
          return cycleEdges;
        }
      }
      state[u] = 2;
      return null;
    }

    for (let s = 0; s < n; s += 1) {
      if (state[s] !== 0) continue;
      const cyc = dfs(s);
      if (cyc) return cyc;
    }
    return null;
  }

  function decomposeCount(n, edges) {
    const adj = graphFromEdges(n, edges);
    let cyclePieces = 0;

    while (true) {
      const cyc = findAnyCycle(adj);
      if (!cyc) break;
      for (const [u, v] of cyc) {
        adj[u].delete(v);
        adj[v].delete(u);
      }
      cyclePieces += 1;
    }

    let edgePieces = 0;
    for (let u = 0; u < n; u += 1) edgePieces += adj[u].size;
    edgePieces /= 2;
    return cyclePieces + edgePieces;
  }

  function randomGraphEdges(n, m) {
    const pairs = [];
    for (let u = 0; u < n; u += 1) for (let v = u + 1; v < n; v += 1) pairs.push([u, v]);
    shuffle(pairs, rng);
    return pairs.slice(0, Math.min(m, pairs.length));
  }

  const rows = [];
  for (const n of [60, 90, 120, 150, 180]) {
    for (const c of [2, 3, 4]) {
      const m = c * n;
      let best = Infinity;
      let avg = 0;
      const trials = n <= 120 ? 50 : 30;
      for (let t = 0; t < trials; t += 1) {
        const val = decomposeCount(n, randomGraphEdges(n, m));
        avg += val;
        if (val < best) best = val;
      }
      rows.push({
        model: 'random_graph',
        n,
        m,
        trials,
        best_pieces_found: best,
        avg_pieces: Number((avg / trials).toFixed(3)),
        best_over_n: Number((best / n).toFixed(6)),
      });
    }
  }

  for (const n of [60, 90, 120, 150, 180]) {
    const edges = [];
    const left = [0, 1, 2];
    for (const u of left) for (let v = 3; v < n; v += 1) edges.push([u, v]);
    const m = edges.length;
    const pieces = decomposeCount(n, edges);
    rows.push({
      model: 'K_3_n_minus_3',
      n,
      m,
      decomposition_pieces_found: pieces,
      lower_bound_m_over_6: Number((m / 6).toFixed(6)),
      pieces_over_n: Number((pieces / n).toFixed(6)),
    });
  }

  out.results.ep184 = {
    description: 'Greedy edge-disjoint cycle+edge decomposition profile on random graphs and K_{3,n-3}.',
    rows,
  };
}


const single={problem:'EP-184',script:path.basename(process.argv[1]),generated_utc:new Date().toISOString(),result:out.results.ep184};
const OUT=process.env.OUT || path.join('data','ep184_standalone_compute.json');
fs.writeFileSync(OUT, JSON.stringify(single,null,2)+'\n');
console.log(JSON.stringify({problem:'EP-184',out:OUT},null,2));
