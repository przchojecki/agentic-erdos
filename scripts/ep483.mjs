#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function colorable(N, k) {
  const col = new Int8Array(N + 1);
  col.fill(-1);
  const conflicts = Array.from({ length: N + 1 }, () => []);
  for (let c = 1; c <= N; c += 1) {
    for (let a = 1; a < c; a += 1) {
      const b = c - a;
      if (a <= b) conflicts[c].push([a, b]);
    }
  }

  function dfs(x) {
    if (x > N) return true;
    for (let c = 0; c < k; c += 1) {
      let ok = true;
      for (const [a, b] of conflicts[x]) {
        if (col[a] === c && col[b] === c) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;
      col[x] = c;
      if (dfs(x + 1)) return true;
      col[x] = -1;
    }
    return false;
  }

  return dfs(1);
}

function exactMax(k, cap) {
  let best = 0;
  for (let n = 1; n <= cap; n += 1) {
    if (colorable(n, k)) best = n;
    else return best;
  }
  return best;
}

function rng(seed) {
  let x = seed >>> 0;
  return () => {
    x ^= x << 13; x ^= x >>> 17; x ^= x << 5;
    return (x >>> 0) / 0x100000000;
  };
}

function greedyLen(k, cap, rnd) {
  const col = new Int8Array(cap + 1);
  col.fill(-1);
  for (let x = 1; x <= cap; x += 1) {
    const valid = [];
    for (let c = 0; c < k; c += 1) {
      let ok = true;
      for (let a = 1; a < x; a += 1) {
        const b = x - a;
        if (a > b) continue;
        if (col[a] === c && col[b] === c) { ok = false; break; }
      }
      if (ok) valid.push(c);
    }
    if (!valid.length) return x - 1;
    col[x] = valid[Math.floor(rnd() * valid.length)];
  }
  return cap;
}

const OUT = process.env.OUT || '';
const rowsExact = [
  { k: 1, exact_max_length: exactMax(1, 5) },
  { k: 2, exact_max_length: exactMax(2, 10) },
  { k: 3, exact_max_length: exactMax(3, 18) },
  { k: 4, exact_max_length: 45, source: 'known' },
  { k: 5, exact_max_length: 160, source: 'known_minus_1' },
];

const rnd = rng(20260312 ^ 483);
const rowsHeur = [];
for (const [k, trials, cap] of [[5,300,500],[6,300,800],[7,300,1200],[8,220,1800]]) {
  let best = 0;
  let sum = 0;
  for (let t = 0; t < trials; t += 1) {
    const len = greedyLen(k, cap, rnd);
    sum += len;
    if (len > best) best = len;
  }
  rowsHeur.push({ k, trials, cap, best_greedy_length: best, mean_greedy_length: Number((sum/trials).toPrecision(8)), ratio_best_over_3p2806_pow_k: Number((best/(3.2806**k)).toPrecision(8))});
}

const out = {
  problem: 'EP-483',
  script: path.basename(process.argv[1]),
  method: 'exact_small_and_deeper_heuristic_profiles_for_schur_numbers',
  params: {},
  exact_rows: rowsExact,
  heuristic_rows: rowsHeur,
  generated_utc: new Date().toISOString(),
};
if (OUT) fs.writeFileSync(OUT, JSON.stringify(out,null,2)+'\n');
console.log(JSON.stringify(out,null,2));
