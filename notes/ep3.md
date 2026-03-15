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

## Added Proof-Strategy Layer (No New Computation)

### Approaches to Push
- Tao-style transference: convert reciprocal-mass divergence into structured
  density increments on many scales.
- Hypergraph container route with harmonic weights.
- LLL-inspired local-obstruction control for AP constraints.
- Red-blue block reformulation of density profiles across dyadic scales.

### Blocking Lemma(s)
- **EP3-A (harmonic-to-density bridge)**:
  divergent
  \[
  \sum_{a\in A}\frac1a
  \]
  must force infinitely many $N$ where density is above the threshold needed by
  quantitative $k$-AP theorems (uniformly in fixed $k$).
- **EP3-B (weighted container bound)**:
  every $k$-AP-free container should obey a uniform reciprocal-mass ceiling
  unless it falls into a rigid exceptional class.
- **EP3-C (decay threshold for $r_k(N)$)**:
  a bound strong enough to imply reciprocal convergence for all $k$-AP-free sets.

### What Would Finish the Proof
- A theorem delivering EP3-C for each fixed $k\ge3$ settles the implication by
  partial summation.
- Alternatively, EP3-A + EP3-B closes the argument through a transference chain.

## Deeper Proof Program (A => B => C)

### Target
Prove the full Erdős-Turán harmonic implication:
\[
\sum_{a\in A}\frac1a=\infty \ \Longrightarrow\ A\ \text{contains arbitrarily long APs}.
\]

### Step A: Harmonic-Mass Localization
From divergence, extract infinitely many dyadic scales where \(A\) carries
quantified weighted mass above a threshold convertible to density information.

### Step B: Weighted-to-Uniform Transference
Transfer Step A mass into uniform-enough density on structured subprogressions,
with losses small enough to apply quantitative Szemerédi/hypergraph tools.

### Step C: Length Escalation
Iterate in progression length \(k\) and scale to force arbitrarily long APs.

### Concrete Blocking Lemma (Most Critical)
Need a scale-uniform transference estimate: harmonic-weight excess on
\([X,2X]\) implies existence of a large subprogression \(P\subset[X,2X]\) with
relative density \(\gg (\log X)^{-O(1)}\) and controlled pseudorandom error.
