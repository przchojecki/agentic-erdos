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

Equivalent run-language:
- View `A+A` inside `[s_1,s_t]` as runs of consecutive occupied integers.
- Isolated sums are exactly runs of length `1`.

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

## Adversarial fixed-m search (larger m)
Scripts:
- `scripts/ep152_ep153_adversarial_search.mjs`

Data:
- `data/ep152_ep153_adversarial_m11_80_best.json`
- `data/ep152_ep153_adversarial_m11_80_best.csv`
- `data/ep152_ep153_frontier_summary.json`

Method:
- For each `m`, random dense Sidon generation with objective-directed search.
- Objective: minimize isolated count (and separately minimize average squared gaps).
- High-restart refinement was also run on `m=11..25`.

Observed best-known isolated counts (not proofs, but strong stress-test evidence):
- `m=11 -> 18`
- `m=20 -> 82`
- `m=30 -> 228`
- `m=40 -> 455`
- `m=50 -> 764`
- `m=60 -> 1156`
- `m=70 -> 1640`
- `m=80 -> 2206`

Empirical envelope over `11 <= m <= 80`:
- minimum observed `isolated/m^2` is about `0.149`
- quadratic fit for best-known curve: `isolated ~ 0.349*m^2 - 79.3`

This strongly supports much more than unboundedness (roughly quadratic growth signal).

## Why this is still open
Current obstacle is universal control: we do not have a structural theorem preventing
almost all missing points of `A+A` from clustering into a few long hole intervals, which
could keep isolated-count comparatively low.

## Current status
- Not solved.
- Strong computational and family-based positive signal.
- Missing piece: a general lower bound `isolated(A+A) >= f(|A|)` with `f(m) -> infinity` proved for all Sidon sets.
