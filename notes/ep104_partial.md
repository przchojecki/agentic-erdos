# EP-104 partial attempt

## Route
Combined the standard pair-counting upper bound setup with explicit constructions that force many unit circles through at least three points.

## Evidence from this batch
- `data/ep104_unit_circle_lattice_scan.json` (triangular-lattice hex patches):
  - for `n=91,217,469,817,1261,1801,2437`, we get exactly `n` lattice-centered unit circles containing at least 3 selected points.
- This reproduces a clean linear lower-bound family (`Omega(n)` circles).

## Hard point
The open gap is between linear lower bounds and quadratic upper bounds. Proving `o(n^2)` needs a genuinely nontrivial incidence restriction beyond pair counting.

## Status
Lower-bound construction family verified; asymptotic upper improvement remains open.
