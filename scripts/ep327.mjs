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
    .filter((x) => Number.isInteger(x) && x >= 2);
  return out.length ? out : fallback;
}

function condPair(a, b, variant) {
  const s = a + b;
  if (variant === 1) return (a * b) % s === 0;
  return (2 * a * b) % s === 0;
}

function buildCompat(N, variant) {
  const comp = Array.from({ length: N + 1 }, () => new Uint8Array(N + 1));
  for (let a = 1; a <= N; a += 1) {
    for (let b = a + 1; b <= N; b += 1) {
      if (condPair(a, b, variant)) {
        comp[a][b] = 1;
        comp[b][a] = 1;
      }
    }
  }
  return comp;
}

function exactMaxCompatibleSet(N, variant) {
  const comp = buildCompat(N, variant);
  let best = [];

  function dfs(clique, cands) {
    if (clique.length + cands.length <= best.length) return;
    if (cands.length === 0) {
      if (clique.length > best.length) best = [...clique];
      return;
    }
    const v = cands[cands.length - 1];
    cands.pop();

    const next = [];
    for (let i = 0; i < cands.length; i += 1) if (comp[v][cands[i]]) next.push(cands[i]);
    clique.push(v);
    dfs(clique, next);
    clique.pop();

    dfs(clique, cands);
    cands.push(v);
  }

  const all = Array.from({ length: N }, (_, i) => i + 1);
  dfs([], all);
  best.sort((a, b) => a - b);
  return { size: best.length, witness: best };
}

function randomGreedyCompatibleSet(N, variant, restarts, seed) {
  const rng = makeRng(seed ^ (N * 1009) ^ (variant * 911));
  const comp = buildCompat(N, variant);
  const base = Array.from({ length: N }, (_, i) => i + 1);
  let best = [];

  for (let t = 0; t < restarts; t += 1) {
    // Fisher-Yates shuffle
    for (let i = base.length - 1; i > 0; i -= 1) {
      const j = Math.floor(rng() * (i + 1));
      const x = base[i];
      base[i] = base[j];
      base[j] = x;
    }
    const cur = [];
    for (const x of base) {
      let ok = true;
      for (let i = 0; i < cur.length; i += 1) {
        if (!comp[x][cur[i]]) {
          ok = false;
          break;
        }
      }
      if (ok) cur.push(x);
    }
    if (cur.length > best.length) best = [...cur].sort((a, b) => a - b);
  }
  return { size: best.length, witness: best };
}

const EXACT_N_LIST = parseIntList(process.env.EXACT_N_LIST, [30, 40, 50, 60, 70]);
const HEUR_N_LIST = parseIntList(process.env.HEUR_N_LIST, [100, 150, 200, 300, 500, 800, 1200, 1800]);
const RESTARTS = Number(process.env.RESTARTS || 22000);
const SEED = Number(process.env.SEED || 3272026);
const OUT = process.env.OUT || '';

const t0 = Date.now();
const rows = [];
for (const variant of [1, 2]) {
  for (const N of EXACT_N_LIST) {
    const t1 = Date.now();
    const r = exactMaxCompatibleSet(N, variant);
    rows.push({
      mode: 'exact',
      variant,
      N,
      best_size: r.size,
      ratio_over_N: Number((r.size / N).toFixed(8)),
      odd_count_ratio: Number((Math.floor((N + 1) / 2) / N).toFixed(8)),
      witness_prefix: r.witness.slice(0, 24),
      runtime_ms: Date.now() - t1,
    });
  }
  for (const N of HEUR_N_LIST) {
    const t1 = Date.now();
    const r = randomGreedyCompatibleSet(N, variant, RESTARTS, SEED);
    rows.push({
      mode: 'heuristic_random_greedy',
      variant,
      N,
      restarts: RESTARTS,
      best_size: r.size,
      ratio_over_N: Number((r.size / N).toFixed(8)),
      odd_count_ratio: Number((Math.floor((N + 1) / 2) / N).toFixed(8)),
      witness_prefix: r.witness.slice(0, 24),
      runtime_ms: Date.now() - t1,
    });
  }
}

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-327',
  script: path.basename(process.argv[1]),
  method: 'exact_plus_deep_randomized_search_for_pairwise_divisibility_compatible_sets',
  params: { EXACT_N_LIST, HEUR_N_LIST, RESTARTS, SEED },
  rows,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
