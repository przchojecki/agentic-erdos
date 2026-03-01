# EP-469 deeper attempt

## Statement
Let `A` be primitive pseudoperfect numbers. Does `sum_{n in A} 1/n` converge?

## Exact finite computation in this attempt
I scanned all `n<=120000` with exact subset-sum tests over proper divisors, then filtered
primitive cases.

Data file:
- `data/ep469_primitive_pseudoperfect_scan.json`

Results in range:
- primitive count: `541`
- partial reciprocal sum: `~0.340481`

## Interpretation
This gives exact finite data only. It supports a slow-growing partial sum in this range, but does
not prove convergence/divergence.
