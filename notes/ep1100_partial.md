# EP-1100 partial attempt

## Route
Computed `tau_perp(n)` exactly from sorted divisors up to `n=120000`, and scanned squarefree maxima for `g(k)`.

## Evidence from this batch
- `data/ep1100_tau_perp_scan.json`:
  - tail mean of `tau_perp(n)/omega(n)` (on top quarter of range) is about `1.214`.
  - scanned squarefree lower bounds: `g(1..6) >= 1,2,4,7,13,20`.
- Confirms nontrivial growth behavior but far from asymptotic resolution.

## Hard point
"Almost all" and extremal asymptotics require analytic control beyond finite computation.

## Status
Open; finite data only.
