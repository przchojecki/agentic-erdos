# EP-896 partial resolution

## Statement
For A,B subset {1,...,N}, let F(A,B) count products m=ab that have exactly one
representation with a in A, b in B. Maximize F(A,B).

## What is resolved
Background/comments give two-sided bounds:
(1+o(1))N^2/log N <= max F(A,B)
and
max F(A,B) << N^2 / ((log N)^delta (log log N)^{3/2})
for explicit delta>0.

## What remains open in this note
The true main term and exact logarithmic exponent are not settled.

## Status
- strong two-sided bounds known.
- asymptotically sharp formula unresolved.
