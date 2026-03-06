#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function firstPrimes(k) {
  const out = [];
  let n = 2;
  while (out.length < k) {
    let ok = true;
    for (let d = 2; d * d <= n; d += 1) {
      if (n % d === 0) {
        ok = false;
        break;
      }
    }
    if (ok) out.push(n);
    n += 1;
  }
  return out;
}

function primorial(primes, k) {
  let v = 1;
  for (let i = 0; i < k; i += 1) v *= primes[i];
  return v;
}

function exactGapScanForPrimorial(nk, primeFactors) {
  const blocked = new Uint8Array(nk + 1);
  blocked[0] = 1;
  for (const p of primeFactors) {
    for (let j = p; j <= nk; j += p) blocked[j] = 1;
  }

  let phi = 0;
  let prev = -1;
  let gapCount = 0;
  let maxGap = 0;
  const evenPresent = new Set();
  for (let x = 1; x <= nk - 1; x += 1) {
    if (blocked[x]) continue;
    phi += 1;
    if (prev !== -1) {
      const g = x - prev;
      gapCount += 1;
      if (g > maxGap) maxGap = g;
      if (g % 2 === 0) evenPresent.add(g);
    }
    prev = x;
  }

  const missingEven = [];
  for (let t = 2; t <= maxGap; t += 2) if (!evenPresent.has(t)) missingEven.push(t);
  return {
    phi_nk: phi,
    gap_count: gapCount,
    max_gap: maxGap,
    represented_even_gap_count_up_to_max: evenPresent.size,
    missing_even_gaps_up_to_max: missingEven,
    first_missing_even_gap: missingEven.length ? missingEven[0] : null,
  };
}

function guaranteedMaxEvenGap(primesK) {
  const pK = primesK[primesK.length - 1];
  let bestT = 0;
  for (let t = 2; t <= 10 * primesK.length; t += 2) {
    const need = t / 2 - 1;
    let have = 0;
    for (const p of primesK) if (p > t) have += 1;
    const cond1 = have >= need;
    const cond2 = pK - 2 > t;
    if (cond1 && cond2) bestT = t;
  }
  return bestT;
}

function egcd(a, b) {
  if (b === 0n) return [a, 1n, 0n];
  const [g, x1, y1] = egcd(b, a % b);
  return [g, y1, x1 - (a / b) * y1];
}

function modInv(a, m) {
  const [g, x] = egcd(a, m);
  if (g !== 1n) return null;
  return ((x % m) + m) % m;
}

function crtCombine(a, m, b, p) {
  const inv = modInv(m % p, p);
  if (inv === null) return null;
  const delta = ((b - (a % p)) % p + p) % p;
  const t = (delta * inv) % p;
  const x = a + m * t;
  return [x % (m * p), m * p];
}

function residueMod(x, p) {
  return Number(((x % BigInt(p)) + BigInt(p)) % BigInt(p));
}

function isCoprimeToAll(x, primes) {
  for (const p of primes) if (residueMod(x, p) === 0) return false;
  return true;
}

function constructWitness(primesK, t) {
  if (t % 2 !== 0 || t < 2) return { ok: false, reason: 't_not_even' };
  const need = t / 2 - 1;
  const used = [];
  for (const p of primesK) if (p > t && used.length < need) used.push(p);
  if (used.length < need) return { ok: false, reason: 'insufficient_large_primes' };

  const usedSet = new Set(used);
  const assign = new Map();
  for (let i = 1; i <= need; i += 1) {
    const q = used[i - 1];
    assign.set(q, ((-2 * i) % q + q) % q);
  }
  for (const p of primesK) {
    if (assign.has(p)) continue;
    const forbid1 = 0;
    const forbid2 = ((-t % p) + p) % p;
    let chosen = -1;
    for (let r = 0; r < p; r += 1) {
      if (r !== forbid1 && r !== forbid2) {
        chosen = r;
        break;
      }
    }
    if (chosen < 0) return { ok: false, reason: 'no_residue_choice' };
    assign.set(p, chosen);
  }

  let x = 0n;
  let m = 1n;
  for (const p of primesK) {
    const next = crtCombine(x, m, BigInt(assign.get(p)), BigInt(p));
    if (!next) return { ok: false, reason: 'crt_failure' };
    [x, m] = next;
  }
  const nk = m;
  if (!(x >= 1n && x + BigInt(t) <= nk - 1n)) return { ok: false, reason: 'wrap' };
  if (!isCoprimeToAll(x, primesK) || !isCoprimeToAll(x + BigInt(t), primesK)) {
    return { ok: false, reason: 'endpoint_not_coprime' };
  }
  for (let s = 1; s < t; s += 1) {
    if (isCoprimeToAll(x + BigInt(s), primesK)) return { ok: false, reason: 'interior_coprime_found' };
  }
  return { ok: true, x: x.toString(), x_plus_t: (x + BigInt(t)).toString() };
}

const N_LIMIT = Number(process.env.N_LIMIT || 223092870);
const KMAX_PROFILE = Number(process.env.KMAX_PROFILE || 700);
const K_MIN_WITNESS = Number(process.env.K_MIN_WITNESS || 8);
const K_MAX_WITNESS = Number(process.env.K_MAX_WITNESS || 420);
const T_MAX_WITNESS = Number(process.env.T_MAX_WITNESS || 300);
const OUT = process.env.OUT || '';

const t0 = Date.now();

const primesForProfile = firstPrimes(KMAX_PROFILE);
const exactRows = [];
for (let k = 1; k <= KMAX_PROFILE; k += 1) {
  const nk = primorial(primesForProfile, k);
  if (nk > N_LIMIT) break;
  const factors = primesForProfile.slice(0, k);
  const scan = exactGapScanForPrimorial(nk, factors);
  exactRows.push({
    k,
    n_k: nk,
    prime_factors: factors,
    ...scan,
  });
}

const profileRows = [];
for (let k = 4; k <= KMAX_PROFILE; k += 1) {
  const ps = primesForProfile.slice(0, k);
  const tMax = guaranteedMaxEvenGap(ps);
  profileRows.push({
    k,
    p_k: ps[ps.length - 1],
    guaranteed_max_even_gap: tMax,
    guaranteed_even_gaps_count: Math.floor(tMax / 2),
  });
}

const witnessRows = [];
for (let k = K_MIN_WITNESS; k <= K_MAX_WITNESS; k += 1) {
  const ps = primesForProfile.slice(0, k);
  const row = { k, checks: [] };
  const tTop = Math.min(T_MAX_WITNESS, 2 * k);
  for (let t = 2; t <= tTop; t += 2) {
    const w = constructWitness(ps, t);
    row.checks.push({
      t,
      ok: w.ok,
      reason: w.ok ? null : w.reason,
      witness: w.ok ? { x: w.x, x_plus_t: w.x_plus_t } : null,
    });
  }
  const okCount = row.checks.filter((c) => c.ok).length;
  row.ok_count = okCount;
  row.total = row.checks.length;
  witnessRows.push(row);
}

const k6 = exactRows.find((r) => r.k === 6) || null;
const out = {
  problem: 'EP-854',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_exact_primorial_gap_scan_plus_constructive_coverage_profile',
  params: { N_LIMIT, KMAX_PROFILE },
  exact_scan_rows: exactRows,
  k6_historical_subconjecture_disproof_check: k6
    ? {
        n6: k6.n_k,
        max_gap: k6.max_gap,
        missing_even_gaps_up_to_max: k6.missing_even_gaps_up_to_max,
        historical_subconjecture_all_even_up_to_max: k6.missing_even_gaps_up_to_max.length === 0,
      }
    : null,
  constructive_profile_rows: profileRows,
  constructive_witness_sweep_rows: witnessRows,
  runtime_seconds: Number(((Date.now() - t0) / 1000).toFixed(3)),
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
