# EP-1133 deeper attempt

## Statement
Robust interpolation obstruction: for many prescribed pairs `(x_i,y_i)`, any near-
full-fitting polynomial of degree `<(1+eps)n` must have sup norm `>C`.

## Attempt route
Compared the statement to Erdos' known opposite-direction extremal interpolation
construction.

## What is known
Background: Erdos proved existence of degree-`n` polynomials with bounded values at
about `(1+eps)n` points but large sup norm.

## Hard point
Turning this into the stated robust near-fit impossibility for arbitrary data remains
open; background says he could not prove even the `m=n` version.

## New finite counterexample-oriented probe
I ran a randomized subset-fit scan:
- pick `n=28`, `epsilon=0.25`, so target fit size `t=floor((1-epsilon)n)=21`;
- random labels `y_i in {-1,1}`;
- for each label vector, sample many subsets `S` of size `t`;
- interpolate exactly on `S` (degree `t-1`) and measure sup norm on a dense grid.

Script / data:
- `scripts/ep1133_subset_fit_scan.mjs`
- `data/ep1133_subset_fit_scan.json`

Main signal:
- **Chebyshev nodes**: many label vectors admit low sup-norm sampled fits
  (median min-sup about `2.34`; about `83.6%` had some sampled fit with sup norm
  `<=3`).
- **Equispaced nodes**: sampled near-full fits are usually much larger
  (median min-sup about `64.4`; only about `1.4%` had sampled fit `<=3`).

Interpretation:
- behavior is strongly node-geometry dependent in finite tests;
- this supports that robust obstructions may hold in unstable-node regimes, while
  stable-node regimes permit many low-norm near-full fits.

## Status
- no theorem or counterexample for the full quantifier pattern.
- new finite structural evidence about where low-norm near-full fitting is easier/harder.

## Additional computational extension (2026-03-03)
I ran a larger probe:
- `n=32`, `epsilon=0.2` (`t=25`),
- `180` random labelings, `180` sampled subsets per labeling,
- dense grid of `1401` points.

New summary:
- Chebyshev nodes: median sampled min-sup `~2.615`, p90 `~3.658`.
- Equispaced nodes: median sampled min-sup `~429.3`, p90 `~1068.8`.

This widens the geometry gap seen in the earlier run.
