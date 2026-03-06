#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseCaseList(value) {
  if (!value) {
    const alphas = [1.11, 1.15, 1.19, 1.23, 1.27, 1.31, 1.35, 1.39, 1.43, 1.47, 1.53, 1.61];
    const ratios = [1.5, 1.75, 2.0, 2.5, 4.0, 8.0];
    const out = [
      { name: 'sqrt2_sqrt3', alpha: Math.SQRT2, beta: Math.sqrt(3) },
      { name: 'pi_e', alpha: Math.PI, beta: Math.E },
      { name: 'alpha1.5_beta6', alpha: 1.5, beta: 6.0 },
    ];
    for (const a of alphas) {
      for (const r of ratios) {
        out.push({
          name: `grid_a${a}_r${r}`,
          alpha: a,
          beta: a * r,
        });
      }
    }
    return out;
  }
  const out = [];
  for (const part of value.split(';')) {
    const [name, a, b] = part.split(':');
    const alpha = Number(a);
    const beta = Number(b);
    if (name && Number.isFinite(alpha) && Number.isFinite(beta) && alpha > 0 && beta > 0) {
      out.push({ name: name.trim(), alpha, beta });
    }
  }
  return out;
}

function floorSeq(alpha, K, X) {
  const arr = [];
  for (let k = 0; k <= K; k += 1) {
    const v = Math.floor(alpha * 2 ** k);
    if (v > 0 && v <= X) arr.push(v);
  }
  return arr;
}

function subsetCoverageBounded(values, X) {
  const can = new Uint8Array(X + 1);
  can[0] = 1;
  for (const a of values) {
    for (let s = X - a; s >= 0; s -= 1) if (can[s]) can[s + a] = 1;
  }
  return can;
}

function longestMissingRun(can, start, end) {
  let best = 0;
  let cur = 0;
  for (let s = start; s <= end; s += 1) {
    if (can[s]) cur = 0;
    else {
      cur += 1;
      if (cur > best) best = cur;
    }
  }
  return best;
}

const KMAX = Number(process.env.KMAX || 28);
const X_LIST = (process.env.X_LIST || '1200000,2200000,3200000,4200000')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => Number.isInteger(x) && x > 1000)
  .sort((a, b) => a - b);
const CASES = parseCaseList(process.env.CASES || '');
const TAIL_START_RATIO = Number(process.env.TAIL_START_RATIO || 0.67);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const c of CASES) {
  for (const X of X_LIST) {
    const t1 = Date.now();
    const s1 = floorSeq(c.alpha, KMAX, X);
    const s2 = floorSeq(c.beta, KMAX, X);
    const vals = [...s1, ...s2].sort((a, b) => a - b);
    const can = subsetCoverageBounded(vals, X);
    const tailStart = Math.floor(TAIL_START_RATIO * X);

    let tailHits = 0;
    for (let n = tailStart; n <= X; n += 1) if (can[n]) tailHits += 1;
    const tailCov = tailHits / Math.max(1, X - tailStart + 1);

    let reach = 0;
    while (reach + 1 <= X && can[reach + 1]) reach += 1;

    rows.push({
      case: c.name,
      alpha: Number(c.alpha.toFixed(6)),
      beta: Number(c.beta.toFixed(6)),
      X,
      terms_used: vals.length,
      min_term: vals.length ? vals[0] : null,
      max_term: vals.length ? vals[vals.length - 1] : null,
      contiguous_reach_from_1: reach,
      tail_start: tailStart,
      tail_coverage_ratio: Number(tailCov.toFixed(6)),
      tail_longest_missing_run: longestMissingRun(can, tailStart, X),
      runtime_ms: Date.now() - t1,
    });
  }
}

const top = [...rows]
  .sort(
    (a, b) =>
      b.tail_coverage_ratio - a.tail_coverage_ratio ||
      a.tail_longest_missing_run - b.tail_longest_missing_run ||
      b.contiguous_reach_from_1 - a.contiguous_reach_from_1,
  )
  .slice(0, 12);

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-354',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_bounded_subset_sum_map_for_two_floor_doubling_sequences',
  params: { KMAX, X_LIST, TAIL_START_RATIO, case_count: CASES.length },
  rows,
  top_cases: top,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
