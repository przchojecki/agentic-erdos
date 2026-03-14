#!/usr/bin/env node

// EP-3 standalone computation:
// Deep profile for ascending greedy 3-AP-free set and harmonic-sum behavior.

function hasOnly01TernaryDigits(n) {
  let x = n;
  while (x > 0) {
    if (x % 3 === 2) return false;
    x = Math.floor(x / 3);
  }
  return true;
}

function greedy3ApFreeProfile(Nmax, checkpointsSet) {
  const inSet = new Uint8Array(Nmax + 1);
  const A = [];
  let harmonic = 0.0;
  let maxN = 0;
  let mismatchCount01Ternary = 0;
  const rows = [];

  for (let n = 1; n <= Nmax; n += 1) {
    let ok = true;
    // Need only y > n/2, since x=2y-n must be positive.
    for (let i = A.length - 1; i >= 0; i -= 1) {
      const y = A[i];
      if (2 * y <= n) break;
      const x = 2 * y - n;
      if (inSet[x]) {
        ok = false;
        break;
      }
    }
    if (ok) {
      inSet[n] = 1;
      A.push(n);
      harmonic += 1 / n;
      maxN = n;
      if (!hasOnly01TernaryDigits(n)) mismatchCount01Ternary += 1;
    }

    if (!checkpointsSet.has(n)) continue;
    const alpha = Math.log(A.length) / Math.log(n);
    rows.push({
      N: n,
      greedy_3ap_free_size: A.length,
      harmonic_sum_over_set: Number(harmonic.toFixed(10)),
      exponent_log_size_over_logN: Number(alpha.toFixed(10)),
      size_over_N_pow_log3_2: Number((A.length / n ** (Math.log(2) / Math.log(3))).toFixed(10)),
      max_selected_element: maxN,
      selected_non_01_ternary_count: mismatchCount01Ternary,
    });
  }

  return { rows, finalSize: A.length, finalHarmonic: harmonic, mismatchCount01Ternary };
}

function main() {
  const t0 = Date.now();
  const depth = Math.max(1, Number(process.env.DEPTH || 1));
  const Nmax = Number(process.env.NMAX || (depth >= 4 ? 10000000 : 1000000));
  const checkpoints = [];
  for (let p = 3; p <= 7; p += 1) checkpoints.push(10 ** p);
  checkpoints.push(Math.floor(Nmax / 2), Nmax);
  const checkpointsSet = new Set(checkpoints.filter((x) => x >= 1 && x <= Nmax));

  const prof = greedy3ApFreeProfile(Nmax, checkpointsSet);

  const payload = {
    problem: 'EP-3',
    script: 'ep3.mjs',
    method: 'deep_long_range_profile_of_ascending_greedy_3AP_free_set_with_harmonic_tracking',
    warning:
      'This studies one canonical 3-AP-free construction only and does not settle the full all-k divergent-harmonic implication.',
    params: { depth, Nmax, checkpoints: Array.from(checkpointsSet).sort((a, b) => a - b) },
    rows: prof.rows,
    summary: {
      final_size: prof.finalSize,
      final_harmonic_sum: Number(prof.finalHarmonic.toFixed(10)),
      selected_non_01_ternary_count: prof.mismatchCount01Ternary,
    },
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
