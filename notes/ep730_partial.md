# EP-730 deeper attempt

## Statement
Are there infinitely many `n!=m` such that `C(2n,n)` and `C(2m,m)` have the same prime-divisor set?

## Computation in this attempt
I computed prime-divisor signatures of `C(2n,n)` for `n<=5000` via exact prime valuations and
clustered equal signatures.

Data file:
- `data/ep726_ep730_ep731_scan.json` (`ep730` section)

Findings:
- 39 repeated-signature groups up to `n=5000`.
- Includes known pair `(87,88)` and many additional pairs, e.g. `(199,200)`, `(237,238)`.

## Interpretation
This gives strong finite evidence for abundance of such pairs, but not an infinite proof.
