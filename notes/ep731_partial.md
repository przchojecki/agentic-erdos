# EP-731 deeper attempt

## Statement
For almost all `n`, estimate least `m` with `m \nmid C(2n,n)`.

## Computation in this attempt
I computed exact prime valuations of `C(2n,n)` and then exact least non-divisor `m` for
`1<=n<=5000` (search cap `m<=5000`, with no unresolved cases).

Data file:
- `data/ep726_ep730_ep731_scan.json` (`ep731` section)

Examples:
- `n=100`: least `m=7`
- `n=2000`: least `m=25`
- `n=5000`: least `m=17`

The ratio `log m / sqrt(log n)` stays in a moderate band in this range (median near `0.98`).

## Interpretation
Finite data is compatible with the reported `exp((log n)^{1/2+o(1)})` scale, but this does not
prove the almost-all asymptotic law.
