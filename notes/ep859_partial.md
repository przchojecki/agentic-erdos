# EP-859 deeper attempt

## Statement
For fixed `t`, let `d_t` be the density of integers `n` such that `t` is a sum of distinct
divisors of `n`.

## Rigorous partial result
`d_t >= 1/t`.
Reason: every multiple of `t` contributes (take the one-term sum `{t}`).

## Computation in this attempt
Finite density scan for `2<=t<=200` up to `N=300000`.

Data file:
- `data/ep859_density_scan.json`

Examples (`N=300000`):
- `d_40 ~ 0.3231`
- `d_80 ~ 0.2798`
- `d_200 ~ 0.2309`

## Interpretation
This gives a rigorous baseline plus finite trend data, but not the asymptotic constants/exponents
asked in the problem.
