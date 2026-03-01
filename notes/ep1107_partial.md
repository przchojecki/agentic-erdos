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

## Unconditional theorem (weaker than target)
For each fixed `r>=2`, there exists a constant `W(r)` such that every positive
integer is a sum of at most `W(r)` many `r`-powerful numbers.

Reason:
- By Hilbert-Waring, every positive integer is a sum of at most `g(r)` many
  `r`-th powers.
- Every nonzero `r`-th power is `r`-powerful.
- Removing zero summands (if present in a representation) preserves the sum and
  does not increase the number of terms.
So one can take `W(r)=g(r)`.

## Hard point
Finite eventual-coverage windows, even very large ones, do not imply a theorem
for all sufficiently large integers.

## Status
We now have an unconditional weaker theorem (`<=W(r)` summands), very strong
finite support for the sharp `r+1` bound (up to `r=7` here), and the full
`r+1` statement remains open.
