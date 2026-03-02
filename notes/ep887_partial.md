# EP-887 partial attempt

## Route
Used the same divisor-near-square scan to test interval
`(sqrt(n), sqrt(n)+C*n^{1/4})`
for several `C`.

## Evidence from this batch
- `data/ep886_887_divisors_near_sqrt_scan.json`:
  - for `C=1`, max observed count is `1` (up to `n=2*10^6`);
  - for `C=2`, max observed count is `4`;
  - for `C=4`, max observed count is `6`.

## Hard point
Finite computation does not establish existence of an absolute global constant `K` valid for all large `n` and all fixed `C`.

## Status
Finite evidence consistent with boundedness; problem remains open.
