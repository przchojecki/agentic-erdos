#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function parseIntList(value, fallback) {
  if (!value) return fallback;
  const out = value
    .split(',')
    .map((x) => Number(x.trim()))
    .filter((x) => Number.isInteger(x) && x > 0);
  return out.length ? out : fallback;
}

function explicitBasisOrder2(N) {
  const t = Math.ceil(Math.sqrt(N));
  const seen = new Set();
  const A = [];
  for (let x = 0; x <= t; x += 1) {
    seen.add(x);
    A.push(x);
  }
  for (let x = 0; x <= t * t; x += t) {
    if (x > N) break;
    if (seen.has(x)) continue;
    seen.add(x);
    A.push(x);
  }
  A.sort((a, b) => a - b);
  return A;
}

function buildPairCounts(B, N) {
  const cnt = new Uint16Array(N + 1);
  for (let i = 0; i < B.length; i += 1) {
    const bi = B[i];
    for (let j = i; j < B.length; j += 1) {
      const s = bi + B[j];
      if (s > N) break;
      if (cnt[s] < 65535) cnt[s] += 1;
    }
  }
  return cnt;
}

function uncoveredCount(cnt) {
  let miss = 0;
  for (let s = 0; s < cnt.length; s += 1) if (cnt[s] === 0) miss += 1;
  return miss;
}

function ratioOscillationScore(B) {
  const m = B.length;
  if (m < 8) return 0;
  const start = Math.max(4, Math.floor(0.35 * m));
  let mn = Infinity;
  let mx = -Infinity;
  let sum = 0;
  let sum2 = 0;
  let c = 0;
  for (let k = start; k <= m; k += 1) {
    const r = B[k - 1] / (k * k);
    if (r < mn) mn = r;
    if (r > mx) mx = r;
    sum += r;
    sum2 += r * r;
    c += 1;
  }
  const mean = sum / c;
  const variance = Math.max(0, sum2 / c - mean * mean);
  const std = Math.sqrt(variance);
  return {
    amplitude: mx - mn,
    std,
    score: (mx - mn) + 0.5 * std,
    tail_start_k: start,
    tail_min_ratio: Number(mn.toFixed(8)),
    tail_max_ratio: Number(mx.toFixed(8)),
    tail_std_ratio: Number(std.toFixed(8)),
  };
}

function deepPruneSearch(A, N, runs, steps, seed) {
  const rng = makeRng(seed ^ (N * 1009));
  let best = null;

  for (let run = 0; run < runs; run += 1) {
    const B = [...A];
    const cnt = buildPairCounts(B, N);
    let miss = uncoveredCount(cnt);
    if (miss !== 0) throw new Error(`Initial basis failed at N=${N}`);

    let cur = ratioOscillationScore(B);
    let temp = 0.01;

    for (let step = 0; step < steps && B.length > 6; step += 1) {
      const idx = 1 + Math.floor(rng() * (B.length - 1)); // keep 0
      const x = B[idx];

      for (let j = 0; j < B.length; j += 1) {
        const s = x + B[j];
        if (s > N) continue;
        const old = cnt[s];
        cnt[s] = old - 1;
        if (old === 1) miss += 1;
      }

      if (miss > 0) {
        for (let j = 0; j < B.length; j += 1) {
          const s = x + B[j];
          if (s > N) continue;
          const old = cnt[s];
          cnt[s] = old + 1;
          if (old === 0) miss -= 1;
        }
        temp *= 0.9997;
        continue;
      }

      B.splice(idx, 1);
      const nxt = ratioOscillationScore(B);
      const accept = nxt.score >= cur.score || rng() < Math.exp((nxt.score - cur.score) / Math.max(1e-9, temp));
      if (accept) {
        cur = nxt;
      } else {
        B.splice(idx, 0, x);
        for (let j = 0; j < B.length; j += 1) {
          const s = x + B[j];
          if (s > N) continue;
          const old = cnt[s];
          cnt[s] = old + 1;
          if (old === 0) miss -= 1;
        }
      }
      temp *= 0.9997;
    }

    const rec = {
      basis_size: B.length,
      coverage_missing_sums: miss,
      ...cur,
      sample_tail_values: B.slice(-8),
    };
    if (!best || rec.score > best.score) best = rec;
  }

  return best;
}

const N_LIST = parseIntList(process.env.N_LIST, [40000, 80000, 120000, 180000]);
const RUNS = Number(process.env.RUNS || 20);
const STEPS = Number(process.env.STEPS || 30000);
const SEED = Number(process.env.SEED || 3262026);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const N of N_LIST) {
  const A = explicitBasisOrder2(N);
  const best = deepPruneSearch(A, N, RUNS, STEPS, SEED);
  rows.push({
    N,
    explicit_basis_size: A.length,
    best_found: best,
  });
}

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-326',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_pruning_search_for_irregular_quadratic_ratio_in_order2_subbases',
  params: { N_LIST, RUNS, STEPS, SEED },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
