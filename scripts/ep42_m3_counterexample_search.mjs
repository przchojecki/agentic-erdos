#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

// EP-42 focused search for M=3 counterexamples at larger N.
// We seek a Sidon set A subset [1..N] such that there is NO Sidon triple
// B={x<y<z} with (A-A) ∩ (B-B) = {0}.
//
// For triples B, this is equivalent to:
// there are no distinct a,b in C with a+b in C, where
// C = {1,...,N-1} \ D(A), D(A)=positive differences of A.
//
// So we search Sidon A minimizing the count of distinct Schur triples in C.

const N_LIST = (process.env.N_LIST || '64,72,80,96,120')
  .split(',')
  .map((x) => Number(x.trim()))
  .filter((x) => Number.isInteger(x) && x >= 10);
const M_MIN = Number(process.env.M_MIN || 8);
const M_MAX = Number(process.env.M_MAX || 18);
const RESTARTS = Number(process.env.RESTARTS || 60);
const STEPS = Number(process.env.STEPS || 18000);
const SEED = Number(process.env.SEED || 20260303);
const VERIFY_DIRECT = Number(process.env.VERIFY_DIRECT || 1) !== 0;

function makeRng(seed) {
  let x = (seed >>> 0) || 1;
  return () => {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return (x >>> 0) / 4294967296;
  };
}

function shuffleInPlace(arr, rng) {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(rng() * (i + 1));
    const t = arr[i];
    arr[i] = arr[j];
    arr[j] = t;
  }
}

function buildDiffUsed(A, N) {
  const used = new Uint8Array(N);
  for (let i = 0; i < A.length; i += 1) {
    for (let j = i + 1; j < A.length; j += 1) {
      const d = Math.abs(A[j] - A[i]);
      if (d <= 0 || d >= N || used[d]) return null;
      used[d] = 1;
    }
  }
  return used;
}

function randomSidonSet(N, m, rng) {
  const base = Array.from({ length: N }, (_, i) => i + 1);
  for (let attempt = 0; attempt < 300; attempt += 1) {
    const perm = base.slice();
    shuffleInPlace(perm, rng);
    const A = [];
    const used = new Uint8Array(N);

    for (const x of perm) {
      let ok = true;
      const toAdd = [];
      for (const y of A) {
        const d = Math.abs(x - y);
        if (used[d]) {
          ok = false;
          break;
        }
        toAdd.push(d);
      }
      if (!ok) continue;
      A.push(x);
      for (const d of toAdd) used[d] = 1;
      if (A.length >= m) break;
    }

    if (A.length >= m) {
      A.length = m;
      A.sort((a, b) => a - b);
      return A;
    }
  }
  return null;
}

function evaluateBadDistinctSchur(usedDiff, N) {
  const inC = new Uint8Array(N);
  let cSize = 0;
  for (let d = 1; d <= N - 1; d += 1) {
    if (!usedDiff[d]) {
      inC[d] = 1;
      cSize += 1;
    }
  }

  let bad = 0;
  let sample = null;
  for (let a = 1; a <= N - 1; a += 1) {
    if (!inC[a]) continue;
    for (let b = a + 1; a + b <= N - 1; b += 1) {
      if (!inC[b]) continue;
      if (inC[a + b]) {
        bad += 1;
        if (!sample) sample = [a, b, a + b];
      }
    }
  }

  return { bad, cSize, sample };
}

function directWitnessB(usedDiff, N) {
  for (let x = 1; x <= N - 2; x += 1) {
    for (let y = x + 1; y <= N - 1; y += 1) {
      const d1 = y - x;
      if (usedDiff[d1]) continue;
      for (let z = y + 1; z <= N; z += 1) {
        const d2 = z - y;
        const d3 = z - x;
        if (d1 === d2) continue; // non-Sidon triple (3-term AP)
        if (!usedDiff[d2] && !usedDiff[d3]) {
          return { B: [x, y, z], differences: [d1, d2, d3] };
        }
      }
    }
  }
  return null;
}

function hasDuplicateValues(A) {
  for (let i = 1; i < A.length; i += 1) if (A[i] === A[i - 1]) return true;
  return false;
}

const rng = makeRng(SEED);
const results = [];

for (const N of N_LIST) {
  const started = Date.now();
  let globalBest = null;
  let foundExact = null;
  const tried = [];

  for (let m = M_MIN; m <= M_MAX; m += 1) {
    let bestForM = null;

    for (let r = 0; r < RESTARTS; r += 1) {
      let cur = randomSidonSet(N, m, rng);
      if (!cur) continue;
      let curUsed = buildDiffUsed(cur, N);
      if (!curUsed) continue;
      let curEval = evaluateBadDistinctSchur(curUsed, N);

      let bestLocal = { A: cur.slice(), used: curUsed, ...curEval };

      for (let step = 0; step < STEPS; step += 1) {
        const idx = Math.floor(rng() * m);
        let x = 1 + Math.floor(rng() * N);
        let guard = 0;
        while (cur.includes(x) && guard < 25) {
          x = 1 + Math.floor(rng() * N);
          guard += 1;
        }
        if (cur.includes(x)) continue;

        const cand = cur.slice();
        cand[idx] = x;
        cand.sort((a, b) => a - b);
        if (hasDuplicateValues(cand)) continue;

        const candUsed = buildDiffUsed(cand, N);
        if (!candUsed) continue;
        const candEval = evaluateBadDistinctSchur(candUsed, N);

        const temp = 0.02 + 0.25 * (1 - step / Math.max(1, STEPS - 1));
        const delta = curEval.bad - candEval.bad;
        const accept = delta >= 0 || rng() < Math.exp(delta / temp);

        if (accept) {
          cur = cand;
          curUsed = candUsed;
          curEval = candEval;
        }

        if (
          candEval.bad < bestLocal.bad ||
          (candEval.bad === bestLocal.bad && candEval.cSize > bestLocal.cSize)
        ) {
          bestLocal = { A: cand.slice(), used: candUsed, ...candEval };
        }

        if (bestLocal.bad === 0) break;
      }

      if (
        !bestForM ||
        bestLocal.bad < bestForM.bad ||
        (bestLocal.bad === bestForM.bad && bestLocal.cSize > bestForM.cSize)
      ) {
        bestForM = { ...bestLocal, m, restart: r + 1 };
      }

      if (
        !globalBest ||
        bestLocal.bad < globalBest.bad ||
        (bestLocal.bad === globalBest.bad && bestLocal.cSize > globalBest.cSize)
      ) {
        globalBest = { ...bestLocal, m, restart: r + 1 };
      }

      if (bestLocal.bad === 0) {
        foundExact = { ...bestLocal, m, restart: r + 1 };
        break;
      }
    }

    if (bestForM) {
      tried.push({
        m,
        best_bad_distinct_schur: bestForM.bad,
        best_c_size: bestForM.cSize,
        sample_bad_triple: bestForM.sample,
      });
    }

    if (foundExact) break;
  }

  let certification = null;
  if (VERIFY_DIRECT && foundExact) {
    const witness = directWitnessB(foundExact.used, N);
    certification = {
      direct_B_witness_exists: witness !== null,
      witness,
    };
  }

  const row = {
    N,
    params: {
      m_min: M_MIN,
      m_max: M_MAX,
      restarts: RESTARTS,
      steps: STEPS,
    },
    found_exact_bad0: foundExact
      ? {
          m: foundExact.m,
          restart: foundExact.restart,
          A: foundExact.A,
          c_size: foundExact.cSize,
        }
      : null,
    certification,
    global_best: globalBest
      ? {
          m: globalBest.m,
          restart: globalBest.restart,
          best_bad_distinct_schur: globalBest.bad,
          best_c_size: globalBest.cSize,
          sample_bad_triple: globalBest.sample,
          A: globalBest.A,
        }
      : null,
    tried_by_m: tried,
    runtime_ms: Date.now() - started,
  };

  results.push(row);
  process.stderr.write(
    `N=${N} done: found_bad0=${Boolean(foundExact)} best_bad=${row.global_best?.best_bad_distinct_schur}\n`
  );
}

const out = {
  problem: 'EP-42',
  script: path.basename(process.argv[1]),
  method: 'annealed_search_for_M3_counterexample_via_complement_distinct_schur_obstruction',
  params: {
    n_list: N_LIST,
    m_min: M_MIN,
    m_max: M_MAX,
    restarts: RESTARTS,
    steps: STEPS,
    verify_direct: VERIFY_DIRECT,
    seed: SEED,
  },
  results,
  generated_utc: new Date().toISOString(),
};

const outPath = path.join('data', 'ep42_m3_counterexample_search.json');
fs.writeFileSync(outPath, `${JSON.stringify(out, null, 2)}\n`);
console.log(
  JSON.stringify(
    {
      outPath,
      summary: results.map((r) => ({
        N: r.N,
        found_bad0: Boolean(r.found_exact_bad0),
        best_bad: r.global_best?.best_bad_distinct_schur,
        best_m: r.global_best?.m,
      })),
    },
    null,
    2
  )
);
