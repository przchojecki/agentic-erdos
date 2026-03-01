# EP-709 deeper attempt

## Statement
`f(n)` is the minimal interval-length factor forcing distinct divisibility matches for
any `n`-set `A`.

## Concrete progress in this attempt
- Proved exactly: `f(2)=1`.

### Proof sketch for `f(2)=1`
Let `A={a,b}` with `a!=b`, `M=max(a,b)`, and `I` any interval of `M` consecutive
integers.
- `I` contains at least one multiple of `a` and at least one multiple of `b`.
- If these could only be the same integer `t`, then each modulus would contribute a
  unique multiple in `I`, forcing `a>M/2` and `b>M/2`.
- WLOG `b=M`. Then `t` must be the unique multiple of `M` in `I`, so `t` is a
  multiple of `a`, hence `a|M`. But with `a>M/2` and `a<M`, this is impossible.
Thus distinct choices always exist, so interval length `M` suffices for `n=2`.

## Known general bounds (background)
`(log n)^c << f(n) << n^{1/2}`.

## Remaining hard part
Asymptotic behavior for general `n` remains open.
