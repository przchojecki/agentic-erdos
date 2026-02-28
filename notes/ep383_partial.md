# EP-383 deep attempt with computation

## Statement
For every `k`, are there infinitely many primes `p` such that the largest prime
factor of `prod_{0<=i<=k}(p^2+i)` equals `p`?

## Attempt route
Used smoothness heuristic in background and performed finite prime searches for
small `k`.

## Computation signal
For primes `p<=50000`, sample witnesses were found for each `k=1,2,3,4,5`.
Example: for `k=5`, found `p in {15361, 43777, 44531, 45131}`.

## Obstacle
Finite witness lists do not imply infinitude for any fixed `k`.

## Status
- heuristic and finite-range positive evidence: present.
- theorem proving infinitude: unresolved.
