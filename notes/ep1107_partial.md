# EP-1107 partial attempt

## Route
Ran exact finite scans for representations as sums of at most `r+1` many `r`-powerful numbers.

## Evidence from this batch
- `data/ep1107_r_powerful_sum_scan.json` (up to `n=250000`) found:
  - `r=2`: all sufficiently large numbers covered (largest missing `119`).
  - `r=3`: all sufficiently large numbers covered in range (largest missing `2039`).
  - `r=4`: largest missing `150271`, and no missing values in the final scanned tail.
- Background already states `r=2` is proved.

## Hard point
Finite eventual-coverage windows do not imply a theorem for all sufficiently large integers.

## Status
Strong finite support for `r=3,4`; full general proof for all `r` remains open.
