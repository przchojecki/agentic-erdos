# EP-962 deeper attempt with search

## Statement
`k(n)`: longest block `m+1,...,m+k` (for some `m<=n`) where each term has a prime
factor `>k`.

## Experiment in this attempt
I ran a prefix search to `n=10^6` using greatest-prime-factor tables.

Data file:
- `data/ep962_prefix_search_n1e6.json`

Observed:
- best `k` up to `10^6` is `121` (first found near `m=879498`).
- `k/sqrt(n)` decreases over sampled scales.

## Interpretation
Finite-range data suggests sub-polynomial growth and no near-`n^epsilon` behavior in
this range, but does not prove asymptotic bounds.
