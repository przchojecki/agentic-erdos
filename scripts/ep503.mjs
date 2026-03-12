#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function choose2(n) {
  return (n * (n - 1)) / 2;
}

function makeRng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (1664525 * s + 1013904223) >>> 0;
    return s / 0x100000000;
  };
}

function dist2(x, y) {
  let s = 0;
  for (let i = 0; i < x.length; i += 1) {
    const d = x[i] - y[i];
    s += d * d;
  }
  return s;
}

function allTriplesIsosceles(points, eps = 1e-9) {
  const n = points.length;
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      for (let k = j + 1; k < n; k += 1) {
        const a = dist2(points[i], points[j]);
        const b = dist2(points[i], points[k]);
        const c = dist2(points[j], points[k]);
        if (Math.abs(a - b) > eps && Math.abs(a - c) > eps && Math.abs(b - c) > eps) return false;
      }
    }
  }
  return true;
}

function baseConstruction(d) {
  const m = d + 1;
  const pts = [];
  for (let i = 0; i < m; i += 1) {
    for (let j = i + 1; j < m; j += 1) {
      const v = Array(m).fill(0);
      v[i] = 1;
      v[j] = 1;
      pts.push(v);
    }
  }
  const centroid = Array(m).fill(2 / m);
  return { pts, plus1: [...pts, centroid] };
}

function randomCandidate(dim, rng) {
  const vals = [-1, -0.5, 0, 0.5, 1, 1.5, 2];
  const v = [];
  for (let i = 0; i < dim; i += 1) v.push(vals[Math.floor(rng() * vals.length)]);
  return v;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 503);
const rows = [];

for (let d = 2; d <= 14; d += 1) {
  const { pts, plus1 } = baseConstruction(d);
  const baseValid = allTriplesIsosceles(pts);
  const plus1Valid = allTriplesIsosceles(plus1);

  const candidateTrials = d <= 9 ? 18000 : 6000;
  let extensionWitnessFound = false;

  for (let t = 0; t < candidateTrials; t += 1) {
    const cand = randomCandidate(d + 1, rng);
    if (allTriplesIsosceles([...plus1, cand])) {
      extensionWitnessFound = true;
      break;
    }
  }

  rows.push({
    d,
    lower_construction_size: pts.length,
    lower_plus1_size: plus1.length,
    lower_valid: baseValid,
    lower_plus1_valid: plus1Valid,
    quadratic_upper_binom_dplus2_2: choose2(d + 2),
    random_extension_trials: candidateTrials,
    extension_candidate_found_in_trials: extensionWitnessFound,
  });
}

const out = {
  problem: 'EP-503',
  script: path.basename(process.argv[1]),
  method: 'deep_validation_of_known_lower_constructions_plus_random_extension_search',
  params: {
    d_range: [2, 14],
  },
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
