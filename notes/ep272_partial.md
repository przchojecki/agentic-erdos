# EP-272 partial resolution

## Statement
For `N>=1`, let `t(N)` be the maximum size of a family
`A_1,...,A_t \subseteq {1,...,N}` such that for every `i!=j`,
`A_i \cap A_j` is a non-empty arithmetic progression.
Determine `t(N)`.

## What is resolved
Background records Szab\'o (1999):

`t(N) = N^2/2 + O(N^{5/3}(log N)^3)`.

So the asymptotic order and leading constant are known (`t(N)=(1/2+o(1))N^2`).

## Additional resolved subclaims from background
- The earlier "fixed-point arithmetic progression" extremal guess is false.
- The Simonovits--S\'os conjecture `t(N)=C(N,2)+1` is also false; Szab\'o gives larger constructions.

## What remains open in this note
The exact value (or sharp second-order term) is not settled by the cited material.
Background notes a conjectural refinement `t(N)=C(N,2)+O(N)`.

## Status
- Asymptotic leading term: resolved.
- Exact/sharp refinement: unresolved.
