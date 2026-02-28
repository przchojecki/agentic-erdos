# EP-912 partial resolution

## Statement
If `n! = prod_i p_i^{k_i}` and `h(n)` counts distinct exponents `k_i`,
ask whether there is `c>0` such that

`h(n) ~ c * (n/log n)^{1/2}`.

## What is resolved
Background states Erdos--Selfridge proved

`h(n) asymp (n/log n)^{1/2}`.

So the correct order is established.

## What remains open in this note
The exact leading constant `c` in the asymptotic formula is not proved in the
provided background (only heuristic suggestions are mentioned).

## Status
- Order of growth: resolved.
- Exact asymptotic constant: unresolved.
