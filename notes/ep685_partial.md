# EP-685 partial resolution

## Statement
Estimate number of distinct prime divisors of `binom(n,k)` in the range
`n^epsilon < k <= n^{1-epsilon}` and possible extensions.

## What is resolved
Background records a baseline lower bound from size considerations:
number of prime factors is greater than
`log binom(n,k) / log n`, asymptotically sharp when `k > n^{1-o(1)}`.

## What remains open in this note
The proposed asymptotic formula in the broad mid-range is not resolved by the
cited baseline.

## Status
- trivial baseline and high-`k` sharpness regime: known.
- main mid-range asymptotic formula: unresolved.
