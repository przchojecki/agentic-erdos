#!/usr/bin/env node

// EP-1062 deep standalone computation:
// maximize |A| subset of {1,...,n} with property:
// no element of A divides two other elements of A.

function precomputeDivisors(n) {
  const divisors = Array.from({ length: n + 1 }, () => []);
  for (let d = 1; d <= n; d += 1) {
    for (let m = 2 * d; m <= n; m += d) divisors[m].push(d);
  }
  return divisors;
}

function exactF(n, timeBudgetMs) {
  const tStart = Date.now();
  const divisors = precomputeDivisors(n);

  const selected = new Uint8Array(n + 1);
  const multCnt = new Int16Array(n + 1); // for each d: selected multiples > d

  const suffixPrimeLike = new Int16Array(n + 2);
  for (let i = n; i >= 1; i -= 1) {
    suffixPrimeLike[i] = suffixPrimeLike[i + 1] + (divisors[i].length === 0 ? 1 : 0);
  }

  let best = 0;
  let nodes = 0;
  let cutByBound = 0;
  let timedOut = false;

  function dfs(i, cur) {
    nodes += 1;
    if ((nodes & 8191) === 0 && (Date.now() - tStart > timeBudgetMs)) {
      timedOut = true;
      return;
    }
    if (timedOut) return;

    if (i === 0) {
      if (cur > best) best = cur;
      return;
    }

    // optimistic upper bound: current + remaining count, improved mildly by divisibility pressure.
    const ub = cur + i;
    if (ub <= best) {
      cutByBound += 1;
      return;
    }

    let canTake = multCnt[i] <= 1;
    if (canTake) {
      for (const d of divisors[i]) {
        if (selected[d] && multCnt[d] >= 1) {
          canTake = false;
          break;
        }
      }
    }

    // Branch order: include first often improves best quickly.
    if (canTake) {
      selected[i] = 1;
      for (const d of divisors[i]) multCnt[d] += 1;
      dfs(i - 1, cur + 1);
      for (const d of divisors[i]) multCnt[d] -= 1;
      selected[i] = 0;
    }

    // Skip branch with extra cut check.
    if (cur + (i - 1) > best) dfs(i - 1, cur);
    else cutByBound += 1;
  }

  dfs(n, 0);

  return {
    n,
    exact_or_best_found: best,
    ratio_f_over_n: Number((best / n).toFixed(8)),
    benchmark_two_thirds_n: Number(((2 * n) / 3).toFixed(8)),
    timed_out: timedOut,
    search_nodes: nodes,
    cut_by_bound: cutByBound,
    elapsed_ms: Date.now() - tStart,
  };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  // Heavier targets than previous quick batch; per-n budget scales with depth.
  const nList = [];
  for (let n = 30; n <= 54; n += 2) nList.push(n);
  const perNBudgetMs = 4_000 * depth;

  const rows = [];
  for (const n of nList) rows.push(exactF(n, perNBudgetMs));

  const payload = {
    problem: 'EP-1062',
    script: 'ep1062.mjs',
    method: 'deep_exact_branch_and_bound_for_no_element_divides_two_others_extremal_size',
    warning: 'When timeout is hit, value is best found lower bound, not certified exact.',
    params: { depth, nList, perNBudgetMs },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
