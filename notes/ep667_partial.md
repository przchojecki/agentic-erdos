# EP-667 partial resolution

## Statement
For local edge-density constraints on all `p`-vertex sets, define
`c(p,q)=liminf log H(n)/log n`. Is `c(p,q)` strictly increasing in `q` over the
specified range?

## What is resolved
Background gives anchor values/bounds:
- `q=1`: Ramsey-type bounds, e.g. `1/(p-1) <= c(p,1) <= 2/(p+1)`.
- `q=binom(p-1,2)+1`: `c(p,q)=1`.
- `q=binom(p-1,2)`: upper bound `c(...) <= 1/2`.

## What remains open in this note
Strict monotonicity in `q` across the full interval is not resolved by these
points.

## Status
- endpoint/near-endpoint values and bounds: known.
- full monotonicity question: unresolved.
