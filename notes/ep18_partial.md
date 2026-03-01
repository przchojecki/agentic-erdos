# EP-18 partial attempt

## Route
Computed exact small-range values of `h(m)` for practical numbers via divisor subset-sum cardinality DP, and separately for small factorials.

## Evidence from this batch
- `data/ep18_practical_hm_scan.json`: practical `m<=12000` typically have small `h(m)` (single digits in sampled tail).
- `data/ep18_factorial_h_scan.json`: `h(3!)=2`, `h(4!)=3`, `h(5!)=4`, `h(6!)=5`, `h(7!)=5`, `h(8!)=6`.

## Hard point
Small-range behavior does not prove infinitely many polylog-scale `h(m)` examples or asymptotics for `h(n!)`.

## Status
No full resolution; supports plausibility of slow growth but not a theorem.
