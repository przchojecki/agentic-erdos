# EP-9

## Proof Attempts and Literature Notes

### Source: ep9_partial.md

# EP-9 partial attempt

## Route
Viewed the claim as a density-upgrade problem from known lower bounds on exceptional odd integers not representable as `p+2^k+2^l`.

## What is resolved from background
- Infinitely many exceptions are known.
- Quantitatively, very large sparse lower bounds are known (`N^{1-eps}`-type).

## Hard point
Current methods still fall short of proving positive upper density of the exceptional set.

## Status
Strong partial lower bounds, density positivity still open.

## Integrated Batch Reasoning

Batch scripts were integrated into `data/ep9.json` with extracted EP-specific sections.

- harder_batch1_quick_compute.mjs: : odd numbers not representable as p + 2^a + 2^b.
## Batch Split Integrations (From HEAD)

### Source: notes/harder_batch1_web_compute.md

### EP-9
- Quick literature check:
  - No obvious post-2011 direct update was identified in this quick pass.
- Finite compute signal:
  - Up to $10^6$, only $2$ odd numbers were found not representable as $p+2^a+2^b$ (density among odds about $4\times 10^{-6}$).
- Interpretation:
  - Finite range remains extremely sparse for exceptions; this does not contradict known infinitude but gives no density-positivity evidence.

## New Experiments
- 2026-03-05T09:26:52.089Z: autonomous one-by-one run imported harder_batch1_quick_compute.json result for EP-9.
