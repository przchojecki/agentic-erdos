#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 6:
// EP-160, EP-161, EP-165, EP-169, EP-170, EP-172, EP-174, EP-177, EP-181, EP-183.

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

function choose2(x) {
  return (x * (x - 1)) / 2;
}

const rng = makeRng(20260303 ^ 601);
const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-160: color [1..N] with k colors so every 4-AP has >=3 distinct colors.
{
  function build4APs(N) {
    const aps = [];
    for (let a = 1; a <= N; a += 1) {
      for (let d = 1; a + 3 * d <= N; d += 1) {
        aps.push([a - 1, a + d - 1, a + 2 * d - 1, a + 3 * d - 1]);
      }
    }
    return aps;
  }

  function apBad(colors, ap) {
    const c0 = colors[ap[0]];
    const c1 = colors[ap[1]];
    const c2 = colors[ap[2]];
    const c3 = colors[ap[3]];
    let distinct = 1;
    if (c1 !== c0) distinct += 1;
    if (c2 !== c0 && c2 !== c1) distinct += 1;
    if (c3 !== c0 && c3 !== c1 && c3 !== c2) distinct += 1;
    return distinct < 3;
  }

  function findColoring(N, k, restarts, steps) {
    const aps = build4APs(N);
    const apByPos = Array.from({ length: N }, () => []);
    for (let i = 0; i < aps.length; i += 1) for (const p of aps[i]) apByPos[p].push(i);

    for (let t = 0; t < restarts; t += 1) {
      const colors = new Uint8Array(N);
      for (let i = 0; i < N; i += 1) colors[i] = Math.floor(rng() * k);

      const bad = new Uint8Array(aps.length);
      let badCount = 0;
      for (let i = 0; i < aps.length; i += 1) {
        if (apBad(colors, aps[i])) {
          bad[i] = 1;
          badCount += 1;
        }
      }

      for (let step = 0; step < steps; step += 1) {
        if (badCount === 0) return true;

        const pos = Math.floor(rng() * N);
        const oldColor = colors[pos];
        let newColor = oldColor;
        while (newColor === oldColor) newColor = Math.floor(rng() * k);

        let delta = 0;
        for (const apId of apByPos[pos]) {
          const before = bad[apId];
          const ap = aps[apId];
          colors[pos] = newColor;
          const after = apBad(colors, ap) ? 1 : 0;
          colors[pos] = oldColor;
          delta += after - before;
        }

        if (delta <= 0 || rng() < 0.01) {
          colors[pos] = newColor;
          for (const apId of apByPos[pos]) {
            const ap = aps[apId];
            const before = bad[apId];
            const after = apBad(colors, ap) ? 1 : 0;
            if (before !== after) {
              bad[apId] = after;
              badCount += after - before;
            }
          }
        }
      }
    }
    return false;
  }

  const rows = [];
  for (const N of [20, 30, 40, 60, 80]) {
    let found = null;
    const triesByN = N <= 40 ? [2, 3, 4, 5, 6] : [2, 3, 4, 5, 6, 7, 8];
    for (const k of triesByN) {
      const ok = findColoring(N, k, 24, 35000);
      rows.push({ N, k_tested: k, valid_coloring_found: ok });
      if (ok && found === null) {
        found = k;
        break;
      }
    }
    rows.push({ N, empirical_upper_bound_h_of_N: found });
  }

  out.results.ep160 = {
    description: 'Finite local-search profile for h(N): minimum colors forcing >=3 colors on each 4-AP.',
    rows,
  };
}

// EP-161: finite sampled profile for F^{(3)}(n,alpha) behavior.
{
  const n = 20;
  const idx = (a, b, c) => a * n * n + b * n + c;

  function randomColoringTriples() {
    const arr = new Uint8Array(n * n * n);
    for (let a = 0; a < n; a += 1) {
      for (let b = a + 1; b < n; b += 1) {
        for (let c = b + 1; c < n; c += 1) {
          arr[idx(a, b, c)] = rng() < 0.5 ? 0 : 1;
        }
      }
    }
    return arr;
  }

  function sampleSubset(size) {
    const v = Array.from({ length: n }, (_, i) => i);
    shuffle(v, rng);
    return v.slice(0, size).sort((x, y) => x - y);
  }

  function redDensityOnSubset(col, sub) {
    let red = 0;
    let tot = 0;
    for (let i = 0; i < sub.length; i += 1) {
      for (let j = i + 1; j < sub.length; j += 1) {
        for (let k = j + 1; k < sub.length; k += 1) {
          if (col[idx(sub[i], sub[j], sub[k])] === 1) red += 1;
          tot += 1;
        }
      }
    }
    return red / tot;
  }

  const alphas = [0, 0.02, 0.05, 0.1, 0.15, 0.2];
  const rows = [];
  for (const alpha of alphas) {
    let bestM = 0;
    const colorings = 36;
    for (let t = 0; t < colorings; t += 1) {
      const col = randomColoringTriples();

      const good = Array(n + 1).fill(true);
      for (let s = 4; s <= n; s += 1) {
        let okS = true;
        const samples = 26;
        for (let r = 0; r < samples; r += 1) {
          const sub = sampleSubset(s);
          const p = redDensityOnSubset(col, sub);
          const minFrac = Math.min(p, 1 - p);
          if (minFrac + 1e-12 < alpha) {
            okS = false;
            break;
          }
        }
        good[s] = okS;
      }

      let m = n + 1;
      for (let s = n; s >= 4; s -= 1) {
        if (!good[s]) break;
        m = s;
      }
      if (m <= n && m > bestM) bestM = m;
    }

    rows.push({
      n,
      alpha,
      random_colorings_tested: 36,
      sampled_empirical_F_3_n_alpha: bestM,
    });
  }

  out.results.ep161 = {
    description: 'Sampled finite hypergraph-coloring profile for F^{(3)}(n,alpha).',
    rows,
  };
}

// EP-165: finite triangle-free process proxy for off-diagonal Ramsey scale.
{
  function triangleFreeProcess(n) {
    const edges = [];
    for (let u = 0; u < n; u += 1) for (let v = u + 1; v < n; v += 1) edges.push([u, v]);
    shuffle(edges, rng);

    const adj = Array.from({ length: n }, () => new Uint8Array(n));
    let m = 0;
    for (const [u, v] of edges) {
      let createsTri = false;
      for (let w = 0; w < n; w += 1) {
        if (adj[u][w] && adj[v][w]) {
          createsTri = true;
          break;
        }
      }
      if (createsTri) continue;
      adj[u][v] = 1;
      adj[v][u] = 1;
      m += 1;
    }
    return { adj, edges: m };
  }

  function greedyIndependentSize(adj, trials = 24) {
    const n = adj.length;
    let best = 0;
    for (let t = 0; t < trials; t += 1) {
      const ord = Array.from({ length: n }, (_, i) => i);
      shuffle(ord, rng);
      const dead = new Uint8Array(n);
      let sz = 0;
      for (const v of ord) {
        if (dead[v]) continue;
        sz += 1;
        dead[v] = 1;
        for (let u = 0; u < n; u += 1) if (adj[v][u]) dead[u] = 1;
      }
      if (sz > best) best = sz;
    }
    return best;
  }

  const rows = [];
  for (const k of [20, 30, 40, 50]) {
    const cand = [0.45, 0.55, 0.65, 0.75].map((c) => Math.max(12, Math.floor((c * k * k) / Math.log(k))));
    let bestN = null;
    for (const n of cand) {
      let found = false;
      let bestAlpha = Infinity;
      for (let t = 0; t < 6; t += 1) {
        const g = triangleFreeProcess(n);
        const alphaEst = greedyIndependentSize(g.adj, 20);
        if (alphaEst < bestAlpha) bestAlpha = alphaEst;
        if (alphaEst < k) found = true;
      }
      rows.push({
        k,
        n_tested: n,
        six_runs_min_greedy_independent_size: bestAlpha,
        witness_alpha_less_than_k_found: found,
      });
      if (found) bestN = n;
    }
    rows.push({
      k,
      empirical_lower_bound_n_with_alpha_less_k: bestN,
      k2_over_logn: Number((k * k / Math.log(k)).toFixed(3)),
      empirical_ratio_n_over_k2_over_logn: bestN ? Number((bestN / (k * k / Math.log(k))).toFixed(6)) : null,
    });
  }

  out.results.ep165 = {
    description: 'Triangle-free process finite proxy for R(3,k) lower-scale constants.',
    rows,
  };
}

// EP-169: harmonic sums for k-AP-free greedy sets.
{
  function greedyNo3AP(N) {
    const inSet = new Uint8Array(N + 1);
    const elems = [];
    let h = 0;
    for (let x = 1; x <= N; x += 1) {
      let bad = false;
      for (const y of elems) {
        const z = 2 * y - x;
        if (z >= 1 && inSet[z]) {
          bad = true;
          break;
        }
      }
      if (!bad) {
        inSet[x] = 1;
        elems.push(x);
        h += 1 / x;
      }
    }
    return { size: elems.length, harmonic: h };
  }

  function greedyNo4AP(N) {
    const inSet = new Uint8Array(N + 1);
    let size = 0;
    let h = 0;
    for (let x = 1; x <= N; x += 1) {
      let bad = false;
      for (let d = 1; x - 3 * d >= 1; d += 1) {
        if (inSet[x - d] && inSet[x - 2 * d] && inSet[x - 3 * d]) {
          bad = true;
          break;
        }
      }
      if (!bad) {
        inSet[x] = 1;
        size += 1;
        h += 1 / x;
      }
    }
    return { size, harmonic: h };
  }

  const rows = [];
  for (const N of [20000, 50000, 100000]) {
    const v = greedyNo3AP(N);
    rows.push({
      k: 3,
      N,
      greedy_size: v.size,
      harmonic_sum: Number(v.harmonic.toFixed(6)),
      harmonic_over_logN: Number((v.harmonic / Math.log(N)).toFixed(6)),
    });
  }
  for (const N of [4000, 8000, 12000]) {
    const v = greedyNo4AP(N);
    rows.push({
      k: 4,
      N,
      greedy_size: v.size,
      harmonic_sum: Number(v.harmonic.toFixed(6)),
      harmonic_over_logN: Number((v.harmonic / Math.log(N)).toFixed(6)),
    });
  }

  out.results.ep169 = {
    description: 'Greedy finite harmonic-sum profiles for k-AP-free sets.',
    rows,
  };
}

// EP-170: sparse ruler greedy construction profile.
{
  function greedySparseRuler(N, restarts) {
    const allTargetCount = N + 1;
    let best = Infinity;

    for (let t = 0; t < restarts; t += 1) {
      const inA = new Uint8Array(N + 1);
      const A = [0, N];
      inA[0] = 1;
      inA[N] = 1;

      const covered = new Uint8Array(N + 1);
      covered[0] = 1;
      covered[N] = 1;
      let coveredCount = 2;

      while (coveredCount < allTargetCount) {
        let bestX = -1;
        let bestGain = -1;
        const candidates = [];

        for (let x = 0; x <= N; x += 1) {
          if (inA[x]) continue;
          let gain = 0;
          for (const a of A) {
            const d = Math.abs(x - a);
            if (!covered[d]) gain += 1;
          }
          if (gain > bestGain) {
            bestGain = gain;
            candidates.length = 0;
            candidates.push(x);
          } else if (gain === bestGain) {
            candidates.push(x);
          }
        }

        if (candidates.length === 0) break;
        bestX = candidates[Math.floor(rng() * candidates.length)];
        inA[bestX] = 1;
        A.push(bestX);

        for (const a of A) {
          const d = Math.abs(bestX - a);
          if (!covered[d]) {
            covered[d] = 1;
            coveredCount += 1;
          }
        }
      }

      if (A.length < best) best = A.length;
    }

    return best;
  }

  const rows = [];
  for (const [N, restarts] of [
    [200, 80],
    [400, 70],
    [800, 60],
    [1200, 50],
  ]) {
    const sz = greedySparseRuler(N, restarts);
    rows.push({
      N,
      restarts,
      best_size_found: sz,
      ratio_over_sqrtN: Number((sz / Math.sqrt(N)).toFixed(6)),
    });
  }

  out.results.ep170 = {
    description: 'Greedy finite sparse-ruler profile for F(N)/sqrt(N).',
    rows,
  };
}

// EP-172: finite coloring proxy for monochromatic sum-product patterns.
{
  function hasWitnessM3(colors, N) {
    for (let a = 1; a <= N; a += 1) {
      for (let b = a + 1; b <= N; b += 1) {
        for (let c = b + 1; c <= N; c += 1) {
          const vals = [a + b, a + c, b + c, a * b, a * c, b * c, a + b + c, a * b * c];
          const col0 = colors[vals[0]];
          let ok = true;
          for (let i = 1; i < vals.length; i += 1) {
            if (colors[vals[i]] !== col0) {
              ok = false;
              break;
            }
          }
          if (ok) return true;
        }
      }
    }
    return false;
  }

  const rows = [];
  for (const r of [2, 3]) {
    for (const N of [18, 24, 30]) {
      const M = N * N * N;
      const trials = 90;
      let hits = 0;
      for (let t = 0; t < trials; t += 1) {
        const colors = new Uint8Array(M + 1);
        for (let x = 1; x <= M; x += 1) colors[x] = Math.floor(rng() * r);
        if (hasWitnessM3(colors, N)) hits += 1;
      }
      rows.push({
        colors: r,
        N_domain_for_A: N,
        color_domain_max: M,
        trials,
        witness_size3_found_count: hits,
        witness_size3_found_rate: Number((hits / trials).toFixed(6)),
      });
    }
  }

  out.results.ep172 = {
    description: 'Finite random-coloring proxy for monochromatic sum/product patterns (|A|=3).',
    rows,
  };
}

// EP-174: finite F2^d rectangle proxy (known Ramsey-family shape).
{
  function randomMonoRectRate(d, trials, samplesPerTrial) {
    const n = 1 << d;
    let minRate = 1;
    let avgRate = 0;

    for (let t = 0; t < trials; t += 1) {
      const col = new Uint8Array(n);
      for (let i = 0; i < n; i += 1) col[i] = rng() < 0.5 ? 0 : 1;

      let mono = 0;
      for (let s = 0; s < samplesPerTrial; s += 1) {
        const x = Math.floor(rng() * n);
        let u = Math.floor(rng() * (n - 1)) + 1;
        let v = Math.floor(rng() * (n - 1)) + 1;
        while (v === u) v = Math.floor(rng() * (n - 1)) + 1;

        const p0 = x;
        const p1 = x ^ u;
        const p2 = x ^ v;
        const p3 = x ^ u ^ v;
        const c = col[p0];
        if (col[p1] === c && col[p2] === c && col[p3] === c) mono += 1;
      }
      const rate = mono / samplesPerTrial;
      avgRate += rate;
      if (rate < minRate) minRate = rate;
    }

    return { minRate, avgRate: avgRate / trials };
  }

  const rows = [];
  for (const d of [5, 6, 7, 8]) {
    const trials = 70;
    const samples = 3500;
    const v = randomMonoRectRate(d, trials, samples);
    rows.push({
      d,
      cube_vertices: 1 << d,
      trials,
      sampled_rectangles_per_trial: samples,
      min_mono_rectangle_rate_observed: Number(v.minRate.toFixed(6)),
      avg_mono_rectangle_rate_observed: Number(v.avgRate.toFixed(6)),
    });
  }

  out.results.ep174 = {
    description: 'Finite F2^d rectangle proxy under random 2-colorings.',
    rows,
  };
}

// EP-177: finite h_N(d) profiles for explicit +/-1 sequences.
{
  function thueMorseValue(i) {
    let x = i;
    let p = 0;
    while (x > 0) {
      p ^= x & 1;
      x >>= 1;
    }
    return p ? -1 : 1;
  }

  function maxProgDiscrepancyForD(seq, d) {
    let best = 0;
    const N = seq.length;
    for (let r = 0; r < d; r += 1) {
      let pref = 0;
      let minPref = 0;
      let maxPref = 0;
      for (let i = r; i < N; i += d) {
        pref += seq[i];
        if (pref < minPref) minPref = pref;
        if (pref > maxPref) maxPref = pref;
      }
      const disc = maxPref - minPref;
      if (disc > best) best = disc;
    }
    return best;
  }

  const N = 30000;
  const dList = [1, 2, 3, 4, 6, 8, 12, 16, 24, 32, 48, 64];

  const thue = new Int8Array(N);
  for (let i = 0; i < N; i += 1) thue[i] = thueMorseValue(i);

  const rows = [];
  for (const d of dList) {
    const th = maxProgDiscrepancyForD(thue, d);

    let bestRnd = Infinity;
    for (let t = 0; t < 10; t += 1) {
      const rnd = new Int8Array(N);
      for (let i = 0; i < N; i += 1) rnd[i] = rng() < 0.5 ? -1 : 1;
      const v = maxProgDiscrepancyForD(rnd, d);
      if (v < bestRnd) bestRnd = v;
    }

    rows.push({
      d,
      N_prefix: N,
      thue_morse_hN_d: th,
      random_best_of_10_hN_d: bestRnd,
      thue_over_sqrt_d: Number((th / Math.sqrt(d)).toFixed(6)),
      random_over_sqrt_d: Number((bestRnd / Math.sqrt(d)).toFixed(6)),
    });
  }

  out.results.ep177 = {
    description: 'Finite discrepancy profile h_N(d) for Thue-Morse and random +/-1 sequences.',
    rows,
  };
}

// EP-181: bound profile + finite Q2=C4 monochromatic proxy.
{
  const c = 0.03656;
  const boundRows = [];
  for (const n of [4, 6, 8, 10, 12, 16]) {
    const log2Upper = (2 - c) * n;
    const log2Target = n;
    boundRows.push({
      n,
      log2_upper_bound_tikhomirov_style: Number(log2Upper.toFixed(6)),
      log2_linear_target_2_pow_n: log2Target,
      ratio_exponent_log2_upper_over_target: Number((log2Upper - log2Target).toFixed(6)),
    });
  }

  function randomColorK(m) {
    const cmat = Array.from({ length: m }, () => new Uint8Array(m));
    for (let i = 0; i < m; i += 1) {
      for (let j = i + 1; j < m; j += 1) {
        const c0 = rng() < 0.5 ? 0 : 1;
        cmat[i][j] = c0;
        cmat[j][i] = c0;
      }
    }
    return cmat;
  }

  function hasMonoC4(cmat) {
    const m = cmat.length;
    for (let u = 0; u < m; u += 1) {
      for (let v = u + 1; v < m; v += 1) {
        let redCommon = 0;
        let blueCommon = 0;
        for (let w = 0; w < m; w += 1) {
          if (w === u || w === v) continue;
          if (cmat[u][w] === 1 && cmat[v][w] === 1) redCommon += 1;
          if (cmat[u][w] === 0 && cmat[v][w] === 0) blueCommon += 1;
          if (redCommon >= 2 || blueCommon >= 2) return true;
        }
      }
    }
    return false;
  }

  const proxyRows = [];
  for (const m of [6, 8, 10, 12]) {
    const trials = 400;
    let hits = 0;
    for (let t = 0; t < trials; t += 1) if (hasMonoC4(randomColorK(m))) hits += 1;
    proxyRows.push({
      m,
      trials,
      monochromatic_C4_found_rate: Number((hits / trials).toFixed(6)),
    });
  }

  out.results.ep181 = {
    description: 'Asymptotic-bound profile for R(Q_n) plus finite monochromatic C4 proxy.',
    bound_rows: boundRows,
    q2_proxy_rows: proxyRows,
  };
}

// EP-183: bound window profile for lim R(3;k)^{1/k}.
{
  const rows = [];

  // recursion upper bound: U_1=3, U_k <= 2 + k(U_{k-1}-1)
  const U = [0, 3];
  for (let k = 2; k <= 80; k += 1) U[k] = 2 + k * (U[k - 1] - 1);

  const lowerRoot = 380 ** (1 / 5);
  for (const k of [5, 10, 20, 30, 40, 60, 80]) {
    const upper = U[k];
    rows.push({
      k,
      lower_root_from_schur_bound: Number(lowerRoot.toFixed(6)),
      recursive_upper_n: upper,
      recursive_upper_root: Number(upper ** (1 / k)).toFixed(6),
    });
  }

  out.results.ep183 = {
    description: 'Finite lower/upper kth-root windows from Schur-based lower and recursive factorial-scale upper bounds.',
    rows,
  };
}

const outPath = path.join('data', 'harder_batch6_quick_compute.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ outPath }, null, 2));
