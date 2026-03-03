# EP-162 partial

## Attempt in this batch
Reworked the problem as a 2-color discrepancy-on-subsets threshold:
find largest `k` such that some edge-coloring of `K_n` keeps both color densities
above `alpha` on every induced subgraph of size `>=k`.

## Hard point
Background already gives matching-order logarithmic bounds
`c_1(alpha) log n < F(n,alpha) < c_2(alpha) log n`.
The unresolved part is sharp asymptotics `F(n,alpha) ~ c_alpha log n`.
No new argument was found to identify `c_alpha` or tighten constants.

## Status
No new theorem/counterexample in this batch.
