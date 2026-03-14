#!/usr/bin/env node

// EP-901
// Deeper constructive upper-bound search for m(n): the minimum number of edges
// in a non-2-colorable n-uniform hypergraph.

function makeRng(seed) {
  let x = seed >>> 0;
  return function rng() {
    x ^= x << 13;
    x ^= x >>> 17;
    x ^= x << 5;
    return ((x >>> 0) / 4294967296);
  };
}

function combinationsMasks(v, r) {
  const out = [];
  const cur = [];
  function rec(start, need) {
    if (need === 0) {
      let mask = 0;
      for (const x of cur) mask |= (1 << x);
      out.push(mask);
      return;
    }
    for (let x = start; x <= v - need; x += 1) {
      cur.push(x);
      rec(x + 1, need - 1);
      cur.pop();
    }
  }
  rec(0, r);
  return out;
}

function greedyConstruct(v, n, cfg, rng) {
  const full = (1 << v) - 1;
  const edgesAll = combinationsMasks(v, n);
  const used = new Uint8Array(edgesAll.length);
  const alive = [];
  for (let c = 0; c < (1 << v); c += 1) alive.push(c);

  const chosen = [];

  for (let step = 0; step < cfg.stepsCap && alive.length > 0; step += 1) {
    let bestIdx = -1;
    let bestKill = -1;

    for (let t = 0; t < cfg.sampleCand; t += 1) {
      const idx = Math.floor(rng() * edgesAll.length);
      if (used[idx]) continue;
      const e = edgesAll[idx];
      let kill = 0;
      for (const c of alive) {
        const comp = full ^ c;
        if ((e & c) === e || (e & comp) === e) kill += 1;
      }
      if (kill > bestKill) {
        bestKill = kill;
        bestIdx = idx;
      }
    }

    if (bestIdx < 0) break;

    used[bestIdx] = 1;
    const e = edgesAll[bestIdx];
    chosen.push(e);

    let w = 0;
    for (let i = 0; i < alive.length; i += 1) {
      const c = alive[i];
      const comp = full ^ c;
      if (!((e & c) === e || (e & comp) === e)) {
        alive[w] = c;
        w += 1;
      }
    }
    alive.length = w;
  }

  return {
    edge_count: chosen.length,
    remaining_colorings: alive.length,
    success_non2colorable: alive.length === 0,
  };
}

function runConfigForN(n, cfgBase) {
  const vValues = [];
  for (let v = cfgBase.vMin; v <= cfgBase.vMax; v += 1) vValues.push(v);

  const rows = [];
  let best = null;

  for (const v of vValues) {
    let bestForV = null;
    for (let r = 0; r < cfgBase.restarts; r += 1) {
      const rng = makeRng((20260313 ^ (n * 1009) ^ (v * 65537) ^ (r * 8191)) >>> 0);
      const out = greedyConstruct(v, n, cfgBase, rng);

      if (
        !bestForV ||
        (out.success_non2colorable && !bestForV.success_non2colorable) ||
        (out.success_non2colorable === bestForV.success_non2colorable &&
          out.edge_count < bestForV.edge_count) ||
        (out.success_non2colorable === bestForV.success_non2colorable &&
          out.edge_count === bestForV.edge_count &&
          out.remaining_colorings < bestForV.remaining_colorings)
      ) {
        bestForV = out;
      }
    }

    const row = {
      n,
      v,
      restarts: cfgBase.restarts,
      stepsCap: cfgBase.stepsCap,
      sampleCand: cfgBase.sampleCand,
      best_edges_found: bestForV.edge_count,
      best_remaining_colorings: bestForV.remaining_colorings,
      found_non2colorable_witness: bestForV.success_non2colorable,
      ratio_over_2_pow_n: Number((bestForV.edge_count / (2 ** n)).toFixed(8)),
    };
    rows.push(row);

    if (
      !best ||
      (row.found_non2colorable_witness && !best.found_non2colorable_witness) ||
      (row.found_non2colorable_witness === best.found_non2colorable_witness && row.best_edges_found < best.best_edges_found)
    ) {
      best = row;
    }
  }

  return { n, rows, best_for_n: best, trivial_lower_bound_2_pow_n_minus_1: 2 ** (n - 1) };
}

function main() {
  const t0 = Date.now();

  const configs = [
    { n: 4, vMin: 8, vMax: 11, restarts: 70, sampleCand: 320, stepsCap: 420 },
    { n: 5, vMin: 10, vMax: 13, restarts: 60, sampleCand: 280, stepsCap: 420 },
    { n: 6, vMin: 12, vMax: 14, restarts: 45, sampleCand: 220, stepsCap: 420 },
    { n: 7, vMin: 14, vMax: 15, restarts: 24, sampleCand: 160, stepsCap: 420 },
  ];

  const perN = configs.map((cfg) => runConfigForN(cfg.n, cfg));
  const globalBest = perN.map((x) => x.best_for_n);

  const payload = {
    problem: 'EP-901',
    script: 'ep901.mjs',
    method: 'deeper_multirestart_greedy_search_for_non2colorable_n_uniform_hypergraphs',
    warning: 'Constructive finite upper bounds only; not exact m(n) and not asymptotic proof.',
    configs,
    per_n_results: perN,
    global_best_rows: globalBest,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
