#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function randomBits(n) {
  const a = new Uint8Array(n + 1);
  for (let i = 1; i <= n; i += 1) a[i] = Math.random() < 0.5 ? 0 : 1;
  return a;
}

function longestByDiff(bits, N, d) {
  let best = 1;
  for (let r = 1; r <= d; r += 1) {
    let i = r;
    if (i > N) break;
    let cur = 1;
    let prev = bits[i];
    for (i = r + d; i <= N; i += d) {
      const b = bits[i];
      if (b === prev) cur += 1;
      else {
        if (cur > best) best = cur;
        cur = 1;
        prev = b;
      }
    }
    if (cur > best) best = cur;
  }
  return best;
}

const root = process.cwd();
const outPath = path.join(root, 'data', 'ep187_coloring_ap_diff_scan.json');

const N = Number(process.argv[2] || 8000);
const Dmax = Number(process.argv[3] || 180);
const trials = Number(process.argv[4] || 180);

const bestLd = Array(Dmax + 1).fill(Number.POSITIVE_INFINITY);
const avgLd = Array(Dmax + 1).fill(0);
let bestOverallScore = Number.POSITIVE_INFINITY;
let bestOverallProfile = null;

for (let t = 0; t < trials; t += 1) {
  const bits = randomBits(N);
  const prof = [];
  let score = 0;

  for (let d = 1; d <= Dmax; d += 1) {
    const Ld = longestByDiff(bits, N, d);
    prof.push(Ld);
    if (Ld < bestLd[d]) bestLd[d] = Ld;
    avgLd[d] += Ld;
    score += Ld;
  }

  if (score < bestOverallScore) {
    bestOverallScore = score;
    bestOverallProfile = prof.slice();
  }

  if ((t + 1) % 30 === 0) process.stderr.write(`trial=${t + 1}, bestScore=${bestOverallScore}\n`);
}

for (let d = 1; d <= Dmax; d += 1) avgLd[d] /= trials;

const checkpoints = [2,3,4,5,8,10,16,20,32,40,64,80,128,160,180]
  .filter((d) => d <= Dmax)
  .map((d) => ({
    d,
    best_Ld_over_trials: bestLd[d],
    avg_Ld_over_trials: avgLd[d],
    best_Ld_over_log2d: bestLd[d] / Math.log2(Math.max(2, d)),
    avg_Ld_over_log2d: avgLd[d] / Math.log2(Math.max(2, d)),
  }));

const out = {
  problem: 'EP-187',
  method: 'random_coloring_search_and_AP-length_profile_by_common_difference',
  params: { N, Dmax, trials },
  best_over_trials_profile: bestOverallProfile,
  checkpoints,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
process.stderr.write(`Wrote ${outPath}\n`);
