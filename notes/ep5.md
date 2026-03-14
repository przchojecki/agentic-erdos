# EP-5

## Problem Statement
Let
\[
S := \left\{\lim_{j\to\infty}\frac{p_{n_j+1}-p_{n_j}}{\log n_j}\right\}
\]
be the set of limit points of normalized prime gaps.
Is it true that
\[
S=[0,\infty)?
\]

## Literature
- Known: both $0$ and $\infty$ occur as limit points.
- Known: substantial interval/positive-measure structure for limit points has been proved.
- Open: full characterization $S=[0,\infty)$.

## Our Approaches / What Is Proven
- Replaced placeholder script with deep standalone computation (`scripts/ep5.mjs`):
  - computes prime gaps up to the first $5\cdot 10^6$ prime indices;
  - analyzes two normalizations:
    \[
    \frac{p_{n+1}-p_n}{\log n}
    \quad\text{and}\quad
    \frac{p_{n+1}-p_n}{\log p_n};
    \]
  - extracts extreme values, quantiles, and occupancy of fine bins in $[0,20)$.

## Computation-Guided Observations
Deep run (`DEPTH=5`, `N_PRIMES=5,000,000`) found:
- For normalization by $\log n$:
  - min $\approx 0.1297$, max $\approx 14.9009$,
  - 127 occupied bins out of 200 in $[0,20)$ at step $0.1$.
- For normalization by $\log p_n$:
  - min $\approx 0.1095$, max $\approx 12.4615$,
  - 105 occupied bins out of 200 in $[0,20)$ at step $0.1$.
- Upper-tail events persist at finite scale (nontrivial fraction above 6), while small normalized gaps also remain frequent.

Interpretation: finite data strongly supports a rich spread of normalized gaps, but cannot prove full surjectivity of limit points.

## Status
- Substantial partial structure known; full characterization remains open.
- Added deeper standalone large-range empirical profile at 5 million prime indices.
