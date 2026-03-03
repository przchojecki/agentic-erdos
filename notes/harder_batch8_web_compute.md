# Harder Batch 8: Web + Compute

Batch: `EP-241, EP-243, EP-244, EP-252, EP-256, EP-257, EP-261, EP-263, EP-264, EP-265`

Computation artifact:
- `data/harder_batch8_quick_compute.json`

## Per-problem quick outcomes

### EP-241
- Quick literature check:
  - Quick scan did not surface a newer theorem improving the classical asymptotic framework on this page; the listed benchmark remains Bose-Chowla lower construction and Green's upper bound.
- Finite compute signal:
  - Greedy/random finite constructions gave sizes `16,19,23,28` for `N=5e3,1e4,2e4,5e4`.
  - The normalized ratio `|A|/N^{1/3}` decreases from about `0.94` to `0.76`.
- Interpretation:
  - Finite data is consistent with an `N^{1/3}`-scale law, but does not resolve the asymptotic constant question.

### EP-243
- Quick literature check:
  - The main partial route remains Erdős-Straus and Duverney's conditional/stronger-hypothesis rigidity result.
- Finite compute signal:
  - Exact Sylvester sequences (`a_{n+1}=a_n^2-a_n+1`) give exact zero telescoping residual in exact rational arithmetic.
  - A single perturbation at one index immediately creates a nonzero residual (numerator `-1` over huge denominator).
- Interpretation:
  - This is strong finite evidence for recurrence rigidity, but not a full proof under only the original hypotheses.

### EP-244
- Quick literature check:
  - Romanoff-type progress is significant: Ding (2025) proves positive lower density for almost all real `C>1`.
- Finite compute signal:
  - For `X=200000`, representation densities for `n=p+\lfloor C^k\rfloor` are positive across tested `C`:
    - `C=1.3`: `~0.983`
    - `C=\sqrt2`: `~0.856`
    - `C=2`: `~0.554`
    - `C=3`: `~0.367`
- Interpretation:
  - Computation supports positive-density behavior for many concrete `C`, but cannot prove asymptotic density.

### EP-252
- Quick literature check:
  - Known unconditional status remains: irrational for `k=1,2,3,4` (with `k=4` solved by Pratt, 2022); general `k` open.
- Finite compute signal:
  - High truncations (`N=40` vs `N=140`) are numerically identical at displayed precision for `k\le 6`.
  - Best rational approximants with denominator `\le 20000` are close but with nonzero errors (`~10^{-9}` scale).
- Interpretation:
  - Numerics are compatible with irrationality and with rapid convergence, but do not distinguish irrationality for `k\ge 5`.

### EP-256
- Quick literature check:
  - The specific growth question `\log f(n) \gg n^c` is known to fail (Belov-Konyagin upper bounds of polylog type); the broader quantitative behavior remains open.
- Finite compute signal:
  - Grid maximization of `\max_{|z|=1}\prod_i|1-z^{a_i}|` for sample families shows slow log-growth in tested `n`.
  - Consecutive exponents: `\log` max values around `2.89,3.88,4.81,5.71,6.59` for `n=8..24`.
- Interpretation:
  - Finite profiles match subpolynomial-growth expectations and do not suggest a hidden `n^c` lower law.

### EP-257
- Quick literature check:
  - Recent progress (Tao-Teräväinen, 2025) settles important special cases (primes / prime powers), but the full all-infinite-`A` statement remains open.
- Finite compute signal:
  - Partial sums for representative infinite `A` (primes, prime powers, powers of 2, squares) stabilize quickly in tested truncations (`L=200` vs `L=400`).
  - Rational approximation with moderate denominator gives tiny but nonzero residuals.
- Interpretation:
  - Data supports irrational-looking behavior in examples, without addressing full universal quantification over all infinite `A`.

### EP-261
- Quick literature check:
  - Infinitely many `n` are known by explicit identity (Borwein-Loring route), and all `n\le 10000` have been verified by Tengely-Ulas-Zygadlo.
- Finite compute signal:
  - Under a narrow ansatz `a_i=n+i` with bounded offset window (`L\le 20`), only `50/5000` values were represented.
- Interpretation:
  - The narrow model is too restrictive and misses most representable cases; this is a method limitation, not negative evidence.

### EP-263
- Quick literature check:
  - Kovač-Tao (2024/2025) gives a sharp negative regime when `a_{n+1}/a_n^2\to 0` and a positive superquadratic-growth regime.
- Finite compute signal:
  - Diagnostic `\log(a_{n+1}/a_n^2)`:
    - `2^{2^n}`: approximately `0` (borderline)
    - `\exp(0.6\cdot 2^n)`: negative (sub-quadratic relative growth)
    - `\exp(0.8\cdot 2^n)`: positive (super-quadratic relative growth)
- Interpretation:
  - The numerics cleanly illustrate the known threshold geometry; the borderline `2^{2^n}` case remains delicate.

### EP-264
- Quick literature check:
  - Kovač-Tao proved `2^n` is not an irrationality sequence and provided a broad obstruction criterion via `\liminf a_n^2\sum_{k>n}1/a_k^2`.
- Finite compute signal:
  - Computed criterion proxy values:
    - `a_n=2^n`: stable near `1/3` (strictly positive)
    - `a_n=n!`: positive values decreasing but clearly nonzero in tested range
    - `a_n=2^{2^n}`: rapidly tends to `0`
- Interpretation:
  - Finite data aligns with the theorem: exponential-type growth fails the criterion, while doubly-exponential growth remains plausible.

### EP-265
- Quick literature check:
  - Kovač-Tao nearly settles growth by constructing doubly-exponential examples; remaining frontier is whether one can force `\limsup a_n^{1/2^n}>1`.
- Finite compute signal:
  - Classical constructions (triangular numbers; cubic-shift variant) recover near-rational sums with tiny truncation error.
  - Growth proxies (`a_n^{1/n}` at `n=2000`) are close to `1`, confirming polynomial-type growth in those examples.
- Interpretation:
  - Classical examples validate rational-shift mechanisms but are far from extremal growth now known possible.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/241
  - https://www.erdosproblems.com/243
  - https://www.erdosproblems.com/244
  - https://www.erdosproblems.com/252
  - https://www.erdosproblems.com/256
  - https://www.erdosproblems.com/257
  - https://www.erdosproblems.com/261
  - https://www.erdosproblems.com/263
  - https://www.erdosproblems.com/264
  - https://www.erdosproblems.com/265
- Additional primary references surfaced in quick scan:
  - https://arxiv.org/abs/2503.22700
  - https://arxiv.org/abs/2406.17593
  - https://arxiv.org/abs/2512.01739
