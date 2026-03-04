# Harder Batch 15: Web + Compute

Batch: `EP-576, EP-584, EP-585, EP-588, EP-589, EP-591, EP-592, EP-604, EP-609, EP-612`

Computation artifact:
- `data/harder_batch15_quick_compute.json`

## Per-problem quick outcomes

### EP-576
- Quick literature check:
  - Problem-page status remains open; currently listed general upper bounds for `ex(n;Q_k)` are subquadratic with exponent improvements over the older `2-1/k` form.
- Finite compute signal:
  - Random-graph probes (`n=24,32,40`) show low-to-moderate probability of detecting a cube-like `Q_3` witness in tested `p` ranges.
- Interpretation:
  - Finite threshold signal is consistent with sparse-to-intermediate `Q_3` emergence, but too coarse to identify the true asymptotic `ex(n;Q_3)` scale.

### EP-584
- Quick literature check:
  - Problem-page status remains open; key context still distinguishes fixed-density results from the harder sparse regime `delta=n^{-c}`.
- Finite compute signal:
  - In random dense graphs at tested `delta`, sampled edge-pairs were overwhelmingly connected by short cycles (proxy for `<=6`/`<=8`), and adjacent-edge pairs frequently lay on `C_4`.
- Interpretation:
  - Constant-density behavior appears strongly favorable; sparse-density transfer remains the hard step.

### EP-585
- Quick literature check:
  - Major 2025 update: Chakraborti–Janzer–Methuku–Montgomery prove an `n (log n)^{O(1)}` upper bound in strong general form (`k` disjoint cycles same vertex set), giving an asymptotic resolution up to polylog factors.
- Finite compute signal:
  - Small-`n` exact greedy search under the forbidden pattern finds best edge counts `19,23,26` for `n=8,9,10`.
- Interpretation:
  - Large-scale status is now tightly constrained between `Omega(n log log n)` and `n polylog(n)`; remaining gap is polylog-level sharpening.

### EP-588
- Quick literature check:
  - Problem-page status remains open; known constructions keep lower bounds close to quadratic for each fixed `k>=4`.
- Finite compute signal:
  - Heuristic searches with no `(k+1)`-collinear points produced many `k`-rich lines for `k=4,5` at tested `n`, with near-quadratic finite behavior.
- Interpretation:
  - Finite instances continue to look far from a clean strong subquadratic collapse; asymptotic `o(n^2)` remains delicate.

### EP-589
- Quick literature check:
  - Current page summary still gives `n^{1/2} log n` lower and sublinear upper bounds (e.g. `n^{5/6+o(1)}`), so the true order stays open.
- Finite compute signal:
  - From sampled no-4-collinear instances, extracted no-3-collinear subsets are large in finite range (`~0.73n` to `~0.89n` in best runs).
- Interpretation:
  - Finite geometry remains too small to reflect asymptotic sublinear constraints.

### EP-591
- Quick literature check:
  - The problem page is now marked `PROVED` (affirmative), citing Schipperus (2010) and independent Darby work.
- Finite compute signal:
  - Only toy finite analogue included (`R(3,3)=6`), as no faithful finite model captures the ordinal statement.
- Interpretation:
  - Original statement is resolved in the affirmative.

### EP-592
- Quick literature check:
  - Problem remains open; current summary still indicates a narrow remaining case (the three-indecomposable-summand regime in the Schipperus framework).
- Finite compute signal:
  - Same toy baseline as EP-591; no meaningful finite analogue of the full ordinal classification.
- Interpretation:
  - Classification program is near-complete structurally but not fully closed.

### EP-604
- Quick literature check:
  - Pinned-distance formulation remains open; grid benchmark remains the obstruction scale around `n/sqrt(log n)`.
- Finite compute signal:
  - Grid families show much smaller pinned maxima than random sets (random near `n`, grids around `0.44n..0.50n` on tested sizes), matching expected structure gap.
- Interpretation:
  - Data reflects the known extremal contrast but does not move asymptotic lower-bound theory.

### EP-609
- Quick literature check:
  - Problem-page updates include 2024 and 2025 progress on upper bounds (notably `f(n) << n^{3/2}2^{n/2}` in 2025), while lower bounds still grow much slower.
- Finite compute signal:
  - Heuristic search on `K_{2^n+1}` found best minimum monochromatic odd-cycle length `5` for `n=3` colors and `3` for `n=4` colors in tested runs.
- Interpretation:
  - Finite search is consistent with strong forcing at moderate `n`; asymptotic upper/lower gap remains very large.

### EP-612
- Quick literature check:
  - Original conjecture is known false in the `K_{2r}`-free branch (CSS21), and newer 2025 examples add further pressure; amended `(3-2/k) n/d + O(1)`-type formulation remains open.
- Finite compute signal:
  - Explicit triangle-free blow-up families give coefficient `D / (n/d)` around `0.89..0.94` in tested cases, well below conjectured upper constants.
- Interpretation:
  - Construction tests are sanity checks only; proving sharp upper constants for the amended conjecture is still the key obstacle.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/576
  - https://www.erdosproblems.com/584
  - https://www.erdosproblems.com/585
  - https://www.erdosproblems.com/588
  - https://www.erdosproblems.com/589
  - https://www.erdosproblems.com/591
  - https://www.erdosproblems.com/592
  - https://www.erdosproblems.com/604
  - https://www.erdosproblems.com/609
  - https://www.erdosproblems.com/612
- Additional primary references surfaced in quick scan:
  - https://doi.org/10.1016/j.aim.2025.110228
  - https://arxiv.org/abs/2412.07708
  - https://arxiv.org/abs/2506.14910
  - https://doi.org/10.1016/j.jctb.2021.06.001
