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
  for (const n of [60, 90, 120]) {
    for (const c of [2, 3, 4]) {
      const m = c * n;
      let best = Infinity;
      let avg = 0;
      const trials = 18;
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

  for (const n of [60, 90, 120]) {
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

// EP-188: finite triangular-lattice proxy.
{
  function triPatch(m) {
    const pts = [];
    const id = new Map();
    for (let x = 0; x < m; x += 1) {
      for (let y = 0; y < m; y += 1) {
        const k = `${x},${y}`;
        id.set(k, pts.length);
        pts.push([x, y]);
      }
    }
    const dirs = [
      [1, 0],
      [0, 1],
      [1, -1],
      [-1, 0],
      [0, -1],
      [-1, 1],
    ];
    const neigh = Array.from({ length: pts.length }, () => []);
    for (let i = 0; i < pts.length; i += 1) {
      const [x, y] = pts[i];
      for (const [dx, dy] of dirs) {
        const j = id.get(`${x + dx},${y + dy}`);
        if (j !== undefined) neigh[i].push(j);
      }
    }
    return { pts, neigh, m };
  }

  function maxBlueRun(colors, patch) {
    const { pts, m } = patch;
    const id = new Map(pts.map((p, i) => [`${p[0]},${p[1]}`, i]));
    const dirs = [
      [1, 0],
      [0, 1],
      [1, -1],
    ];
    let best = 0;

    for (let i = 0; i < pts.length; i += 1) {
      const [x, y] = pts[i];
      for (const [dx, dy] of dirs) {
        const prev = id.get(`${x - dx},${y - dy}`);
        if (prev !== undefined) continue;
        let cx = x;
        let cy = y;
        let cur = 0;
        while (cx >= 0 && cx < m && cy >= 0 && cy < m) {
          const j = id.get(`${cx},${cy}`);
          if (j === undefined) break;
          if (colors[j] === 0) {
            cur += 1;
            if (cur > best) best = cur;
          } else {
            cur = 0;
          }
          cx += dx;
          cy += dy;
        }
      }
    }

    return best;
  }

  function redConflicts(colors, patch) {
    let c = 0;
    const { neigh } = patch;
    for (let i = 0; i < neigh.length; i += 1) {
      if (colors[i] !== 1) continue;
      for (const j of neigh[i]) if (j > i && colors[j] === 1) c += 1;
    }
    return c;
  }

  function optimize(m, restarts = 40, steps = 12000) {
    const patch = triPatch(m);
    let bestRun = Infinity;
    for (let rep = 0; rep < restarts; rep += 1) {
      const colors = new Uint8Array(patch.pts.length);
      for (let i = 0; i < colors.length; i += 1) colors[i] = rng() < 0.35 ? 1 : 0;

      let conf = redConflicts(colors, patch);
      let run = maxBlueRun(colors, patch);
      let score = conf * 1000 + run;

      for (let step = 0; step < steps; step += 1) {
        const v = Math.floor(rng() * colors.length);
        colors[v] ^= 1;
        const nConf = redConflicts(colors, patch);
        const nRun = maxBlueRun(colors, patch);
        const nScore = nConf * 1000 + nRun;
        if (nScore <= score || rng() < 0.002) {
          conf = nConf;
          run = nRun;
          score = nScore;
        } else {
          colors[v] ^= 1;
        }
      }

      if (conf === 0 && run < bestRun) bestRun = run;
    }
    return bestRun;
  }

  const rows = [];
  for (const m of [8, 10, 12, 14]) {
    const run = optimize(m, 36, 10000);
    rows.push({
      lattice_side_m: m,
      vertices: m * m,
      best_max_blue_unit_step_AP_run_found: run,
      proxy_k_upper_bound_from_found_coloring: run < Infinity ? run + 1 : null,
    });
  }

  out.results.ep188 = {
    description: 'Finite triangular-lattice proxy balancing red unit-distance avoidance vs blue unit-step AP runs.',
    rows,
  };
}

// EP-195: permutation proxy for monotone arithmetic progressions.
{
  function countMonoAP(perm, k) {
    const N = perm.length;
    const pos = new Int32Array(N + 1);
    for (let i = 0; i < N; i += 1) pos[perm[i]] = i;

    let inc = 0;
    let dec = 0;
    for (let a = 1; a <= N; a += 1) {
      for (let d = 1; a + (k - 1) * d <= N; d += 1) {
        let up = true;
        let down = true;
        for (let t = 1; t < k; t += 1) {
          const p0 = pos[a + (t - 1) * d];
          const p1 = pos[a + t * d];
          if (!(p0 < p1)) up = false;
          if (!(p0 > p1)) down = false;
          if (!up && !down) break;
        }
        if (up) inc += 1;
        if (down) dec += 1;
      }
    }
    return { total: inc + dec, inc, dec };
  }

  const rows = [];
  for (const N of [30, 40, 50, 60]) {
    let best4 = Infinity;
    let best3 = Infinity;
    const trials = 1500;
    const base = Array.from({ length: N }, (_, i) => i + 1);

    for (let t = 0; t < trials; t += 1) {
      const p = [...base];
      shuffle(p, rng);
      const c4 = countMonoAP(p, 4).total;
      if (c4 < best4) best4 = c4;
      if (c4 === 0) {
        const c3 = countMonoAP(p, 3).total;
        if (c3 < best3) best3 = c3;
      }
    }

    rows.push({
      N,
      random_trials: trials,
      min_monotone_4AP_count_found: best4,
      exists_trial_without_monotone_4AP: best4 === 0,
      min_monotone_3AP_count_among_4AP_free_trials: Number.isFinite(best3) ? best3 : null,
    });
  }

  out.results.ep195 = {
    description: 'Random-permutation finite profile for monotone value-AP occurrences.',
    rows,
  };
}

// EP-202: disjoint congruence classes packing heuristic.
{
  function bestPacking(N, restarts) {
    let best = 0;

    const moduli = Array.from({ length: N - 1 }, (_, i) => i + 2);
    for (let rep = 0; rep < restarts; rep += 1) {
      const ord = [...moduli];
      shuffle(ord, rng);
      const selected = []; // [n,a]
      for (const n of ord) {
        const feasible = [];
        for (let a = 0; a < n; a += 1) {
          let ok = true;
          for (const [m, b] of selected) {
            const g = gcd(n, m);
            if (a % g === b % g) {
              ok = false;
              break;
            }
          }
          if (ok) feasible.push(a);
        }
        if (feasible.length === 0) continue;
        const a = feasible[Math.floor(rng() * feasible.length)];
        selected.push([n, a]);
      }
      if (selected.length > best) best = selected.length;
    }

    return best;
  }

  function gcd(a, b) {
    let x = a;
    let y = b;
    while (y !== 0) {
      const t = x % y;
      x = y;
      y = t;
    }
    return x;
  }

  const rows = [];
  for (const [N, restarts] of [
    [40, 500],
    [80, 400],
    [120, 320],
    [160, 260],
  ]) {
    const r = bestPacking(N, restarts);
    const L = Math.exp(Math.sqrt(Math.log(N) * Math.log(Math.log(N))));
    rows.push({
      N,
      restarts,
      best_r_found: r,
      ratio_r_over_N: Number((r / N).toFixed(6)),
      ratio_r_times_L_over_N: Number((r * L / N).toFixed(6)),
    });
  }

  out.results.ep202 = {
    description: 'Randomized packing profile for disjoint residue classes with distinct moduli <= N.',
    rows,
  };
}

// EP-208: squarefree gaps profile.
{
  function squarefreeMask(X) {
    const sf = new Uint8Array(X + 1);
    sf.fill(1, 1);
    const r = Math.floor(Math.sqrt(X));
    for (let p = 2; p <= r; p += 1) {
      const sq = p * p;
      for (let v = sq; v <= X; v += sq) sf[v] = 0;
    }
    sf[0] = 0;
    return sf;
  }

  const rows = [];
  for (const X of [200000, 500000, 1000000, 2000000, 5000000]) {
    const sf = squarefreeMask(X);
    let prev = -1;
    let maxGap = 0;
    let gapStart = null;
    for (let n = 1; n <= X; n += 1) {
      if (!sf[n]) continue;
      if (prev >= 0) {
        const g = n - prev;
        if (g > maxGap) {
          maxGap = g;
          gapStart = prev;
        }
      }
      prev = n;
    }
    const scale = (Math.PI * Math.PI / 6) * (Math.log(gapStart) / Math.log(Math.log(gapStart)));
    rows.push({
      X,
      max_gap_observed: maxGap,
      gap_start_at: gapStart,
      ratio_over_pi2_over6_log_over_loglog: Number((maxGap / scale).toFixed(6)),
      ratio_over_gap_start_pow_0_2: Number((maxGap / (gapStart ** 0.2)).toFixed(6)),
    });
  }

  out.results.ep208 = {
    description: 'Finite maximum-gap profile for squarefree numbers.',
    rows,
  };
}

// EP-212 + EP-213: integer-grid rational-distance proxies.
{
  function pointsGrid(M) {
    const pts = [];
    for (let x = -M; x <= M; x += 1) for (let y = -M; y <= M; y += 1) pts.push([x, y]);
    return pts;
  }

  function buildIntDistanceAdj(pts) {
    const n = pts.length;
    const adj = Array.from({ length: n }, () => new Uint8Array(n));
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const dx = pts[i][0] - pts[j][0];
        const dy = pts[i][1] - pts[j][1];
        const d2 = dx * dx + dy * dy;
        if (isPerfectSquare(d2)) {
          adj[i][j] = 1;
          adj[j][i] = 1;
        }
      }
    }
    return adj;
  }

  function collinear(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) === (b[1] - a[1]) * (c[0] - a[0]);
  }

  function det3(m) {
    return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
      - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
      + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  }

  function cocircular4(a, b, c, d) {
    const rows = [a, b, c, d].map(([x, y]) => [x * x + y * y, x, y, 1]);
    const m0 = [
      [rows[1][1], rows[1][2], rows[1][3]],
      [rows[2][1], rows[2][2], rows[2][3]],
      [rows[3][1], rows[3][2], rows[3][3]],
    ];
    const m1 = [
      [rows[1][0], rows[1][2], rows[1][3]],
      [rows[2][0], rows[2][2], rows[2][3]],
      [rows[3][0], rows[3][2], rows[3][3]],
    ];
    const m2 = [
      [rows[1][0], rows[1][1], rows[1][3]],
      [rows[2][0], rows[2][1], rows[2][3]],
      [rows[3][0], rows[3][1], rows[3][3]],
    ];
    const m3 = [
      [rows[1][0], rows[1][1], rows[1][2]],
      [rows[2][0], rows[2][1], rows[2][2]],
      [rows[3][0], rows[3][1], rows[3][2]],
    ];
    const det = rows[0][0] * det3(m0) - rows[0][1] * det3(m1) + rows[0][2] * det3(m2) - rows[0][3] * det3(m3);
    return det === 0;
  }

  function maxCliqueGreedy(adj, restarts) {
    const n = adj.length;
    let best = 0;
    for (let rep = 0; rep < restarts; rep += 1) {
      const ord = Array.from({ length: n }, (_, i) => i);
      shuffle(ord, rng);
      const chosen = [];
      for (const v of ord) {
        let ok = true;
        for (const u of chosen) {
          if (!adj[v][u]) {
            ok = false;
            break;
          }
        }
        if (ok) chosen.push(v);
      }
      if (chosen.length > best) best = chosen.length;
    }
    return best;
  }

  function maxGeneralPositionIntDistSet(pts, adj, restarts) {
    const n = pts.length;
    let best = 0;
    for (let rep = 0; rep < restarts; rep += 1) {
      const ord = Array.from({ length: n }, (_, i) => i);
      shuffle(ord, rng);
      const chosen = [];
      for (const v of ord) {
        let ok = true;

        for (const u of chosen) {
          if (!adj[v][u]) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;

        for (let i = 0; i < chosen.length && ok; i += 1) {
          for (let j = i + 1; j < chosen.length; j += 1) {
            if (collinear(pts[chosen[i]], pts[chosen[j]], pts[v])) {
              ok = false;
              break;
            }
          }
        }
        if (!ok) continue;

        for (let i = 0; i < chosen.length && ok; i += 1) {
          for (let j = i + 1; j < chosen.length && ok; j += 1) {
            for (let k = j + 1; k < chosen.length; k += 1) {
              if (cocircular4(pts[chosen[i]], pts[chosen[j]], pts[chosen[k]], pts[v])) {
                ok = false;
                break;
              }
            }
          }
        }
        if (ok) chosen.push(v);
      }
      if (chosen.length > best) best = chosen.length;
    }
    return best;
  }

  const rows212 = [];
  const rows213 = [];
  for (const M of [4, 5, 6, 7]) {
    const pts = pointsGrid(M);
    const adj = buildIntDistanceAdj(pts);

    const c = maxCliqueGreedy(adj, 450);
    rows212.push({
      M,
      grid_points: pts.length,
      best_all_integer_distance_subset_size_found: c,
      ratio_over_grid_size: Number((c / pts.length).toFixed(6)),
    });

    const g = maxGeneralPositionIntDistSet(pts, adj, 420);
    rows213.push({
      M,
      grid_points: pts.length,
      best_general_position_integer_distance_subset_size_found: g,
    });
  }

  out.results.ep212 = {
    description: 'Integer-grid proxy for large finite all-rational-distance subsets (integer-distance specialization).',
    rows: rows212,
  };

  out.results.ep213 = {
    description: 'Integer-grid proxy for general-position all-integer-distance finite sets.',
    rows: rows213,
  };
}

// EP-222: gaps between sums of two squares.
{
  function sumsOfTwoSquaresMask(X) {
    const mark = new Uint8Array(X + 1);
    const r = Math.floor(Math.sqrt(X));
    for (let a = 0; a <= r; a += 1) {
      const aa = a * a;
      for (let b = a; aa + b * b <= X; b += 1) {
        mark[aa + b * b] = 1;
      }
    }
    return mark;
  }

  const rows = [];
  for (const X of [200000, 500000, 1000000, 2000000, 5000000]) {
    const mark = sumsOfTwoSquaresMask(X);
    let prev = -1;
    let maxGap = 0;
    let start = 0;
    for (let n = 0; n <= X; n += 1) {
      if (!mark[n]) continue;
      if (prev >= 0) {
        const g = n - prev;
        if (g > maxGap) {
          maxGap = g;
          start = prev;
        }
      }
      prev = n;
    }
    rows.push({
      X,
      max_gap_observed: maxGap,
      gap_starts_at: start,
      max_gap_over_log_start: Number((maxGap / Math.log(Math.max(3, start))).toFixed(6)),
      max_gap_over_log_div_sqrtloglog: Number((maxGap / (Math.log(Math.max(3, start)) / Math.sqrt(Math.log(Math.log(Math.max(5, start)))))).toFixed(6)),
    });
  }

  out.results.ep222 = {
    description: 'Finite max-gap profile for integers representable as a sum of two squares.',
    rows,
  };
}

// EP-233: second moment of prime gaps.
{
  const Nmax = 500000;
  const lim = 8000000;
  const { primes } = sieve(lim);

  const rows = [];
  let S = 0;
  let ptr = 1;
  const checkpoints = new Set([10000, 50000, 100000, 200000, 500000]);

  while (ptr <= Nmax && ptr < primes.length) {
    const d = primes[ptr] - primes[ptr - 1];
    S += d * d;
    if (checkpoints.has(ptr)) {
      const N = ptr;
      const pN = primes[ptr - 1];
      rows.push({
        N,
        p_N: pN,
        sum_d_n_sq: S,
        ratio_over_N_logN_sq: Number((S / (N * Math.log(N) ** 2)).toFixed(6)),
        ratio_over_N_logpN_sq: Number((S / (N * Math.log(pN) ** 2)).toFixed(6)),
      });
    }
    ptr += 1;
  }

  out.results.ep233 = {
    description: 'Finite profile for sum_{n<=N} (p_{n+1}-p_n)^2.',
    sieve_limit: lim,
    rows,
  };
}

// EP-236: representation counts n = p + 2^k.
{
  const Xmax = 2000000;
  const { isPrime } = sieve(Xmax);
  const powers = [];
  for (let v = 1; v <= Xmax; v *= 2) powers.push(v);

  const cnt = new Uint16Array(Xmax + 1);
  for (const p2 of powers) {
    for (let p = 2; p + p2 <= Xmax; p += 1) {
      if (!isPrime[p]) continue;
      cnt[p + p2] += 1;
    }
  }

  function summarize(X) {
    let maxF = 0;
    let arg = 0;
    let sum = 0;
    for (let n = 1; n <= X; n += 1) {
      const v = cnt[n];
      sum += v;
      if (v > maxF) {
        maxF = v;
        arg = n;
      }
    }

    const hist = new Int32Array(maxF + 1);
    for (let n = 1; n <= X; n += 1) hist[cnt[n]] += 1;
    let c = 0;
    let p99 = 0;
    const target = Math.ceil(0.99 * X);
    for (let i = 0; i <= maxF; i += 1) {
      c += hist[i];
      if (c >= target) {
        p99 = i;
        break;
      }
    }

    return {
      X,
      max_f_n: maxF,
      argmax_n: arg,
      max_f_over_log_n: Number((maxF / Math.log(Math.max(3, arg))).toFixed(6)),
      mean_f: Number((sum / X).toFixed(6)),
      percentile99_f: p99,
    };
  }

  const rows = [200000, 500000, 1000000, 2000000].map(summarize);

  out.results.ep236 = {
    description: 'Finite distribution profile of f(n)=#{(p,2^k): n=p+2^k}.',
    rows,
  };
}

const outPath = path.join('data', 'harder_batch7_quick_compute.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ outPath }, null, 2));
