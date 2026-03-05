# EP-5

## Proof Attempts and Literature Notes

### Source: ep5_partial.md

# EP-5 partial attempt

## Route
Interpreted the question as asking whether the normalized prime-gap limit-point set is all of `[0, infinity]`.

## What is resolved from background
- `0` and `infinity` are both known limit points.
- Positive-measure and interval-type partial inclusions are known.

## Hard point
Upgrading from large-measure/interval fragments to full surjectivity of limit points remains out of reach.

## Status
Substantial partial structure known; full characterization open.

## Integrated Batch Reasoning

Batch scripts were integrated into `data/ep5.json` with extracted EP-specific sections.

- harder_batch1_quick_compute.mjs: : normalized prime gap finite profile.
## Batch Split Integrations (From HEAD)

### Source: notes/harder_batch1_web_compute.md

### EP-5
- Quick literature check:
  - No clearly newer direct breakthrough than the modern limit-point structure papers quickly surfaced; Merikoski (2020) remains central in this scan.
- Finite compute signal:
  - For first $4\times 10^5$ prime indices, normalized gaps $\frac{p_{n+1}-p_n}{\log n}$ occupy all bins in $[0,10]$ at step $0.25$; observed max about $12.42$.
- Interpretation:
  - Empirically broad spread supports rich limit-point behavior, but finite data cannot prove full $S=[0,\infty)$.

## New Experiments
- 2026-03-05T09:26:52.089Z: autonomous one-by-one run imported harder_batch1_quick_compute.json result for EP-5.
