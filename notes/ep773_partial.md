# EP-773 partial attempt

## Route
Ran repeated random-greedy Sidon extraction from square sets `{1^2,...,N^2}` to profile achievable finite-size growth.

## Evidence from this batch
- `data/ep773_squares_sidon_random_greedy.json` (`N` up to `2500`, `1200` trials each):
  - best sizes from `38` (`N=100`) to `277` (`N=2500`),
  - empirical exponent `log(best)/log(N)` around `0.72` to `0.79`.

## Hard point
Heuristic extraction is not extremal and cannot decide whether the true optimum reaches `N^{1-o(1)}`.

## Status
Finite growth signal between known lower/upper regimes; asymptotic exponent remains open.
