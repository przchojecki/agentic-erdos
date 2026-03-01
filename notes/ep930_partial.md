# EP-930 partial

## Statement
For each `r`, ask if there is `k` so that for any `r` disjoint intervals
`I_1,...,I_r` of consecutive integers, each of length at least `k`,
the product `prod_i prod_{m in I_i} m` is not a perfect power.

## Attempt in this batch
I ran exact prime-exponent tests for equal-length disjoint intervals.
For each `k <= 12`, I searched counterexamples inside a finite window.

Data file:
- `data/ep930_interval_product_power_scan.json`

## Result
- `r=2`: equal-length counterexamples found for `k=1,2,3`.
- `r=3`: equal-length counterexamples found for `k=1,2,3,4,5`.
- In this scan (`N<=220`), no equal-length counterexample was found for
  `r=2` with `k>=4`, or `r=3` with `k>=6`.

## Hard point
This is finite-window evidence only, and only for equal lengths.
The full statement allows arbitrary disjoint intervals and requires a proof
for all sufficiently large lengths.

