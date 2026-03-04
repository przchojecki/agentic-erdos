#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 15:
// EP-576, EP-584, EP-585, EP-588, EP-589,
// EP-591, EP-592, EP-604, EP-609, EP-612.

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

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function choose2(n) {
  return (n * (n - 1)) / 2;
}

function edgeKey(u, v) {
  return u < v ? `${u},${v}` : `${v},${u}`;
}

function makeGraph(n) {
  const adj = Array.from({ length: n }, () => Array(n).fill(0));
  const neigh = Array.from({ length: n }, () => []);
  return { n, adj, neigh, m: 0 };
}

function addEdge(G, u, v) {
  if (u === v || G.adj[u][v]) return false;
  G.adj[u][v] = 1;
  G.adj[v][u] = 1;
  G.neigh[u].push(v);
  G.neigh[v].push(u);
  G.m += 1;
  return true;
}

function removeEdge(G, u, v) {
  if (!G.adj[u][v]) return false;
  G.adj[u][v] = 0;
  G.adj[v][u] = 0;
  G.neigh[u] = G.neigh[u].filter((x) => x !== v);
  G.neigh[v] = G.neigh[v].filter((x) => x !== u);
  G.m -= 1;
  return true;
}

function randomGraph(n, p, rng) {
  const G = makeGraph(n);
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) {
      if (rng() < p) addEdge(G, u, v);
    }
  }
  return G;
}

function allEdges(n) {
  const e = [];
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) e.push([u, v]);
  }
  return e;
}

function combinations(arr, k) {
  const out = [];
  const cur = [];
  function dfs(i, left) {
    if (left === 0) {
      out.push([...cur]);
      return;
    }
    for (let j = i; j <= arr.length - left; j += 1) {
      cur.push(arr[j]);
      dfs(j + 1, left - 1);
      cur.pop();
    }
  }
  dfs(0, k);
  return out;
}

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-576: Q3-detection threshold proxy in random graphs.
{
  function containsQ3CubeLike(G) {
    const { n, adj, neigh } = G;

    for (let r = 0; r < n; r += 1) {
      const nr = neigh[r];
      if (nr.length < 3) continue;

      for (let i = 0; i < nr.length; i += 1) {
        const u = nr[i];
        for (let j = i + 1; j < nr.length; j += 1) {
          const v = nr[j];
          for (let k = j + 1; k < nr.length; k += 1) {
            const w = nr[k];

            const xs = [];
            for (const x of neigh[u]) {
              if (x === r || x === u || x === v || x === w) continue;
              if (adj[v][x]) xs.push(x);
            }
            if (!xs.length) continue;

            const ys = [];
            for (const y of neigh[u]) {
              if (y === r || y === u || y === v || y === w) continue;
              if (adj[w][y]) ys.push(y);
            }
            if (!ys.length) continue;

            const zs = [];
            for (const z of neigh[v]) {
              if (z === r || z === u || z === v || z === w) continue;
              if (adj[w][z]) zs.push(z);
            }
            if (!zs.length) continue;

            for (const x of xs) {
              for (const y of ys) {
                if (y === x) continue;
                for (const z of zs) {
                  if (z === x || z === y) continue;
                  for (const t of neigh[x]) {
                    if (t === r || t === u || t === v || t === w || t === x || t === y || t === z) continue;
                    if (adj[y][t] && adj[z][t]) return true;
                  }
                }
              }
            }
          }
        }
      }
    }

    return false;
  }

  const rng = makeRng(20260303 ^ 1501);
  const rows = [];

  for (const [n, pList, trials] of [
    [24, [0.08, 0.1, 0.12, 0.14, 0.16], 20],
    [32, [0.06, 0.08, 0.1, 0.12, 0.14], 18],
    [40, [0.05, 0.07, 0.09, 0.11, 0.13], 15],
  ]) {
    let threshold = null;
    for (const p of pList) {
      let hit = 0;
      for (let t = 0; t < trials; t += 1) {
        const G = randomGraph(n, p, rng);
        if (containsQ3CubeLike(G)) hit += 1;
      }
      const prob = hit / trials;
      if (threshold === null && prob >= 0.5) threshold = p;
      rows.push({
        n,
        p,
        trials,
        contains_Q3_proxy_probability: Number(prob.toPrecision(6)),
      });
    }
    if (threshold !== null) {
      const e = threshold * choose2(n);
      rows.push({
        n,
        heuristic_threshold_p: threshold,
        heuristic_threshold_edges: Number(e.toPrecision(7)),
        threshold_edges_over_n_pow_1_5: Number((e / (n ** 1.5)).toPrecision(7)),
      });
    }
  }

  out.results.ep576 = {
    description: 'Random-graph threshold proxy for containing cube-like Q3 subgraphs.',
    rows,
  };
}

// EP-584: short-cycle pair connectivity sampling in dense graphs.
{
  function bfsDistAvoidEdge(G, src, banU, banV) {
    const { n, neigh } = G;
    const dist = Array(n).fill(-1);
    const q = [src];
    dist[src] = 0;
    let qi = 0;
    while (qi < q.length) {
      const u = q[qi++];
      const du = dist[u];
      for (const v of neigh[u]) {
        if ((u === banU && v === banV) || (u === banV && v === banU)) continue;
        if (dist[v] >= 0) continue;
        dist[v] = du + 1;
        q.push(v);
      }
    }
    return dist;
  }

  function approxPairOnCycleAtMostL(G, e1, e2, L) {
    const [a, b] = e1;
    const [c, d] = e2;
    if ((a === c && b === d) || (a === d && b === c)) return true;

    const da = bfsDistAvoidEdge(G, a, a, b);
    const db = bfsDistAvoidEdge(G, b, a, b);

    const cand1 = da[c] >= 0 && db[d] >= 0 ? da[c] + 1 + db[d] : 1e9;
    const cand2 = da[d] >= 0 && db[c] >= 0 ? da[d] + 1 + db[c] : 1e9;
    const bestPath = Math.min(cand1, cand2);

    return bestPath <= L - 1;
  }

  function adjacentPairInC4(G, e1, e2) {
    const [a, b] = e1;
    const [c, d] = e2;

    let u = -1;
    let v = -1;
    let w = -1;

    if (a === c) {
      u = a;
      v = b;
      w = d;
    } else if (a === d) {
      u = a;
      v = b;
      w = c;
    } else if (b === c) {
      u = b;
      v = a;
      w = d;
    } else if (b === d) {
      u = b;
      v = a;
      w = c;
    } else {
      return false;
    }

    for (const x of G.neigh[v]) {
      if (x === u || x === w) continue;
      if (G.adj[w][x]) return true;
    }
    return false;
  }

  const rng = makeRng(20260303 ^ 1502);
  const rows = [];

  for (const [delta, trials] of [[0.08, 4], [0.12, 4], [0.16, 4]]) {
    const n = 72;
    const p = Math.min(0.95, 2 * delta);

    let avgM = 0;
    let frac6 = 0;
    let frac8 = 0;
    let fracAdjC4 = 0;

    for (let t = 0; t < trials; t += 1) {
      const G = randomGraph(n, p, rng);
      avgM += G.m;

      const edges = [];
      for (let u = 0; u < n; u += 1) {
        for (const v of G.neigh[u]) {
          if (u < v) edges.push([u, v]);
        }
      }

      let hit6 = 0;
      let hit8 = 0;
      const pairSamples = Math.min(120, Math.floor(edges.length / 2));
      for (let s = 0; s < pairSamples; s += 1) {
        const e1 = edges[Math.floor(rng() * edges.length)];
        const e2 = edges[Math.floor(rng() * edges.length)];
        if (approxPairOnCycleAtMostL(G, e1, e2, 6)) hit6 += 1;
        if (approxPairOnCycleAtMostL(G, e1, e2, 8)) hit8 += 1;
      }

      let adjHit = 0;
      let adjCnt = 0;
      for (let s = 0; s < 160; s += 1) {
        const u = Math.floor(rng() * n);
        if (G.neigh[u].length < 2) continue;
        const a = G.neigh[u][Math.floor(rng() * G.neigh[u].length)];
        const b = G.neigh[u][Math.floor(rng() * G.neigh[u].length)];
        if (a === b) continue;
        adjCnt += 1;
        if (adjacentPairInC4(G, [u, a], [u, b])) adjHit += 1;
      }

      frac6 += pairSamples ? hit6 / pairSamples : 0;
      frac8 += pairSamples ? hit8 / pairSamples : 0;
      fracAdjC4 += adjCnt ? adjHit / adjCnt : 0;
    }

    avgM /= trials;
    frac6 /= trials;
    frac8 /= trials;
    fracAdjC4 /= trials;

    rows.push({
      n,
      delta,
      trials,
      avg_edges: Number(avgM.toPrecision(7)),
      delta_sq_n_sq: Number((delta * delta * n * n).toPrecision(7)),
      delta_cu_n_sq: Number((delta * delta * delta * n * n).toPrecision(7)),
      sampled_pair_fraction_cycle_len_le_6_approx: Number(frac6.toPrecision(6)),
      sampled_pair_fraction_cycle_len_le_8_approx: Number(frac8.toPrecision(6)),
      sampled_adjacent_pair_fraction_on_C4: Number(fracAdjC4.toPrecision(6)),
    });
  }

  out.results.ep584 = {
    description: 'Short-cycle connectivity proxy on dense random graphs at edge-density delta.',
    rows,
  };
}

// EP-585: finite exact search (small n) for avoiding two edge-disjoint cycles with same vertex set.
{
  function hasK5(G) {
    const { n, adj } = G;
    for (let a = 0; a < n; a += 1) {
      for (let b = a + 1; b < n; b += 1) {
        if (!adj[a][b]) continue;
        for (let c = b + 1; c < n; c += 1) {
          if (!adj[a][c] || !adj[b][c]) continue;
          for (let d = c + 1; d < n; d += 1) {
            if (!adj[a][d] || !adj[b][d] || !adj[c][d]) continue;
            for (let e = d + 1; e < n; e += 1) {
              if (adj[a][e] && adj[b][e] && adj[c][e] && adj[d][e]) return true;
            }
          }
        }
      }
    }
    return false;
  }

  function hasTwoEdgeDisjointCyclesSameVertexSet(G) {
    if (hasK5(G)) return true;

    const { n, adj, neigh } = G;
    const edgePos = Array.from({ length: n }, () => Array(n).fill(-1));
    let e = 0;
    for (let u = 0; u < n; u += 1) {
      for (let v = u + 1; v < n; v += 1) {
        edgePos[u][v] = e;
        edgePos[v][u] = e;
        e += 1;
      }
    }

    const cycByVertexMask = new Map();
    const seenCycleEdgeMasks = new Set();

    for (let s = 0; s < n; s += 1) {
      const visited = Array(n).fill(false);
      const path = [s];
      visited[s] = true;

      function dfs(u) {
        for (const v of neigh[u]) {
          if (v === s) {
            if (path.length >= 3) {
              const verts = path;
              let vMask = 0;
              for (const x of verts) vMask |= 1 << x;

              let em = 0n;
              for (let i = 0; i < verts.length; i += 1) {
                const a = verts[i];
                const b = verts[(i + 1) % verts.length];
                const pos = edgePos[a][b];
                em |= 1n << BigInt(pos);
              }

              const key = em.toString();
              if (!seenCycleEdgeMasks.has(key)) {
                seenCycleEdgeMasks.add(key);
                if (!cycByVertexMask.has(vMask)) cycByVertexMask.set(vMask, []);
                cycByVertexMask.get(vMask).push(em);
              }
            }
            continue;
          }

          if (v < s || visited[v]) continue;
          visited[v] = true;
          path.push(v);
          dfs(v);
          path.pop();
          visited[v] = false;
        }
      }

      dfs(s);
    }

    for (const cycles of cycByVertexMask.values()) {
      for (let i = 0; i < cycles.length; i += 1) {
        for (let j = i + 1; j < cycles.length; j += 1) {
          if ((cycles[i] & cycles[j]) === 0n) return true;
        }
      }
    }

    return false;
  }

  function greedyMaxEdgesNoViolation(n, restarts, rng) {
    const edges = allEdges(n);
    let best = 0;

    for (let r = 0; r < restarts; r += 1) {
      const G = makeGraph(n);
      shuffle(edges, rng);

      for (const [u, v] of edges) {
        addEdge(G, u, v);
        if (hasTwoEdgeDisjointCyclesSameVertexSet(G)) removeEdge(G, u, v);
      }

      if (G.m > best) best = G.m;
    }

    return best;
  }

  const rng = makeRng(20260303 ^ 1503);
  const rows = [];

  for (const [n, restarts] of [[8, 18], [9, 14], [10, 10]]) {
    const best = greedyMaxEdgesNoViolation(n, restarts, rng);
    rows.push({
      n,
      restarts,
      best_edges_found_no_two_edge_disjoint_same_vertex_set_cycles: best,
      best_over_n_loglogn: Number((best / Math.max(1, n * Math.log(Math.log(Math.max(4, n))))).toPrecision(7)),
      best_over_n_logn: Number((best / Math.max(1, n * Math.log(n))).toPrecision(7)),
    });
  }

  out.results.ep585 = {
    description: 'Small-n exact greedy maxima under the forbidden same-vertex-set disjoint-cycle condition.',
    rows,
  };
}

// Geometry helpers for EP-588/589/604.
function lineKeyFromPoints(p, q) {
  let A = q[1] - p[1];
  let B = p[0] - q[0];
  let C = A * p[0] + B * p[1];

  const g = gcd(gcd(Math.abs(A), Math.abs(B)), Math.abs(C));
  if (g > 0) {
    A /= g;
    B /= g;
    C /= g;
  }

  if (A < 0 || (A === 0 && B < 0) || (A === 0 && B === 0 && C < 0)) {
    A = -A;
    B = -B;
    C = -C;
  }

  return `${A},${B},${C}`;
}

function lineStats(points) {
  const n = points.length;
  const mp = new Map();

  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      const key = lineKeyFromPoints(points[i], points[j]);
      if (!mp.has(key)) mp.set(key, new Set());
      const S = mp.get(key);
      S.add(i);
      S.add(j);
    }
  }

  let maxCollinear = 1;
  const lineSizes = [];
  for (const S of mp.values()) {
    const sz = S.size;
    lineSizes.push(sz);
    if (sz > maxCollinear) maxCollinear = sz;
  }

  return { maxCollinear, lineSizes, lineMap: mp };
}

function randomDistinctPoints(n, grid, rng) {
  const used = new Set();
  const pts = [];
  while (pts.length < n) {
    const x = Math.floor(rng() * grid);
    const y = Math.floor(rng() * grid);
    const key = `${x},${y}`;
    if (used.has(key)) continue;
    used.add(key);
    pts.push([x, y]);
  }
  return pts;
}

// EP-588: heuristic max count of >=k-point lines with no (k+1)-collinear points.
{
  const rng = makeRng(20260303 ^ 1504);

  function optimizeForK(n, k, restarts, steps, grid) {
    let best = {
      linesAtLeastK: -1,
      linesExactlyK: -1,
      maxCollinear: Infinity,
    };

    for (let r = 0; r < restarts; r += 1) {
      let pts = randomDistinctPoints(n, grid, rng);
      let stats = lineStats(pts);

      function score(st) {
        const linesAtLeastK = st.lineSizes.filter((x) => x >= k).length;
        const linesExactlyK = st.lineSizes.filter((x) => x === k).length;
        return { linesAtLeastK, linesExactlyK, maxCollinear: st.maxCollinear };
      }

      let cur = score(stats);

      if (cur.maxCollinear <= k) {
        if (
          cur.linesAtLeastK > best.linesAtLeastK ||
          (cur.linesAtLeastK === best.linesAtLeastK && cur.linesExactlyK > best.linesExactlyK)
        ) {
          best = { ...cur };
        }
      }

      for (let it = 0; it < steps; it += 1) {
        const idx = Math.floor(rng() * n);
        const used = new Set(pts.map((p) => `${p[0]},${p[1]}`));
        used.delete(`${pts[idx][0]},${pts[idx][1]}`);

        let cand = null;
        for (let tr = 0; tr < 25; tr += 1) {
          const x = Math.floor(rng() * grid);
          const y = Math.floor(rng() * grid);
          const key = `${x},${y}`;
          if (!used.has(key)) {
            cand = [x, y];
            break;
          }
        }
        if (!cand) continue;

        const old = pts[idx];
        pts[idx] = cand;
        const st2 = lineStats(pts);
        const sc2 = score(st2);

        const improve =
          sc2.maxCollinear <= k &&
          (sc2.linesAtLeastK > cur.linesAtLeastK ||
            (sc2.linesAtLeastK === cur.linesAtLeastK && sc2.linesExactlyK >= cur.linesExactlyK));

        if (improve) {
          stats = st2;
          cur = sc2;
          if (
            cur.linesAtLeastK > best.linesAtLeastK ||
            (cur.linesAtLeastK === best.linesAtLeastK && cur.linesExactlyK > best.linesExactlyK)
          ) {
            best = { ...cur };
          }
        } else {
          pts[idx] = old;
        }
      }
    }

    return best;
  }

  const rows = [];
  for (const [k, nList] of [
    [4, [28, 36, 44]],
    [5, [30, 40]],
  ]) {
    for (const n of nList) {
      const best = optimizeForK(n, k, 10, 420, 29);
      rows.push({
        k,
        n,
        best_lines_with_at_least_k_points: best.linesAtLeastK,
        best_lines_with_exactly_k_points: best.linesExactlyK,
        max_collinear_constraint: k,
        lines_at_least_k_over_n_sq: Number((best.linesAtLeastK / (n * n)).toPrecision(7)),
      });
    }
  }

  out.results.ep588 = {
    description: 'Heuristic lower-bound search for many k-rich lines under no-(k+1)-collinear constraint.',
    rows,
  };
}

// EP-589: no-4-collinear sets and large no-3-collinear subset heuristic.
{
  const rng = makeRng(20260303 ^ 1505);

  function buildNo4Set(n, grid) {
    let pts = randomDistinctPoints(n, grid, rng);

    for (let it = 0; it < 1600; it += 1) {
      const st = lineStats(pts);
      if (st.maxCollinear <= 3) return pts;

      let badLine = null;
      let badPts = null;
      for (const [key, S] of st.lineMap.entries()) {
        if (S.size >= 4) {
          badLine = key;
          badPts = [...S];
          break;
        }
      }
      if (!badLine) return pts;

      const idx = badPts[Math.floor(rng() * badPts.length)];
      const used = new Set(pts.map((p) => `${p[0]},${p[1]}`));
      used.delete(`${pts[idx][0]},${pts[idx][1]}`);

      for (let tr = 0; tr < 40; tr += 1) {
        const x = Math.floor(rng() * grid);
        const y = Math.floor(rng() * grid);
        const key = `${x},${y}`;
        if (used.has(key)) continue;
        pts[idx] = [x, y];
        break;
      }
    }

    return pts;
  }

  function maxNo3SubsetHeuristic(points) {
    const n = points.length;
    const st = lineStats(points);

    const triples = [];
    for (const S of st.lineMap.values()) {
      const arr = [...S];
      if (arr.length === 3) triples.push(arr);
      if (arr.length > 3) {
        for (let i = 0; i < arr.length; i += 1) {
          for (let j = i + 1; j < arr.length; j += 1) {
            for (let k = j + 1; k < arr.length; k += 1) {
              triples.push([arr[i], arr[j], arr[k]]);
            }
          }
        }
      }
    }

    const alive = Array(n).fill(true);
    const deg = Array(n).fill(0);

    function recomputeDeg() {
      deg.fill(0);
      for (const [a, b, c] of triples) {
        if (alive[a] && alive[b] && alive[c]) {
          deg[a] += 1;
          deg[b] += 1;
          deg[c] += 1;
        }
      }
    }

    recomputeDeg();
    while (true) {
      let anyBad = false;
      for (const [a, b, c] of triples) {
        if (alive[a] && alive[b] && alive[c]) {
          anyBad = true;
          break;
        }
      }
      if (!anyBad) break;

      let vBest = -1;
      let dBest = -1;
      for (let v = 0; v < n; v += 1) {
        if (!alive[v]) continue;
        if (deg[v] > dBest) {
          dBest = deg[v];
          vBest = v;
        }
      }
      if (vBest < 0) break;
      alive[vBest] = false;
      recomputeDeg();
    }

    const removed = [];
    for (let v = 0; v < n; v += 1) if (!alive[v]) removed.push(v);

    function canAdd(v) {
      for (const [a, b, c] of triples) {
        if (a !== v && b !== v && c !== v) continue;
        const aa = a === v ? true : alive[a];
        const bb = b === v ? true : alive[b];
        const cc = c === v ? true : alive[c];
        if (aa && bb && cc) return false;
      }
      return true;
    }

    let improved = true;
    while (improved) {
      improved = false;
      for (const v of removed) {
        if (alive[v]) continue;
        if (canAdd(v)) {
          alive[v] = true;
          improved = true;
        }
      }
    }

    let sz = 0;
    for (let v = 0; v < n; v += 1) if (alive[v]) sz += 1;
    return { size: sz, num_triples: triples.length, max_collinear_original: st.maxCollinear };
  }

  const rows = [];
  for (const n of [28, 36, 44, 52]) {
    let best = { size: 0, num_triples: 0, max_collinear_original: 0 };
    for (let r = 0; r < 16; r += 1) {
      const pts = buildNo4Set(n, 41);
      const cur = maxNo3SubsetHeuristic(pts);
      if (cur.size > best.size) best = cur;
    }

    rows.push({
      n,
      best_no3_subset_size_from_no4_instance: best.size,
      ratio_over_sqrt_n: Number((best.size / Math.sqrt(n)).toPrecision(7)),
      ratio_over_n: Number((best.size / n).toPrecision(7)),
      triples_in_source_instance: best.num_triples,
      source_max_collinear: best.max_collinear_original,
    });
  }

  out.results.ep589 = {
    description: 'Heuristic lower bounds for g(n) via no-4-collinear instances and extracted no-3-collinear subsets.',
    rows,
  };
}

// EP-591 and EP-592: toy finite Ramsey analogue (R(3,3)=6) and status marker.
{
  function hasMonoTriangle(mask, N) {
    let e = 0;
    const idx = Array.from({ length: N }, () => Array(N).fill(-1));
    for (let i = 0; i < N; i += 1) {
      for (let j = i + 1; j < N; j += 1) {
        idx[i][j] = e;
        idx[j][i] = e;
        e += 1;
      }
    }

    for (let a = 0; a < N; a += 1) {
      for (let b = a + 1; b < N; b += 1) {
        for (let c = b + 1; c < N; c += 1) {
          const ab = ((mask >> BigInt(idx[a][b])) & 1n) === 1n;
          const ac = ((mask >> BigInt(idx[a][c])) & 1n) === 1n;
          const bc = ((mask >> BigInt(idx[b][c])) & 1n) === 1n;
          if ((ab && ac && bc) || (!ab && !ac && !bc)) return true;
        }
      }
    }
    return false;
  }

  function ramsey33Exact() {
    for (let N = 3; N <= 7; N += 1) {
      const E = choose2(N);
      const total = 1n << BigInt(E);
      let allForced = true;
      for (let m = 0n; m < total; m += 1n) {
        if (!hasMonoTriangle(m, N)) {
          allForced = false;
          break;
        }
      }
      if (allForced) return N;
    }
    return null;
  }

  const r33 = ramsey33Exact();

  out.results.ep591 = {
    description: 'Ordinal statement itself is theorem-level; finite toy analogue confirms R(3,3)=6.',
    toy_finite_ramsey_result: {
      R_3_3_exact: r33,
    },
  };

  out.results.ep592 = {
    description: 'General partition-ordinal classification has no faithful finite proxy; retained toy baseline from triangle-Ramsey core.',
    toy_reference: {
      R_3_3_exact: r33,
    },
  };
}

// EP-604: pinned-distance profile on grid and random sets.
{
  function pinnedStats(points) {
    const n = points.length;
    let maxPinned = 0;
    let sumPinned = 0;

    for (let i = 0; i < n; i += 1) {
      const D = new Set();
      const [x1, y1] = points[i];
      for (let j = 0; j < n; j += 1) {
        if (i === j) continue;
        const [x2, y2] = points[j];
        const dx = x1 - x2;
        const dy = y1 - y2;
        D.add(dx * dx + dy * dy);
      }
      const c = D.size;
      sumPinned += c;
      if (c > maxPinned) maxPinned = c;
    }

    return {
      maxPinned,
      avgPinned: sumPinned / n,
    };
  }

  const rng = makeRng(20260303 ^ 1506);
  const rows = [];

  for (const m of [10, 16, 22]) {
    const gridPts = [];
    for (let x = 0; x < m; x += 1) {
      for (let y = 0; y < m; y += 1) gridPts.push([x, y]);
    }
    const n = gridPts.length;
    const gs = pinnedStats(gridPts);

    const randPts = randomDistinctPoints(n, 1500, rng);
    const rs = pinnedStats(randPts);

    const scale = n / Math.sqrt(Math.log(Math.max(3, n)));

    rows.push({
      n,
      family: 'grid_m_by_m',
      m,
      max_pinned_distinct_distances: gs.maxPinned,
      avg_pinned_distinct_distances: Number(gs.avgPinned.toPrecision(7)),
      max_over_n_over_sqrt_log_n: Number((gs.maxPinned / scale).toPrecision(7)),
      max_over_n: Number((gs.maxPinned / n).toPrecision(7)),
    });

    rows.push({
      n,
      family: 'random_integer_points',
      grid_side: 1500,
      max_pinned_distinct_distances: rs.maxPinned,
      avg_pinned_distinct_distances: Number(rs.avgPinned.toPrecision(7)),
      max_over_n_over_sqrt_log_n: Number((rs.maxPinned / scale).toPrecision(7)),
      max_over_n: Number((rs.maxPinned / n).toPrecision(7)),
    });
  }

  out.results.ep604 = {
    description: 'Pinned-distance maxima and averages on structured (grid) vs random point sets.',
    rows,
  };
}

// EP-609: odd-girth lower-bound search in n-colorings of K_{2^n+1}.
{
  function buildEdges(N) {
    const e = [];
    for (let i = 0; i < N; i += 1) {
      for (let j = i + 1; j < N; j += 1) e.push([i, j]);
    }
    return e;
  }

  function firstDiffBit(a, b, bits) {
    for (let k = 0; k < bits; k += 1) {
      const ba = (a >> k) & 1;
      const bb = (b >> k) & 1;
      if (ba !== bb) return k;
    }
    return 0;
  }

  function initColoring(bits, rng) {
    const base = 1 << bits;
    const N = base + 1;
    const edges = buildEdges(N);
    const colors = new Int16Array(edges.length);

    for (let ei = 0; ei < edges.length; ei += 1) {
      const [u, v] = edges[ei];
      if (u < base && v < base) {
        colors[ei] = firstDiffBit(u, v, bits);
      } else {
        colors[ei] = Math.floor(rng() * bits);
      }
    }

    return { N, edges, colors };
  }

  function oddGirthOfColor(N, edges, colors, targetColor) {
    const neigh = Array.from({ length: N }, () => []);
    for (let i = 0; i < edges.length; i += 1) {
      if (colors[i] !== targetColor) continue;
      const [u, v] = edges[i];
      neigh[u].push(v);
      neigh[v].push(u);
    }

    let best = Infinity;

    for (let s = 0; s < N; s += 1) {
      const dist = Array(N).fill(-1);
      dist[s] = 0;
      const q = [s];
      let qi = 0;

      while (qi < q.length) {
        const u = q[qi++];
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
    let numBipartiteColors = 0;

    for (let c = 0; c < bits; c += 1) {
      const og = oddGirthOfColor(conf.N, conf.edges, conf.colors, c);
      if (!Number.isFinite(og)) {
        numBipartiteColors += 1;
      } else if (og < minOdd) {
        minOdd = og;
      }
    }

    return {
      minMonochromaticOddCycleLength: Number.isFinite(minOdd) ? minOdd : null,
      bipartiteColorClasses: numBipartiteColors,
    };
  }

  const rng = makeRng(20260303 ^ 1507);
  const rows = [];

  for (const [bits, restarts, iters] of [[3, 8, 800], [4, 6, 700]]) {
    let best = { minMonochromaticOddCycleLength: -1, bipartiteColorClasses: -1 };

    for (let r = 0; r < restarts; r += 1) {
      const conf = initColoring(bits, rng);
      let cur = evaluate(bits, conf);

      function better(a, b) {
        const aa = a.minMonochromaticOddCycleLength ?? 10_000;
        const bb = b.minMonochromaticOddCycleLength ?? 10_000;
        if (aa !== bb) return aa > bb;
        return a.bipartiteColorClasses > b.bipartiteColorClasses;
      }

      if (better(cur, best)) best = { ...cur };

      for (let it = 0; it < iters; it += 1) {
        const ei = Math.floor(rng() * conf.edges.length);
        const old = conf.colors[ei];
        let neu = old;
        while (neu === old) neu = Math.floor(rng() * bits);
        conf.colors[ei] = neu;

        const nxt = evaluate(bits, conf);
        if (better(nxt, cur)) {
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
      best_min_monochromatic_odd_cycle_length_found: best.minMonochromaticOddCycleLength,
      best_bipartite_color_classes: best.bipartiteColorClasses,
    });
  }

  out.results.ep609 = {
    description: 'Heuristic search for large monochromatic odd girth in n-colorings of K_{2^n+1}.',
    rows,
  };
}

// EP-612: diameter/n-over-d ratios for explicit K4-free (triangle-free) blow-up families.
{
  function blowupCycleGraph(L, s) {
    const n = L * s;
    const G = makeGraph(n);

    function id(block, idx) {
      return block * s + idx;
    }

    for (let b = 0; b < L; b += 1) {
      const nb = (b + 1) % L;
      for (let i = 0; i < s; i += 1) {
        for (let j = 0; j < s; j += 1) {
          addEdge(G, id(b, i), id(nb, j));
        }
      }
    }

    return G;
  }

  function diameter(G) {
    const { n, neigh } = G;
    let D = 0;
    for (let s = 0; s < n; s += 1) {
      const dist = Array(n).fill(-1);
      dist[s] = 0;
      const q = [s];
      let qi = 0;
      while (qi < q.length) {
        const u = q[qi++];
        for (const v of neigh[u]) {
          if (dist[v] >= 0) continue;
          dist[v] = dist[u] + 1;
          q.push(v);
        }
      }
      for (const x of dist) if (x > D) D = x;
    }
    return D;
  }

  function minDegree(G) {
    let d = Infinity;
    for (const arr of G.neigh) if (arr.length < d) d = arr.length;
    return d;
  }

  const rows = [];
  const originalK4FreeCoeff = 16 / 7; // first formula in statement at r=2
  const amendedK4FreeCoeff = 3 - 2 / 3; // (3 - 2/k) with k=3 (K4-free)

  for (const [L, s] of [
    [9, 8],
    [13, 8],
    [17, 8],
    [13, 12],
    [17, 12],
  ]) {
    const G = blowupCycleGraph(L, s);
    const n = G.n;
    const d = minDegree(G);
    const D = diameter(G);
    const coeff = (D * d) / n;

    rows.push({
      family: 'blowup_of_odd_cycle_triangle_free',
      L,
      s,
      n,
      min_degree: d,
      diameter: D,
      coeff_D_over_n_over_d: Number(coeff.toPrecision(7)),
      ratio_to_original_k4_free_coeff_16_over_7: Number((coeff / originalK4FreeCoeff).toPrecision(7)),
      ratio_to_amended_k4_free_coeff_7_over_3: Number((coeff / amendedK4FreeCoeff).toPrecision(7)),
    });
  }

  out.results.ep612 = {
    description: 'Explicit K4-free family diameter profile versus n/d scaling constants.',
    rows,
  };
}

const outPath = path.join('data', 'harder_batch15_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
