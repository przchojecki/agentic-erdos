# EP-836 partial resolution

## Statement
For an `r`-uniform hypergraph `G` with chromatic number `3` and pairwise-intersecting edges:
1. Must `|V(G)| = O(r^2)`?
2. Must there exist two edges with intersection size `>> r`?

## First question: false
The background includes Alon's construction:
- Vertex set is `X ∪ Y`, where `|X| = 2r-2` and
  `|Y| = (1/2) * C(2r-2, r-1)`.
- `Y` indexes equipartitions of `X` into two `(r-1)`-subsets.
- Edges are:
  1. all `r`-subsets of `X`;
  2. for each `y in Y`, all sets `{y} ∪ S` where `S` is one side of the partition indexed by `y`.

This hypergraph is intersecting, 3-chromatic, and has

`|V(G)| = |X| + |Y| = (2r-2) + (1/2)C(2r-2,r-1) = Theta(4^r / sqrt(r))`,

which is not `O(r^2)`.

So the first question is disproved.

## Second question: still open in this note
The same background records Erdős–Lovász lower bound:

there exist two edges meeting in `>> r / log r`.

This does not settle whether one can force `>> r`.

## Status
- First subquestion: resolved (false).
- Second subquestion: unresolved here.

