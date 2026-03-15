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

## Added Proof-Strategy Layer (No New Computation)

### Approaches to Push
- Additive-combinatorial anti-concentration route on
  \[
  \sum_{i=1}^n \varepsilon_i a_i.
  \]
- Sieve-style collision control for subset sums (view repeated sums as bad events).
- Probabilistic/LLL framing for local collision constraints among subset signatures.

### Blocking Lemma(s)
- **EP1-A (constant-scale anti-concentration)**:
  prove
  \[
  \max_t \mathbf P\!\left(\sum \varepsilon_i a_i=t\right)\le C\,2^{-n}
  \]
  with absolute $C$; current methods lose a $\sqrt n$ factor.
- **EP1-B (energy rigidity)**:
  near-minimal additive energy of subset sums should force support size
  $\gg 2^n$ with absolute constant, not $2^n/\sqrt n$.

### What Would Finish the Proof
- Either EP1-A or EP1-B at full strength implies
  \[
  \#\{\text{subset sums}\}\gg 2^n,
  \]
  hence $N\gg 2^n$ since subset sums lie in $[0,nN]$.

## Deeper Proof Program (A => B => C)

### Target
Upgrade the current \(2^n/\sqrt n\)-scale lower bounds to \(c\,2^n\), yielding
\(N\gg 2^n\).

### Step A: Strong Anti-Concentration
For dissociated \(A\), establish near-optimal bound on maximal atom of subset-sum
distribution:
\[
\max_t \mathbf P\!\left(\sum \varepsilon_i a_i=t\right)\le C\,2^{-n}.
\]

### Step B: Support Expansion
Deduce
\[
|\operatorname{supp}\text{(subset sums)}|\ge c\,2^n
\]
with absolute \(c>0\).

### Step C: Interval Compression Contradiction
Since support lies in \([0,nN]\), infer \(nN\ge c\,2^n\), i.e. \(N\gg 2^n\).

### Concrete Blocking Lemma (Most Critical)
Need an inverse Littlewood-Offord theorem tailored to strictly increasing
positive integers that removes the \(\sqrt n\) entropy loss in current bounds.
