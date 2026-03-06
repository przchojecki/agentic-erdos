#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function parseFloatList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isFinite(x) && x > 0);
  return out.length ? out : fallback;
}

function seqFloorGeom(t, alpha, limit) {
  const A = [];
  let n = 0;
  let prev = 0;
  while (true) {
    const x = Math.floor(t * alpha ** n);
    n += 1;
    if (x <= 0) continue;
    if (x <= prev) continue;
    if (x > limit) break;
    A.push(x);
    prev = x;
    if (A.length > 80) break;
  }
  return A;
}

function distinctCoverage(A, N) {
  const can = new Uint8Array(N + 1);
  can[0] = 1;
  for (const a of A) {
    if (a > N) continue;
    for (let s = N - a; s >= 0; s -= 1) if (can[s]) can[s + a] = 1;
  }
  return can;
}

function tailStats(can, starts) {
  const N = can.length - 1;
  const rows = [];
  for (const st of starts) {
    if (st > N) continue;
    let hit = 0;
    let longestMissRun = 0;
    let curMissRun = 0;
    for (let n = st; n <= N; n += 1) {
      if (can[n]) {
        hit += 1;
        curMissRun = 0;
      } else {
        curMissRun += 1;
        if (curMissRun > longestMissRun) longestMissRun = curMissRun;
      }
    }
    rows.push({
      start: st,
      coverage_ratio: Number((hit / (N - st + 1)).toFixed(6)),
      longest_missing_run: longestMissRun,
    });
  }
  return rows;
}

const N = Number(process.env.N || 900000);
const ALPHAS = parseFloatList(
  process.env.ALPHAS,
  [1.11, 1.13, 1.15, 1.17, 1.19, 1.21, 1.23, 1.25, 1.27, 1.29, 1.31, 1.33, 1.35, 1.37, 1.39, 1.41, 1.45, 1.49, 1.53, 1.57],
);
const TS = parseFloatList(process.env.TS, [0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.4, 1.6, 2, 2.8, 4, 6, 9, 12]);
const TAIL_STARTS = parseFloatList(process.env.TAIL_STARTS, [120000, 200000, 320000, 500000, 750000]).map((x) =>
  Math.floor(x),
);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const alpha of ALPHAS) {
  for (const t of TS) {
    const t1 = Date.now();
    const A = seqFloorGeom(t, alpha, N);
    const can = distinctCoverage(A, N);
    const stats = tailStats(can, TAIL_STARTS);
    rows.push({
      alpha,
      t,
      seq_len_up_to_N: A.length,
      last_term: A.length ? A[A.length - 1] : null,
      sum_terms: A.reduce((acc, x) => acc + x, 0),
      tail_rows: stats,
      runtime_ms: Date.now() - t1,
    });
  }
}

const promising = rows
  .map((r) => {
    const last = r.tail_rows[r.tail_rows.length - 1] || { coverage_ratio: 0, longest_missing_run: N };
    return {
      alpha: r.alpha,
      t: r.t,
      seq_len_up_to_N: r.seq_len_up_to_N,
      coverage_at_largest_tail_start: last.coverage_ratio,
      longest_missing_run_at_largest_tail_start: last.longest_missing_run,
      score: Number((1.8 * last.coverage_ratio - 0.0005 * last.longest_missing_run).toFixed(6)),
    };
  })
  .sort((a, b) => b.score - a.score)
  .slice(0, 20);

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-349',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_finite_completeness_proxy_map_for_floor_t_alpha_n_sequences',
  params: { N, ALPHAS, TS, TAIL_STARTS },
  rows,
  top_promising_parameters: promising,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
