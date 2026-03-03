#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 12:
// EP-406, EP-408, EP-409, EP-410, EP-411,
// EP-413, EP-416, EP-431, EP-450, EP-470.

function sieveSPF(limit) {
  const spf = new Uint32Array(limit + 1);
  for (let i = 2; i <= limit; i += 1) {
    if (spf[i] !== 0) continue;
    spf[i] = i;
    if (i * i > limit) continue;
    for (let j = i * i; j <= limit; j += i) {
      if (spf[j] === 0) spf[j] = i;
    }
  }
  return spf;
}

function primesFromSPF(spf) {
  const p = [];
  for (let i = 2; i < spf.length; i += 1) if (spf[i] === i) p.push(i);
  return p;
}

function phiSieve(limit) {
  const phi = new Uint32Array(limit + 1);
  for (let i = 0; i <= limit; i += 1) phi[i] = i;
  for (let p = 2; p <= limit; p += 1) {
    if (phi[p] !== p) continue;
    for (let j = p; j <= limit; j += p) {
      phi[j] = Math.floor((phi[j] / p) * (p - 1));
    }
  }
  return phi;
}

function sigmaSieve(limit) {
  const s = new Float64Array(limit + 1);
  for (let i = 1; i <= limit; i += 1) {
    for (let j = i; j <= limit; j += i) s[j] += i;
  }
  return s;
}

function omegaSieve(limit) {
  const w = new Uint8Array(limit + 1);
  for (let p = 2; p <= limit; p += 1) {
    if (w[p] !== 0) continue;
    for (let j = p; j <= limit; j += p) w[j] += 1;
  }
  return w;
}

function factorizeNumber(n, spf) {
  const f = [];
  let x = n;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    f.push([p, e]);
  }
  return f;
}

function properDivisors(n, spf) {
  const fac = factorizeNumber(n, spf);
  let divs = [1];
  for (const [p, e] of fac) {
    const cur = [];
    let pe = 1;
    for (let k = 0; k <= e; k += 1) {
      for (const d of divs) cur.push(d * pe);
      pe *= p;
    }
    divs = cur;
  }
  divs = divs.filter((d) => d < n);
  divs.sort((a, b) => b - a);
  return divs;
}

function isPrimeBySPF(n, spf) {
  return n >= 2 && spf[n] === n;
}

function phiByFactorization(n, primes) {
  let x = n;
  let res = n;
  for (const p of primes) {
    if (p * p > x) break;
    if (x % p !== 0) continue;
    res = Math.floor((res / p) * (p - 1));
    while (x % p === 0) x = Math.floor(x / p);
  }
  if (x > 1) res = Math.floor((res / x) * (x - 1));
  return res;
}

function sigmaByFactorization(n, primes) {
  let x = n;
  let ans = 1;
  for (const p of primes) {
    if (p * p > x) break;
    if (x % p !== 0) continue;
    let term = 1;
    let pw = 1;
    while (x % p === 0) {
      x = Math.floor(x / p);
      pw *= p;
      term += pw;
    }
    ans *= term;
    if (!Number.isFinite(ans) || ans > Number.MAX_SAFE_INTEGER) return null;
  }
  if (x > 1) {
    ans *= (1 + x);
    if (!Number.isFinite(ans) || ans > Number.MAX_SAFE_INTEGER) return null;
  }
  return ans;
}

function hasOnlyDigitsSetBase(nBig, base, allowedChars) {
  const s = nBig.toString(base);
  for (let i = 0; i < s.length; i += 1) {
    if (!allowedChars.has(s[i])) return false;
  }
  return true;
}

function sampleWithoutReplacement(maxVal, size, rngState) {
  const arr = Array.from({ length: maxVal }, (_, i) => i + 1);
  for (let i = maxVal - 1; i > 0; i -= 1) {
    rngState.x ^= rngState.x << 13;
    rngState.x ^= rngState.x >>> 17;
    rngState.x ^= rngState.x << 5;
    const r = ((rngState.x >>> 0) + 0.5) / 4294967296;
    const j = Math.floor(r * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
  return arr.slice(0, size);
}

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// Shared precompute sizes.
const N_SMALL = 1_000_000;
const spf = sieveSPF(N_SMALL + 5);
const primes = primesFromSPF(spf);
const phi = phiSieve(N_SMALL + 5);

// Largest prime factor table on same range.
const lpf = new Uint32Array(N_SMALL + 6);
lpf[1] = 1;
for (let n = 2; n <= N_SMALL + 5; n += 1) {
  const p = spf[n];
  const q = Math.floor(n / p);
  const lp = lpf[q];
  lpf[n] = p > lp ? p : lp;
}

// EP-406: powers of 2 with ternary digits constraints.
{
  const NEXP = 20000;
  const rows = [];

  const allow01 = new Set(['0', '1']);
  const allow12 = new Set(['1', '2']);

  let v = 1n;
  const hits01 = [];
  const hits12 = [];

  let missing0After16 = 0;
  let missing1After16 = 0;
  let missing2After16 = 0;

  for (let n = 0; n <= NEXP; n += 1) {
    const s = v.toString(3);

    if (hasOnlyDigitsSetBase(v, 3, allow01)) hits01.push(n);
    if (hasOnlyDigitsSetBase(v, 3, allow12)) hits12.push(n);

    if (n >= 16) {
      if (!s.includes('0')) missing0After16 += 1;
      if (!s.includes('1')) missing1After16 += 1;
      if (!s.includes('2')) missing2After16 += 1;
    }

    if ([100, 1000, 5000, 10000, 20000].includes(n)) {
      rows.push({
        n,
        count_hits_01_up_to_n: hits01.length,
        count_hits_12_up_to_n: hits12.length,
      });
    }

    v <<= 1n;
  }

  out.results.ep406 = {
    description: 'Finite ternary-digit profile for powers of two.',
    exponent_limit: NEXP,
    exponents_with_only_digits_0_1: hits01,
    exponents_with_only_digits_1_2: hits12,
    counts_missing_digit_after_n_ge_16: {
      missing_0: missing0After16,
      missing_1: missing1After16,
      missing_2: missing2After16,
    },
    rows,
  };
}

// EP-408: iterated phi depth and coarse largest-prime-factor profile.
{
  const N = 300000;
  const f = new Uint16Array(N + 1);
  f[1] = 0;
  for (let n = 2; n <= N; n += 1) f[n] = f[phi[n]] + 1;

  const milestones = [10000, 50000, 100000, 200000, 300000];
  const mset = new Set(milestones);

  const rows = [];
  let sumRatio = 0;
  let sumSqRatio = 0;
  let cnt = 0;
  let fracLpfLeN01 = 0;
  let fracLpfLeN005 = 0;

  for (let n = 3; n <= N; n += 1) {
    const r = f[n] / Math.log(n);
    sumRatio += r;
    sumSqRatio += r * r;
    cnt += 1;

    const k = Math.max(1, Math.floor(Math.log(Math.log(n))));
    let x = n;
    for (let t = 0; t < k; t += 1) x = phi[x];

    const lp = lpf[x];
    if (lp <= n ** 0.1) fracLpfLeN01 += 1;
    if (lp <= n ** 0.05) fracLpfLeN005 += 1;

    if (mset.has(n)) {
      const mean = sumRatio / cnt;
      const varr = Math.max(0, sumSqRatio / cnt - mean * mean);
      rows.push({
        X: n,
        mean_f_over_log: Number(mean.toPrecision(7)),
        std_f_over_log: Number(Math.sqrt(varr).toPrecision(7)),
        fraction_lpf_phi_loglog_le_n_pow_0_1: Number((fracLpfLeN01 / cnt).toPrecision(6)),
        fraction_lpf_phi_loglog_le_n_pow_0_05: Number((fracLpfLeN005 / cnt).toPrecision(6)),
      });
    }
  }

  out.results.ep408 = {
    description: 'Finite distribution proxies for f(n)=min{k:phi_k(n)=1} and lpf(phi_{loglog n}(n)).',
    rows,
  };
}

// EP-409: iterations of T(n)=phi(n)+1 to prime.
{
  const N = 300000;
  const memoSteps = new Int32Array(N + 1);
  const memoPrime = new Int32Array(N + 1);
  memoSteps.fill(-1);

  function solve(n) {
    if (memoSteps[n] >= 0) return [memoSteps[n], memoPrime[n]];

    const path = [];
    let x = n;
    while (true) {
      if (memoSteps[x] >= 0) break;
      path.push(x);
      if (isPrimeBySPF(x, spf)) {
        memoSteps[x] = 0;
        memoPrime[x] = x;
        break;
      }
      x = phi[x] + 1;
    }

    let steps = memoSteps[x];
    let p = memoPrime[x];
    for (let i = path.length - 1; i >= 0; i -= 1) {
      steps += 1;
      memoSteps[path[i]] = steps;
      memoPrime[path[i]] = p;
    }
    return [memoSteps[n], memoPrime[n]];
  }

  const milestones = [10000, 50000, 100000, 200000, 300000];
  const mset = new Set(milestones);

  let sumF = 0;
  let maxF = 0;
  let argMax = 1;
  const primeBasin = new Map();
  const rows = [];

  for (let n = 1; n <= N; n += 1) {
    const [steps, p] = solve(n);
    const f = isPrimeBySPF(n, spf) ? 0 : steps;
    sumF += f;
    if (f > maxF) {
      maxF = f;
      argMax = n;
    }
    primeBasin.set(p, (primeBasin.get(p) || 0) + 1);

    if (mset.has(n)) {
      const c2 = primeBasin.get(2) || 0;
      const c3 = primeBasin.get(3) || 0;
      const c5 = primeBasin.get(5) || 0;
      rows.push({
        X: n,
        mean_iterations_to_prime: Number((sumF / n).toPrecision(7)),
        max_iterations_up_to_X: maxF,
        argmax_n: argMax,
        density_reaching_prime_2: Number((c2 / n).toPrecision(6)),
        density_reaching_prime_3: Number((c3 / n).toPrecision(6)),
        density_reaching_prime_5: Number((c5 / n).toPrecision(6)),
      });
    }
  }

  const topBasins = [...primeBasin.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8)
    .map(([p, c]) => ({ prime: p, count: c, density: Number((c / N).toPrecision(6)) }));

  out.results.ep409 = {
    description: 'Finite iteration profile for T(n)=phi(n)+1 and terminal-prime basins.',
    rows,
    top_terminal_prime_basins: topBasins,
  };
}

// EP-410: growth snapshots for sigma iterates.
{
  const SIGMA_LIMIT = 2_000_000;
  const sigma = sigmaSieve(SIGMA_LIMIT);

  function sigmaOne(x) {
    if (x <= SIGMA_LIMIT) return sigma[x];
    return sigmaByFactorization(x, primes);
  }

  const seeds = [2, 3, 4, 5, 6, 10, 12, 30, 70, 210];
  const rows = [];

  for (const seed of seeds) {
    let x = seed;
    const profile = [];
    let stopped = false;

    for (let k = 1; k <= 12; k += 1) {
      const y = sigmaOne(x);
      if (y === null || !Number.isFinite(y) || y > 1e15) {
        stopped = true;
        break;
      }
      x = y;
      profile.push({
        k,
        value: Math.round(x),
        root_k: Number((x ** (1 / k)).toPrecision(7)),
        log_over_k: Number((Math.log(x) / k).toPrecision(7)),
      });
    }

    rows.push({
      seed,
      steps_computed: profile.length,
      stopped_early: stopped,
      last_value: profile.length ? profile[profile.length - 1].value : seed,
      profile,
    });
  }

  out.results.ep410 = {
    description: 'Finite growth profile for sigma iterates sigma_k(n).',
    rows,
  };
}

// EP-411: search for finite-window eventual patterns g_{k+r}(n)=2g_k(n).
{
  function g(n) {
    if (n <= N_SMALL) return n + phi[n];
    return n + phiByFactorization(n, primes);
  }

  function iterG(n, len, cap) {
    const arr = [n];
    let x = n;
    for (let i = 0; i < len; i += 1) {
      x = g(x);
      if (!Number.isFinite(x) || x > cap) return null;
      arr.push(x);
    }
    return arr;
  }

  const N = 20000;
  const RMAX = 6;
  const LEN = 26;
  const CAP = 5e8;
  const hits = [];

  for (let n = 2; n <= N; n += 1) {
    const seq = iterG(n, LEN + RMAX, CAP);
    if (!seq) continue;
    for (let r = 1; r <= RMAX; r += 1) {
      let found = false;
      let bestK = null;
      for (let K = 2; K <= 12; K += 1) {
        let ok = true;
        for (let k = K; k <= K + 7; k += 1) {
          if (seq[k + r] !== 2 * seq[k]) {
            ok = false;
            break;
          }
        }
        if (ok) {
          found = true;
          bestK = K;
          break;
        }
      }
      if (found) hits.push({ n, r, witness_K: bestK });
    }
  }

  function verifyKnown(n, r) {
    const seq = iterG(n, 40 + r, 5e12);
    if (!seq) return null;
    for (let k = 4; k <= 35; k += 1) {
      if (seq[k + r] !== 2 * seq[k]) return false;
    }
    return true;
  }

  out.results.ep411 = {
    description: 'Finite-window search for eventual doubling under iterates of g(n)=n+phi(n).',
    scan_limit_n: N,
    scan_limit_r: RMAX,
    candidate_hits_first_40: hits.slice(0, 40),
    hit_count_total: hits.length,
    known_case_checks: [
      { n: 10, r: 2, holds_on_checked_window: verifyKnown(10, 2) },
      { n: 94, r: 2, holds_on_checked_window: verifyKnown(94, 2) },
    ],
  };
}

// EP-413: barriers for omega and epsilon-variants.
{
  const N = 500000;
  const omega = omegaSieve(N + 5);

  function barrierProfile(eps) {
    let mx = 1; // max over m<n of m+eps*omega(m)
    const barriers = [];
    const milestones = [10000, 50000, 100000, 200000, 500000];
    const mset = new Set(milestones);
    const rows = [];

    for (let n = 1; n <= N; n += 1) {
      if (n >= mx) {
        barriers.push(n);
      }
      const val = n + eps * omega[n];
      if (val > mx) mx = val;

      if (mset.has(n)) {
        rows.push({
          X: n,
          barrier_count_up_to_X: barriers.length,
          density: Number((barriers.length / n).toPrecision(6)),
        });
      }
    }

    return {
      eps,
      first_30_barriers: barriers.slice(0, 30),
      rows,
    };
  }

  out.results.ep413 = {
    description: 'Finite barrier profiles for m + eps*omega(m) <= n variants.',
    profiles: [barrierProfile(1), barrierProfile(0.5), barrierProfile(0.25)],
  };
}

// EP-416: finite proxy for V(x)=#{n<=x: phi(m)=n solvable}.
{
  const M = 1_000_000;
  const hit = new Uint8Array(M + 1);
  for (let m = 1; m <= M; m += 1) {
    const v = phi[m];
    if (v <= M) hit[v] = 1;
  }

  const pref = new Uint32Array(M + 1);
  for (let i = 1; i <= M; i += 1) pref[i] = pref[i - 1] + hit[i];

  const rows = [];
  for (const X of [20000, 50000, 100000, 200000, 500000]) {
    const Vx = pref[X];
    const V2x = pref[Math.min(M, 2 * X)];
    rows.push({
      X,
      V_proxy_X: Vx,
      V_proxy_2X: V2x,
      ratio_V2X_over_VX: Number((V2x / Vx).toPrecision(6)),
      V_over_X_over_logX: Number((Vx / (X / Math.log(X))).toPrecision(6)),
    });
  }

  out.results.ep416 = {
    description: 'Finite image-of-totient proxy V(x) from m<=1e6.',
    rows,
  };
}

// EP-431: finite random sumset coverage proxy for primes.
{
  const X = 5000;
  const M = 800;
  const primesX = primes.filter((p) => p <= X);

  const rng = { x: 20260303 ^ 1201 };

  function coverageForSizes(sa, sb, trials) {
    let best = 0;
    let avg = 0;

    for (let t = 0; t < trials; t += 1) {
      const A = sampleWithoutReplacement(M, sa, rng);
      const B = sampleWithoutReplacement(M, sb, rng);
      const sums = new Uint8Array(X + 1);
      for (const a of A) {
        for (const b of B) {
          const s = a + b;
          if (s <= X) sums[s] = 1;
        }
      }
      let c = 0;
      for (const p of primesX) if (sums[p]) c += 1;
      const ratio = c / primesX.length;
      avg += ratio;
      if (ratio > best) best = ratio;
    }

    return {
      size_A: sa,
      size_B: sb,
      trials,
      best_prime_coverage_ratio: Number(best.toPrecision(6)),
      avg_prime_coverage_ratio: Number((avg / trials).toPrecision(6)),
    };
  }

  out.results.ep431 = {
    description: 'Random finite sumset coverage of primes up to X by A+B with bounded A,B.',
    X,
    prime_count_up_to_X: primesX.length,
    rows: [
      coverageForSizes(12, 12, 250),
      coverageForSizes(20, 20, 250),
      coverageForSizes(30, 30, 250),
      coverageForSizes(40, 40, 250),
      coverageForSizes(50, 50, 250),
    ],
  };
}

// EP-450: interval densities of integers having a divisor in (n,2n).
{
  function buildHasDiv(N, n) {
    const arr = new Uint8Array(N + 1);
    for (let d = n + 1; d <= 2 * n - 1; d += 1) {
      for (let m = d; m <= N; m += d) arr[m] = 1;
    }
    return arr;
  }

  function prefix(arr) {
    const p = new Uint32Array(arr.length);
    for (let i = 1; i < arr.length; i += 1) p[i] = p[i - 1] + arr[i];
    return p;
  }

  const rows = [];
  for (const n of [120, 300, 700]) {
    const YMAX = 24 * n;
    const XMAX = 200000;
    const arr = buildHasDiv(XMAX + YMAX + 5, n);
    const prefArr = prefix(arr);

    for (const y of [2 * n, 4 * n, 8 * n, 16 * n, 24 * n]) {
      let minD = 1;
      let maxD = 0;
      let avgD = 0;
      let cnt = 0;
      for (let x = 0; x <= XMAX; x += 1) {
        const c = prefArr[x + y] - prefArr[x];
        const d = c / y;
        if (d < minD) minD = d;
        if (d > maxD) maxD = d;
        avgD += d;
        cnt += 1;
      }
      rows.push({
        n,
        y,
        min_density_over_x: Number(minD.toPrecision(6)),
        max_density_over_x: Number(maxD.toPrecision(6)),
        mean_density_over_x: Number((avgD / cnt).toPrecision(6)),
      });
    }
  }

  out.results.ep450 = {
    description: 'Finite x-window density profile for having a divisor in (n,2n).',
    rows,
  };
}

// EP-470: weird numbers (finite) and odd weird search proxy.
{
  const N_WEIRD = 30000;
  const N_ODD = 300000;

  const spfBig = sieveSPF(N_ODD + 5);
  const sigmaAll = sigmaSieve(N_ODD + 5);
  const omegaAll = omegaSieve(N_ODD + 5);

  function isSemiperfect(n) {
    const divs = properDivisors(n, spfBig);
    let bits = 1n;
    const mask = (1n << BigInt(n + 1)) - 1n;
    const targetBit = 1n << BigInt(n);

    for (const d of divs) {
      bits |= bits << BigInt(d);
      bits &= mask;
      if (bits & targetBit) return true;
    }
    return false;
  }

  const weird = [];
  for (let n = 2; n <= N_WEIRD; n += 1) {
    if (sigmaAll[n] < 2 * n) continue;
    if (!isSemiperfect(n)) weird.push(n);
  }

  const weirdSet = new Set(weird);
  const primitive = [];
  for (const n of weird) {
    let prim = true;
    const divs = properDivisors(n, spfBig);
    for (const d of divs) {
      if (weirdSet.has(d)) {
        prim = false;
        break;
      }
    }
    if (prim) primitive.push(n);
  }

  const oddWeird = [];
  const oddCandidatesChecked = [];
  for (let n = 3; n <= N_ODD; n += 2) {
    if (sigmaAll[n] < 2 * n) continue;
    if (omegaAll[n] < 6) continue; // known necessary condition for odd weird numbers.
    oddCandidatesChecked.push(n);
    if (!isSemiperfect(n)) oddWeird.push(n);
  }

  out.results.ep470 = {
    description: 'Finite weird-number and odd-weird search proxies.',
    weird_search_limit: N_WEIRD,
    odd_search_limit: N_ODD,
    weird_count: weird.length,
    first_25_weird: weird.slice(0, 25),
    primitive_weird_count: primitive.length,
    first_25_primitive_weird: primitive.slice(0, 25),
    odd_candidates_checked_count: oddCandidatesChecked.length,
    odd_candidates_checked_first_20: oddCandidatesChecked.slice(0, 20),
    odd_weird_found: oddWeird,
  };
}

const outPath = path.join('data', 'harder_batch12_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
