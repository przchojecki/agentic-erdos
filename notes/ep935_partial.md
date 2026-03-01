# EP-935 partial

## Statement
For `Q_2`, the powerful part, study
`Q_2(n(n+1)...(n+ell))` versus `n^(2+eps)`, and for `ell>=2` whether
`limsup Q_2(...)/n^2 = infty`.

## Attempt in this batch
I ran exact prime-factor scans for `n<=200000` and `ell=1,2,3,4`,
tracking maxima of `Q_2 / n^2` and `Q_2 / n^(2.01)`.

Data file:
- `data/ep935_q2_product_scan.json`

## Result
- `ell=1`: max `Q_2/n^2` about `1.125` in range.
- `ell=2`: max `Q_2/n^2` about `338`.
- `ell=3`: max `Q_2/n^2` about `864`.
- `ell=4`: max `Q_2/n^2` about `1.6787e5`.
- Even `Q_2/n^(2.01)` is very large for `ell>=2` in the scanned range.

## Hard point
These are finite-range maxima, not an asymptotic theorem; however they give
strong computational support that the `ell>=2` limsup can be very large.

