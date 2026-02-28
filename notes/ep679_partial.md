# EP-679 partial resolution

## Statement
With `omega(n)` = number of distinct prime factors:
1. For fixed `epsilon>0`, are there infinitely many `n` such that
   `omega(n-k) < (1+epsilon) log k / log log k`
   for all sufficiently large `k<n`?
2. Is the stronger form
   `omega(n-k) < log k / log log k + O(1)`
   false?

## What is resolved
The background records that (in comments) DottedCalculator disproved the stronger form by proving:

for all sufficiently large `n`, there exists `k<n` such that

`omega(n-k) >= log k / log log k + c * log k / (log log k)^2`

for some constant `c>0`.

This is stronger than merely violating `+O(1)`, so the second subquestion is answered in the affirmative:
the stronger version is false.

## What remains open
The first subquestion (with factor `(1+epsilon)`) remains open in this note.

## Status
- Second subquestion: resolved (false).
- First subquestion: unresolved.

