#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-68: S = sum_{n>=2} 1/(n! - 1).
// Compute exact partial sum S_N = A/B, use rigorous tail bound
//   0 < S - S_N < 6/(N+1)!,
// then test whether any rational p/q with q <= Q can lie in this interval.

const N = Number(process.env.N || 22);
const QMAX = Number(process.env.QMAX || 1_000_000);

function gcd(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function addFrac(aNum, aDen, bNum, bDen) {
  const num = aNum * bDen + bNum * aDen;
  const den = aDen * bDen;
  const g = gcd(num, den);
  return [num / g, den / g];
}

function factorial(n) {
  let f = 1n;
  for (let i = 2n; i <= BigInt(n); i += 1n) f *= i;
  return f;
}

function absBig(x) {
  return x < 0n ? -x : x;
}

function fracToDecimalString(num, den, digits = 12) {
  const intPart = num / den;
  let rem = num % den;
  let frac = '';
  for (let i = 0; i < digits; i += 1) {
    rem *= 10n;
    const d = rem / den;
    frac += d.toString();
    rem %= den;
    if (rem === 0n) break;
  }
  return frac.length > 0 ? `${intPart.toString()}.${frac}` : intPart.toString();
}

// Build exact S_N.
let num = 0n;
let den = 1n;
let fact = 1n;
for (let n = 2; n <= N; n += 1) {
  fact *= BigInt(n);
  const termDen = fact - 1n;
  [num, den] = addFrac(num, den, 1n, termDen);
}

const factN1 = fact * BigInt(N + 1);
const tailNum = 6n;
const tailDen = factN1;

// interval: (num/den, num/den + tailNum/tailDen)
let witness = null;
let best = null;

for (let q = 1; q <= QMAX; q += 1) {
  const qBig = BigInt(q);
  const aTimesQ = num * qBig;

  // nearest integer candidates to aTimesQ/den
  const p0 = aTimesQ / den;
  const cand = [p0 - 1n, p0, p0 + 1n];

  for (const p of cand) {
    if (p < 0n) continue;
    const diffNum = absBig(aTimesQ - den * p); // numerator of |num/den - p/q|
    // check diffNum/(den*q) <= tailNum/tailDen
    const lhs = diffNum * tailDen;
    const rhs = tailNum * den * qBig;
    if (lhs <= rhs) {
      witness = { q, p: p.toString(), diff_num: diffNum.toString() };
      break;
    }
    // Track best approximation observed in normalized ratio lhs/rhs.
    // smaller is better.
    if (!best || lhs < best.lhs) {
      best = { q, p: p.toString(), lhs, rhs, diff_num: diffNum };
    }
  }
  if (witness) break;
}

const out = {
  problem: 'EP-68',
  script: path.basename(process.argv[1]),
  method: 'exact_partial_sum_plus_rigorous_tail_interval_denominator_exclusion',
  params: { N, qmax: QMAX },
  partial_sum: { num: num.toString(), den: den.toString() },
  tail_bound: `S - S_N < ${tailNum.toString()}/${tailDen.toString()}`,
  has_rational_candidate_in_interval_with_q_le_qmax: witness !== null,
  witness,
  best_near_miss: best
    ? {
        q: best.q,
        p: best.p,
        lhs: best.lhs.toString(),
        rhs: best.rhs.toString(),
        normalized_ratio_lhs_over_rhs: fracToDecimalString(best.lhs, best.rhs, 18),
      }
    : null,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep68_rational_denominator_exclusion.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      outPath,
      N,
      qmax: QMAX,
      has_candidate: witness !== null,
      witness,
    },
    null,
    2
  )
);
