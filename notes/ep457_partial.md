# EP-457 partial resolution

## Statement
Is there `epsilon>0` with infinitely many `n` such that every prime
`p <= (2+epsilon) log n` divides `prod_{1<=i<=log n}(n+i)`?

## What is resolved
Background gives a construction yielding
`q(n,log n) >= (2+o(1)) log n` for infinitely many `n`, where `q` is the least
missing prime divisor.

## What remains open in this note
The strict improvement to `(2+epsilon) log n` is not proved by the cited
construction.

## Status
- threshold at `2+o(1)`: known.
- fixed `2+epsilon` improvement infinitely often: unresolved.
