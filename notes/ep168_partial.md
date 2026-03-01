# EP-168 partial

## Statement
Let `F(N)` be the largest size of a subset of `{1,...,N}` with no triple
`{n,2n,3n}`. Determine `lim F(N)/N` and whether this limit is irrational.

## Attempt in this batch
I solved the exact finite optimization for small `N` as a 3-uniform independent
set problem on edges `{n,2n,3n}` with branch-and-bound plus propagation.

Data file:
- `data/ep168_exact_small_scan.json`

## Result
Exact values for `20 <= N <= 75` (step 5):
- Most sampled points gave exact ratio `F(N)/N = 0.8`.
- One sample (`N=50`) gave `41/50 = 0.82`.

## Hard point
This finite exact frontier is consistent with a stable density near `0.8`,
but it does not determine the true limit or address irrationality.

