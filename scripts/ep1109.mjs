#!/usr/bin/env node

// EP-1109 deep standalone computation:
// f(N) = max |A|, A subset [1..N], such that all sums in A+A are squarefree.
// Reduced to max clique on compatibility graph.

function sievePrimes(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1, 2);
  for (let p = 2; p * p <= limit; p += 1) {
    if (!isPrime[p]) continue;
    for (let q = p * p; q <= limit; q += p) isPrime[q] = 0;
  }
  const primes = [];
  for (let p = 2; p <= limit; p += 1) if (isPrime[p]) primes.push(p);
  return primes;
}

function nonSquarefreeBitset(limit) {
  const bad = new Uint8Array(limit + 1);
  const primes = sievePrimes(Math.floor(Math.sqrt(limit)) + 2);
  for (const p of primes) {
    const sq = p * p;
    for (let m = sq; m <= limit; m += sq) bad[m] = 1;
  }
  return bad;
}

function buildGraph(N, bad) {
  const vals = [];
  for (let x = 1; x <= N; x += 1) if (!bad[2 * x]) vals.push(x);
  const m = vals.length;

  const adj = Array.from({ length: m }, () => new Uint8Array(m));
  for (let i = 0; i < m; i += 1) {
    for (let j = i + 1; j < m; j += 1) {
      if (!bad[vals[i] + vals[j]]) {
        adj[i][j] = 1;
        adj[j][i] = 1;
      }
    }
  }

  return { vals, adj, m };
}

function greedyLowerBound(adj, trials = 64) {
  const n = adj.length;
  const verts = [...Array(n).keys()];
  let best = 0;

  for (let t = 0; t < trials; t += 1) {
    // shuffled order
    for (let i = 0; i < n; i += 1) {
      const j = i + Math.floor(Math.random() * (n - i));
      const tmp = verts[i];
      verts[i] = verts[j];
      verts[j] = tmp;
    }

    const clique = [];
    for (const v of verts) {
      let ok = true;
      for (const u of clique) if (!adj[v][u]) { ok = false; break; }
      if (ok) clique.push(v);
    }
    if (clique.length > best) best = clique.length;
  }

  return best;
}

function colorSort(cand, adj) {
  const n = cand.length;
  const order = [];
  const bounds = [];

  const remaining = cand.slice();
  let color = 0;
  while (remaining.length > 0) {
    color += 1;
    const used = [];
    const next = [];
    for (const v of remaining) {
      let conflict = false;
      for (const u of used) {
        if (adj[v][u]) {
          conflict = true;
          break;
        }
      }
      if (!conflict) {
        used.push(v);
        order.push(v);
        bounds.push(color);
      } else {
        next.push(v);
      }
    }
    remaining.length = 0;
    for (const x of next) remaining.push(x);
  }

  return { order, bounds };
}

function maxCliqueBounded(adj, timeoutMs, initialBest = 0) {
  const t0 = Date.now();
  const n = adj.length;

  let best = initialBest;
  let nodes = 0;
  let timedOut = false;

  function expand(cand, size) {
    if (timedOut) return;
    if (Date.now() - t0 > timeoutMs) {
      timedOut = true;
      return;
    }
    nodes += 1;

    if (cand.length === 0) {
      if (size > best) best = size;
      return;
    }

    const { order, bounds } = colorSort(cand, adj);

    for (let i = order.length - 1; i >= 0; i -= 1) {
      if (size + bounds[i] <= best) return;
      const v = order[i];

      const next = [];
      for (let j = 0; j < i; j += 1) {
        const u = order[j];
        if (adj[v][u]) next.push(u);
      }
      expand(next, size + 1);
      if (timedOut) return;
    }
  }

  const all = [...Array(n).keys()];
  expand(all, 0);

  return {
    best,
    exact: !timedOut,
    timedOut,
    nodes,
    elapsedMs: Date.now() - t0,
  };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const nList =
    depth >= 4
      ? (() => {
          const out = [];
          for (let n = 220; n <= 1200; n += 20) out.push(n);
          return out;
        })()
      : [80, 100, 120, 140, 160];
  const timeoutMsPerN = depth >= 4 ? 20000 : 6000;

  const Nmax = Math.max(...nList);
  const bad = nonSquarefreeBitset(2 * Nmax + 5);

  const rows = [];
  for (const N of nList) {
    const { vals, adj, m } = buildGraph(N, bad);
    const lb = greedyLowerBound(adj, depth >= 4 ? 140 : 40);
    const r = maxCliqueBounded(adj, timeoutMsPerN, lb);

    rows.push({
      N,
      candidate_vertices_count: m,
      timeout_ms: timeoutMsPerN,
      greedy_lower_bound: lb,
      exact: r.exact,
      timedOut: r.timedOut,
      exact_or_lower_bound_f_N: r.best,
      f_over_log_N: Number((r.best / Math.log(N)).toFixed(10)),
      f_over_sqrt_N: Number((r.best / Math.sqrt(N)).toFixed(10)),
      f_over_loglog_N: Number((r.best / Math.log(Math.log(N))).toFixed(10)),
      nodes: r.nodes,
      elapsed_ms_for_N: r.elapsedMs,
    });
  }

  const payload = {
    problem: 'EP-1109',
    script: 'ep1109.mjs',
    method: 'deep_max_clique_computation_for_squarefree_sumset_subsets_with_coloring_bound_branch_and_bound',
    warning: 'Exact where timeout not hit; timed-out rows are rigorous lower bounds only.',
    params: { depth, nList, timeoutMsPerN },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
