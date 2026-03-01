# EP-1040 deeper attempt

## Statement
For closed infinite `F subset C`, is `mu(F)` determined by transfinite diameter? In particular,
if diameter is `>=1`, must `mu(F)=0`?

## Computation in this attempt (model case)
I tested `F` on the unit circle via `f_m(z)=z^m-1` (roots in `F`) and estimated area
`|{z:|f_m(z)|<1}|` by Monte Carlo.

Data file:
- `data/ep1040_unitcircle_area_scan.json`

Sample estimates:
- `m=40`: area `~1.324`
- `m=100`: area `~0.818`
- `m=300`: area `~0.344`

## Interpretation
For this canonical `F` (capacity/transfinite diameter `1`), the tested areas decrease strongly
with `m`, consistent with `mu(F)=0` in this special case. This does not settle the general
question for arbitrary closed infinite `F`.
