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


// EP-212 + EP-213: integer-grid rational-distance proxies.
{
  function pointsGrid(M) {
    const pts = [];
    for (let x = -M; x <= M; x += 1) for (let y = -M; y <= M; y += 1) pts.push([x, y]);
    return pts;
  }

  function buildIntDistanceAdj(pts) {
    const n = pts.length;
    const adj = Array.from({ length: n }, () => new Uint8Array(n));
    for (let i = 0; i < n; i += 1) {
      for (let j = i + 1; j < n; j += 1) {
        const dx = pts[i][0] - pts[j][0];
        const dy = pts[i][1] - pts[j][1];
        const d2 = dx * dx + dy * dy;
        if (isPerfectSquare(d2)) {
          adj[i][j] = 1;
          adj[j][i] = 1;
        }
      }
    }
    return adj;
  }

  function collinear(a, b, c) {
    return (b[0] - a[0]) * (c[1] - a[1]) === (b[1] - a[1]) * (c[0] - a[0]);
  }

  function det3(m) {
    return m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1])
      - m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0])
      + m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  }

  function cocircular4(a, b, c, d) {
    const rows = [a, b, c, d].map(([x, y]) => [x * x + y * y, x, y, 1]);
    const m0 = [
      [rows[1][1], rows[1][2], rows[1][3]],
      [rows[2][1], rows[2][2], rows[2][3]],
      [rows[3][1], rows[3][2], rows[3][3]],
    ];
    const m1 = [
      [rows[1][0], rows[1][2], rows[1][3]],
      [rows[2][0], rows[2][2], rows[2][3]],
      [rows[3][0], rows[3][2], rows[3][3]],
    ];
    const m2 = [
      [rows[1][0], rows[1][1], rows[1][3]],
      [rows[2][0], rows[2][1], rows[2][3]],
      [rows[3][0], rows[3][1], rows[3][3]],
    ];
    const m3 = [
      [rows[1][0], rows[1][1], rows[1][2]],
      [rows[2][0], rows[2][1], rows[2][2]],
      [rows[3][0], rows[3][1], rows[3][2]],
    ];
    const det = rows[0][0] * det3(m0) - rows[0][1] * det3(m1) + rows[0][2] * det3(m2) - rows[0][3] * det3(m3);
    return det === 0;
  }

  function maxCliqueGreedy(adj, restarts) {
    const n = adj.length;
    let best = 0;
    for (let rep = 0; rep < restarts; rep += 1) {
      const ord = Array.from({ length: n }, (_, i) => i);
      shuffle(ord, rng);
      const chosen = [];
      for (const v of ord) {
        let ok = true;
        for (const u of chosen) {
          if (!adj[v][u]) {
            ok = false;
            break;
          }
        }
        if (ok) chosen.push(v);
      }
      if (chosen.length > best) best = chosen.length;
    }
    return best;
  }

  function maxGeneralPositionIntDistSet(pts, adj, restarts) {
    const n = pts.length;
    let best = 0;
    for (let rep = 0; rep < restarts; rep += 1) {
      const ord = Array.from({ length: n }, (_, i) => i);
      shuffle(ord, rng);
      const chosen = [];
      for (const v of ord) {
        let ok = true;

        for (const u of chosen) {
          if (!adj[v][u]) {
            ok = false;
            break;
          }
        }
        if (!ok) continue;

        for (let i = 0; i < chosen.length && ok; i += 1) {
          for (let j = i + 1; j < chosen.length; j += 1) {
            if (collinear(pts[chosen[i]], pts[chosen[j]], pts[v])) {
              ok = false;
              break;
            }
          }
        }
        if (!ok) continue;

        for (let i = 0; i < chosen.length && ok; i += 1) {
          for (let j = i + 1; j < chosen.length && ok; j += 1) {
            for (let k = j + 1; k < chosen.length; k += 1) {
              if (cocircular4(pts[chosen[i]], pts[chosen[j]], pts[chosen[k]], pts[v])) {
                ok = false;
                break;
              }
            }
          }
        }
        if (ok) chosen.push(v);
      }
      if (chosen.length > best) best = chosen.length;
    }
    return best;
  }

  const rows212 = [];
  const rows213 = [];
  for (const M of [4, 5, 6, 7]) {
    const pts = pointsGrid(M);
    const adj = buildIntDistanceAdj(pts);

    const c = maxCliqueGreedy(adj, 450);
    rows212.push({
      M,
      grid_points: pts.length,
      best_all_integer_distance_subset_size_found: c,
      ratio_over_grid_size: Number((c / pts.length).toFixed(6)),
    });

    const g = maxGeneralPositionIntDistSet(pts, adj, 420);
    rows213.push({
      M,
      grid_points: pts.length,
      best_general_position_integer_distance_subset_size_found: g,
    });
  }

  out.results.ep212 = {
    description: 'Integer-grid proxy for large finite all-rational-distance subsets (integer-distance specialization).',
    rows: rows212,
  };

  out.results.ep213 = {
    description: 'Integer-grid proxy for general-position all-integer-distance finite sets.',
    rows: rows213,
  };
}


const single={problem:'EP-213',script:path.basename(process.argv[1]),generated_utc:new Date().toISOString(),result:out.results.ep213};
const OUT=process.env.OUT || path.join('data','ep213_standalone_compute.json');
fs.writeFileSync(OUT, JSON.stringify(single,null,2)+'\n');
console.log(JSON.stringify({problem:'EP-213',out:OUT},null,2));
