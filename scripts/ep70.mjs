#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function buildTriples(n) {
  const triples = [];
  for (let i = 0; i < n; i += 1) {
    for (let j = i + 1; j < n; j += 1) {
      for (let k = j + 1; k < n; k += 1) triples.push([i, j, k]);
    }
  }
  return triples;
}

function largestHomogeneousSubset(n, colors, triples) {
  let best = 0;
  const total = 1 << n;
  const bits = new Uint8Array(total);
  for (let m = 1; m < total; m += 1) bits[m] = bits[m >>> 1] + (m & 1);
  for (let mask = 1; mask < total; mask += 1) {
    const sz = bits[mask];
    if (sz <= best) continue;
    if (sz < 3) {
      best = Math.max(best, sz);
      continue;
    }
    let col = -1;
    let ok = true;
    for (let t = 0; t < triples.length; t += 1) {
      const [a, b, c] = triples[t];
      if (((mask >>> a) & 1) && ((mask >>> b) & 1) && ((mask >>> c) & 1)) {
        const v = colors[t];
        if (col === -1) col = v;
        else if (v !== col) {
          ok = false;
          break;
        }
      }
    }
    if (ok) best = sz;
  }
  return best;
}

function optimizeColoring(n, restarts, iters, seed) {
  const rng = makeRng(seed);
  const triples = buildTriples(n);
  const m = triples.length;
  let globalBest = Infinity;

  for (let r = 0; r < restarts; r += 1) {
    const colors = new Uint8Array(m);
    for (let i = 0; i < m; i += 1) colors[i] = rng() < 0.5 ? 0 : 1;

    let cur = largestHomogeneousSubset(n, colors, triples);
    let best = cur;
    for (let t = 0; t < iters; t += 1) {
      const idx = Math.floor(rng() * m);
      colors[idx] ^= 1;
      const nxt = largestHomogeneousSubset(n, colors, triples);
      if (nxt <= cur || rng() < Math.exp((cur - nxt) / 0.75)) {
        cur = nxt;
        if (cur < best) best = cur;
      } else {
        colors[idx] ^= 1;
      }
    }
    if (best < globalBest) globalBest = best;
  }

  return { n, triples: m, best_largest_homogeneous_subset: globalBest };
}

const N_LIST = (process.env.N_LIST || '8,9,10,11').split(',').map((x) => Number(x.trim())).filter(Number.isFinite);
const RESTARTS = Number(process.env.RESTARTS || 24);
const ITERS = Number(process.env.ITERS || 5000);
const SEED = Number(process.env.SEED || 7002026);
const OUT = process.env.OUT || '';

const rows = N_LIST.map((n, i) => optimizeColoring(n, RESTARTS, ITERS, SEED ^ (n * 1009 + i * 313)));

const out = {
  problem: 'EP-70',
  script: path.basename(process.argv[1]),
  method: 'finite_3uniform_2coloring_ramsey_proxy',
  params: { N_LIST, RESTARTS, ITERS, SEED },
  rows,
  generated_utc: new Date().toISOString(),
};

if (OUT) fs.writeFileSync(OUT, JSON.stringify(out, null, 2) + '\n');
console.log(JSON.stringify(out, null, 2));
