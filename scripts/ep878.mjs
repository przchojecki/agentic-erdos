#!/usr/bin/env node
import fs from 'fs';

// EP-878 note: statement is malformed in source; we compute from the usable formula core.
const OUT = process.env.OUT || 'data/ep878_standalone_deeper.json';
const X_LIST = [2000, 5000, 10000, 20000];

function factorDistinct(n, spf) {
  const primes = [];
  let x = n;
  let last = 0;
  while (x > 1) {
    const p = spf[x];
    if (p !== last) primes.push(p);
    last = p;
    while (x % p === 0) x /= p;
  }
  return primes;
}

function sieveSPF(N) {
  const spf = new Uint32Array(N + 1);
  for (let i = 2; i <= N; i += 1) if (spf[i] === 0) {
    spf[i] = i;
    if (i * i <= N) for (let j = i * i; j <= N; j += i) if (spf[j] === 0) spf[j] = i;
  }
  return spf;
}

function floorLogBase(n, p) {
  let e = 0;
  let cur = 1;
  while (cur * p <= n) {
    cur *= p;
    e += 1;
  }
  return e;
}

function fValue(n, primes) {
  let s = 0;
  for (const p of primes) {
    const e = floorLogBase(n, p);
    s += p ** e;
  }
  return s;
}

function FProxyExactSmall(n, primes) {
  // Max sum of pairwise-coprime a_i<=n using only primes from factor set.
  // Exact DP over prime-subset masks with one selected number per mask.
  const t = primes.length;
  const maxMask = 1 << t;
  const bestForMask = new Int32Array(maxMask);
  // enumerate all numbers <=n supported on prime subset
  function gen(idx, val, mask) {
    if (idx === t) {
      if (mask !== 0 && val <= n && val > bestForMask[mask]) bestForMask[mask] = val;
      return;
    }
    gen(idx + 1, val, mask);
    let v = val * primes[idx];
    while (v <= n) {
      gen(idx + 1, v, mask | (1 << idx));
      v *= primes[idx];
    }
  }
  gen(0, 1, 0);

  const dp = new Int32Array(maxMask);
  for (let mask = 1; mask < maxMask; mask += 1) {
    let sub = mask;
    while (sub) {
      const cand = bestForMask[sub] + dp[mask ^ sub];
      if (cand > dp[mask]) dp[mask] = cand;
      sub = (sub - 1) & mask;
    }
  }
  return dp[maxMask - 1];
}

const t0 = Date.now();
const rows = [];
for (const X of X_LIST) {
  const spf = sieveSPF(X);
  let maxF = 0;
  let argF = 1;
  let maxf = 0;
  let argf = 1;
  let ratioCount = 0;
  let ratioSum = 0;
  let sampled = 0;

  for (let n = 2; n <= X; n += 1) {
    const ps = factorDistinct(n, spf);
    if (ps.length > 10) continue;
    const fv = fValue(n, ps);
    const Fv = FProxyExactSmall(n, ps);
    if (fv > maxf) { maxf = fv; argf = n; }
    if (Fv > maxF) { maxF = Fv; argF = n; }
    if (fv > 0) {
      ratioSum += Fv / fv;
      ratioCount += 1;
    }
    sampled += 1;
  }
  rows.push({
    X,
    sampled_n_count: sampled,
    max_f_n: maxf,
    argmax_f_n: argf,
    max_Fproxy_n: maxF,
    argmax_Fproxy_n: argF,
    avg_ratio_Fproxy_over_f: Number((ratioSum / Math.max(1, ratioCount)).toPrecision(8)),
  });
}

const out = {
  problem: 'EP-878',
  script: 'ep878.mjs',
  method: 'finite_formula_core_scan_for_f_and_exact_small_F_proxy',
  warning: 'Original statement is malformed in dataset; this uses inferred formula core only.',
  params: { X_LIST },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
