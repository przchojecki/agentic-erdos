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

function subsetCoverage(sequence, N) {
  const can = new Uint8Array(N + 1);
  can[0] = 1;
  for (const a of sequence) {
    if (a > N) continue;
    for (let s = N - a; s >= 0; s -= 1) {
      if (can[s]) can[s + a] = 1;
    }
  }
  return can;
}

function tailCoverageRatio(can, start, N) {
  let hit = 0;
  for (let s = start; s <= N; s += 1) if (can[s]) hit += 1;
  return hit / Math.max(1, N - start + 1);
}

function tailRatios(seq, tailCount) {
  const ratios = [];
  const s = Math.max(1, seq.length - tailCount);
  for (let i = s; i < seq.length; i += 1) ratios.push(seq[i] / seq[i - 1]);
  return ratios;
}

function median(arr) {
  const a = [...arr].sort((x, y) => x - y);
  const m = Math.floor(a.length / 2);
  return a.length % 2 ? a[m] : 0.5 * (a[m - 1] + a[m]);
}

function buildSequence(N, eps, rng) {
  const seq = [1, 2];
  while (true) {
    const prev = seq[seq.length - 1];
    const target = prev * (1 + eps + 0.5 * rng());
    const nxt = Math.max(Math.ceil((1 + eps) * prev), Math.floor(target));
    if (nxt > N) break;
    seq.push(nxt);
    if (seq.length > 60) break;
  }
  return seq;
}

const N = Number(process.env.N || 160000);
const EPS = Number(process.env.EPS || 0.18);
const TRIALS = Number(process.env.TRIALS || 420);
const TAIL_START = Number(process.env.TAIL_START || 90000);
const DEL_SAMPLES = Number(process.env.DEL_SAMPLES || 8);
const SEED = Number(process.env.SEED || 3462026);
const OUT = process.env.OUT || '';

const phi = (1 + Math.sqrt(5)) / 2;
const rng = makeRng(SEED);
const t0 = Date.now();
let best = null;
const leaderboard = [];

for (let t = 0; t < TRIALS; t += 1) {
  const seq = buildSequence(N, EPS, rng);
  const can = subsetCoverage(seq, N);
  const baseTailCov = tailCoverageRatio(can, TAIL_START, N);

  let delScore = 0;
  const picked = [];
  if (seq.length > 3) {
    for (let j = 0; j < DEL_SAMPLES; j += 1) {
      const idx = 1 + Math.floor(rng() * (seq.length - 1));
      picked.push(idx);
    }
  }
  for (const idx of picked) {
    const reduced = seq.filter((_, i) => i !== idx);
    const c2 = subsetCoverage(reduced, N);
    delScore += tailCoverageRatio(c2, TAIL_START, N);
  }
  const delTailCov = picked.length ? delScore / picked.length : 0;

  const ratios = tailRatios(seq, 12);
  const medRatio = ratios.length ? median(ratios) : 0;
  const ratioDevFromPhi = Math.abs(medRatio - phi);
  const score = 2.2 * baseTailCov + 2.0 * delTailCov - 0.6 * ratioDevFromPhi;

  const row = {
    trial: t + 1,
    seq_length: seq.length,
    last_term: seq[seq.length - 1],
    base_tail_coverage: Number(baseTailCov.toFixed(6)),
    deletion_tail_coverage: Number(delTailCov.toFixed(6)),
    tail_median_ratio: Number(medRatio.toFixed(6)),
    ratio_dev_from_phi: Number(ratioDevFromPhi.toFixed(6)),
    score: Number(score.toFixed(6)),
    sample_tail_terms: seq.slice(-12),
  };
  leaderboard.push(row);
  if (!best || row.score > best.score) best = row;
}

leaderboard.sort((a, b) => b.score - a.score);
const top = leaderboard.slice(0, 15);
const runtime_seconds = Number(((Date.now() - t0) / 1000).toFixed(3));

const out = {
  problem: 'EP-346',
  script: path.basename(process.argv[1]),
  method: 'standalone_deep_ratio_constrained_complete_sequence_surrogate_search',
  params: { N, EPS, TRIALS, TAIL_START, DEL_SAMPLES, SEED },
  phi,
  best,
  top_rows: top,
  runtime_seconds,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
