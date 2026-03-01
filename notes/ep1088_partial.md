# EP-1088 partial

## Statement
Estimate `f_d(n)`, the least `m` such that every `m` points in `R^d` contain
`n` points with all pairwise distances distinct.

## Attempt in this batch
I focused on `n=3`, where the property means existence of a scalene triangle.
I used the cross-polytope construction (`2d` points: `+-e_i`) and checked its
distance spectrum exactly.

Data file:
- `data/ep1088_ep1089_construction_scan.json`

## Result
Cross-polytope has exactly two distance values and no scalene triangle, so:
- `f_d(3) >= 2d+1` (explicit lower bound).

Random calibration at size `2d+1` had scalene-triple fraction `1.0` in tested
dimensions, indicating the construction is highly special.

## Hard point
This gives only a baseline lower bound for `n=3`.
The main open part is sharp growth for general `n` and large `d`.

