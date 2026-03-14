#!/usr/bin/env node

// EP-1005 deep standalone computation:
// Exact f(n) from the definition on Farey sequence F_n.
// f(n) = max f such that for all 1<=k<l<=k+f,
// (a_k-a_l)(b_k-b_l) >= 0.
// Equivalent: if d_min is the smallest index gap with a discordant pair,
// then f(n) = d_min - 1.

function fareySequence(n) {
  const numer = [0];
  const denom = [1];

  let a = 0;
  let b = 1;
  let c = 1;
  let d = n;

  while (c <= n) {
    numer.push(c);
    denom.push(d);
    const k = Math.floor((n + b) / d);
    const e = k * c - a;
    const f = k * d - b;
    a = c;
    b = d;
    c = e;
    d = f;
  }

  return { numer, denom };
}

function isDiscordant(ai, bi, aj, bj) {
  return (ai < aj && bi > bj) || (ai > aj && bi < bj);
}

function exactFfromDefinition(numer, denom) {
  const L = numer.length;
  for (let gap = 1; gap < L; gap += 1) {
    for (let i = 0, j = gap; j < L; i += 1, j += 1) {
      if (isDiscordant(numer[i], denom[i], numer[j], denom[j])) {
        return {
          f: gap - 1,
          witness: {
            i,
            j,
            gap,
            left: `${numer[i]}/${denom[i]}`,
            right: `${numer[j]}/${denom[j]}`,
          },
        };
      }
    }
  }

  return {
    f: L - 1,
    witness: null,
  };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));

  const nList =
    depth >= 4
      ? [180, 240, 300, 360, 480, 600, 720, 840, 960, 1080, 1200]
      : depth >= 2
        ? [160, 220, 280, 340, 420, 520, 640, 760]
        : [120, 180, 240, 320, 400, 500, 600];

  const rows = [];
  let totalPairChecks = 0;

  for (const n of nList) {
    const tN0 = Date.now();
    const { numer, denom } = fareySequence(n);
    const L = numer.length;

    let pairChecksForN = 0;
    let found = null;

    for (let gap = 1; gap < L && found === null; gap += 1) {
      for (let i = 0, j = gap; j < L; i += 1, j += 1) {
        pairChecksForN += 1;
        if (isDiscordant(numer[i], denom[i], numer[j], denom[j])) {
          found = {
            f: gap - 1,
            witness: {
              i,
              j,
              gap,
              left: `${numer[i]}/${denom[i]}`,
              right: `${numer[j]}/${denom[j]}`,
            },
          };
          break;
        }
      }
    }

    const result =
      found || {
        f: L - 1,
        witness: null,
      };

    totalPairChecks += pairChecksForN;
    rows.push({
      n,
      farey_length: L,
      f_n_exact_in_this_computation: result.f,
      f_over_n: Number((result.f / n).toFixed(10)),
      n_over_4: Number((n / 4).toFixed(10)),
      pair_checks: pairChecksForN,
      elapsed_ms_for_n: Date.now() - tN0,
      first_discordant_witness: result.witness,
    });
  }

  const payload = {
    problem: 'EP-1005',
    script: 'ep1005.mjs',
    method: 'exact_farey_pair_gap_scan_from_problem_definition',
    warning: 'Exact finite values for listed n only; asymptotic constant remains open.',
    params: { depth, nList },
    rows,
    total_pair_checks: totalPairChecks,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
