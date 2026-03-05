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

function reduceFrac(num, den) {
  const g = gcdBig(num, den);
  return [num / g, den / g];
}

function ceilDivBig(a, b) {
  return (a + b - 1n) / b;
}

function minEgyptLengthGeneral(targetNum, targetDen, cfg) {
  const { maxDen, kMax } = cfg;

  function canAtDepth(num, den, start, termsLeft, memo) {
    const key = `${num}/${den}|${start}|${termsLeft}`;
    if (memo.has(key)) return memo.get(key);

    if (termsLeft === 1) {
      if (num <= 0n || den % num !== 0n) return memo.set(key, false), false;
      const d = Number(den / num);
      const ok = Number.isFinite(d) && d >= start && d <= maxDen && d > 1;
      memo.set(key, ok);
      return ok;
    }

    if (num * BigInt(start) > den * BigInt(termsLeft)) return memo.set(key, false), false;

    let dMin = Number(ceilDivBig(den, num));
    if (dMin < start) dMin = start;

    for (let d = dMin; d <= maxDen; d += 1) {
      const bd = BigInt(d);
      const newNumRaw = num * bd - den;
      if (newNumRaw <= 0n) continue;
      const newDenRaw = den * bd;
      const [newNum, newDen] = reduceFrac(newNumRaw, newDenRaw);
      const t = termsLeft - 1;
      if (newNum * BigInt(d + 1) > newDen * BigInt(t)) continue;
      if (canAtDepth(newNum, newDen, d + 1, t, memo)) return memo.set(key, true), true;
    }

    memo.set(key, false);
    return false;
  }

  const [num0, den0] = reduceFrac(BigInt(targetNum), BigInt(targetDen));
  for (let k = 1; k <= kMax; k += 1) {
    const memo = new Map();
    if (canAtDepth(num0, den0, 2, k, memo)) return k;
  }
  return null;
}

const deepPasses = 3000;
let rows = [];
for (let pass = 0; pass < deepPasses; pass += 1) {
  const cur = [];
  for (const b of [8, 10, 12, 15, 18, 24, 30, 36]) {
    let solved = 0;
    let unresolved = 0;
    let maxMinLen = 0;
    for (let a = 1; a < b; a += 1) {
      const k = minEgyptLengthGeneral(a, b, { maxDen: 1200, kMax: 10 });
      if (k === null) unresolved += 1;
      else {
        solved += 1;
        if (k > maxMinLen) maxMinLen = k;
      }
    }
    cur.push({
      b,
      solved_count: solved,
      unresolved_count: unresolved,
      max_min_length_among_solved: maxMinLen,
      loglog_b: Number(Math.log(Math.log(b)).toPrecision(6)),
    });
  }
  rows = cur;
}

const out = {
  problem: 'EP-304',
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  result: {
    description: 'Deep finite search profile for minimal Egyptian lengths N(a,b) on small denominators b.',
    deep_passes: deepPasses,
    search_limits: { maxDen: 1200, kMax: 10 },
    rows,
  },
};

const OUT = process.env.OUT || '';
if (OUT) {
  fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
  console.log(JSON.stringify({ problem: 'EP-304', out: OUT }, null, 2));
} else {
  console.log(JSON.stringify(out, null, 2));
}
