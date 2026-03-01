# EP-460 partial attempt

## Route
Converted the greedy condition into a prime-support exclusion process on `b=n-a`, validated against naive construction for small `n`, and scanned up to `n=12000`.

## Evidence from this batch
- `data/ep460_greedy_sequence_scan.json`: observed reciprocal sums `sum_{0<a_i<n} 1/a_i` in roughly `2.2-3.2` range over scanned `n`, with maximum about `3.159` at `n=10343`.
- Decomposition by least-prime-factor condition (`P^-(n-a) <= a` vs complement) shows most mass in the complement in this finite range.

## Hard point
Finite-range growth and fluctuations do not imply `n->infty` divergence for every `n`-parameter instance, and the exact intended variant in sources is partly ambiguous.

## Status
No full proof; finite evidence only.
