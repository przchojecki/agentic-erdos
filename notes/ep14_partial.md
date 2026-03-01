# EP-14 partial attempt

## Route
Performed heuristic local search for sets `A subseteq [1,N]` with `|A|=floor(sqrt(N))` minimizing counts of integers not represented in exactly one way as a sum of two elements of `A`.

## Evidence from this batch
- `data/ep14_unique_sum_exception_quick.json` gives best bad-counts `68, 97, 146, 215` for `N=120,180,260,360`.
- These are consistent with a `sqrt(N)`-scale error profile in this range.

## Hard point
Heuristic finite constructions do not settle sharp asymptotic exponents/constants in the infinite problem.

## Status
Open in this batch; finite evidence aligns with known `N^{1/2}`-type scale.
