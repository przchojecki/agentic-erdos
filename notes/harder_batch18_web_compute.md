# Harder Batch 18: Web + Compute

Batch: `EP-778, EP-782, EP-787, EP-791, EP-792, EP-805, EP-811, EP-813, EP-821, EP-824`

Computation artifact:
- `data/harder_batch18_quick_compute.json`

## Per-problem quick outcomes

### EP-778
- Quick literature check:
  - Problem remains open; 2024 progress shows Bob-winning `n` have density at least `3/4`.
- Finite compute signal:
  - Random-vs-random play is near balanced with high tie rates.
  - With the same greedy triangle-building heuristic on both sides, first-player (Alice) keeps a small advantage; with asymmetric heuristics, the stronger heuristic side dominates.
- Interpretation:
  - Finite simulations show strong strategy sensitivity and do not settle Bob’s universal winning-strategy question.

### EP-782
- Quick literature check:
  - Still open; no unconditional full resolution for long quasi-progressions/cubes in squares.
- Finite compute signal:
  - Quasi-progression search in squares up to `2e6` found best lengths increasing with tolerance `C` (e.g. up to `9` for `C=12`).
  - Many 2D additive-cube patterns were found; no 3D pattern found in random probing at tested scale.
- Interpretation:
  - Finite data supports abundance of low-dimensional structure but does not resolve arbitrary-length behavior.

### EP-787
- Quick literature check:
  - Bounds have improved (latest page update 2025), but the asymptotic order remains open.
- Finite compute signal:
  - In sampled adversarial families, interval-type sets were worst; exact finite optimization gave worst ratios around `0.53n`.
- Interpretation:
  - Samples suggest large guaranteed subsets in finite ranges; no asymptotic breakthrough.

### EP-791
- Quick literature check:
  - Open; `g(n)~2sqrt(n)` is known false, with best constants still far from final.
- Finite compute signal:
  - Exact small-`n` values (`n=10,15,20,24`) give `g(n)^2/n` in roughly `2.4..2.67`.
  - Greedy constructions for larger `n` are in the expected `3.6..4.0` constant window.
- Interpretation:
  - Numerics are consistent with current lower/upper constant ranges; no new constant refinement.

### EP-792
- Quick literature check:
  - Open; newest lower-bound increment (2025) still far from closing asymptotic gap.
- Finite compute signal:
  - Exact sampled worst-cases for `n=16,20,24` gave max sum-free subset sizes near `n/2` (well above `n/3`).
- Interpretation:
  - Small finite instances are not near asymptotic extremality driving the `n/3+o(n)` frontier.

### EP-805
- Quick literature check:
  - Open; strongest known constructions/counterconstraints still leave a broad threshold interval for `g(n)`.
- Finite compute signal:
  - In `G(n,1/2)` samples with target threshold `t=ceil(log2 n)`, success probability for random induced `g`-subgraphs transitions sharply as `g` grows (around `g~56..72` in tested `n=128,256`).
- Interpretation:
  - Finite local-Ramsey transition is visible but does not identify the extremal existential threshold function.

### EP-811
- Quick literature check:
  - Problem remains open in general; classic challenge cases still active.
- Finite compute signal:
  - In a structured balanced 6-coloring of `K_13` (cyclic-distance decomposition), both a rainbow `K_4` and rainbow `C_6` are present.
- Interpretation:
  - This balanced family is not a counterexample to rainbow-forcing for these two test graphs.

### EP-813
- Quick literature check:
  - Open; 2023 raised the lower exponent significantly (`~n^{5/12-o(1)}`), leaving a substantial gap.
- Finite compute signal:
  - Best sampled dense graphs still had nonzero sampled violations of the local 7-vertex condition; exact clique numbers on these near-candidates were `8` for `n=26,30,34`.
- Interpretation:
  - Search did not reach fully valid finite witnesses at these sizes, so it gives direction only.

### EP-821
- Quick literature check:
  - Open; best current exponent remains below the `1-epsilon` target.
- Finite compute signal:
  - Totient-preimage scan up to `5e5` found maximum `g(n)=639` at `n=120960` (effective finite exponent around `0.552`).
- Interpretation:
  - Finite data is far from the conjectured near-linear exponent regime.

### EP-824
- Quick literature check:
  - Open; known progress proves superlinear growth of `h(x)/x`, while near-quadratic claim remains unresolved.
- Finite compute signal:
  - Counts up to `x=30000` show increasing `h(x)/x`, with fitted finite exponent near `1.07`.
- Interpretation:
  - Numerical growth is consistent with known superlinear behavior, but far from confirming `x^{2-o(1)}`.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/778
  - https://www.erdosproblems.com/782
  - https://www.erdosproblems.com/787
  - https://www.erdosproblems.com/791
  - https://www.erdosproblems.com/792
  - https://www.erdosproblems.com/805
  - https://www.erdosproblems.com/811
  - https://www.erdosproblems.com/813
  - https://www.erdosproblems.com/821
  - https://www.erdosproblems.com/824
- Additional primary references surfaced in quick scan:
  - https://doi.org/10.1016/j.jnt.2026.03.017
  - https://arxiv.org/abs/2410.16554
