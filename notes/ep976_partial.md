# EP-976 partial attempt

## Route
Compared the target growth questions with known unconditional lower bounds in background and ran finite polynomial scans for representative irreducible examples.

## Evidence from this batch
- `data/ep976_poly_largest_prime_scan.json` (quadratic examples up to `n=5000`) shows very large observed `F_f(n)` values, often on near-`n^2` finite scale in those examples.

## What is known
Background records unconditional bounds of shape
`F_f(n) >> n * exp((log n)^c)` (Tenenbaum).

## Hard point
That lower bound is stronger than `n log n` but does not by itself force a fixed-power gain `n^{1+delta}`. The asked `n^{1+c}` and especially `n^d` lower targets remain unresolved in this batch.

## Status
Open targets; finite data is suggestive but non-conclusive.
