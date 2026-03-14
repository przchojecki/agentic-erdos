#!/usr/bin/env node

// EP-949 finite proxy over [1..N]:
// Given sum-free S, find large A subset [1..N]\S such that (A+A)\cap S = empty
// for sums <= N.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function isSumFree(Sset, N) {
  const arr = [];
  for (let x = 1; x <= N; x += 1) if (Sset[x]) arr.push(x);
  for (let i = 0; i < arr.length; i += 1) {
    for (let j = i; j < arr.length; j += 1) {
      const s = arr[i] + arr[j];
      if (s <= N && Sset[s]) return false;
    }
  }
  return true;
}

function randomSumFreeSet(N, rng, steps) {
  const S = new Uint8Array(N + 1);
  const order = Array.from({ length: N }, (_, i) => i + 1);
  for (let i = order.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = order[i]; order[i] = order[j]; order[j] = t;
  }

  let added = 0;
  for (let idx = 0; idx < order.length && added < steps; idx += 1) {
    const x = order[idx];
    S[x] = 1;
    if (!isSumFree(S, N)) S[x] = 0;
    else added += 1;
  }
  return S;
}

function maxAForS(S, N) {
  const candidates = [];
  for (let x = 1; x <= N; x += 1) if (!S[x]) candidates.push(x);

  const forbid = Array.from({ length: candidates.length }, () => new Uint8Array(candidates.length));
  const badVertex = new Uint8Array(candidates.length);

  for (let i = 0; i < candidates.length; i += 1) {
    const a = candidates[i];
    if (2 * a <= N && S[2 * a]) badVertex[i] = 1;
    for (let j = i + 1; j < candidates.length; j += 1) {
      const b = candidates[j];
      const s = a + b;
      if (s <= N && S[s]) {
        forbid[i][j] = 1;
        forbid[j][i] = 1;
      }
    }
  }

  let best = 0;
  const chosen = new Uint8Array(candidates.length);

  function dfs(pos, current) {
    if (current + (candidates.length - pos) <= best) return;
    if (pos === candidates.length) {
      if (current > best) best = current;
      return;
    }

    // skip
    dfs(pos + 1, current);

    // take
    if (!badVertex[pos]) {
      let ok = true;
      for (let i = 0; i < pos; i += 1) {
        if (chosen[i] && forbid[pos][i]) { ok = false; break; }
      }
      if (ok) {
        chosen[pos] = 1;
        dfs(pos + 1, current + 1);
        chosen[pos] = 0;
      }
    }
  }

  dfs(0, 0);
  return { maxA: best, complementSize: candidates.length };
}

function buildStructuredS(N, mode) {
  const S = new Uint8Array(N + 1);
  if (mode === 'upper_half') {
    for (let x = Math.floor(N / 2) + 1; x <= N; x += 1) S[x] = 1;
  } else if (mode === 'odds') {
    for (let x = 1; x <= N; x += 2) S[x] = 1;
  } else if (mode === 'mod3_eq1') {
    for (let x = 1; x <= N; x += 1) if (x % 3 === 1) S[x] = 1;
  }
  return S;
}

function sizeOfSet(S, N) {
  let c = 0;
  for (let i = 1; i <= N; i += 1) if (S[i]) c += 1;
  return c;
}

function main() {
  const t0 = Date.now();

  const N = 60;
  const rows = [];

  const structuredModes = ['upper_half', 'odds', 'mod3_eq1'];
  for (const mode of structuredModes) {
    const S = buildStructuredS(N, mode);
    const out = maxAForS(S, N);
    rows.push({
      source: `structured_${mode}`,
      N,
      sum_free_verified: isSumFree(S, N),
      S_size: sizeOfSet(S, N),
      complement_size: out.complementSize,
      max_A_size_found: out.maxA,
      ratio_A_over_N: Number((out.maxA / N).toFixed(8)),
    });
  }

  const randomTrials = 40;
  for (let t = 0; t < randomTrials; t += 1) {
    const rng = makeRng((20260314 ^ (t * 65537)) >>> 0);
    const S = randomSumFreeSet(N, rng, 26);
    const out = maxAForS(S, N);
    rows.push({
      source: `random_${t}`,
      N,
      sum_free_verified: isSumFree(S, N),
      S_size: sizeOfSet(S, N),
      complement_size: out.complementSize,
      max_A_size_found: out.maxA,
      ratio_A_over_N: Number((out.maxA / N).toFixed(8)),
    });
  }

  let best = rows[0];
  let worst = rows[0];
  for (const r of rows) {
    if (r.ratio_A_over_N > best.ratio_A_over_N) best = r;
    if (r.ratio_A_over_N < worst.ratio_A_over_N) worst = r;
  }

  const payload = {
    problem: 'EP-949',
    script: 'ep949.mjs',
    method: 'finite_sumfree_complement_search_for_large_A_with_AplusA_avoids_S',
    warning: 'Finite integer proxy only; original statement is over R and cardinality continuum.',
    params: { N, randomTrials },
    rows,
    summary: {
      best_ratio_A_over_N: best.ratio_A_over_N,
      worst_ratio_A_over_N: worst.ratio_A_over_N,
      best_source: best.source,
      worst_source: worst.source,
    },
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
