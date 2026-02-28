# EP-152 proof attempt (v2)

## Problem
For every `M >= 1`, does every sufficiently large finite Sidon set `A` have at least `M` values
`a in A+A` with both neighbors missing:
`a-1 notin A+A` and `a+1 notin A+A`?

## Reframing
Let `A+A = {s_1 < ... < s_t}` and define gaps `g_i = s_{i+1}-s_i`.
An element `s_i` is "isolated" iff both adjacent gap constraints hold:
- left gap `> 1` (or `i=1`)
- right gap `> 1` (or `i=t`)

So EP-152 asks whether the minimum possible isolated-count over Sidon sets of size `m`
must go to infinity with `m`.

## Exhaustive small-N evidence
Script:
- `scripts/ep152_ep153_scan_smallN.mjs`

Data:
- `data/ep152_ep153_scan_smallN_10_60.json`

From exhaustive enumeration of all Sidon sets with `min(A)=1` in `[1..N]`, `10 <= N <= 60`,
the observed global minima by size were:

- `m=2 -> min isolated = 0`
- `m=3 -> 1`
- `m=4 -> 2`
- `m=5 -> 2`
- `m=6 -> 3`
- `m=7 -> 5`
- `m=8 -> 5`
- `m=9 -> 8`
- `m=10 -> 12`

Representative size-10 minimizer found:
`A = [1,2,7,11,24,27,35,42,54,56]` with isolated-count `12`.

## Large-family signal
Script:
- `scripts/ep152_ep153_family_metrics.mjs`

Data:
- `data/ep152_ep153_family_metrics.json`

Two standard infinite Sidon families were sampled:
- Ruzsa prime family `A_p = {2pi + i^2 mod p}`
- Mian-Chowla greedy prefixes

In both families, isolated-count grows rapidly (roughly quadratic in `m` in tested range),
not merely unbounded.

## Why this is still open
Current obstacle is universal control: we do not have a structural theorem preventing
almost all missing points of `A+A` from clustering into a few long hole intervals, which
could keep isolated-count comparatively low.

## Current status
- Not solved.
- Strong computational and family-based positive signal.
- Missing piece: a general lower bound `isolated(A+A) >= f(|A|)` with `f(m) -> infinity`.

