#!/usr/bin/env node

// EP-1016 deep finite search:
// pancyclic witness search for graphs with m=n+h edges.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function randomGraphWithMEdges(n, m, rng) {
  const edges = [];
  for (let i = 0; i < n; i += 1) for (let j = i + 1; j < n; j += 1) edges.push([i, j]);
  for (let i = edges.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = edges[i]; edges[i] = edges[j]; edges[j] = t;
  }

  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  for (let i = 0; i < Math.min(m, edges.length); i += 1) {
    const [u, v] = edges[i];
    adj[u][v] = 1;
    adj[v][u] = 1;
  }
  return { adj };
}

function cycleLengthsPresent(adj) {
  const n = adj.length;
  const found = new Uint8Array(n + 1);

  function dfs(start, u, used, depth) {
    for (let v = 0; v < n; v += 1) {
      if (!adj[u][v]) continue;
      if (v === start && depth >= 3) {
        found[depth] = 1;
        continue;
      }
      if (used[v]) continue;
      if (v < start) continue;
      used[v] = 1;
      dfs(start, v, used, depth + 1);
      used[v] = 0;
    }
  }

  for (let s = 0; s < n; s += 1) {
    const used = new Uint8Array(n);
    used[s] = 1;
    dfs(s, s, used, 1);
  }

  return found;
}

function isPancyclic(adj) {
  const n = adj.length;
  const cyc = cycleLengthsPresent(adj);
  for (let k = 3; k <= n; k += 1) if (!cyc[k]) return false;
  return true;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const rows = [];
  for (const n of [8, 9, 10, 11, 12, 13, 14]) {
    let bestH = null;
    let witnessM = null;
    for (let h = 0; h <= 14; h += 1) {
      const m = n + h;
      let found = false;
      const tries = 320 * depth;
      for (let t = 0; t < tries; t += 1) {
        const rng = makeRng((20260314 ^ (1016 * 104729) ^ (n * 12289) ^ (h * 8191) ^ t) >>> 0);
        const G = randomGraphWithMEdges(n, m, rng);
        if (isPancyclic(G.adj)) {
          found = true;
          break;
        }
      }
      if (found) {
        bestH = h;
        witnessM = m;
        break;
      }
    }

    rows.push({
      n,
      minimal_h_found_in_random_search: bestH,
      witness_edge_count_n_plus_h: witnessM,
      baseline_log2_n: Number(Math.log2(n).toFixed(8)),
    });
  }

  const payload = {
    problem: 'EP-1016',
    script: 'ep1016.mjs',
    method: 'deep_random_pancyclic_witness_search_with_exact_cycle_length_checks',
    warning: 'Random search gives upper-bound witnesses only; non-detection is inconclusive.',
    params: { depth, max_h_tested: 14, trials_per_h_base: 320 },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
