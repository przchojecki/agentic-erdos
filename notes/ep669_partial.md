# EP-669 partial resolution

## Statement
For `n` points in the plane, let `F_k(n)` be the maximum number of distinct lines
containing at least `k` points, and `f_k(n)` the analogue for exactly `k` points.
Estimate these quantities, especially limits of `F_k(n)/n^2` and `f_k(n)/n^2`.

## What is resolved
Background gives a full asymptotic for `k=3` (Orchard problem scale):

`f_3(n) = n^2/6 - O(n)`,
`F_3(n) = n^2/6 - O(n)`.

So the `k=3` case is asymptotically settled (limit `=1/6` for both normalized
quantities).

## What remains open in this note
The problem asks for general `k`; background only gives a trivial universal upper
bound `lim F_k(n)/n^2 <= 1/(k(k-1))` and no matching general asymptotic.

## Status
- `k=3`: resolved asymptotically.
- general `k`: unresolved.
