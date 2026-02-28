# EP-389 deep attempt with bounded computation

## Statement
For each `n>=1`, does there exist `k` such that
`n(n+1)...(n+k-1)` divides `(n+k)...(n+2k-1)`?

## Attempt route
Checked prime-valuation divisibility condition with bounded search over `k`.

## Computation signal
For `n<=30` and search cap `k<=300`, witnesses were found for
`n=1,2,3,4,5` with `k=1,5,4,207,206` respectively; no witness appeared up to the
cap for `n=6` through `30`.

## Obstacle
Bounded search cannot rule out larger `k`.

## Status
- finite-range data supports nontrivial behavior.
- universal existence remains unresolved.
