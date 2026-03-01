# EP-820 deeper attempt

## Statement
Study `H(n)`: smallest `l` with some `k<l` and `gcd(k^n-1,l^n-1)=1`. In particular, whether
`H(n)=3` infinitely often.

## Exact finite computation in this attempt
I computed `H(n)` by direct BigInt gcd search.

Data files:
- `data/ep820_Hn_scan.json` (`1<=n<=160`, base search cap `l<=260`)
- `data/ep820_Hn_unresolved_extension_to700.json` (extended unresolved cases to `l<=700`)

Key finite facts:
- For `n<=160`, `H(n)=3` occurs for `73` values.
- First 10 values match background: `3,3,3,6,3,18,3,6,3,12`.
- Some `n` need very large `l` (e.g. `H(48)=455`, `H(66)=469`, `H(80)=510` found in extension).
- Even after `l<=700`, unresolved values remain (e.g. `n=36,60,72,...,156`).

## Interpretation
Finite data shows highly irregular behavior with large spikes. This does not resolve whether
`H(n)=3` infinitely often.
