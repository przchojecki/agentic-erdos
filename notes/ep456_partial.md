# EP-456 partial

## Statement
Compare `m_n` (smallest `m` with `n|phi(m)`) and `p_n` (smallest prime `1 mod n`):
is `m_n<p_n` for almost all `n`? does `p_n/m_n->infty` for almost all `n`?

## Attempt in this batch
I computed exact `(m_n,p_n)` for `2<=n<=1500`.

Data file:
- `data/ep456_mn_vs_pn_scan.json`

## Result
- In this range, `m_n < p_n` for 358 out of 1499 values (`~23.9%`).
- Equality `m_n=p_n` occurs for `~76.1%` in this range.
- Power-of-two odd-exponent samples (`n=2^(2k+1)`) consistently satisfy strict
  inequality in tested cases with potentially large ratios (e.g. `n=512`,
  `p_n/m_n ~ 9.96`).

## Hard point
Finite frequencies up to 1500 are far from proving almost-all behavior.

