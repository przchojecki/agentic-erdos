# EP-858 deeper attempt with finite optimization

## Statement
Maximize `(1/log N) sum_{n in A} 1/n` under the multiplicative exclusion condition
(no forbidden `at=b` relations of the stated type).

## Computation in this attempt
I ran finite optimization/greedy searches for `N` up to `5000`.

Data files:
- `data/ep858_finite_optimization_search.json`
- `data/ep858_finite_optimization_search_large.json`

Observed best normalized values in these finite runs are around `0.52-0.56`.

## Interpretation
Finite values remain substantial at tested `N`; this does not contradict the known
`o(1)` asymptotic result, but indicates slow decay in accessible ranges.
