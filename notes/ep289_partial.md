# EP-289 partial

## Statement
For all sufficiently large `k`, are there distinct non-overlapping non-adjacent
intervals `I_1,...,I_k`, each of length at least 2, such that
`sum_i sum_{n in I_i} 1/n = 1`?

## Attempt in this batch
I ran exact randomized searches with integerized harmonic sums (common denominator
`lcm(1..Nmax)`) for decompositions of 1 into interval blocks.

Data file:
- `data/ep289_interval_egyptian_search.json`

## Result
No exact decomposition was found in these searches for
- `Nmax=90`, `k<=10`
- `Nmax=140`, `k<=8`
within the tested attempt budgets.

## Hard point
This is negative finite evidence only; non-findings under randomized search do
not imply nonexistence for larger ranges or different constructions.

