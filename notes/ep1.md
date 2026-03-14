# EP-1

## Problem Statement
If $A\subseteq \{1,\ldots,N\}$ with $|A|=n$ has all subset sums
\[
\sum_{a\in S} a \quad (S\subseteq A)
\]
distinct, must one have $N\gg 2^n$?

## Literature
- Classical lower bounds are much weaker than $N\gg 2^n$:
  best known scale is about $2^n/\sqrt{n}$ (central-binomial type barrier).
- Standard exact lower bound:
\[
N \ge \binom{n}{\lfloor n/2\rfloor}.
\]

## Our Approaches / What Is Proven
- Replaced placeholder script with standalone deep computation (`scripts/ep1.mjs`):
  - exact branch-and-bound search for maximal cardinality in $[1,N]$ for all $N\le 70$;
  - randomized construction search up to $N=600$.
- This computes
\[
m(N):=\max\{|A|:A\subseteq[1,N],\ \text{all subset sums distinct}\}.
\]

## Computation-Guided Observations
Deep run (`DEPTH=4`) took about 108 seconds and found:
- For many $N$, one can beat the powers-of-two construction by exactly $+1$ element:
  \[
  m(N)-(\lfloor \log_2 N\rfloor+1)=1
  \]
  at least for ranges like $N=13\text{--}15$, $24\text{--}31$, $44\text{--}63$.
- Example witnesses:
  - $N=13$: $A=\{3,6,11,12,13\}$ gives $|A|=5$ (baseline is 4).
  - $N=50$: $A=\{1,6,12,24,46,48,50\}$ gives $|A|=7$ (baseline is 6).
- Randomized search up to $N=600$ also repeatedly found the same $+1$ gain.

Interpretation: finite data confirms nontrivial constructions beyond pure powers of two, but still far from the conjectural asymptotic scale needed to force $N\gg 2^n$.

## Status
- Major progress known, original stronger form still open.
- Added deep exact/heuristic computation with explicit witness sets and quantitative gaps.
