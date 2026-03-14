#!/usr/bin/env node

// EP-1030 deep finite proxy:
// compare constructive lower bounds for R(k+1,k) and R(k,k)
// using random colorings with exact red/blue clique checks.

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
      const tail = cand & ~((1n << BigInt(v + 1)) - 1n);
      dfs(level + 1, tail & adjBits[v]);
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

function avoidsPattern(red, redClique, blueClique) {
  if (hasCliqueOfSize(red, redClique)) return false;
  const blue = blueAdjFromRed(red);
  return !hasCliqueOfSize(blue, blueClique);
}

function bestNFound(redClique, blueClique, nMin, nMax, depth, rng) {
  let best = null;
  for (let n = nMin; n <= nMax; n += 1) {
    const tries = Math.max(300, Math.floor((3200 * depth) / Math.sqrt(n)));
    let ok = false;
    for (let t = 0; t < tries; t += 1) {
      const red = buildRandomColoring(n, rng);
      if (avoidsPattern(red, redClique, blueClique)) { ok = true; break; }
    }
    if (ok) best = n;
  }
  return best;
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const rng = makeRng(20260314 ^ 1030 ^ (depth * 8191));

  const kList = [4, 5, 6];
  const rows = [];

  for (const k of kList) {
    const nMin = Math.max(8, 2 * k + 2);
    const nMax = k === 6 ? 96 : 70;

    const bestDiag = bestNFound(k, k, nMin, nMax, depth, rng);
    const bestOff = bestNFound(k + 1, k, nMin, nMax + 6, depth, rng);

    const lbDiag = bestDiag === null ? null : bestDiag + 1;
    const lbOff = bestOff === null ? null : bestOff + 1;
    rows.push({
      k,
      best_n_found_avoiding_red_Kk_and_blue_Kk: bestDiag,
      implied_lower_bound_Rkk_ge: lbDiag,
      best_n_found_avoiding_red_Kkplus1_and_blue_Kk: bestOff,
      implied_lower_bound_Rkplus1_k_ge: lbOff,
      ratio_lower_bounds_Rkplus1k_over_Rkk: (lbDiag && lbOff) ? Number((lbOff / lbDiag).toFixed(8)) : null,
    });
  }

  const payload = {
    problem: 'EP-1030',
    script: 'ep1030.mjs',
    method: 'deep_constructive_ratio_proxy_for_off_diagonal_vs_diagonal_ramsey_numbers',
    warning: 'Constructive lower-bound ratios only; does not prove existence of fixed multiplicative gap.',
    params: { depth, kList },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
