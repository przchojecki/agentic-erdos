# EP-883 partial resolution

## Statement split
1. Under the threshold
   `|A| > floor(n/2)+floor(n/3)-floor(n/6)`, must `G(A)` contain all odd cycles
   of length `<= n/3 + 1`?
2. For every fixed `ell>=1`, under the same threshold and large `n`, must `G(A)`
   contain a complete `(1,ell,ell)` tripartite graph?

## What is resolved
Background says S\'ark\"ozy (1999) solved the second question by proving that, for large `n`,
`G(A)` contains a complete `(1,ell,ell)` with

`ell >> log n / log log n`.

Since this `ell` tends to infinity, for any fixed target `ell_0` and all sufficiently
large `n`, one has `ell >= ell_0`; therefore subquestion (2) is true.

## What remains open in this note
Background gives for subquestion (1) only a weaker cycle result:
all odd cycles up to length `<= c n` for some constant `c>0`.
That does not by itself establish the stated `n/3+1` range.

## Status
- Second subquestion: resolved (true, by stronger growth of `ell`).
- First subquestion: unresolved here.
