# EP-386 partial resolution

## Statement
Can binomial coefficients be products of consecutive primes infinitely often?

## What is resolved
Background includes several explicit examples with `k>=3`, refuting the stronger
informal belief that this might never happen beyond trivial cases.

It also gives known `n` where `C(n,2)` is such a product.

## New finite scan
I ran an exact incremental-factorization scan for
`2 <= k <= 12`, `n <= 2,000,000`, requiring `k <= n-2` and deduplicating the
symmetry `C(n,k)=C(n,n-k)` via `k <= n/2`.

Script / data:
- `scripts/ep386_binomial_consecutive_primes_scan.mjs`
- `data/ep386_binomial_consecutive_primes_scan.json`

Hits found in this range:
- `k=2`: `n=4,6,15,21,715`
- `k=3`: `n=7`
- `k=4`: `n=10,14`
- `k=6`: `n=15`
- no hits for `k=5` or `k>=7` in this scan window.

## What remains open in this note
The main infinitude question remains unresolved in the cited material.

## Status
- existence of nontrivial examples: known.
- infinitely-often behavior: unresolved.

## Additional computational extension (2026-03-03)
I extended the exact scan to `n<=3,000,000` and `k<=14`.

Outcome:
- total hit count stayed `9` (same hit set as before),
- no new hits for `k=5` or any `k>=7`,
- in particular, no hits for newly added `k=13,14`.

So finite evidence still strongly suggests extreme sparsity beyond the known
small examples.
