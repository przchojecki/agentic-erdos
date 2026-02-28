# EP-663 partial resolution

## Statement
For fixed `k>=2`, with `q(n,k)` the least prime not dividing
`prod_{1<=i<=k}(n+i)`, ask whether
`q(n,k) < (1+o(1)) log n` for large `n`.

## What is resolved
Background records an easy bound:
`q(n,k) < (1+o(1)) k log n`.

## What remains open in this note
Removing the multiplicative factor `k` (for fixed `k`) is not settled in this
entry.

## Status
- `k log n`-scale upper bound: known.
- sharp `(1+o(1)) log n` bound: unresolved.
