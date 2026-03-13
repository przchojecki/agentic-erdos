#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function isSquare(n) {
  const r = Math.floor(Math.sqrt(n));
  return r * r === n;
}

function buildKnownRepresentable(NMAX) {
  const rep = new Uint8Array(NMAX + 1);

  for (let n = 1; n * n <= NMAX; n += 1) rep[n * n] = 1;
  for (let n = 1; n * n <= NMAX; n += 1) {
    for (const c of [2, 3, 6]) {
      const v = c * n * n;
      if (v <= NMAX) rep[v] = 1;
    }
  }
  for (let a = 1; a * a <= NMAX; a += 1) {
    for (let b = 1; b * b + a * a <= NMAX; b += 1) rep[a * a + b * b] = 1;
  }

  // Zhang-type family: n^2ab with threshold.
  for (let a = 1; a <= 70; a += 1) {
    for (let b = 1; b <= a; b += 1) {
      const thresh = 3 * Math.ceil((a * a + b * b + a * b - a - b) / (a * b));
      for (let n = Math.max(1, thresh); ; n += 1) {
        const v = n * n * a * b;
        if (v > NMAX) break;
        rep[v] = 1;
      }
    }
  }
  return rep;
}

const t0 = Date.now();
const NMAX = 8000;
const rep = buildKnownRepresentable(NMAX);

const checkpoints = [200, 500, 1000, 2000, 4000, 8000];
const growthRows = [];
for (const X of checkpoints) {
  let represented = 0;
  let representedNonSquare = 0;
  for (let n = 1; n <= X; n += 1) {
    if (!rep[n]) continue;
    represented += 1;
    if (!isSquare(n)) representedNonSquare += 1;
  }
  growthRows.push({
    X,
    represented_count: represented,
    represented_density: Number((represented / X).toPrecision(8)),
    represented_non_square_count: representedNonSquare,
    represented_non_square_density: Number((representedNonSquare / X).toPrecision(8)),
  });
}

const firstMissing = [];
const firstMissingNonSquares = [];
for (let n = 1; n <= NMAX && firstMissing.length < 80; n += 1) {
  if (!rep[n]) firstMissing.push(n);
}
for (let n = 2; n <= NMAX && firstMissingNonSquares.length < 80; n += 1) {
  if (!rep[n] && !isSquare(n)) firstMissingNonSquares.push(n);
}

const out = {
  problem: 'EP-633',
  script: path.basename(process.argv[1]),
  method: 'deep_arithmetic_map_of_known_tiling_families_to_quantify_non_square_abundance',
  params: { NMAX },
  growth_rows: growthRows,
  first_missing_values: firstMissing,
  first_missing_non_squares: firstMissingNonSquares,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
