#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 23:
// EP-1052, EP-1053, EP-1054, EP-1055, EP-1056,
// EP-1057, EP-1059, EP-1060, EP-1061, EP-1062.

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

function distinctPrimeFactors(n, spf) {
  const out = [];
  let x = n;
  while (x > 1) {
    const p = spf[x] || x;
    out.push(p);
    while (x % p === 0) x = Math.floor(x / p);
  }
  return out;
}

function factorPrimePowers(n, spf) {
  const out = [];
  let x = n;
  while (x > 1) {
    const p = spf[x] || x;
    let e = 0;
    while (x % p === 0) {
      x = Math.floor(x / p);
      e += 1;
    }
    out.push([p, e]);
  }
  return out;
}

function divisorsSorted(n, spf) {
  const fac = factorPrimePowers(n, spf);
  let divs = [1];
  for (const [p, e] of fac) {
    const cur = [];
    let pe = 1;
    for (let i = 0; i <= e; i += 1) {
      for (const d of divs) cur.push(d * pe);
      pe *= p;
    }
    divs = cur;
  }
  divs.sort((a, b) => a - b);
  return divs;
}

function divisorSums(limit) {
  const sigma = new Float64Array(limit + 1);
  for (let d = 1; d <= limit; d += 1) {
    for (let m = d; m <= limit; m += d) sigma[m] += d;
  }
  return sigma;
}

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

const SPF_LIMIT = 2_000_000;
const spf = sieveSPF(SPF_LIMIT);

const SIGMA_LIMIT = 1_000_000;
const sigma = divisorSums(SIGMA_LIMIT);

// EP-1052: finite scan for unitary perfect numbers.
{
  const N = 2_000_000;
  const hits = [];
  let oddHitCount = 0;

  for (let n = 2; n <= N; n += 1) {
    let x = n;
    let sigmaStar = 1;
    while (x > 1) {
      const p = spf[x] || x;
      let pe = 1;
      while (x % p === 0) {
        x = Math.floor(x / p);
        pe *= p;
      }
      sigmaStar *= pe + 1;
    }
    if (sigmaStar === 2 * n) {
      hits.push(n);
      if (n % 2 === 1) oddHitCount += 1;
    }
  }

  out.results.ep1052 = {
    description: 'Finite unitary-perfect scan via sigma*(n)=prod(p^a+1).',
    N,
    unitary_perfect_hits_up_to_N: hits,
    odd_hits_count: oddHitCount,
    hit_count: hits.length,
  };
}

// EP-1053: finite profile of multiply-perfect multipliers k = sigma(n)/n.
{
  const N = 1_000_000;
  const topByK = new Map();
  const probes = new Set([100_000, 300_000, 600_000, 1_000_000]);
  const probeRows = [];
  let runningMaxK = 0;
  let argAtMax = 1;
  let countKge3 = 0;

  for (let n = 2; n <= N; n += 1) {
    const s = sigma[n];
    if (s % n !== 0) {
      if (probes.has(n)) {
        probeRows.push({
          n,
          running_max_k: runningMaxK,
          n_attaining_running_max_k: argAtMax,
          count_k_ge_3_up_to_n: countKge3,
        });
      }
      continue;
    }
    const k = s / n;
    if (k > runningMaxK) {
      runningMaxK = k;
      argAtMax = n;
    }
    if (k >= 3) countKge3 += 1;
    const prev = topByK.get(k);
    if (!prev || n > prev.max_n) topByK.set(k, { max_n: n, sample: prev ? prev.sample : [] });
    if (topByK.get(k).sample.length < 4) topByK.get(k).sample.push(n);

    if (probes.has(n)) {
      probeRows.push({
        n,
        running_max_k: runningMaxK,
        n_attaining_running_max_k: argAtMax,
        count_k_ge_3_up_to_n: countKge3,
      });
    }
  }

  const topKRows = [...topByK.entries()]
    .sort((a, b) => b[0] - a[0])
    .slice(0, 8)
    .map(([k, v]) => ({ k, max_n_with_this_k_up_to_N: v.max_n, sample_n: v.sample }));

  out.results.ep1053 = {
    description: 'Finite scan of integer multipliers k with sigma(n)=k*n.',
    N,
    probe_rows: probeRows,
    top_k_rows: topKRows,
  };
}

// EP-1054: bounded computation of f(n)-style representability via smallest divisors.
{
  const N_TARGET = 700;
  const M_MAX = 20_000;
  const best = new Int32Array(N_TARGET + 1);
  best.fill(0);

  for (let m = 1; m <= M_MAX; m += 1) {
    const divs = divisorsSorted(m, spf);
    let pref = 0;
    for (const d of divs) {
      pref += d;
      if (pref > N_TARGET) break;
      if (best[pref] === 0 || m < best[pref]) best[pref] = m;
    }
  }

  const probes = [6, 10, 20, 50, 100, 200, 400, 700];
  const probeRows = probes.map((n) => ({
    n,
    best_m_found: best[n] || null,
    ratio_m_over_n: best[n] ? Number((best[n] / n).toPrecision(7)) : null,
  }));

  const unresolved = [];
  for (let n = 1; n <= N_TARGET; n += 1) if (best[n] === 0) unresolved.push(n);

  let maxRatio = 0;
  let argN = -1;
  for (let n = 6; n <= N_TARGET; n += 1) {
    if (best[n] === 0) continue;
    const r = best[n] / n;
    if (r > maxRatio) {
      maxRatio = r;
      argN = n;
    }
  }

  out.results.ep1054 = {
    description: 'Bounded search for minimal m where n is a prefix sum of sorted divisors of m.',
    N_TARGET,
    M_MAX,
    unresolved_n_up_to_target_under_MMAX: unresolved,
    probe_rows: probeRows,
    max_ratio_m_over_n_found: Number(maxRatio.toPrecision(7)),
    n_attaining_max_ratio: argN,
  };
}

// EP-1055: finite class recursion profile for primes.
{
  const LIMIT = 1_000_000;
  const primes = [];
  for (let p = 2; p <= LIMIT; p += 1) if (spf[p] === p) primes.push(p);

  const cls = new Map();
  const firstPrime = new Map();
  const counts = new Map();

  for (const p of primes) {
    const facts = distinctPrimeFactors(p + 1, spf);
    let c;
    if (facts.every((q) => q === 2 || q === 3)) {
      c = 1;
    } else {
      let mx = 0;
      for (const q of facts) {
        if (q === 2 || q === 3) continue;
        const cq = cls.get(q) || 0;
        if (cq > mx) mx = cq;
      }
      c = mx + 1;
    }
    cls.set(p, c);
    if (!firstPrime.has(c)) firstPrime.set(c, p);
    counts.set(c, (counts.get(c) || 0) + 1);
  }

  const classes = [...firstPrime.entries()]
    .sort((a, b) => a[0] - b[0])
    .slice(0, 12)
    .map(([c, p]) => ({ class: c, first_prime: p, p_to_1_over_class: Number((p ** (1 / c)).toPrecision(7)) }));

  const countRows = [...counts.entries()]
    .sort((a, b) => a[0] - b[0])
    .map(([c, cnt]) => ({ class: c, prime_count_up_to_limit: cnt }))
    .slice(0, 12);

  out.results.ep1055 = {
    description: 'Finite recursive prime-class computation based on prime factors of p+1.',
    LIMIT,
    first_primes_by_class: classes,
    class_population_rows: countRows,
    max_class_seen: Math.max(...counts.keys()),
  };
}

// EP-1056: search for consecutive-interval product == 1 (mod p).
{
  const PRIMES_MAX = 400;
  const primes = [];
  for (let p = 2; p <= PRIMES_MAX; p += 1) if (spf[p] === p) primes.push(p);

  const rows = [];
  const kMaxByPrime = [];

  for (const p of primes) {
    if (p < 5) continue;
    const pref = new Int32Array(p);
    pref[0] = 1 % p;
    for (let i = 1; i < p; i += 1) pref[i] = (pref[i - 1] * i) % p;

    const pos = new Map();
    for (let i = 0; i < p; i += 1) {
      const v = pref[i];
      if (!pos.has(v)) pos.set(v, []);
      pos.get(v).push(i);
    }

    let bestList = [];
    for (const lst of pos.values()) if (lst.length > bestList.length) bestList = lst;
    const kMax = Math.max(0, bestList.length - 1);
    kMaxByPrime.push({ p, kMax });

    if (kMax >= 2 && rows.length < 10) {
      const intervals = [];
      for (let i = 1; i <= Math.min(kMax, 4); i += 1) {
        intervals.push([bestList[i - 1] + 1, bestList[i]]);
      }
      rows.push({
        p,
        max_k_found_from_prefix_collisions: kMax,
        sample_intervals_first_four: intervals,
      });
    }
  }

  const firstRows = [];
  for (let k = 2; k <= 7; k += 1) {
    const hit = kMaxByPrime.find((r) => r.kMax >= k);
    if (hit) firstRows.push({ k, first_prime_with_detected_solution_of_size_at_least_k: hit.p });
  }

  out.results.ep1056 = {
    description: 'Finite prefix-factorial collision search for consecutive-interval product congruent to 1 mod p.',
    PRIMES_MAX,
    sample_rows: rows,
    first_prime_by_detected_k: firstRows,
  };
}

// EP-1057: Carmichael counting profile.
{
  const X = 1_000_000;
  const probes = new Set([100_000, 200_000, 400_000, 700_000, 1_000_000]);
  const rows = [];
  const samples = [];
  let count = 0;

  for (let n = 3; n <= X; n += 1) {
    if (spf[n] === n) {
      if (probes.has(n)) {
        rows.push({
          x: n,
          C_x: count,
          C_over_x: Number((count / n).toPrecision(7)),
          logC_over_logx: count > 1 ? Number((Math.log(count) / Math.log(n)).toPrecision(7)) : 0,
        });
      }
      continue;
    }

    let x = n;
    let sqfree = true;
    const facts = [];
    while (x > 1) {
      const p = spf[x] || x;
      let e = 0;
      while (x % p === 0) {
        x = Math.floor(x / p);
        e += 1;
      }
      if (e > 1) {
        sqfree = false;
        break;
      }
      facts.push(p);
    }
    if (!sqfree || facts.length < 3) {
      if (probes.has(n)) {
        rows.push({
          x: n,
          C_x: count,
          C_over_x: Number((count / n).toPrecision(7)),
          logC_over_logx: count > 1 ? Number((Math.log(count) / Math.log(n)).toPrecision(7)) : 0,
        });
      }
      continue;
    }

    let ok = true;
    for (const p of facts) {
      if ((n - 1) % (p - 1) !== 0) {
        ok = false;
        break;
      }
    }
    if (ok) {
      count += 1;
      if (samples.length < 20) samples.push(n);
    }

    if (probes.has(n)) {
      rows.push({
        x: n,
        C_x: count,
        C_over_x: Number((count / n).toPrecision(7)),
        logC_over_logx: count > 1 ? Number((Math.log(count) / Math.log(n)).toPrecision(7)) : 0,
      });
    }
  }

  out.results.ep1057 = {
    description: 'Finite Carmichael count using Korselt criterion (squarefree + p-1 | n-1 for all p|n).',
    X,
    rows,
    first_carmichael_numbers_in_scan: samples,
  };
}

// EP-1059: finite prime scan for p-k! all composite.
{
  const P_MAX = 1_000_000;
  const facts = [];
  let f = 1;
  for (let k = 1; k <= 12; k += 1) {
    f *= k;
    if (f >= P_MAX) break;
    facts.push({ k, value: f });
  }

  const hits = [];
  const probeRows = [];
  let cnt = 0;
  const probes = new Set([100_000, 300_000, 600_000, 1_000_000]);

  for (let p = 2; p <= P_MAX; p += 1) {
    if (spf[p] !== p) {
      if (probes.has(p)) probeRows.push({ x: p, count_hits_up_to_x: cnt });
      continue;
    }

    let good = true;
    for (const { value } of facts) {
      if (value >= p) break;
      const q = p - value;
      if (q <= 3 || spf[q] === q) {
        good = false;
        break;
      }
    }
    if (good) {
      cnt += 1;
      if (hits.length < 40) hits.push(p);
    }
    if (probes.has(p)) probeRows.push({ x: p, count_hits_up_to_x: cnt });
  }

  out.results.ep1059 = {
    description: 'Finite prime search for p where p-k! is composite for every factorial below p.',
    P_MAX,
    factorials_used: facts,
    first_hits: hits,
    probe_rows: probeRows,
  };
}

// EP-1060: multiplicity profile for values n = k * sigma(k).
{
  const K = 300_000;
  const cnt = new Map();
  let maxMult = 0;
  let argN = null;

  for (let k = 1; k <= K; k += 1) {
    const n = k * sigma[k];
    const c = (cnt.get(n) || 0) + 1;
    cnt.set(n, c);
    if (c > maxMult) {
      maxMult = c;
      argN = n;
    }
  }

  const top = [...cnt.entries()]
    .sort((a, b) => b[1] - a[1] || a[0] - b[0])
    .slice(0, 12)
    .map(([n, c]) => ({ n, multiplicity: c }));

  let maxSmall = 0;
  for (const [n, c] of cnt.entries()) if (n <= 65536 && c > maxSmall) maxSmall = c;

  out.results.ep1060 = {
    description: 'Finite multiplicity profile of the map k -> k*sigma(k).',
    K,
    max_multiplicity_found: maxMult,
    first_n_at_max_multiplicity: argN,
    max_multiplicity_for_n_le_2_pow_16: maxSmall,
    top_rows: top,
  };
}

// EP-1061: finite count of sigma(a)+sigma(b)=sigma(a+b), unordered pairs.
{
  const X = 12_000;
  const probes = new Set([2_000, 4_000, 6_000, 8_000, 10_000, 12_000]);
  let total = 0;
  const rows = [];

  for (let c = 2; c <= X; c += 1) {
    const target = sigma[c];
    for (let a = 1; a <= Math.floor((c - 1) / 2); a += 1) {
      const b = c - a;
      if (sigma[a] + sigma[b] === target) total += 1;
    }
    if (probes.has(c)) {
      rows.push({
        x: c,
        unordered_solution_count_up_to_x: total,
        count_over_x: Number((total / c).toPrecision(7)),
      });
    }
  }

  out.results.ep1061 = {
    description: 'Finite count profile for sigma(a)+sigma(b)=sigma(a+b) with a+b<=x (unordered pairs a<b).',
    X,
    rows,
  };
}

// EP-1062: exact small-n optimisation by branch-and-bound.
{
  function exactF(n) {
    const divisors = Array.from({ length: n + 1 }, () => []);
    for (let d = 1; d <= n; d += 1) {
      for (let m = 2 * d; m <= n; m += d) divisors[m].push(d);
    }

    const selected = new Uint8Array(n + 1);
    const multCnt = new Int16Array(n + 1);
    let best = 0;

    function dfs(i, cur) {
      if (i === 0) {
        if (cur > best) best = cur;
        return;
      }
      if (cur + i <= best) return;

      let canTake = multCnt[i] <= 1;
      if (canTake) {
        for (const d of divisors[i]) {
          if (selected[d] && multCnt[d] >= 1) {
            canTake = false;
            break;
          }
        }
      }

      if (canTake) {
        selected[i] = 1;
        for (const d of divisors[i]) multCnt[d] += 1;
        dfs(i - 1, cur + 1);
        for (const d of divisors[i]) multCnt[d] -= 1;
        selected[i] = 0;
      }
      dfs(i - 1, cur);
    }

    dfs(n, 0);
    return best;
  }

  const rows = [];
  for (const n of [18, 20, 22, 24, 26, 28, 30, 32]) {
    const f = exactF(n);
    rows.push({
      n,
      exact_f_n: f,
      ratio_f_over_n: Number((f / n).toPrecision(7)),
      benchmark_two_thirds_n: Number(((2 * n) / 3).toPrecision(7)),
    });
  }

  out.results.ep1062 = {
    description: 'Exact small-n optimisation for sets with no element dividing two others in the set.',
    rows,
  };
}

const outPath = path.join('data', 'harder_batch23_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
