# EP-302 partial resolution

## Statement
Let `f(N)` be the largest size of `A subseteq {1,...,N}` with no distinct
`a,b,c in A` satisfying

`1/a = 1/b + 1/c`.

Question includes: is `f(N) = (1/2+o(1))N`?

## What is resolved
Background already gives stronger lower bounds:
- `f(N) >= (5/8+o(1))N` (Cambie construction in background);
- and upper bound `f(N) <= (9/10+o(1))N` (van Doorn, as recorded in background).

Therefore the specific subquestion `f(N)=(1/2+o(1))N` is not compatible with the
recorded lower bound and is effectively ruled out by the provided background.

## What remains open in this note
The true asymptotic constant (or sharper asymptotic description) remains open
between the current lower and upper bounds listed in background.

## Status
- half-density guess: false from recorded lower bound.
- exact asymptotic value: unresolved.
