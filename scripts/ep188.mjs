#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// Quick computational probes for harder batch 7:
// EP-184, EP-188, EP-195, EP-202, EP-208, EP-212, EP-213, EP-222, EP-233, EP-236.

function makeRng(seed) {
  let x = seed | 0;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) + 0.5) / 4294967296;
  };
}

function shuffle(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function sieve(limit) {
  const isPrime = new Uint8Array(limit + 1);
  isPrime.fill(1, 2);
  for (let i = 2; i * i <= limit; i += 1) {
    if (!isPrime[i]) continue;
    for (let j = i * i; j <= limit; j += i) isPrime[j] = 0;
  }
  const primes = [];
  for (let i = 2; i <= limit; i += 1) if (isPrime[i]) primes.push(i);
  return { isPrime, primes };
}

function isPerfectSquare(n) {
  const r = Math.floor(Math.sqrt(n));
  return r * r === n;
}

const rng = makeRng(20260303 ^ 709);
const out = {
  script: path.basename(process.argv[1]),
  generated_utc: new Date().toISOString(),
  results: {},
};


// EP-188: finite triangular-lattice proxy.
{
  function triPatch(m) {
    const pts = [];
    const id = new Map();
    for (let x = 0; x < m; x += 1) {
      for (let y = 0; y < m; y += 1) {
        const k = `${x},${y}`;
        id.set(k, pts.length);
        pts.push([x, y]);
      }
    }
    const dirs = [
      [1, 0],
      [0, 1],
      [1, -1],
      [-1, 0],
      [0, -1],
      [-1, 1],
    ];
    const neigh = Array.from({ length: pts.length }, () => []);
    for (let i = 0; i < pts.length; i += 1) {
      const [x, y] = pts[i];
      for (const [dx, dy] of dirs) {
        const j = id.get(`${x + dx},${y + dy}`);
        if (j !== undefined) neigh[i].push(j);
      }
    }
    return { pts, neigh, m };
  }

  function maxBlueRun(colors, patch) {
    const { pts, m } = patch;
    const id = new Map(pts.map((p, i) => [`${p[0]},${p[1]}`, i]));
    const dirs = [
      [1, 0],
      [0, 1],
      [1, -1],
    ];
    let best = 0;

    for (let i = 0; i < pts.length; i += 1) {
      const [x, y] = pts[i];
      for (const [dx, dy] of dirs) {
        const prev = id.get(`${x - dx},${y - dy}`);
        if (prev !== undefined) continue;
        let cx = x;
        let cy = y;
        let cur = 0;
        while (cx >= 0 && cx < m && cy >= 0 && cy < m) {
          const j = id.get(`${cx},${cy}`);
          if (j === undefined) break;
          if (colors[j] === 0) {
            cur += 1;
            if (cur > best) best = cur;
          } else {
            cur = 0;
          }
          cx += dx;
          cy += dy;
        }
      }
    }

    return best;
  }

  function redConflicts(colors, patch) {
    let c = 0;
    const { neigh } = patch;
    for (let i = 0; i < neigh.length; i += 1) {
      if (colors[i] !== 1) continue;
      for (const j of neigh[i]) if (j > i && colors[j] === 1) c += 1;
    }
    return c;
  }

  function optimize(m, restarts = 40, steps = 12000) {
    const patch = triPatch(m);
    let bestRun = Infinity;
    for (let rep = 0; rep < restarts; rep += 1) {
      const colors = new Uint8Array(patch.pts.length);
      for (let i = 0; i < colors.length; i += 1) colors[i] = rng() < 0.35 ? 1 : 0;

      let conf = redConflicts(colors, patch);
      let run = maxBlueRun(colors, patch);
      let score = conf * 1000 + run;

      for (let step = 0; step < steps; step += 1) {
        const v = Math.floor(rng() * colors.length);
        colors[v] ^= 1;
        const nConf = redConflicts(colors, patch);
        const nRun = maxBlueRun(colors, patch);
        const nScore = nConf * 1000 + nRun;
        if (nScore <= score || rng() < 0.002) {
          conf = nConf;
          run = nRun;
          score = nScore;
        } else {
          colors[v] ^= 1;
        }
      }

      if (conf === 0 && run < bestRun) bestRun = run;
    }
    return bestRun;
  }

  const rows = [];
  for (const m of [8, 10, 12, 14, 16, 18]) {
    const restarts = m <= 12 ? 36 : 24;
    const steps = m <= 12 ? 10000 : 7000;
    const run = optimize(m, restarts, steps);
    rows.push({
      lattice_side_m: m,
      vertices: m * m,
      restarts,
      steps_per_restart: steps,
      best_max_blue_unit_step_AP_run_found: run,
      proxy_k_upper_bound_from_found_coloring: run < Infinity ? run + 1 : null,
    });
  }

  out.results.ep188 = {
    description: 'Finite triangular-lattice proxy balancing red unit-distance avoidance vs blue unit-step AP runs.',
    rows,
  };
}


const single={problem:'EP-188',script:path.basename(process.argv[1]),generated_utc:new Date().toISOString(),result:out.results.ep188};
const OUT=process.env.OUT || path.join('data','ep188_standalone_compute.json');
fs.writeFileSync(OUT, JSON.stringify(single,null,2)+'\n');
console.log(JSON.stringify({problem:'EP-188',out:OUT},null,2));
