#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function gcdBig(a, b) {
  let x = a < 0n ? -a : a;
  let y = b < 0n ? -b : b;
  while (y !== 0n) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function gcdInt(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function reduceFrac(num, den) {
  const g = gcdBig(num, den);
  return [num / g, den / g];
}

function ceilDivBig(a, b) {
  return (a + b - 1n) / b;
}

function sieve(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= limit; i += 1) {
    if (!isPrime[i]) continue;
    for (let j = i * i; j <= limit; j += i) isPrime[j] = 0;
  }
  return { isPrime };
}

const maxDen = 1200;
const { isPrime } = sieve(maxDen + 20);
const semiprimes = [];
for (let n = 6; n <= maxDen; n += 1) {
  let cnt = 0;
  let p1 = -1;
  let p2 = -1;
  for (let p = 2; p * p <= n; p += 1) {
    if (!isPrime[p] || n % p !== 0) continue;
    const q = n / p;
    if (q !== p && isPrime[q]) {
      cnt += 1;
      p1 = p;
      p2 = q;
    }
  }
  if (cnt === 1 && p1 !== p2) semiprimes.push(n);
}

function minEgyptLengthSemiprime(a, b, kMax) {
  const [num0, den0] = reduceFrac(BigInt(a), BigInt(b));

  function canAtDepth(num, den, pos, termsLeft, memo) {
    const key = `${num}/${den}|${pos}|${termsLeft}`;
    if (memo.has(key)) return memo.get(key);

    if (termsLeft === 1) {
      if (num <= 0n || den % num !== 0n) return memo.set(key, false), false;
      const d = Number(den / num);
      const ok = Number.isFinite(d) && semiprimes.includes(d) && pos < semiprimes.length && d >= semiprimes[pos];
      memo.set(key, ok);
      return ok;
    }

    const start = semiprimes[pos] ?? maxDen + 1;
    if (!Number.isFinite(start)) return memo.set(key, false), false;
    if (num * BigInt(start) > den * BigInt(termsLeft)) return memo.set(key, false), false;

    const dMin0 = Number(ceilDivBig(den, num));
    for (let i = pos; i < semiprimes.length; i += 1) {
      const d = semiprimes[i];
      if (d < dMin0) continue;
      const bd = BigInt(d);
      const newNumRaw = num * bd - den;
      if (newNumRaw <= 0n) continue;
      const newDenRaw = den * bd;
      const [newNum, newDen] = reduceFrac(newNumRaw, newDenRaw);
      const t = termsLeft - 1;
      const nextStart = semiprimes[i + 1] ?? (maxDen + 1);
      if (newNum * BigInt(nextStart) > newDen * BigInt(t)) continue;
      if (canAtDepth(newNum, newDen, i + 1, t, memo)) return memo.set(key, true), true;
    }

    memo.set(key, false);
    return false;
  }

  for (let k = 1; k <= kMax; k += 1) {
    const memo = new Map();
    if (canAtDepth(num0, den0, 0, k, memo)) return k;
  }
  return null;
}

const deepPasses = 60;
let rows = [];
for (let pass = 0; pass < deepPasses; pass += 1) {
  const cur = [];
  for (const b of [6, 10, 14, 15, 21, 30, 42, 66]) {
    let solved = 0;
    let unresolved = 0;
    let maxLen = 0;
    for (let a = 1; a < b; a += 1) {
      if (gcdInt(a, b) !== 1) continue;
      const k = minEgyptLengthSemiprime(a, b, 10);
      if (k === null) unresolved += 1;
      else {
        solved += 1;
        if (k > maxLen) maxLen = k;
      }
    }
    cur.push({
      b,
      represented_coprime_a_count: solved,
      unresolved_coprime_a_count: unresolved,
      max_min_length_among_represented: maxLen,
    });
  }
  rows = cur;
}

const out = {
  problem: 'EP-306',
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  result: {
    description: 'Deep finite representability profile for a/b using distinct semiprime denominators.',
    deep_passes: deepPasses,
    semiprime_count_up_to_maxDen: semiprimes.length,
    search_limits: { maxDen, kMax: 10 },
    rows,
  },
};

const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-306', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(out, null, 2));
}
