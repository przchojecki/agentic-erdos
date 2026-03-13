#!/usr/bin/env node
import fs from 'fs';

// EP-847 finite analog:
// On [1..N], study
// - alpha_3AP(N): max subset with no 3-term AP;
// - chi_3AP(N): min colors to partition [1..N] into 3AP-free classes.

const OUT = process.env.OUT || 'data/ep847_standalone_deeper.json';

function apTriples(N) {
  const T = [];
  for (let a = 1; a <= N; a += 1) {
    for (let d = 1; a + 2 * d <= N; d += 1) T.push([a - 1, a + d - 1, a + 2 * d - 1]);
  }
  return T;
}

function alphaNoAP(N, T) {
  const chosen = new Int8Array(N);
  let best = 0;
  function bad() {
    for (const [a, b, c] of T) if (chosen[a] && chosen[b] && chosen[c]) return true;
    return false;
  }
  function dfs(i, cur) {
    if (cur + (N - i) <= best) return;
    if (i === N) {
      if (cur > best) best = cur;
      return;
    }
    chosen[i] = 1;
    if (!bad()) dfs(i + 1, cur + 1);
    chosen[i] = 0;
    dfs(i + 1, cur);
  }
  dfs(0, 0);
  return best;
}

function hasKColoring(N, T, k) {
  const col = new Int8Array(N).fill(-1);
  function bad() {
    for (const [a, b, c] of T) {
      const ca = col[a];
      if (ca >= 0 && ca === col[b] && ca === col[c]) return true;
    }
    return false;
  }
  function dfs(i) {
    if (i === N) return true;
    for (let c = 0; c < k; c += 1) {
      col[i] = c;
      if (!bad() && dfs(i + 1)) return true;
    }
    col[i] = -1;
    return false;
  }
  return dfs(0);
}

function minColorsNoAP(N, T, kMax = 8) {
  for (let k = 1; k <= kMax; k += 1) if (hasKColoring(N, T, k)) return k;
  return null;
}

const t0 = Date.now();
const rows = [];
for (const N of [9, 12, 15, 18]) {
  const T = apTriples(N);
  const alpha = alphaNoAP(N, T);
  const chi = minColorsNoAP(N, T, 8);
  rows.push({
    N,
    ap_triples_count: T.length,
    alpha_3ap_free: alpha,
    alpha_over_N: Number((alpha / N).toPrecision(8)),
    min_colors_partition_into_3ap_free_classes: chi,
  });
}

const out = {
  problem: 'EP-847',
  script: 'ep847.mjs',
  method: 'finite_exact_profile_for_3ap_free_subsets_and_partitions',
  warning: 'Finite exact data only, not an infinite decomposition theorem.',
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
