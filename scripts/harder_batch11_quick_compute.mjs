#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 11:
// EP-365, EP-368, EP-371, EP-373, EP-374,
// EP-376, EP-377, EP-387, EP-393, EP-396.

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
  const primes = [];
  for (let i = 2; i < spf.length; i += 1) {
    if (spf[i] === i) primes.push(i);
  }
  return primes;
}

function factorizeInt(n, spf) {
  const out = [];
  let x = n;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    out.push([p, e]);
  }
  return out;
}

function isSquareInt(n) {
  const r = Math.floor(Math.sqrt(n));
  return r * r === n;
}

function vpFact(n, p) {
  let s = 0;
  let x = n;
  while (x > 0) {
    x = Math.floor(x / p);
    s += x;
  }
  return s;
}

function vpCentralBinom(n, p) {
  return vpFact(2 * n, p) - 2 * vpFact(n, p);
}

function noCarryDoubleInBase(n, p) {
  const threshold = Math.floor((p - 1) / 2);
  let x = n;
  while (x > 0) {
    if (x % p > threshold) return false;
    x = Math.floor(x / p);
  }
  return true;
}

function isqrtBigInt(n) {
  if (n < 2n) return n;
  let x = 1n << BigInt((n.toString(2).length + 1) >> 1);
  while (true) {
    const y = (x + n / x) >> 1n;
    if (y >= x) return x;
    x = y;
  }
}

function isSquareBigInt(n) {
  if (n < 0n) return false;
  const r = isqrtBigInt(n);
  return r * r === n;
}

function product3(x) {
  return x * (x + 1n) * (x + 2n);
}

function exactConsecutiveTripleRoot(target) {
  if (target < 6n) return null;
  let lo = 1n;
  let hi = 1n;
  while (product3(hi) < target) hi <<= 1n;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1n;
    const v = product3(mid);
    if (v === target) return mid;
    if (v < target) lo = mid + 1n;
    else hi = mid - 1n;
  }
  return null;
}

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// Shared precomputation for EP-365/368/371 and small-integer factoring tasks.
const LIMIT = 3_000_000;
const spf = sieveSPF(LIMIT + 5);
const primesAll = primesFromSPF(spf);

// Largest prime factor table.
const lpf = new Uint32Array(LIMIT + 2);
lpf[1] = 1;
for (let n = 2; n <= LIMIT + 1; n += 1) {
  const p = spf[n];
  const m = Math.floor(n / p);
  const prev = lpf[m];
  lpf[n] = p > prev ? p : prev;
}

// Powerful-number table.
const powerful = new Uint8Array(LIMIT + 2);
powerful[1] = 1;
for (let n = 2; n <= LIMIT + 1; n += 1) {
  let x = n;
  let ok = 1;
  while (x > 1) {
    const p = spf[x];
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    if (e === 1) {
      ok = 0;
      break;
    }
  }
  powerful[n] = ok;
}

// EP-365: consecutive powerful pairs.
{
  const milestones = [10_000, 100_000, 500_000, 1_000_000, 2_000_000, 3_000_000];
  const mset = new Set(milestones);
  const rows = [];

  let countPairs = 0;
  let countBothNonSquare = 0;
  const firstPairs = [];
  const firstBothNonSquare = [];

  for (let n = 1; n <= LIMIT; n += 1) {
    if (powerful[n] && powerful[n + 1]) {
      countPairs += 1;
      const nonSquare = !isSquareInt(n) && !isSquareInt(n + 1);
      if (nonSquare) {
        countBothNonSquare += 1;
        if (firstBothNonSquare.length < 12) firstBothNonSquare.push(n);
      }
      if (firstPairs.length < 20) firstPairs.push(n);
    }

    if (mset.has(n)) {
      const ln = Math.log(n);
      rows.push({
        X: n,
        pair_count_up_to_X: countPairs,
        both_non_square_count_up_to_X: countBothNonSquare,
        pair_count_over_log2: Number((countPairs / (ln * ln)).toPrecision(6)),
      });
    }
  }

  out.results.ep365 = {
    description: 'Finite profile of consecutive powerful numbers n,n+1.',
    first_pair_starts: firstPairs,
    first_both_non_square_pair_starts: firstBothNonSquare,
    rows,
  };
}

// EP-368: largest prime factor of n(n+1).
{
  const milestones = [10_000, 100_000, 500_000, 1_000_000, 2_000_000, 3_000_000];
  const mset = new Set(milestones);
  const rows = [];

  let minF = Number.POSITIVE_INFINITY;
  let maxF = 0;
  let cntLeLog2 = 0;

  for (let n = 2; n <= LIMIT; n += 1) {
    const F = lpf[n] > lpf[n + 1] ? lpf[n] : lpf[n + 1];
    if (F < minF) minF = F;
    if (F > maxF) maxF = F;

    const t = Math.log(n) ** 2;
    if (F <= t) cntLeLog2 += 1;

    if (mset.has(n)) {
      rows.push({
        X: n,
        min_F_up_to_X: minF,
        max_F_up_to_X: maxF,
        count_n_with_F_le_log2_up_to_X: cntLeLog2,
        proportion_F_le_log2: Number((cntLeLog2 / (n - 1)).toPrecision(6)),
      });
    }
  }

  out.results.ep368 = {
    description: 'Finite behavior of F(n)=P(n(n+1)) relative to logarithmic scales.',
    rows,
  };
}

// EP-371: density of P(n)<P(n+1).
{
  const milestones = [10_000, 100_000, 500_000, 1_000_000, 2_000_000, 3_000_000];
  const mset = new Set(milestones);
  const rows = [];

  let cnt = 0;
  for (let n = 1; n <= LIMIT; n += 1) {
    if (lpf[n] < lpf[n + 1]) cnt += 1;
    if (mset.has(n)) {
      const dens = cnt / n;
      rows.push({
        X: n,
        count: cnt,
        density: Number(dens.toPrecision(8)),
        signed_error_from_half: Number((dens - 0.5).toPrecision(6)),
      });
    }
  }

  out.results.ep371 = {
    description: 'Finite density profile of {n: P(n)<P(n+1)}.',
    rows,
  };
}

// Factorial tables for EP-373/393.
const FACT_MAX = 1000;
const fact = [1n];
for (let n = 1; n <= FACT_MAX; n += 1) fact.push(fact[n - 1] * BigInt(n));
const factIndex = new Map();
for (let n = 0; n <= FACT_MAX; n += 1) factIndex.set(fact[n], n);

// EP-373: finite search of low-factor-count factorial-product identities.
{
  const N2 = 400;
  const N3 = 150;

  const k2 = [];
  for (let n = 3; n <= N2; n += 1) {
    const fn = fact[n];
    for (let a = 2; a <= n - 2; a += 1) {
      const fa = fact[a];
      if (fn % fa !== 0n) continue;
      const q = fn / fa;
      const b = factIndex.get(q);
      if (b === undefined) continue;
      if (b < 2 || b > a || b > n - 2) continue;
      k2.push({ n, a, b });
    }
  }

  const k3 = [];
  for (let n = 4; n <= N3; n += 1) {
    const fn = fact[n];
    for (let a = 2; a <= n - 2; a += 1) {
      const fa = fact[a];
      for (let b = 2; b <= a; b += 1) {
        const prod = fa * fact[b];
        if (fn % prod !== 0n) continue;
        const q = fn / prod;
        const c = factIndex.get(q);
        if (c === undefined) continue;
        if (c < 2 || c > b || c > n - 2) continue;
        k3.push({ n, a, b, c });
      }
    }
  }

  out.results.ep373 = {
    description: 'Finite search for n! = product of 2 or 3 factorials with top index <= n-2.',
    search_limits: { N2, N3 },
    k2_solution_count: k2.length,
    k2_solutions: k2,
    k3_solution_count: k3.length,
    k3_solutions_first_40: k3.slice(0, 40),
  };
}

// EP-374: exact finite profile for D2/D3 via parity signatures modulo squares.
{
  const M = 600;
  const sig = Array(M + 1).fill(0n);

  const primes = primesAll.filter((p) => p <= M);
  const pIndex = new Map(primes.map((p, i) => [p, i]));

  for (let n = 1; n <= M; n += 1) {
    let x = n;
    let delta = 0n;
    while (x > 1) {
      const p = spf[x];
      let e = 0;
      while (x % p === 0) {
        x = Math.floor(x / p);
        e += 1;
      }
      if (e & 1) delta ^= 1n << BigInt(pIndex.get(p));
    }
    sig[n] = sig[n - 1] ^ delta;
  }

  const best = new Int8Array(M + 1);
  best.fill(99);

  const seenSig = new Map();
  const pairXor = new Set();
  seenSig.set(sig[1], 1);

  for (let m = 2; m <= M; m += 1) {
    if (seenSig.has(sig[m])) best[m] = 2;
    if (pairXor.has(sig[m]) && best[m] > 3) best[m] = 3;

    for (let i = 1; i < m; i += 1) pairXor.add(sig[i] ^ sig[m]);
    seenSig.set(sig[m], m);
  }

  const milestones = [100, 200, 300, 400, 500, 600];
  const rows = [];
  for (const X of milestones) {
    let d2 = 0;
    let d3 = 0;
    let other = 0;
    let primeInD2orD3 = 0;
    for (let m = 2; m <= X; m += 1) {
      if (best[m] === 2) {
        d2 += 1;
        if (spf[m] === m) primeInD2orD3 += 1;
      } else if (best[m] === 3) {
        d3 += 1;
        if (spf[m] === m) primeInD2orD3 += 1;
      } else {
        other += 1;
      }
    }
    rows.push({
      X,
      D2_count: d2,
      D3_count: d3,
      unresolved_or_ge4_count: other,
      prime_count_in_D2_or_D3: primeInD2orD3,
    });
  }

  out.results.ep374 = {
    description: 'Exact finite counts for D2 and D3 via square-parity signatures up to m<=600.',
    rows,
  };
}

// EP-376: n such that C(2n,n) is coprime to 105.
{
  const N = 2_000_000;
  const milestones = [10_000, 50_000, 100_000, 500_000, 1_000_000, 2_000_000];
  const mset = new Set(milestones);

  let cnt = 0;
  let lastHit = 0;
  let maxGap = 0;
  const first = [];
  const rows = [];

  for (let n = 1; n <= N; n += 1) {
    const ok = noCarryDoubleInBase(n, 3) && noCarryDoubleInBase(n, 5) && noCarryDoubleInBase(n, 7);
    if (ok) {
      cnt += 1;
      if (first.length < 30) first.push(n);
      if (lastHit !== 0) {
        const gap = n - lastHit;
        if (gap > maxGap) maxGap = gap;
      }
      lastHit = n;
    }
    if (mset.has(n)) {
      rows.push({
        X: n,
        count_up_to_X: cnt,
        density: Number((cnt / n).toPrecision(8)),
        max_gap_so_far: maxGap,
      });
    }
  }

  out.results.ep376 = {
    description: 'Finite count of n with C(2n,n) coprime to 3*5*7 (digit/no-carry criterion).',
    first_terms: first,
    rows,
  };
}

// EP-377: f(n)=sum_{p<=n, p not | C(2n,n)} 1/p.
{
  const N = 20_000;
  const primes = primesAll.filter((p) => p <= N);
  const milestones = [1000, 5000, 10000, 15000, 20000];
  const mset = new Set(milestones);
  const rows = [];

  let sumAll = 0;
  let maxF = -1;
  let argMax = -1;

  for (let n = 1; n <= N; n += 1) {
    let f = 0;
    for (const p of primes) {
      if (p > n) break;
      if (noCarryDoubleInBase(n, p)) f += 1 / p;
    }

    sumAll += f;
    if (f > maxF) {
      maxF = f;
      argMax = n;
    }

    if (mset.has(n)) {
      rows.push({
        X: n,
        average_f_up_to_X: Number((sumAll / n).toPrecision(8)),
        max_f_up_to_X: Number(maxF.toPrecision(8)),
        argmax_n_up_to_X: argMax,
      });
    }
  }

  out.results.ep377 = {
    description: 'Finite profile of harmonic sum over primes not dividing C(2n,n).',
    rows,
  };
}

// EP-387: finite interval-divisor profile for C(n,k).
{
  const N = 600;
  const KMAX = 20;
  const cVals = [0.3, 0.4, 0.5];

  let failNK = 0;
  const failC = new Map(cVals.map((c) => [c, 0]));
  let totalPairs = 0;

  let minBestRatio = 1;
  let minBestWitness = null;

  const milestones = [150, 300, 450, 600];
  const rows = [];

  for (let n = 2; n <= N; n += 1) {
    let minRatioAtN = 1;

    for (let k = 1; k <= Math.min(KMAX, n - 1); k += 1) {
      totalPairs += 1;

      const vp = new Map();
      for (const p of primesAll) {
        if (p > n) break;
        const e = vpFact(n, p) - vpFact(k, p) - vpFact(n - k, p);
        if (e > 0) vp.set(p, e);
      }

      function divides(d) {
        let x = d;
        while (x > 1) {
          const p = spf[x];
          let e = 0;
          while (x % p === 0) {
            x = Math.floor(x / p);
            e += 1;
          }
          if ((vp.get(p) || 0) < e) return false;
        }
        return true;
      }

      // Strong interval (n-k, n].
      let hasNK = false;
      for (let d = n; d > n - k; d -= 1) {
        if (divides(d)) {
          hasNK = true;
          break;
        }
      }
      if (!hasNK) failNK += 1;

      // c-interval checks.
      for (const c of cVals) {
        const lo = Math.floor(c * n);
        let hasC = false;
        for (let d = n; d > lo; d -= 1) {
          if (divides(d)) {
            hasC = true;
            break;
          }
        }
        if (!hasC) failC.set(c, failC.get(c) + 1);
      }

      // Best divisor ratio in [1,n].
      let bestD = 1;
      for (let d = n; d >= 1; d -= 1) {
        if (divides(d)) {
          bestD = d;
          break;
        }
      }
      const ratio = bestD / n;
      if (ratio < minRatioAtN) minRatioAtN = ratio;
      if (ratio < minBestRatio) {
        minBestRatio = ratio;
        minBestWitness = { n, k, best_divisor: bestD };
      }
    }

    if (milestones.includes(n)) {
      rows.push({
        n,
        min_best_divisor_ratio_over_k_le_20: Number(minRatioAtN.toPrecision(6)),
      });
    }
  }

  out.results.ep387 = {
    description: 'Finite divisor-in-interval profile for C(n,k), n<=600 and k<=20.',
    total_pairs_checked: totalPairs,
    fail_count_interval_n_minus_k: failNK,
    fail_rates_c_intervals: cVals.map((c) => ({ c, fail_count: failC.get(c), fail_rate: Number((failC.get(c) / totalPairs).toPrecision(6)) })),
    global_min_best_divisor_ratio: Number(minBestRatio.toPrecision(6)),
    global_min_best_divisor_witness: minBestWitness,
    rows,
  };
}

// EP-393: finite search for f(n)=1 proxy via n!=x(x+1); and 3-consecutive-product proxy.
{
  const N1 = 1000;
  const N3 = 200;

  const twoConsecutive = [];
  for (let n = 2; n <= N1; n += 1) {
    const fn = fact[n];
    const D = 1n + 4n * fn;
    if (!isSquareBigInt(D)) continue;
    const r = isqrtBigInt(D);
    if ((r - 1n) % 2n !== 0n) continue;
    const x = (r - 1n) / 2n;
    if (x * (x + 1n) === fn) twoConsecutive.push({ n, x: x.toString() });
  }

  const threeConsecutive = [];
  for (let n = 3; n <= N3; n += 1) {
    const fn = fact[n];
    const x = exactConsecutiveTripleRoot(fn);
    if (x !== null) threeConsecutive.push({ n, x: x.toString() });
  }

  out.results.ep393 = {
    description: 'Finite proxies for small-width interval factorizations of n! using exact consecutive products.',
    search_limits: { N1, N3 },
    two_consecutive_solutions: twoConsecutive,
    three_consecutive_solutions: threeConsecutive,
  };
}

// EP-396: search smallest n for each k with prod_{i=0..k}(n-i) | C(2n,n), finite range.
{
  const N = 8000;
  const KMAX = 8;
  const primes = primesAll.filter((p) => p <= N);

  const firstN = Array(KMAX + 1).fill(null);
  const hitCounts = Array(KMAX + 1).fill(0);

  for (let n = 2; n <= N; n += 1) {
    const vp = new Map();
    for (const p of primes) {
      if (p > n) break;
      const e = vpCentralBinom(n, p);
      if (e > 0) vp.set(p, e);
    }

    const acc = new Map();
    const kLim = Math.min(KMAX, n - 1);

    for (let k = 0; k <= kLim; k += 1) {
      const factors = factorizeInt(n - k, spf);
      for (const [p, e] of factors) acc.set(p, (acc.get(p) || 0) + e);

      let ok = true;
      for (const [p, e] of acc.entries()) {
        if ((vp.get(p) || 0) < e) {
          ok = false;
          break;
        }
      }

      if (ok) {
        hitCounts[k] += 1;
        if (firstN[k] === null) firstN[k] = n;
      }
    }

    let done = true;
    for (let k = 0; k <= KMAX; k += 1) {
      if (firstN[k] === null) {
        done = false;
        break;
      }
    }
    if (done && n > 1000) break;
  }

  out.results.ep396 = {
    description: 'Finite search for divisibility of descending products by C(2n,n), k<=8.',
    search_limit_n: N,
    rows: Array.from({ length: KMAX + 1 }, (_, k) => ({
      k,
      first_n_found: firstN[k],
      hit_count_in_range: hitCounts[k],
    })),
  };
}

const outPath = path.join('data', 'harder_batch11_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
