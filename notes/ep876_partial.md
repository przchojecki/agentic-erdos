# EP-876 partial attempt

## Route
Counterexample-oriented finite search for long prefixes satisfying both:
- no element equals a sum of distinct earlier elements,
- gap constraint `a_{n+1}-a_n < n` (interpreted for `n>=2`).

## Evidence from this batch
- `data/ep876_gap_less_than_n_backtrack.json` found a length-20 valid prefix:
  `4,33,34,36,39,...,68`.

## Hard point
Finite prefixes do not imply existence of an infinite sequence with this gap regime.

## Status
Finite positive feasibility signal; infinite-version question remains open.
