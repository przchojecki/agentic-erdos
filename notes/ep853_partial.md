# EP-853 partial attempt

## Route
Scanned prime-gap coverage by index `n` and tracked
`r(x)`: smallest even gap not yet seen among `d_1,...,d_x`.

## Evidence from this batch
- `data/ep853_prime_gap_coverage_scan.json`:
  - `r(10^4)=66`, `r(10^5)=102`, `r(10^6)=156`.
  - `r(x)/log x` increased over scanned checkpoints.

## Hard point
Finite growth of `r(x)` does not establish `r(x)->infty` or `r(x)/log x->infty` asymptotically.

## Status
No proof; finite evidence is consistent with growth.
