# EP-1

## Proof Attempts and Literature Notes

### Source: ep1_partial.md

# EP-1 partial attempt

## Route
Compared the conjectural `N >> 2^n` target with modern lower bounds from additive-combinatorial compression arguments.

## What is resolved from background
- Strong exact lower bound known: `N >= binom(n, floor(n/2))`.
- This is about `2^n / sqrt(n)` and still does not reach a constant-times-`2^n` lower bound.

## Hard point
Closing the remaining `sqrt(n)` factor gap appears to require new structural input beyond current extremal subset-sum arguments.

## Status
Major progress known, original stronger form still open.

## Integrated Batch Reasoning

Batch scripts were integrated into `data/ep1.json` with extracted EP-specific sections.

- harder_batch1_quick_compute.mjs: ,3,5,9,12,15,17,20,28,30.
- harder_batch1_quick_compute.mjs: : central binomial lower bound scale.
## Batch Split Integrations (From HEAD)

### Source: notes/harder_batch1_web_compute.md

### EP-1
- Quick literature check:
  - Found a recent related extension in modular setting: Dousse et al., *Modular distinct subset sums* (Acta Arith., 2025).
- Finite compute signal:
  - Central-binomial scale check gives $\binom{n}{\lfloor n/2\rfloor} 2^{-n}\sqrt{n}$ approaching about $0.795$ by $n=64$.
- Interpretation:
  - Finite profile matches the known $2^n/\sqrt{n}$ scale and still leaves the $\sqrt{n}$ gap to the conjectural $c\,2^n$ target.
