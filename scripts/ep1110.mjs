#!/usr/bin/env node

// EP-1110 deep standalone computation:
// n is representable if it is a sum of terms p^a q^b chosen as an antichain
// in divisibility order (no chosen term divides another).

function gcd(a, b) {
  let x = Math.abs(a);
  let y = Math.abs(b);
  while (y !== 0) {
    const t = x % y;
    x = y;
    y = t;
  }
  return x;
}

function termsPQ(p, q, N) {
  const terms = [];
  for (let a = 0, pa = 1; pa <= N; a += 1, pa *= p) {
    for (let b = 0, qb = 1; pa * qb <= N; b += 1, qb *= q) {
      terms.push({ val: pa * qb, a, b });
    }
  }
  terms.sort((x, y) => x.val - y.val || x.a - y.a || x.b - y.b);
  // dedupe values (should not collide for coprime p,q but keep safe)
  const out = [];
  let prev = -1;
  for (const t of terms) {
    if (t.val !== prev) {
      out.push(t);
      prev = t.val;
    }
  }
  return out;
}

function comparable(u, v) {
  return (u.a <= v.a && u.b <= v.b) || (v.a <= u.a && v.b <= u.b);
}

function representabilityProfile(p, q, N, budgetMs) {
  const t0 = Date.now();
  const terms = termsPQ(p, q, N);
  const m = terms.length;

  const comp = Array.from({ length: m }, () => new Uint8Array(m));
  for (let i = 0; i < m; i += 1) {
    for (let j = i + 1; j < m; j += 1) {
      if (comparable(terms[i], terms[j])) {
        comp[i][j] = 1;
        comp[j][i] = 1;
      }
    }
  }

  const rep = new Uint8Array(N + 1);
  let states = 0;
  let timedOut = false;

  function dfs(idx, sum, chosen) {
    if (timedOut) return;
    states += 1;
    if (states % 10000 === 0 && Date.now() - t0 > budgetMs) {
      timedOut = true;
      return;
    }
    rep[sum] = 1;

    for (let i = idx; i < m; i += 1) {
      const t = terms[i].val;
      if (sum + t > N) break;

      let ok = true;
      for (const j of chosen) {
        if (comp[i][j]) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;

      chosen.push(i);
      dfs(i + 1, sum + t, chosen);
      chosen.pop();
      if (timedOut) return;
    }
  }

  dfs(0, 0, []);

  let non = 0;
  let nonCoprime = 0;
  const firstNon = [];
  for (let n = 1; n <= N; n += 1) {
    if (rep[n]) continue;
    non += 1;
    if (gcd(n, p * q) === 1) nonCoprime += 1;
    if (firstNon.length < 60) firstNon.push(n);
  }

  return {
    p,
    q,
    N,
    terms_count: m,
    dfs_states: states,
    timed_out: timedOut,
    non_count: non,
    non_density: Number((non / N).toFixed(10)),
    non_coprime_to_pq_count: nonCoprime,
    non_coprime_density_over_N: Number((nonCoprime / N).toFixed(10)),
    first_nonrepresentable: firstNon,
    elapsed_ms: Date.now() - t0,
  };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const N = Number(process.env.N || (depth >= 4 ? 50000 : 8000));
  const budgetMs = Number(process.env.BUDGET_MS || (depth >= 4 ? 60000 : 8000));

  const pairs = depth >= 4
    ? (() => {
        const plist = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47];
        const out = [];
        for (let i = 0; i < plist.length; i += 1) {
          for (let j = 0; j < plist.length; j += 1) {
            if (plist[i] > plist[j]) out.push([plist[i], plist[j]]);
          }
        }
        return out;
      })()
    : [
        [2, 3],
        [5, 2],
        [7, 3],
      ];

  const rows = pairs.map(([p, q]) => representabilityProfile(p, q, N, budgetMs));

  const payload = {
    problem: 'EP-1110',
    script: 'ep1110.mjs',
    method: 'deep_antichain_sum_enumeration_for_pq_power_terms_with_divisibility_incomparability_constraint',
    warning: 'Exact where timed_out=false; timed-out rows provide lower-bound representability only.',
    params: { depth, N, budgetMs, pairs },
    rows,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
