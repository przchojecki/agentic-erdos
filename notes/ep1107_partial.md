# EP-1107 partial attempt

## Route
Ran exact finite scans for representations as sums of at most `r+1` many
`r`-powerful numbers, then upgraded to a large-range bitset convolution method.

## Evidence from this batch
- `data/ep1107_r_powerful_bitset_scan.json` (up to `n=100000000`) found:
  - `r=3`: `45` missing values up to bound, largest missing `2039`.
  - `r=4`: `1318` missing values, largest missing `150271`.
  - `r=5`: `6018` missing values, largest missing `449560`.
  - `r=6`: `37036` missing values, largest missing `4034495`.
  - `r=7`: `274426` missing values, largest missing `41892928`.
- For every tested `r in {3,4,5,6,7}`, no missing values occurred in the tail
  interval `[99900001, 100000000]`.
- Background already states `r=2` is proved.

## Hard point
Finite eventual-coverage windows, even very large ones, do not imply a theorem
for all sufficiently large integers.

## Status
Very strong finite support for eventual coverage (up to `r=7` here), but full
general proof remains open.
