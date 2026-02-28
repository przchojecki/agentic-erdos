# EP-43 proof attempt (v1)

## Problem
Given Sidon sets `A, B ⊆ {1,...,N}` with
`(A - A) ∩ (B - B) = {0}`,
show (or refute)
`C(|A|,2) + C(|B|,2) <= C(f(N),2) + O(1)`,
where `f(N)` is the maximal Sidon size in `{1,...,N}`.

## Setup
Let `m = |A|`, `n = |B|`.
For each nonzero integer `d`, let
- `r_A(d) = # { (a,a') in A^2 : a-a' = d }`
- `r_B(d) = # { (b,b') in B^2 : b-b' = d }`.

For Sidon sets in integers, nonzero internal differences are unique, so `r_A(d), r_B(d) in {0,1}` for `d != 0`.
Condition `(A-A) ∩ (B-B) = {0}` implies `r_A(d) r_B(d) = 0` for `d != 0`.

## What we can prove cleanly

1. **Global difference-count bound**
   `sum_{d>0}(r_A(d)+r_B(d)) = C(m,2)+C(n,2) <= N-1`.

   Reason: positive differences lie in `{1,...,N-1}` and are disjoint across `A` and `B`.

2. **Cross-sum uniqueness**
   If `a1+b1 = a2+b2` with `ai in A, bi in B`, then `a1-a2 = b2-b1` is in
   `(A-A) ∩ (B-B)`, hence must be `0`, so `a1=a2, b1=b2`.
   Therefore all `A+B` sums are distinct and `|A+B| = mn <= 2N-1`.

3. **Cross-difference uniqueness**
   If `a1-b1 = a2-b2`, then `a1-a2 = b1-b2`; same argument gives uniqueness.
   Hence `|A-B| = mn <= 2N-1`.

These are strong structural facts, but still far from the target `~ N/2` scale implied by `C(f(N),2)`.

## Why the direct routes stall

- Fourier/energy identities with
  `F(t) = |sum_{a in A} e^{iat}|^2 + |sum_{b in B} e^{ibt}|^2`
  mostly collapse to identities already implied by Sidon + disjoint-difference support.
- Ruzsa-style inequalities using `|A+B|=mn` and Sidon energies do not currently force
  `C(m,2)+C(n,2)` down to `C(f(N),2)+O(1)`.
- The remaining gap is essentially an **extremal packing obstruction**:
  proving a single-color Sidon extremizer controls two-color disjoint-difference packings up to constant error.

## Exact computation (small N)

Exhaustive search scripts:
- Baseline: `scripts/ep43_search.mjs`
- Faster exact solver (canonical + branch-and-bound): `scripts/ep43_search_bb.mjs`

Exact values for `2 <= N <= 24` were saved at:
- `data/ep43_exact_N2_24.jsonl`

Extended exact values for `25 <= N <= 40` were saved at:
- `data/ep43_exact_bb_N25_40.jsonl`

Further exact values for `41 <= N <= 50` were saved at:
- `data/ep43_exact_bb_N41_50.jsonl`
- runtime profile aggregate: `data/ep43_exact_bb_profile_N25_50.json`

For each `N`, we computed
`best(N) = max ( C(|A|,2)+C(|B|,2) )`
over valid pairs `(A,B)`, and compared with `C(f(N),2)`.

Observed gap `best(N) - C(f(N),2)`:
- for `2 <= N <= 24`: max observed gap `6` (at `N=24`)
- for `25 <= N <= 40`: max observed gap `6` (attained at `N=25,30,31,32,33,34,39,40`)
- for `41 <= N <= 50`: max observed gap `8` (attained at `N=43,44`)
- examples:
  - `N=20`: gap `3`
  - `N=23`: gap `5`
  - `N=24`: gap `6`
  - `N=35`: gap `2`
  - `N=40`: gap `6`

So the data remains compatible with a `+O(1)` correction through `N=40`, but does **not** suggest the stronger `+O(0)` form.

With the `N<=50` extension, the strongest empirical correction seen so far is `+8`.

## Runtime break-point profile (exact search)

Using `scripts/ep43_search_bb.mjs`:
- `N=44`: `~59.6s`
- `N=46`: `~71.8s`
- `N=47`: `~117.3s`
- `N=48`: `~227.3s`
- `N=49`: `~406.3s`
- `N=50`: `~750.3s`

So exact search enters a steep blow-up regime around `N≈47-48` on this machine, and becomes very expensive by `N=50`.

## Targeted solver note

A targeted exact checker was also added for large `N`:
- `scripts/ep43_search_targeted.mjs`

For `N=50` it confirms the same exact optimum in about `1.5s` by checking only feasible high sums (`49,46,43,42`) via weight-class disjointness tests.

## Current status

- No full proof of the first question.
- We have a clean set of derived lemmas and exact low-`N` evidence.
- The key unresolved step is converting the two-color disjoint-difference constraints into an upper bound at the single Sidon extremal scale.
