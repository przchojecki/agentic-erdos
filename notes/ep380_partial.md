# EP-380 partial resolution

## Statement
Let `B(x)` count integers up to `x` that lie in at least one "bad" interval,
where the largest prime factor of the interval product appears with multiplicity
at least two. Compare `B(x)` to counts of numbers with `P(n)^2|n`.

## What is resolved
Background provides a proved lower bound:
`B(x) > x^{1-o(1)}`.

It also gives an asymptotic formula for the comparison quantity
`#{n<=x : P(n)^2|n}`.

## What remains open in this note
The proposed asymptotic equivalence between `B(x)` and that comparison count is
not proved in the cited material.

## Status
- nontrivial lower bound and model-count asymptotic: known.
- exact asymptotic matching: unresolved.
