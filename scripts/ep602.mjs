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
  while (fam.length < targetCount && tries < 200000) {
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

function twoColorable(fam, universe) {
  const color = Array(universe).fill(-1);

  function validEdge(e) {
    let c0 = 0; let c1 = 0; let un = 0;
    for (const v of e) {
      if (color[v] === 0) c0 += 1;
      else if (color[v] === 1) c1 += 1;
      else un += 1;
    }
    if (un === 0 && (c0 === 0 || c1 === 0)) return false;
    return true;
  }

  function chooseVar() {
    let best = -1;
    let bestScore = -1;
    for (let v = 0; v < universe; v += 1) {
      if (color[v] !== -1) continue;
      let sc = 0;
      for (const e of fam) if (e.includes(v)) sc += 1;
      if (sc > bestScore) { bestScore = sc; best = v; }
    }
    return best;
  }

  function dfs(assigned) {
    if (assigned === universe) return true;
    const v = chooseVar();
    if (v < 0) return true;
    for (const c of [0, 1]) {
      color[v] = c;
      let ok = true;
      for (const e of fam) {
        if (!e.includes(v)) continue;
        if (!validEdge(e)) { ok = false; break; }
      }
      if (ok && dfs(assigned + 1)) return true;
      color[v] = -1;
    }
    return false;
  }

  return dfs(0);
}

const t0 = Date.now();
const rng = makeRng(20260312 ^ 602);
const rows = [];

for (const [n, k, m, trials] of [[30, 6, 24, 30], [36, 7, 28, 26], [42, 8, 32, 22]]) {
  let built = 0;
  let twoColorableHits = 0;
  for (let t = 0; t < trials; t += 1) {
    const fam = buildFamily(n, k, m, 1, rng);
    if (fam.length < m) continue;
    built += 1;
    if (twoColorable(fam, n)) twoColorableHits += 1;
  }
  rows.push({
    universe_size: n,
    set_size: k,
    family_size_target: m,
    forbidden_intersection_size: 1,
    trials,
    built_instances: built,
    two_colorable_instances: twoColorableHits,
    two_colorable_ratio: built ? Number((twoColorableHits / built).toPrecision(8)) : null,
  });
}

const out = {
  problem: 'EP-602',
  script: path.basename(process.argv[1]),
  method: 'finite_property_B_proxy_for_families_with_pairwise_intersection_not_1',
  params: {},
  rows,
  elapsed_ms: Date.now() - t0,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
