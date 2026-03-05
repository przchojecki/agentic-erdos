# EP-3

## Proof Attempts and Literature Notes

### Source: ep3_partial.md

# EP-3 partial attempt

## Route
Reduced the conjecture to quantitative bounds on `r_k(N)` (largest `k`-AP-free subsets of `[1,N]`).

## What is resolved from background
- `k=3` case of the needed implication is now known via strong Roth-type bounds.
- General `k` still lacks bounds strong enough to force the full divergent-harmonic-series implication.

## Hard point
Need sufficiently strong `r_k(N)` decay uniformly in each fixed `k` to push through the harmonic-divergence criterion for arbitrary progression lengths.

## Status
Partially resolved at low progression lengths; full conjecture open.

## Integrated Batch Reasoning

Batch scripts were integrated into `data/ep3.json` with extracted EP-specific sections.

- harder_batch1_quick_compute.mjs: : simple greedy 3-AP-free sequence growth and harmonic sum.
## Batch Split Integrations (From HEAD)

### Source: notes/harder_batch1_web_compute.md

### EP-3
- Quick literature check:
  - Recent progress remains active: Leng-Sah-Sawhney (2024) on improved quantitative Szemeredi bounds.
- Finite compute signal:
  - A simple ascending greedy 3-AP-free proxy in $[1,N]$ reaches size $2048$ at $N=100000$, with reciprocal sum about $2.9796$.
- Interpretation:
  - Finite proxies show substantial AP-avoidance room, but do not resolve the divergent-harmonic implication for all progression lengths.

## New Experiments
- 2026-03-05T09:26:52.089Z: autonomous one-by-one run imported harder_batch1_quick_compute.json result for EP-3.
