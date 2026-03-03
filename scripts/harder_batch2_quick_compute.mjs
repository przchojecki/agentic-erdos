#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 2:
// EP-32, EP-33, EP-36, EP-39, EP-41, EP-44, EP-51, EP-52, EP-60, EP-61.

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

function randomSubset(maxV, k, rng) {
  const arr = Array.from({ length: maxV }, (_, i) => i + 1);
  shuffle(arr, rng);
  return arr.slice(0, k).sort((a, b) => a - b);
}

function asKey(a, b) {
  return a < b ? `${a},${b}` : `${b},${a}`;
}

function isSidonSet(vals) {
  const seen = new Set();
  for (let i = 0; i < vals.length; i += 1) {
    for (let j = i; j < vals.length; j += 1) {
      const s = vals[i] + vals[j];
      if (seen.has(s)) return false;
      seen.add(s);
    }
  }
  return true;
}

function randomSidonSet(N, target, rng) {
  const base = Array.from({ length: N }, (_, i) => i + 1);
  for (let tries = 0; tries < 200; tries += 1) {
    const arr = base.slice();
    shuffle(arr, rng);
    const A = [];
    const sums = new Set();
    for (const x of arr) {
      let ok = !sums.has(2 * x);
      if (ok) {
        for (const a of A) {
          if (sums.has(a + x)) {
            ok = false;
            break;
          }
        }
      }
      if (!ok) continue;
      for (const a of A) sums.add(a + x);
      sums.add(2 * x);
      A.push(x);
      if (A.length >= target) {
        A.sort((u, v) => u - v);
        return A;
      }
    }
  }
  return null;
}

function canAddToSidon(current, sums, x) {
  if (sums.has(2 * x)) return false;
  for (const a of current) if (sums.has(a + x)) return false;
  return true;
}

function addToSidonState(current, sums, x) {
  for (const a of current) sums.add(a + x);
  sums.add(2 * x);
  current.push(x);
}

function countC4InGraph(n, edges) {
  const adj = Array.from({ length: n }, () => new Uint8Array(n));
  for (const [u, v] of edges) {
    adj[u][v] = 1;
    adj[v][u] = 1;
  }
  let c4 = 0;
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) {
      let common = 0;
      for (let w = 0; w < n; w += 1) if (adj[u][w] && adj[v][w]) common += 1;
      c4 += choose2(common);
    }
  }
  return Math.floor(c4 / 2);
}

function randomGraphWithEdges(n, m, rng) {
  const all = [];
  for (let u = 0; u < n; u += 1) {
    for (let v = u + 1; v < n; v += 1) all.push([u, v]);
  }
  shuffle(all, rng);
  return all.slice(0, m);
}

function sumProductStats(A) {
  const S = new Set();
  const P = new Set();
  for (let i = 0; i < A.length; i += 1) {
    for (let j = 0; j < A.length; j += 1) {
      S.add(A[i] + A[j]);
      P.add(A[i] * A[j]);
    }
  }
  return { sumset: S.size, prodset: P.size };
}

function buildPhi(limit) {
  const phi = new Uint32Array(limit + 1);
  for (let i = 0; i <= limit; i += 1) phi[i] = i;
  for (let p = 2; p <= limit; p += 1) {
    if (phi[p] !== p) continue;
    for (let k = p; k <= limit; k += p) phi[k] -= Math.floor(phi[k] / p);
  }
  return phi;
}

function genRandomCographStats(n, rng) {
  function rec(sz) {
    if (sz === 1) return { alpha: 1, omega: 1 };
    const a = 1 + Math.floor(rng() * (sz - 1));
    const b = sz - a;
    const left = rec(a);
    const right = rec(b);
    if (rng() < 0.5) {
      return {
        alpha: left.alpha + right.alpha,
        omega: Math.max(left.omega, right.omega),
      };
    }
    return {
      alpha: Math.max(left.alpha, right.alpha),
      omega: left.omega + right.omega,
    };
  }
  return rec(n);
}

const rng = makeRng(20260303);
const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// Shared sieve for relevant ranges.
const primeLimit = 240000;
const { isPrime, primes } = sieve(primeLimit);

// EP-32: random finite additive complement probes for primes.
{
  const XList = [50000, 100000, 200000];
  const rows = [];
  for (const X of XList) {
    const low = Math.floor(X / 2);
    const B = Math.floor(18 * Math.sqrt(X));
    const kList = [8, 12, 16, 20, 24];
    const primesInRange = primes.filter((p) => p <= X + B);

    for (const k of kList) {
      let best = 0;
      for (let t = 0; t < 120; t += 1) {
        const A = randomSubset(B, k, rng);
        const cover = new Uint8Array(X - low + 1);
        let c = 0;
        for (const a of A) {
          for (const p of primesInRange) {
            const n = p + a;
            if (n < low || n > X) continue;
            const idx = n - low;
            if (!cover[idx]) {
              cover[idx] = 1;
              c += 1;
            }
          }
        }
        const frac = c / (X - low + 1);
        if (frac > best) best = frac;
      }
      rows.push({
        X,
        low,
        B,
        k,
        trials: 120,
        best_coverage_fraction: Number(best.toFixed(6)),
        k_over_logX: Number((k / Math.log(X)).toFixed(4)),
      });
    }
  }
  out.results.ep32 = {
    description: 'Random finite coverage proxies for representations n=p+a on [X/2, X].',
    rows,
  };
}

// EP-33: greedy finite additive complement to squares on intervals.
{
  const XList = [20000, 50000, 100000];
  const rows = [];
  for (const X of XList) {
    const low = Math.floor(X / 2);
    const high = X;
    const U = high - low + 1;
    const maxA = Math.floor(4 * Math.sqrt(X));
    const squares = [];
    for (let t = 0; t * t <= high; t += 1) squares.push(t * t);

    const covers = [];
    for (let a = 0; a <= maxA; a += 1) {
      const arr = [];
      for (const s of squares) {
        const n = s + a;
        if (n < low || n > high) continue;
        arr.push(n - low);
      }
      covers.push(arr);
    }

    const uncovered = new Uint8Array(U);
    uncovered.fill(1);
    let uncoveredCount = U;
    const chosen = [];
    const checkpoints = new Set([20, 40, 60, 80, 100, 120]);
    const profile = [];

    for (let step = 1; step <= 120; step += 1) {
      let bestA = -1;
      let bestGain = -1;
      for (let a = 0; a <= maxA; a += 1) {
        if (chosen.includes(a)) continue;
        let gain = 0;
        for (const idx of covers[a]) if (uncovered[idx]) gain += 1;
        if (gain > bestGain) {
          bestGain = gain;
          bestA = a;
        }
      }
      if (bestA < 0 || bestGain <= 0) break;
      chosen.push(bestA);
      for (const idx of covers[bestA]) {
        if (uncovered[idx]) {
          uncovered[idx] = 0;
          uncoveredCount -= 1;
        }
      }
      if (checkpoints.has(step)) {
        profile.push({
          t: step,
          coverage_fraction: Number(((U - uncoveredCount) / U).toFixed(6)),
          t_over_sqrtX: Number((step / Math.sqrt(X)).toFixed(6)),
        });
      }
    }

    rows.push({
      X,
      interval: [low, high],
      candidate_a_max: maxA,
      profile,
      final_step_count: chosen.length,
      final_coverage_fraction: Number(((U - uncoveredCount) / U).toFixed(6)),
    });
  }
  out.results.ep33 = {
    description: 'Greedy finite interval coverage by n = square + a with bounded a.',
    rows,
  };
}

// EP-36: random local search for minimum overlap ratio.
{
  function maxDiffCount(A, B, N) {
    const offs = 2 * N + 3;
    const cnt = new Uint16Array(4 * N + 7);
    let best = 0;
    for (const a of A) {
      for (const b of B) {
        const idx = a - b + offs;
        const v = (cnt[idx] += 1);
        if (v > best) best = v;
      }
    }
    return best;
  }

  const NList = [120, 200, 300];
  const rows = [];
  for (const N of NList) {
    const U = Array.from({ length: 2 * N }, (_, i) => i + 1);
    let globalBest = Infinity;
    const restarts = 18;
    for (let r = 0; r < restarts; r += 1) {
      const arr = U.slice();
      shuffle(arr, rng);
      const A = arr.slice(0, N);
      const B = arr.slice(N);
      let score = maxDiffCount(A, B, N);
      for (let it = 0; it < 2000; it += 1) {
        const ia = Math.floor(rng() * N);
        const ib = Math.floor(rng() * N);
        const oldA = A[ia];
        const oldB = B[ib];
        A[ia] = oldB;
        B[ib] = oldA;
        const s2 = maxDiffCount(A, B, N);
        if (s2 <= score) {
          score = s2;
        } else {
          A[ia] = oldA;
          B[ib] = oldB;
        }
      }
      if (score < globalBest) globalBest = score;
    }
    rows.push({
      N,
      best_max_overlap_found: globalBest,
      best_ratio_over_N: Number((globalBest / N).toFixed(6)),
      restarts,
    });
  }
  out.results.ep36 = {
    description: 'Finite local-search profile for minimum overlap constant c.',
    rows,
  };
}

// EP-39: greedy infinite Sidon-prefix growth profile.
{
  const NMax = 2000000;
  const checkpoints = [10000, 100000, 500000, 1000000, 2000000];
  const cpSet = new Set(checkpoints);
  const usedDiff = new Uint8Array(NMax + 1);
  const A = [];
  const rows = [];
  for (let x = 1; x <= NMax; x += 1) {
    let ok = true;
    for (const a of A) {
      const d = x - a;
      if (usedDiff[d]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      for (const a of A) usedDiff[x - a] = 1;
      A.push(x);
    }
    if (cpSet.has(x)) {
      rows.push({
        N: x,
        count: A.length,
        count_over_N_pow_1_3: Number((A.length / Math.cbrt(x)).toFixed(6)),
        count_over_N_pow_sqrt2_minus1: Number((A.length / x ** (Math.SQRT2 - 1)).toFixed(6)),
      });
    }
  }
  out.results.ep39 = {
    description: 'Ascending greedy Sidon sequence finite growth profile.',
    rows,
    last_term_in_prefix: A[A.length - 1],
  };
}

// EP-41: greedy B3-type sequence profile (3-sum uniqueness with repetition allowed).
{
  const NMax = 60000;
  const checkpoints = [2000, 5000, 10000, 30000, 60000];
  const cpSet = new Set(checkpoints);
  const A = [];
  const sum3 = new Set();
  const rows = [];
  for (let x = 1; x <= NMax; x += 1) {
    let ok = !sum3.has(3 * x);
    if (ok) {
      for (let i = 0; i < A.length && ok; i += 1) {
        const a = A[i];
        if (sum3.has(2 * x + a) || sum3.has(x + 2 * a)) ok = false;
      }
    }
    if (ok) {
      for (let i = 0; i < A.length && ok; i += 1) {
        for (let j = i; j < A.length; j += 1) {
          if (sum3.has(x + A[i] + A[j])) {
            ok = false;
            break;
          }
        }
      }
    }
    if (ok) {
      for (let i = 0; i < A.length; i += 1) {
        const a = A[i];
        sum3.add(2 * x + a);
        sum3.add(x + 2 * a);
        for (let j = i; j < A.length; j += 1) {
          sum3.add(x + A[i] + A[j]);
        }
      }
      sum3.add(3 * x);
      A.push(x);
    }
    if (cpSet.has(x)) {
      rows.push({
        N: x,
        count: A.length,
        count_over_N_pow_1_3: Number((A.length / Math.cbrt(x)).toFixed(6)),
      });
    }
  }
  out.results.ep41 = {
    description: 'Greedy finite B3-type sequence profile.',
    rows,
    last_term_in_prefix: A[A.length - 1],
  };
}

// EP-44: finite extension experiments for random Sidon A.
{
  const NList = [120, 180, 240];
  const rows = [];
  for (const N of NList) {
    const tries = 18;
    let success = 0;
    const eps = 0.2;
    let avgRatio = 0;
    for (let t = 0; t < tries; t += 1) {
      const targetA = Math.max(6, Math.floor(0.75 * Math.sqrt(N)));
      const A = randomSidonSet(N, targetA, rng);
      if (!A) continue;

      const M = 3 * N;
      const current = A.slice();
      const sums = new Set();
      for (let i = 0; i < current.length; i += 1) {
        for (let j = i; j < current.length; j += 1) sums.add(current[i] + current[j]);
      }
      const candidates = Array.from({ length: M - N }, (_, i) => N + 1 + i);
      shuffle(candidates, rng);
      for (const x of candidates) {
        if (canAddToSidon(current, sums, x)) addToSidonState(current, sums, x);
      }
      const ratio = current.length / Math.sqrt(M);
      avgRatio += ratio;
      if (current.length >= (1 - eps) * Math.sqrt(M)) success += 1;
    }
    rows.push({
      N,
      M_test: 3 * N,
      epsilon: 0.2,
      trials: tries,
      success_count: success,
      success_fraction: Number((success / tries).toFixed(6)),
      avg_final_ratio_over_sqrtM: Number((avgRatio / tries).toFixed(6)),
    });
  }
  out.results.ep44 = {
    description: 'Finite random extension tests from initial Sidon sets into [N+1,3N].',
    rows,
  };
}

// EP-51: totient preimage minimum ratio profile.
{
  const LIM = 500000;
  const phi = buildPhi(LIM);
  const minN = new Uint32Array(LIM + 1);
  const count = new Uint16Array(LIM + 1);
  for (let n = 1; n <= LIM; n += 1) {
    const v = phi[n];
    if (v <= LIM) {
      if (minN[v] === 0 || n < minN[v]) minN[v] = n;
      if (count[v] < 65535) count[v] += 1;
    }
  }
  let maxRatio = -1;
  let argA = 0;
  const samples = [];
  for (let a = 1; a <= LIM; a += 1) {
    if (minN[a] === 0) continue;
    const r = minN[a] / a;
    if (r > maxRatio) {
      maxRatio = r;
      argA = a;
    }
    if (a % 50000 === 0) samples.push({ a, ratio_min_n_over_a: Number(r.toFixed(6)), preimage_count_within_limit: count[a] });
  }
  out.results.ep51 = {
    description: 'Finite profile of minimal preimage ratio n_a/a for Euler totient values up to 5e5.',
    limit: LIM,
    max_ratio_found: Number(maxRatio.toFixed(6)),
    argmax_a: argA,
    min_n_for_argmax: minN[argA],
    sampled_points: samples,
  };
}

// EP-52: sum-product finite exponent proxies.
{
  const mList = [20, 30, 40, 60];
  const rows = [];
  for (const m of mList) {
    const AP = Array.from({ length: m }, (_, i) => i + 1);
    const apStats = sumProductStats(AP);
    let bestRandom = Infinity;
    let bestRandomPair = null;
    const trials = 240;
    for (let t = 0; t < trials; t += 1) {
      const base = Array.from({ length: 8 * m }, (_, i) => i + 1);
      shuffle(base, rng);
      const A = base.slice(0, m).sort((a, b) => a - b);
      const st = sumProductStats(A);
      const mx = Math.max(st.sumset, st.prodset);
      const exp = Math.log(mx) / Math.log(m);
      if (exp < bestRandom) {
        bestRandom = exp;
        bestRandomPair = { sumset: st.sumset, prodset: st.prodset };
      }
    }
    rows.push({
      m,
      AP_max_sum_or_product_size: Math.max(apStats.sumset, apStats.prodset),
      AP_effective_exponent: Number((Math.log(Math.max(apStats.sumset, apStats.prodset)) / Math.log(m)).toFixed(6)),
      random_trials: trials,
      best_random_effective_exponent: Number(bestRandom.toFixed(6)),
      best_random_pair: bestRandomPair,
    });
  }
  out.results.ep52 = {
    description: 'Finite effective exponent profile for max(|A+A|,|AA|).',
    rows,
  };
}

// EP-60: small-n random search at ex(n,C4)+1 edge level.
{
  // ex(n,C4) for n=1..39 from OEIS A006855 small exact values.
  const exSmall = [
    0, // n=1
    1, 3, 4, 6, 7, 9, 11, 13, 16, 18, 21, 24, 27, 30, 33, 36, 39, 42, 46,
    50, 52, 56, 59, 63, 67, 71, 76, 80, 85, 90, 92, 96, 102, 106, 110, 113, 117, 122,
  ];
  const nList = [20, 24, 28, 32, 36];
  const rows = [];
  for (const n of nList) {
    const ex = exSmall[n - 1];
    const m = ex + 1;
    let best = Infinity;
    const trials = 320;
    for (let t = 0; t < trials; t += 1) {
      const g = randomGraphWithEdges(n, m, rng);
      const c4 = countC4InGraph(n, g);
      if (c4 < best) best = c4;
    }
    rows.push({
      n,
      ex_n_C4_assumed_exact_small_n: ex,
      tested_edges: m,
      random_trials: trials,
      min_C4_found: best,
      min_C4_over_sqrt_n: Number((best / Math.sqrt(n)).toFixed(6)),
    });
  }
  out.results.ep60 = {
    description: 'Small-n random lower-envelope search for C4 counts at ex(n,C4)+1 edges.',
    rows,
    caveat: 'Uses known small exact ex(n,C4) table values only for n<=39.',
  };
}

// EP-61: random cograph proxy (P4-free case) for clique/independent size growth.
{
  const nList = [64, 128, 256, 512];
  const rows = [];
  for (const n of nList) {
    const trials = 400;
    let minBest = Infinity;
    let avg = 0;
    for (let t = 0; t < trials; t += 1) {
      const s = genRandomCographStats(n, rng);
      const b = Math.max(s.alpha, s.omega);
      avg += b;
      if (b < minBest) minBest = b;
    }
    rows.push({
      n,
      trials,
      min_max_clique_or_independent_found: minBest,
      avg_max_clique_or_independent_found: Number((avg / trials).toFixed(4)),
      min_over_sqrt_n: Number((minBest / Math.sqrt(n)).toFixed(6)),
      min_effective_exponent: Number((Math.log(minBest) / Math.log(n)).toFixed(6)),
    });
  }
  out.results.ep61 = {
    description: 'Finite proxy on random cographs (P4-free subclass) for EH-type growth.',
    rows,
    caveat: 'This probes a special forbidden-induced-subgraph class, not general H.',
  };
}

const outPath = path.join('data', 'harder_batch2_quick_compute.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(JSON.stringify({ outPath }, null, 2));
