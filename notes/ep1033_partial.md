# EP-1033 partial attempt

## Route
Ran local search on dense graphs near the Turán threshold to find small values of
`max_{triangle} (deg(u)+deg(v)+deg(w))`, giving finite upper-profile evidence for `h(n)`.

## Evidence from this batch
- `data/ep1033_triangle_degree_sum_search.json` found best ratios around `1.60n` for `n=24..48`.
- This is above `2(\sqrt{3}-1) n ≈ 1.464n` in scanned sizes, hence no finite contradiction to the conjectured lower target.

## Hard point
Search gives only finite upper-profile samples and cannot establish asymptotic lower bounds for all dense graphs.

## Status
No closure; finite experiments consistent with current bound window.
