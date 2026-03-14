#!/usr/bin/env node

// EP-1029 deep finite proxy:
// constructive lower bounds for R(k,k) via random colorings
// with exact monochromatic clique detection.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function buildRandomColoring(n, rng) {
  const red = Array(n).fill(0n);
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      if (rng() < 0.5) {
        red[i] |= (1n << BigInt(j));
        red[j] |= (1n << BigInt(i));
      }
    }
  }
  return red;
}

function intersectBits(a, b) { return a & b; }
function popcnt(x) {
  let c = 0;
  let v = x;
  while (v) { v &= v - 1n; c += 1; }
  return c;
}
function firstBitIndex(x) {
  let idx = 0;
  let v = x;
  while ((v & 1n) === 0n) { v >>= 1n; idx += 1; }
  return idx;
}

function hasCliqueOfSize(adjBits, r) {
  const n = adjBits.length;
  const all = (1n << BigInt(n)) - 1n;
  let found = false;

  function dfs(level, cand) {
    if (found) return;
    if (level === r) { found = true; return; }
    if (popcnt(cand) < (r - level)) return;

    let c = cand;
    while (c) {
      const vBit = c & -c;
      c ^= vBit;
      const v = firstBitIndex(vBit);
      dfs(level + 1, intersectBits(cand & ~((1n << BigInt(v + 1)) - 1n), adjBits[v]));
      if (found) return;
    }
  }

  dfs(0, all);
  return found;
}

function blueAdjFromRed(red) {
  const n = red.length;
  const all = (1n << BigInt(n)) - 1n;
  const blue = Array(n).fill(0n);
  for (let i = 0; i < n; i += 1) {
    const self = (1n << BigInt(i));
    blue[i] = (all ^ red[i]) & ~self;
  }
  return blue;
}

function avoidsMonoKk(red, k) {
  if (hasCliqueOfSize(red, k)) return false;
  const blue = blueAdjFromRed(red);
  return !hasCliqueOfSize(blue, k);
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const rng = makeRng(20260314 ^ 1029 ^ (depth * 65537));

  const kList = [4, 5, 6];
  const rows = [];

  for (const k of kList) {
    const nMin = Math.max(8, 2 * k + 2);
    const nMax = k === 6 ? 96 : 68;
    let bestN = null;

    for (let n = nMin; n <= nMax; n += 1) {
      const tries = Math.max(300, Math.floor((3200 * depth) / Math.sqrt(n)));
      let ok = false;
      for (let t = 0; t < tries; t += 1) {
        const red = buildRandomColoring(n, rng);
        if (avoidsMonoKk(red, k)) {
          ok = true;
          break;
        }
      }
      if (ok) bestN = n;
    }

    const lb = bestN === null ? null : bestN + 1;
    rows.push({
      k,
      best_n_with_coloring_avoiding_mono_Kk_found: bestN,
      implied_lower_bound_Rkk_ge: lb,
      normalization_k_times_2powk_over2: lb === null ? null : Number((lb / (k * (2 ** (k / 2)))).toFixed(8)),
    });
  }

  const payload = {
    problem: 'EP-1029',
    script: 'ep1029.mjs',
    method: 'deep_random_coloring_search_with_exact_mono_clique_checks_for_diagonal_ramsey_lower_bounds',
    warning: 'Finite constructive lower bounds only; does not prove asymptotic divergence of R(k)/(k2^{k/2}).',
    params: { depth, kList },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
