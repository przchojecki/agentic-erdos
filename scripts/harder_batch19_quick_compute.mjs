#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 19:
// EP-825, EP-827, EP-828, EP-829, EP-830,
// EP-840, EP-849, EP-850, EP-856, EP-857.

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

function lcm(a, b) {
  return (a / gcd(a, b)) * b;
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

function factorDistinct(n, spf) {
  const out = [];
  let x = n;
  let prev = 0;
  while (x > 1) {
    const p = spf[x] || x;
    if (p !== prev) out.push(p);
    prev = p;
    while (x % p === 0) x = Math.floor(x / p);
  }
  return out;
}

const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};

// EP-825: weird numbers and abundancy index scan.
{
  const N = 25_000;
  const properDivs = Array.from({ length: N + 1 }, () => []);
  const sigma = new Uint32Array(N + 1);

  for (let d = 1; d <= N; d += 1) {
    for (let m = d; m <= N; m += d) {
      sigma[m] += d;
      if (m !== d) properDivs[m].push(d);
    }
  }

  function canRepresentAsDistinctSum(target, arr) {
    const bits = new Uint8Array(target + 1);
    bits[0] = 1;
    for (const v of arr) {
      for (let s = target; s >= v; s -= 1) {
        if (bits[s - v]) bits[s] = 1;
      }
      if (bits[target]) return true;
    }
    return bits[target] === 1;
  }

  const weirds = [];
  const abundant = [];
  let maxWeirdAbund = 0;

  for (let n = 2; n <= N; n += 1) {
    if (sigma[n] <= 2 * n) continue;
    abundant.push(n);
    const can = canRepresentAsDistinctSum(n, properDivs[n]);
    if (!can) {
      const abund = sigma[n] / n;
      weirds.push({ n, abundancy: abund });
      if (abund > maxWeirdAbund) maxWeirdAbund = abund;
    }
  }

  // Small finite threshold proxy: if sigma(n) > Cn then all representable (within range)
  let bestC = 2;
  for (let Cnum = 201; Cnum <= 800; Cnum += 1) {
    const C = Cnum / 100;
    let ok = true;
    for (const w of weirds) {
      if (w.abundancy > C) {
        ok = false;
        break;
      }
    }
    if (ok) {
      bestC = C;
      break;
    }
  }

  out.results.ep825 = {
    description: 'Finite weird-number abundancy scan and representability threshold proxy.',
    N,
    abundant_count: abundant.length,
    weird_count: weirds.length,
    first_20_weirds: weirds.slice(0, 20).map((x) => x.n),
    max_weird_abundancy_in_range: Number(maxWeirdAbund.toPrecision(8)),
    finite_C_threshold_no_counterexample_above_in_range: bestC,
    note: 'Web status indicates EP-825 solved affirmatively (Larsen); finite scan is consistency check only.',
  };
}

// EP-827: subset with all circumradii distinct.
{
  const rng = makeRng(20260304 ^ 1902);

  function randomGeneralPositionPoints(n, side) {
    while (true) {
      const pts = [];
      const used = new Set();
      while (pts.length < n) {
        const x = Math.floor(rng() * side);
        const y = Math.floor(rng() * side);
        const key = `${x},${y}`;
        if (used.has(key)) continue;
        used.add(key);
        pts.push([x, y]);
      }

      let good = true;
      for (let i = 0; i < n && good; i += 1) {
        for (let j = i + 1; j < n && good; j += 1) {
          for (let k = j + 1; k < n; k += 1) {
            const x1 = pts[i][0];
            const y1 = pts[i][1];
            const x2 = pts[j][0];
            const y2 = pts[j][1];
            const x3 = pts[k][0];
            const y3 = pts[k][1];
            const cross = (x2 - x1) * (y3 - y1) - (y2 - y1) * (x3 - x1);
            if (cross === 0) {
              good = false;
              break;
            }
          }
        }
      }
      if (good) return pts;
    }
  }

  function radiusKey(p1, p2, p3) {
    const a2 = (p2[0] - p3[0]) ** 2 + (p2[1] - p3[1]) ** 2;
    const b2 = (p1[0] - p3[0]) ** 2 + (p1[1] - p3[1]) ** 2;
    const c2 = (p1[0] - p2[0]) ** 2 + (p1[1] - p2[1]) ** 2;
    const cross = Math.abs((p2[0] - p1[0]) * (p3[1] - p1[1]) - (p2[1] - p1[1]) * (p3[0] - p1[0]));
    if (cross === 0) return null;
    let num = a2 * b2 * c2;
    let den = 4 * cross * cross;
    const g = gcd(num, den);
    num /= g;
    den /= g;
    return `${num}/${den}`;
  }

  function bestSubsetSize(pts) {
    const n = pts.length;
    const chosen = [];
    const radSet = new Set();
    let best = 0;

    function dfs(i) {
      if (chosen.length + (n - i) <= best) return;
      if (i === n) {
        if (chosen.length > best) best = chosen.length;
        return;
      }

      // try include i
      const newKeys = [];
      let ok = true;
      for (let a = 0; a < chosen.length && ok; a += 1) {
        for (let b = a + 1; b < chosen.length; b += 1) {
          const key = radiusKey(pts[chosen[a]], pts[chosen[b]], pts[i]);
          if (key === null || radSet.has(key)) {
            ok = false;
            break;
          }
          newKeys.push(key);
        }
      }

      if (ok) {
        for (const k of newKeys) radSet.add(k);
        chosen.push(i);
        dfs(i + 1);
        chosen.pop();
        for (const k of newKeys) radSet.delete(k);
      }

      // skip i
      dfs(i + 1);
    }

    dfs(0);
    return best;
  }

  const rows = [];
  for (const [n, side, samples] of [[10, 36, 8], [12, 44, 6], [13, 52, 5]]) {
    let best = 0;
    let avg = 0;
    for (let t = 0; t < samples; t += 1) {
      const pts = randomGeneralPositionPoints(n, side);
      const b = bestSubsetSize(pts);
      avg += b;
      if (b > best) best = b;
    }
    rows.push({
      n,
      samples,
      best_subset_size_all_circumradii_distinct: best,
      avg_best_subset_size: Number((avg / samples).toPrecision(7)),
      best_over_n: Number((best / n).toPrecision(7)),
    });
  }

  out.results.ep827 = {
    description: 'Finite random-general-position profile for distinct-circumradius subset sizes.',
    rows,
  };
}

// EP-828: counts of n with phi(n) | n+a.
{
  const N = 500_000;
  const phi = new Uint32Array(N + 1);
  for (let i = 0; i <= N; i += 1) phi[i] = i;
  for (let p = 2; p <= N; p += 1) {
    if (phi[p] !== p) continue;
    for (let k = p; k <= N; k += p) {
      phi[k] -= Math.floor(phi[k] / p);
    }
  }

  const rows = [];
  for (const a of [-8, -4, -1, 0, 1, 2, 3, 5, 8, 12]) {
    let cnt = 0;
    const first = [];
    for (let n = 2; n <= N; n += 1) {
      const ph = phi[n];
      const v = n + a;
      if (v % ph === 0) {
        cnt += 1;
        if (first.length < 12) first.push(n);
      }
    }
    rows.push({
      a,
      N,
      count_solutions_n_le_N: cnt,
      first_12_solutions: first,
      density: Number((cnt / N).toPrecision(7)),
    });
  }

  out.results.ep828 = {
    description: 'Finite density/count profile for divisibility phi(n) | n+a across shifts a.',
    rows,
  };
}

// EP-829: representation counts as sum of two cubes.
{
  const LIM = 200_000_000;
  const maxBase = Math.floor(Math.cbrt(LIM));
  const cubes = Array.from({ length: maxBase + 1 }, (_, i) => i ** 3);

  const mp = new Map();
  for (let i = 0; i <= maxBase; i += 1) {
    for (let j = i; j <= maxBase; j += 1) {
      const s = cubes[i] + cubes[j];
      if (s > LIM) break;
      mp.set(s, (mp.get(s) || 0) + 1);
    }
  }

  let bestN = 0;
  let bestR = 0;
  let over1 = 0;
  let over2 = 0;
  let over3 = 0;
  for (const [n, r] of mp.entries()) {
    if (r > bestR) {
      bestR = r;
      bestN = n;
    }
    if (r >= 2) over1 += 1;
    if (r >= 3) over2 += 1;
    if (r >= 4) over3 += 1;
  }

  out.results.ep829 = {
    description: 'Finite map of r(n)=1_A*1_A(n) for cubes up to a large bound.',
    lim_n: LIM,
    max_representation_count_found: bestR,
    argmax_n_found: bestN,
    counts_with_r_at_least_2: over1,
    counts_with_r_at_least_3: over2,
    counts_with_r_at_least_4: over3,
    log_scale_ratio_max_r_over_log_lim: Number((bestR / Math.log(LIM)).toPrecision(7)),
  };
}

// EP-830: amicable pair counting profile.
{
  const N = 400_000;
  const sigma = new Uint32Array(N + 1);
  for (let d = 1; d <= N; d += 1) {
    for (let m = d; m <= N; m += d) sigma[m] += d;
  }

  const amicA = []; // smaller member of pair
  for (let a = 2; a <= N; a += 1) {
    const b = sigma[a] - a;
    if (b <= a || b > N) continue;
    if (sigma[b] - b === a && sigma[a] === a + b && sigma[b] === a + b) amicA.push(a);
  }
  amicA.sort((x, y) => x - y);

  const rows = [];
  for (const x of [10_000, 50_000, 100_000, 200_000, 300_000, 400_000]) {
    let cnt = 0;
    while (cnt < amicA.length && amicA[cnt] <= x) cnt += 1;
    rows.push({
      x,
      A_x_count_amicable_pairs_with_a_le_x: cnt,
      A_x_over_x: Number((cnt / x).toPrecision(7)),
      log_A_over_log_x: cnt > 1 ? Number((Math.log(cnt) / Math.log(x)).toPrecision(7)) : null,
    });
  }

  out.results.ep830 = {
    description: 'Finite counting profile for amicable pairs via direct sigma-sieve verification.',
    rows,
    first_25_amicable_a_values: amicA.slice(0, 25),
  };
}

// EP-840: quasi-Sidon greedy profile.
{
  const rng = makeRng(20260304 ^ 1903);

  function greedyQuasiSidon(N, tau, trials) {
    let best = 0;

    for (let t = 0; t < trials; t += 1) {
      const A = [];
      const sums = new Map();
      const vals = Array.from({ length: N }, (_, i) => i + 1);
      shuffle(vals, rng);

      function currentRatio(nextWith = null) {
        const m = A.length + (nextWith === null ? 0 : 1);
        if (m < 2) return 1;
        const bin = (m * (m - 1)) / 2;
        const distinct = sums.size + (nextWith === null ? 0 : nextWith);
        return distinct / bin;
      }

      for (const x of vals) {
        let newDistinct = 0;
        const touched = [];

        // sums with existing elements (unordered pair i<j proxy; also include x+x to be conservative for A+A)
        for (const a of A) {
          const s = a + x;
          if (!sums.has(s)) {
            newDistinct += 1;
            touched.push(s);
          }
        }
        const d = x + x;
        if (!sums.has(d) && !touched.includes(d)) {
          newDistinct += 1;
          touched.push(d);
        }

        if (currentRatio(newDistinct) >= tau) {
          A.push(x);
          for (const s of touched) sums.set(s, 1);
        }
      }

      if (A.length > best) best = A.length;
    }

    return best;
  }

  const rows = [];
  for (const N of [200, 500, 1000, 2000]) {
    for (const tau of [0.9, 0.95, 0.98]) {
      const best = greedyQuasiSidon(N, tau, 25);
      rows.push({
        N,
        tau_ratio_threshold: tau,
        best_size_found: best,
        best_over_sqrtN: Number((best / Math.sqrt(N)).toPrecision(7)),
      });
    }
  }

  out.results.ep840 = {
    description: 'Greedy finite profile for maximal quasi-Sidon subsets under ratio thresholds.',
    rows,
    note: 'Local metadata has latest_reference_year=2097, likely a typo; web page indicates open status as of 2025 edits.',
  };
}

// EP-849: multiplicity profile for binomial values.
{
  const NMAX = 600;
  const map = new Map();

  for (let n = 1; n <= NMAX; n += 1) {
    let c = 1n;
    for (let k = 1; k <= Math.floor(n / 2); k += 1) {
      c = (c * BigInt(n - k + 1)) / BigInt(k);
      const key = c.toString();
      map.set(key, (map.get(key) || 0) + 1);
    }
  }

  let maxMult = 0;
  const top = [];
  for (const [a, m] of map.entries()) {
    if (m > maxMult) maxMult = m;
    if (m >= 4) top.push({ a, m });
  }
  top.sort((x, y) => y.m - x.m || (x.a.length - y.a.length)).slice(0, 30);

  const countByT = {};
  for (const m of map.values()) {
    countByT[m] = (countByT[m] || 0) + 1;
  }

  out.results.ep849 = {
    description: 'Finite multiplicity scan for values appearing as binomial coefficients.',
    NMAX,
    max_multiplicity_found: maxMult,
    counts_of_values_by_multiplicity: countByT,
    sample_values_with_multiplicity_at_least_4: top.slice(0, 20),
  };
}

// EP-850: search for equal-prime-support triples at shifts 0,1,2.
{
  const X = 200_000;
  const spf = sieveSPF(X + 3);

  const sig = Array(X + 3).fill('');
  for (let n = 2; n <= X + 2; n += 1) {
    sig[n] = factorDistinct(n, spf).join('.');
  }

  const mp = new Map();
  const hits = [];

  for (let x = 2; x <= X; x += 1) {
    const key = `${sig[x]}|${sig[x + 1]}|${sig[x + 2]}`;
    if (!mp.has(key)) mp.set(key, []);
    const arr = mp.get(key);
    for (const y of arr) {
      if (y !== x) hits.push({ x: y, y: x });
      if (hits.length >= 20) break;
    }
    if (hits.length >= 20) break;
    arr.push(x);
  }

  out.results.ep850 = {
    description: 'Finite collision scan for Erdos-Woods prime-support pattern across x,x+1,x+2.',
    X,
    collision_count_found: hits.length,
    collisions_sample: hits,
    contains_known_75_1215_pair: hits.some((h) => h.x === 75 && h.y === 1215),
  };
}

// EP-856: greedy harmonic-sum maximization under no-k-equal-pairwise-lcm constraint.
{
  function greedyFk(N, k) {
    const A = [];

    for (let x = 1; x <= N; x += 1) {
      let ok = true;

      if (k === 3) {
        for (let i = 0; i < A.length && ok; i += 1) {
          for (let j = i + 1; j < A.length; j += 1) {
            const l1 = lcm(A[i], A[j]);
            const l2 = lcm(A[i], x);
            const l3 = lcm(A[j], x);
            if (l1 === l2 && l2 === l3) {
              ok = false;
              break;
            }
          }
        }
      } else if (k === 4) {
        for (let i = 0; i < A.length && ok; i += 1) {
          for (let j = i + 1; j < A.length && ok; j += 1) {
            for (let t = j + 1; t < A.length; t += 1) {
              const vals = [A[i], A[j], A[t], x];
              let target = null;
              let allSame = true;
              for (let u = 0; u < 4 && allSame; u += 1) {
                for (let v = u + 1; v < 4; v += 1) {
                  const ll = lcm(vals[u], vals[v]);
                  if (target === null) target = ll;
                  else if (ll !== target) {
                    allSame = false;
                    break;
                  }
                }
              }
              if (allSame) {
                ok = false;
                break;
              }
            }
          }
        }
      }

      if (ok) A.push(x);
    }

    let h = 0;
    for (const a of A) h += 1 / a;
    return { size: A.length, harmonic: h };
  }

  const rows = [];
  for (const N of [120, 200, 320, 500]) {
    for (const k of [3, 4]) {
      const g = greedyFk(N, k);
      rows.push({
        k,
        N,
        greedy_set_size: g.size,
        greedy_harmonic_sum: Number(g.harmonic.toPrecision(7)),
        over_logN: Number((g.harmonic / Math.log(N)).toPrecision(7)),
      });
    }
  }

  out.results.ep856 = {
    description: 'Finite greedy harmonic-sum profile under no-k-subset equal pairwise-lcm constraint.',
    rows,
  };
}

// EP-857: 3-sunflower-free family size via greedy random construction.
{
  const rng = makeRng(20260304 ^ 1904);

  function isSunflower3(a, b, c) {
    const core = a & b & c;
    return (a & b) === core && (a & c) === core && (b & c) === core;
  }

  function greedyFamily(n, restarts) {
    const total = 1 << n;
    const all = Array.from({ length: total }, (_, i) => i);
    let best = 0;

    for (let r = 0; r < restarts; r += 1) {
      const order = [...all];
      shuffle(order, rng);
      const F = [];

      for (const s of order) {
        let ok = true;
        for (let i = 0; i < F.length && ok; i += 1) {
          for (let j = i + 1; j < F.length; j += 1) {
            if (isSunflower3(F[i], F[j], s)) {
              ok = false;
              break;
            }
          }
        }
        if (ok) F.push(s);
      }

      if (F.length > best) best = F.length;
    }

    return best;
  }

  const rows = [];
  const base = 3 / (2 ** (2 / 3));
  for (const [n, restarts] of [[7, 60], [8, 50], [9, 40], [10, 30]]) {
    const best = greedyFamily(n, restarts);
    rows.push({
      n,
      restarts,
      best_3sunflower_free_family_size_found: best,
      ratio_over_base_pow_n: Number((best / (base ** n)).toPrecision(7)),
      ratio_over_2_pow_n: Number((best / (2 ** n)).toPrecision(7)),
    });
  }

  out.results.ep857 = {
    description: 'Greedy random lower-bound profile for weak-sunflower-free families (k=3).',
    rows,
  };
}

const outPath = path.join('data', 'harder_batch19_quick_compute.json');
fs.writeFileSync(outPath, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify({ outPath }, null, 2));
