# EP-3

## Problem Statement
Investigate the Erdős-Turán type principle linking additive largeness and arithmetic progressions:
if $A\subset \mathbb{N}$ has divergent reciprocal sum
\[
\sum_{a\in A}\frac1a=\infty,
\]
must $A$ contain arbitrarily long arithmetic progressions?

## Literature
- For 3-term progressions, quantitative Roth-type results are very strong.
- For general $k$, strongest bounds are still not enough to fully settle the divergent-harmonic implication in this form.

## Our Approaches / What Is Proven
- Replaced placeholder script with deep standalone long-range computation (`scripts/ep3.mjs`):
  - builds the canonical ascending greedy 3-AP-free sequence up to large $N$;
  - tracks size growth, effective exponent $\log |A\cap[1,N]|/\log N$, and harmonic partial sums.

## Computation-Guided Observations
Deep run (`DEPTH=4`, `Nmax=10^7`) gives:
- \[
|A\cap[1,10^7]|=32768,
\]
with effective growth exponent near $0.64$ to $0.68$ across checkpoints.
- Harmonic partial sum over this construction is
\[
\sum_{a\in A,\,a\le 10^7}\frac1a \approx 3.002345,
\]
still very slowly increasing.

Interpretation:
- this major 3-AP-free model remains too sparse to force evident fast divergence in finite range;
- finite evidence is compatible with a convergent or extremely slowly diverging harmonic profile for this specific construction, so it does not approach a proof of the full conjectural implication.

## Status
- Partially resolved in literature at low progression lengths.
- Added deep standalone finite evidence up to $10^7$ for a canonical 3-AP-free model.
