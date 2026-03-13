#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function modPow(a, e, m) {
  let base = a % m;
  let exp = e;
  let res = 1n;
  while (exp > 0n) {
    if (exp & 1n) res = (res * base) % m;
    base = (base * base) % m;
    exp >>= 1n;
  }
  return res;
}

function isPrime(n) {
  if (n < 2n) return false;
  for (const p of [2n, 3n, 5n, 7n, 11n, 13n, 17n, 19n, 23n, 29n, 31n, 37n]) {
    if (n === p) return true;
    if (n % p === 0n) return false;
  }

  let d = n - 1n;
  let s = 0;
  while ((d & 1n) === 0n) {
    d >>= 1n;
    s += 1;
  }

  for (const a0 of [2n, 325n, 9375n, 28178n, 450775n, 9780504n, 1795265022n]) {
    if (a0 % n === 0n) continue;
    let x = modPow(a0, d, n);
    if (x === 1n || x === n - 1n) continue;
    let witness = true;
    for (let r = 1; r < s; r += 1) {
      x = (x * x) % n;
      if (x === n - 1n) {
        witness = false;
        break;
      }
    }
    if (witness) return false;
  }
  return true;
}

function smallestPrimeOneMod(p, maxSteps) {
  if (p === 2n) return 3n;
  let t = 1n;
  let steps = 0;
  while (steps < maxSteps) {
    const cand = p * t + 1n;
    if ((cand & 1n) === 1n && isPrime(cand)) return cand;
    t += 1n;
    steps += 1;
  }
  return null;
}

function runGreedyChain(start, maxK, maxStepsPerEdge) {
  const rows = [];
  let p = BigInt(start);
  rows.push({
    k: 1,
    p_k: p.toString(),
    p_k_pow_1_over_k: Number((Number(p) ** 1).toPrecision(8)),
  });

  for (let k = 2; k <= maxK; k += 1) {
    const nxt = smallestPrimeOneMod(p, maxStepsPerEdge);
    if (nxt === null) {
      rows.push({
        k,
        stopped: true,
        reason: `no prime of form 1 mod ${p.toString()} in first ${maxStepsPerEdge} steps`,
      });
      break;
    }
    p = nxt;
    const root = Math.exp(Math.log(Number(p)) / k);
    rows.push({
      k,
      p_k: p.toString(),
      p_k_pow_1_over_k: Number(root.toPrecision(8)),
      log_p_k_over_k_log_k: k >= 2 ? Number((Math.log(Number(p)) / (k * Math.log(k))).toPrecision(8)) : null,
    });
    if (p > 10n ** 15n) break;
  }

  return rows;
}

const t0 = Date.now();
const maxStartPrime = Number(process.env.MAX_START_PRIME || 13);
const starts = [];
const primeSeedBound = Math.max(2, maxStartPrime);
for (let x = 2; x <= primeSeedBound; x += 1) {
  if (isPrime(BigInt(x))) starts.push(x);
}
const maxK = Number(process.env.MAX_K || 12);
const maxStepsPerEdge = Number(process.env.MAX_STEPS_PER_EDGE || 400000);

const chains = starts.map((s) => ({ start_prime: s, rows: runGreedyChain(s, maxK, maxStepsPerEdge) }));

const maximaByK = [];
for (let k = 1; k <= maxK; k += 1) {
  let best = null;
  for (const ch of chains) {
    const row = ch.rows.find((r) => r.k === k && r.p_k_pow_1_over_k != null);
    if (!row) continue;
    if (!best || row.p_k_pow_1_over_k > best.p_k_pow_1_over_k) {
      best = { k, start_prime: ch.start_prime, p_k: row.p_k, p_k_pow_1_over_k: row.p_k_pow_1_over_k };
    }
  }
  if (best) maximaByK.push(best);
}

const out = {
  problem: 'EP-695',
  script: path.basename(process.argv[1]),
  method: 'greedy_prime_chain_growth_multi_start',
  params: { starts, maxK, maxStepsPerEdge },
  chains,
  maxima_by_k: maximaByK,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
