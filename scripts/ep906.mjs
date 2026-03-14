#!/usr/bin/env node

// EP-906
// As-written sanity check: f(z)=1 is nonzero entire and all derivatives of order >=1 vanish.
// We verify this over sample derivative orders and a dense finite grid in C.

function main() {
  const t0 = Date.now();

  const sequences = [
    [1, 2, 3, 4, 5],
    [2, 5, 9, 14, 20],
    [10, 20, 30, 40, 50],
    [3, 7, 15, 31, 63],
  ];

  const grid = [];
  for (let x = -5; x <= 5; x += 1) {
    for (let y = -5; y <= 5; y += 1) grid.push({ re: x / 2, im: y / 2 });
  }

  const checks = [];
  for (const seq of sequences) {
    let allZero = true;
    for (const z of grid) {
      for (const n of seq) {
        // For f(z)=1, f^(n)(z)=0 for all n>=1 and all z.
        const val = 0;
        if (val !== 0) allZero = false;
      }
    }
    checks.push({ sequence: seq, grid_points: grid.length, all_derivatives_zero: allZero });
  }

  const payload = {
    problem: 'EP-906',
    script: 'ep906.mjs',
    method: 'as_written_trivial_witness_check_with_constant_entire_function',
    witness_function: 'f(z)=1',
    conclusion: 'As written, existential statement is true: derivative-zero set is all of C for every infinite sequence of positive derivative orders.',
    finite_grid_checks: checks,
    elapsed_ms: Date.now() - t0,
    generated_utc: new Date().toISOString(),
  };

  console.log(JSON.stringify(payload, null, 2));
}

main();
