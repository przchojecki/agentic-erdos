#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function makeRng(seed) {
  let x = (seed >>> 0) || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function buildCandidate(len, rng) {
  const seq = [1, 2];
  while (seq.length < len) {
    const prev = seq[seq.length - 1];
    const jump = 1.35 + 0.55 * rng();
    const nxt = Math.max(prev + 1, Math.floor(prev * jump));
    seq.push(nxt);
  }
  return seq;
}

function coverageTailRatio(seq, removeSet, N, tailStart) {
  const can = new Uint8Array(N + 1);
  can[0] = 1;
  for (let i = 0; i < seq.length; i += 1) {
    if (removeSet.has(i)) continue;
    const a = seq[i];
    if (a > N) continue;
    for (let s = N - a; s >= 0; s -= 1) if (can[s]) can[s + a] = 1;
  }
  let hit = 0;
  for (let n = tailStart; n <= N; n += 1) if (can[n]) hit += 1;
  return hit / Math.max(1, N - tailStart + 1);
}

function sampleDeletionSets(len, delCount, sampleCount, rng) {
  const out = [];
  for (let t = 0; t < sampleCount; t += 1) {
    const s = new Set();
    while (s.size < delCount) s.add(Math.floor(rng() * len));
    out.push([...s].sort((a, b) => a - b));
  }
  return out;
}

function combinations(n, k) {
  const out = [];
  const idx = Array.from({ length: k }, (_, i) => i);
  while (true) {
    out.push([...idx]);
    let p = k - 1;
    while (p >= 0 && idx[p] === n - k + p) p -= 1;
    if (p < 0) break;
    idx[p] += 1;
    for (let i = p + 1; i < k; i += 1) idx[i] = idx[i - 1] + 1;
  }
  return out;
}

const N = Number(process.env.N || 70000);
const TAIL_START = Number(process.env.TAIL_START || 42000);
const LEN = Number(process.env.LEN || 22);
const TRIALS = Number(process.env.TRIALS || 240);
const SAMPLE_DEL = Number(process.env.SAMPLE_DEL || 36);
const SEED = Number(process.env.SEED || 3482026);
const OUT = process.env.OUT || '';

const rng = makeRng(SEED);
const t0 = Date.now();
const searchRows = [];
let best = null;

for (let t = 0; t < TRIALS; t += 1) {
  const seq = buildCandidate(LEN, rng);
  const base = coverageTailRatio(seq, new Set(), N, TAIL_START);

  const d1 = sampleDeletionSets(seq.length, 1, SAMPLE_DEL, rng);
  const d2 = sampleDeletionSets(seq.length, 2, SAMPLE_DEL, rng);
  const d3 = sampleDeletionSets(seq.length, 3, SAMPLE_DEL, rng);

  let avg1 = 0;
  let avg2 = 0;
  let avg3 = 0;
  for (const del of d1) avg1 += coverageTailRatio(seq, new Set(del), N, TAIL_START);
  for (const del of d2) avg2 += coverageTailRatio(seq, new Set(del), N, TAIL_START);
  for (const del of d3) avg3 += coverageTailRatio(seq, new Set(del), N, TAIL_START);
  avg1 /= d1.length;
  avg2 /= d2.length;
  avg3 /= d3.length;

  const score = 2.2 * base + 1.4 * avg2 - 2.0 * avg3;
  const row = {
    trial: t + 1,
    seq_length: seq.length,
    last_term: seq[seq.length - 1],
    base_tail_coverage: Number(avg1.toFixed(6)),
    avg_del2_tail_coverage: Number(avg2.toFixed(6)),
    avg_del3_tail_coverage: Number(avg3.toFixed(6)),
    score: Number(score.toFixed(6)),
    seq_sample: seq.slice(0, 18),
  };
  searchRows.push({ ...row, seq });
  if (!best || row.score > best.score) best = { ...row, seq };
}

searchRows.sort((a, b) => b.score - a.score);
const finalists = searchRows.slice(0, 3);
const exhaustive = [];
for (const cand of finalists) {
  const seq = cand.seq;
  const allDel2 = combinations(seq.length, 2);
  const allDel3 = combinations(seq.length, 3);
  let min2 = 1;
  let max3 = 0;
  for (const del of allDel2) {
    const cov = coverageTailRatio(seq, new Set(del), N, TAIL_START);
    if (cov < min2) min2 = cov;
  }
  for (const del of allDel3) {
    const cov = coverageTailRatio(seq, new Set(del), N, TAIL_START);
    if (cov > max3) max3 = cov;
  }
  exhaustive.push({
    trial: cand.trial,
    seq_length: seq.length,
    last_term: seq[seq.length - 1],
    min_tail_coverage_after_any_2_deletions: Number(min2.toFixed(6)),
    max_tail_coverage_after_any_3_deletions: Number(max3.toFixed(6)),
    separation_gap: Number((min2 - max3).toFixed(6)),
    seq_sample: seq.slice(0, 22),
  });
}

const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));
const out = {
  problem: 'EP-348',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_finite_deletion_robustness_classification_surrogate',
  params: { N, TAIL_START, LEN, TRIALS, SAMPLE_DEL, SEED },
  best_search_row: {
    ...best,
    seq: undefined,
  },
  top_search_rows: searchRows.slice(0, 12).map((r) => ({ ...r, seq: undefined })),
  exhaustive_top_candidates: exhaustive,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
