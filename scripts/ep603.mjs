#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const OUT = process.env.OUT || '';

function makeRng(seed) {
  let s = seed >>> 0;
  return () => { s = (1664525 * s + 1013904223) >>> 0; return s / 0x100000000; };
}

function sampleSet(universe, k, rng) {
  const arr = Array.from({ length: universe }, (_, i) => i);
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i]; arr[i] = arr[j]; arr[j] = t;
  }
  return arr.slice(0, k).sort((a, b) => a - b);
}

function interSize(a, b) {
  let i = 0; let j = 0; let c = 0;
  while (i < a.length && j < b.length) {
    if (a[i] === b[j]) { c += 1; i += 1; j += 1; }
    else if (a[i] < b[j]) i += 1;
    else j += 1;
  }
  return c;
}

function buildFamily(universe, setSize, targetCount, forbiddenInter, rng) {
  const fam = [];
  let tries = 0;
  while (fam.length < targetCount && tries < 220000) {
    tries += 1;
    const S = sampleSet(universe, setSize, rng);
    let ok = true;
    for (const T of fam) {
      if (interSize(S, T) === forbiddenInter) { ok = false; break; }
    }
    if (ok) fam.push(S);
  }
  return fam;
}

function colorableWithK(fam, universe, K) {
  const color = Array(universe).fill(-1);
  const onV = Array.from({ length: universe }, () => []);
  for (let i = 0; i < fam.length; i += 1) for (const v of fam[i]) onV[v].push(i);

  function edgeBad(e) {
    let c = -1;
    for (const v of e) {
      if (color[v] === -1) return false;
      if (c === -1) c = color[v];
      else if (color[v] !== c) return false;
    }
    return true;
  }

  function chooseVar() {
    let best = -1; let bestDeg = -1;
    for (let v = 0; v < universe; v += 1) {
      if (color[v] !== -1) continue;
      const d = onV[v].length;
      if (d > bestDeg) { bestDeg = d; best = v; }
    }
    return best;
  }

  function dfs(assigned) {
    if (assigned === universe) return true;
    const v = chooseVar();
    if (v < 0) return true;
    for (let c = 0; c < K; c += 1) {
      color[v] = c;
      let ok = true;
      for (const ei of onV[v]) {
        if (edgeBad(fam[ei])) { ok = false; break; }
      }
      if (ok && dfs(assigned + 1)) return true;
      color[v] = -1;
    }
    return false;
  }

  return dfs(0);
}

function minColorsFound(fam, universe, kMax) {
  for (let k = 2; k <= kMax; k += 1) if (colorableWithK(fam, universe, k)) return k;
  return null;
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 603);
const rows = [];

for (const [n, k, m, trials] of [[30, 6, 24, 26], [36, 7, 28, 22], [42, 8, 32, 18]]) {
  let built = 0;
  let sumMin = 0;
  let unresolved = 0;
  const hist = { '2': 0, '3': 0, '4': 0, '5+': 0 };
  for (let t = 0; t < trials; t += 1) {
    const fam = buildFamily(n, k, m, 2, rng);
    if (fam.length < m) continue;
    built += 1;
    const mc = minColorsFound(fam, n, 5);
    if (mc === null) { unresolved += 1; hist['5+'] += 1; continue; }
    sumMin += mc;
    if (mc <= 4) hist[String(mc)] += 1;
    else hist['5+'] += 1;
  }
  rows.push({
    universe_size: n,
    set_size: k,
    family_size_target: m,
    forbidden_intersection_size: 2,
    trials,
    built_instances: built,
    avg_min_colors_over_built: built ? Number((sumMin / built).toPrecision(8)) : null,
    unresolved_over_kmax5: unresolved,
    histogram_min_colors: hist,
  });
}

const out = {
  problem: 'EP-603',
  script: path.basename(process.argv[1]),
  method: 'finite_min_color_proxy_for_families_with_pairwise_intersection_not_2',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
