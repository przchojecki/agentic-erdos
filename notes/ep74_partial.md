# EP-74 partial resolution

## Statement
Given `f(n)->infinity`, is there an infinite-chromatic graph where every
`n`-vertex subgraph can be made bipartite by deleting at most `f(n)` edges?

## What is resolved
Background gives:
- Rodl construction for graphs of chromatic number `aleph_0` when
  `f(n)=epsilon*n` (any fixed `epsilon>0`).
- Hypergraph analogue proved.

## What remains open in this note
For graphs, sublinear regimes remain open; background explicitly says open even
for `f(n)=sqrt(n)`.

## Status
- linear regime (`epsilon n`) for countable chromatic case: resolved.
- sublinear regime (for example `sqrt(n)`): unresolved.
