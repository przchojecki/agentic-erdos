# EP-635 partial resolution

## Statement
For `A subseteq {1,...,N}` with condition
`(b-a>=t and a,b in A) => (b-a)|b`, ask maximal size of `A`.

## What is resolved
Background gives:
- exact answer for `t=1`: `|A|=floor((N+1)/2)`;
- for `t=2`, construction with `|A| >= N/2 + c log N`.

## What remains open in this note
The asymptotic upper bound `|A| <= (1/2+o_t(1))N` for fixed `t` is not settled in
this entry.

## Status
- `t=1` exact and `t=2` super-half lower bound: known.
- general asymptotic optimum: unresolved.
