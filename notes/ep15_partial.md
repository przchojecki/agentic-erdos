# EP-15 partial attempt

## Route
Counterexample-oriented numerical scan of partial sums of
`sum (-1)^n n/p_n`, combined with analytic comparison to slowly varying alternating terms.

## Evidence from this batch
- `data/ep15_alternating_prime_series_scan.json` up to `n=2*10^6`:
  partial sums stay in a narrow range and drift slowly (value about `-0.0213` at the endpoint).

## What is resolved from background
- Conditional convergence is known under a strong Hardy-Littlewood tuples hypothesis.

## Hard point
Unconditional control of oscillations in `n/p_n` around the alternating scale is the main barrier.

## Status
Numerical behavior is compatible with convergence; unconditional proof remains open.
