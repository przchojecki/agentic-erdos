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

function lcmBig(a, b) {
  return (a / gcdBig(a, b)) * b;
}

function parseCases(value) {
  if (!value) {
    return [
      { degree: 1, nFrom: 2, nTo: 46 },
      { degree: 1, nFrom: 4, nTo: 48 },
      { degree: 1, nFrom: 6, nTo: 50 },
      { degree: 2, nFrom: 2, nTo: 44 },
      { degree: 2, nFrom: 4, nTo: 46 },
      { degree: 2, nFrom: 6, nTo: 48 },
      { degree: 3, nFrom: 2, nTo: 42 },
      { degree: 3, nFrom: 4, nTo: 44 },
      { degree: 3, nFrom: 6, nTo: 46 },
      { degree: 4, nFrom: 2, nTo: 40 },
      { degree: 4, nFrom: 4, nTo: 42 },
    ];
  }
  const out = [];
  for (const part of value.split(';')) {
    const [d, a, b] = part.split(':').map((x) => Number(x.trim()));
    if (Number.isInteger(d) && Number.isInteger(a) && Number.isInteger(b) && d >= 1 && a >= 1 && b >= a) {
      out.push({ degree: d, nFrom: a, nTo: b });
    }
  }
  return out;
}

function enumerateHalf(terms, L) {
  let list = [{ rec: 0n, mod: 0n, poly: 0n }];
  for (const term of terms) {
    const next = list.slice();
    for (const x of list) {
      const rec = x.rec + term.rec;
      const mod = rec % L;
      next.push({ rec, mod, poly: x.poly + term.poly });
    }
    list = next;
  }
  return list;
}

function analyzeCase(degree, nFrom, nTo) {
  const nums = [];
  for (let n = nFrom; n <= nTo; n += 1) nums.push(n);
  let L = 1n;
  for (const n of nums) L = lcmBig(L, BigInt(n));

  const terms = nums.map((n) => ({
    rec: L / BigInt(n),
    poly: BigInt(n) ** BigInt(degree),
  }));

  const mid = Math.floor(terms.length / 2);
  const left = enumerateHalf(terms.slice(0, mid), L);
  const right = enumerateHalf(terms.slice(mid), L);

  const rightByMod = new Map();
  for (const r of right) {
    const k = r.mod;
    const arr = rightByMod.get(k);
    if (arr) arr.push(r);
    else rightByMod.set(k, [r]);
  }

  const integerValues = new Set();
  let integerSubsetCount = 0;
  for (const l of left) {
    const need = (L - l.mod) % L;
    const arr = rightByMod.get(need);
    if (!arr) continue;
    for (const r of arr) {
      const rec = l.rec + r.rec;
      if (rec % L !== 0n) continue;
      const carry = rec / L;
      const v = l.poly + r.poly + carry;
      integerSubsetCount += 1;
      integerValues.add(v);
    }
  }

  const ints = [...integerValues].sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  let longestRun = 0;
  let runStart = null;
  if (ints.length) {
    let curStart = ints[0];
    let curLen = 1;
    longestRun = 1;
    runStart = ints[0];
    for (let i = 1; i < ints.length; i += 1) {
      if (ints[i] === ints[i - 1] + 1n) {
        curLen += 1;
      } else {
        if (curLen > longestRun) {
          longestRun = curLen;
          runStart = curStart;
        }
        curStart = ints[i];
        curLen = 1;
      }
    }
    if (curLen > longestRun) {
      longestRun = curLen;
      runStart = curStart;
    }
  }

  return {
    degree,
    n_range: [nFrom, nTo],
    terms_used: terms.length,
    lcm_digits: L.toString().length,
    half_sizes: [left.length, right.length],
    integer_subset_pair_count: integerSubsetCount,
    integer_values_count: ints.length,
    min_integer_value: ints.length ? String(ints[0]) : null,
    max_integer_value: ints.length ? String(ints[ints.length - 1]) : null,
    longest_consecutive_integer_run_length: longestRun,
    longest_run_start: runStart === null ? null : String(runStart),
  };
}

const CASES = parseCases(process.env.CASES || '');
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const c of CASES) {
  const t1 = Date.now();
  const row = analyzeCase(c.degree, c.nFrom, c.nTo);
  row.runtime_ms = Date.now() - t1;
  rows.push(row);
}
const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));

const out = {
  problem: 'EP-351',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_exact_mitm_integer_subset_sums_for_poly_plus_inverse_terms',
  params: { CASES },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
