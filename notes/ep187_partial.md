# EP-187 partial

## Statement
In any 2-coloring of integers, for infinitely many `d`, at least one color class
must contain a `d`-difference AP of length `f(d)`. Determine best `f(d)`.

## Attempt in this batch
I ran random coloring searches on `[1..N]` and computed, for each difference
`d<=D`, the longest monochromatic AP with that fixed difference.

Data file:
- `data/ep187_coloring_ap_diff_scan.json`

## Result
For `N=7000`, `D=180`, across 120 trials, best profiles are on logarithmic scale
in `d` (finite-sample behavior consistent with known `O(log d)` upper direction).

## Hard point
Finite interval colorings do not prove infinite-coloring asymptotics nor the
exact extremal order of `f(d)`.

