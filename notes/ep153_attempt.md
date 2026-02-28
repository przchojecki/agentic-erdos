# EP-153 proof attempt (v2)

## Problem
For finite Sidon `A`, write `A+A = {s_1 < ... < s_t}`.
Is it true that
`(1/t) * sum_{1<=i<t} (s_{i+1}-s_i)^2 -> infinity`
as `|A| -> infinity`?

## Baseline bounds
Let `m = |A|`. For Sidon sets, `t = m(m+1)/2`.
Also `a_max - a_min >= C(m,2)` from distinct positive differences.
Hence
`s_t - s_1 = 2(a_max-a_min) >= m(m-1)`.
By Cauchy,
`(1/t) * sum (gap)^2 >= ((s_t-s_1)/(t-1))^2`,
which gives only a constant-order lower bound (around `4` asymptotically), not divergence.

## Exhaustive small-N evidence
Script:
- `scripts/ep152_ep153_scan_smallN.mjs`

Data:
- `data/ep152_ep153_scan_smallN_10_60.json`

Observed global minima (over all enumerated Sidon sets with `min(A)=1`, `N<=60`):

- `m=2 -> min avg sq gap = 0.666667`
- `m=3 -> 1.333333`
- `m=4 -> 1.8`
- `m=5 -> 2.8`
- `m=6 -> 3.52381`
- `m=7 -> 4.5`
- `m=8 -> 5.5`
- `m=9 -> 5.644444`
- `m=10 -> 6.872727`

So within this exact range, the minimum trend is upward.

## Large-family signal
Script:
- `scripts/ep152_ep153_family_metrics.mjs`

Data:
- `data/ep152_ep153_family_metrics.json`

For both tested families:
- Ruzsa prime family
- Mian-Chowla greedy family

the average squared gap grows strongly with `m` in all tested instances.

## Why this is still open
The key unresolved step is a universal rigidity argument for all Sidon sets: current methods
do not force enough large gaps (or enough gap-variance) in the worst case, despite strong
evidence from exhaustive small search and known constructions.

## Current status
- Not solved.
- Positive computational signal for divergence.
- Main gap: proving a general lower bound that increases with `|A|`.

