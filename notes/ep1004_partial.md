# EP-1004 partial attempt

## Route
Scanned consecutive windows of totient values to find long runs where
`phi(n+1),...,phi(n+K)` are all distinct.

## Evidence from this batch
- `data/ep1004_phi_distinct_run_scan.json`:
  - best run lengths up to `271` by `x=4e6`.
  - these exceed `(log x)^c` for tested `c in {0.5,1,1.5,2}`.

## Hard point
The problem asks existence for every fixed `c>0` asymptotically; finite scans for selected `c` do not prove the full statement.

## Status
Large finite distinct runs found; full asymptotic theorem remains open.
