# EP-726 deeper attempt

## Statement
Conjecture: `sum_{p<=n} 1_{n mod p in (p/2,p)} / p ~ (1/2) log log n`.

## Computation in this attempt
Direct evaluation on a grid `500<=n<=5000` (step 250).

Data file:
- `data/ep726_ep730_ep731_scan.json` (`ep726` section)

Observed:
- at `n=500`: sum `~0.634`, target `(1/2)loglog n ~0.913`
- at `n=5000`: sum `~0.891`, target `~1.071`
- values track the same scale and grow with `n`, though below target in this range.

## Interpretation
Finite range is consistent with the conjectured `log log n` scale, but not decisive for the
asymptotic constant.
