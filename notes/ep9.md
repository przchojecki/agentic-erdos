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

## Added Proof-Strategy Layer (No New Computation)

### Problem Recast
Let
\[
\mathcal E := \{\,n\in 2\mathbb Z+1 : n\neq p+2^a+2^b\ \forall p,a,b\,\}.
\]
Target claim: $\overline d(\mathcal E)>0$.

### Approaches to Push
- Sieve-first: representable odds as union of shifted-prime sets
  \[
  \{n:\ n-(2^a+2^b)\ \text{prime}\}
  \]
  and show this union leaves a positive-density complement.
- Random/probabilistic residue modeling of $2^a+2^b$ shifts.
- Lopsided-LLL control of overlap dependencies among representation events.
- Red-blue encoding (representable vs exceptional) with modular expansion barriers.

### Blocking Lemma(s)
- **EP9-A (second-moment overlap bound)**:
  control correlations between shifted-prime sets strongly enough that their
  union has density $<1$ among odds.
- **EP9-B (uniform distribution of power-sum shifts modulo many moduli)**:
  enough equidistribution to keep sieve major arcs from saturating.
- **EP9-C (weighted-to-unweighted density transfer)**:
  convert weighted sieve upper bounds on representables into an unweighted
  positive-density lower bound for exceptions.

### What Would Finish the Proof
- EP9-A with explicit constants would already imply positive upper density of
  $\mathcal E$.
- More realistically, EP9-B + EP9-C provide the missing infrastructure needed
  to prove EP9-A.

## Deeper Proof Program (A => B => C)

### Target
Prove positive upper density of exceptional odds:
\[
\overline d(\mathcal E)>0.
\]

### Step A: Weighted Cover Bound
Bound representable-odds indicator by a weighted union of shifted-prime events
with explicit second-moment control.

### Step B: Correlation Defect Quantification
Show pairwise/higher correlations among shifts \(2^a+2^b\) contribute only
subcritical overlap, leaving uncovered mass \(\ge \delta\) on infinitely many scales.

### Step C: Density Extraction
Convert scale-wise uncovered mass into positive upper density via limsup
selection.

### Concrete Blocking Lemma (Most Critical)
Need a uniform overlap estimate:
\[
\sum_{(a,b)\neq(a',b')} \!\!\!\!\!\!\!\!\!\!\!\!\!\!\!\!\!\!\! \mu\!\left(E_{a,b}\cap E_{a',b'}\right)
\le (1-\eta)\Big(\sum_{a,b}\mu(E_{a,b})\Big)^2
\]
at relevant scales, where \(E_{a,b}=\{n:\ n-(2^a+2^b)\ \text{prime}\}\).
