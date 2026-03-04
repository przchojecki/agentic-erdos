# Harder Batch 21: Web + Compute

Batch: `EP-931, EP-934, EP-936, EP-939, EP-942, EP-944, EP-945, EP-955, EP-959, EP-969`

Computation artifact:
- `data/harder_batch21_quick_compute.json`

## Per-problem quick outcomes

### EP-931
- Quick literature check:
  - Problem page explicitly notes the statement is false without caveats and lists an AlphaProof counterexample.
- Finite compute signal:
  - Search over `n<=240`, block lengths `3..12` found many equal-prime-support block pairs and recovered the specific `(n_1,k_1)=(0,10)`, `(n_2,k_2)=(13,3)` counterexample.
- Interpretation:
  - As written, the raw finiteness question is not correct; any viable version needs explicit exclusions/caveats.

### EP-934
- Quick literature check:
  - Page remains open; `t=2` case is resolved classically, while higher-`t` sharp formulas are still active.
- Finite compute signal:
  - For even `d=4,6,8,10`, the C5-blowup construction matched edge count `5d^2/4`, max degree `d`, and had line-graph diameter `2`.
- Interpretation:
  - Finite checks align with the known extremal structure behind the `t=2` scale, but do not settle `t>=3` asymptotics.

### EP-936
- Quick literature check:
  - Current strongest listed positive results are conditional on `abc` for both families.
- Finite compute signal:
  - Exact scan found only small powerful hits in tested ranges: `2^3+1=9`, and `n!+1` powerful at `n=4,5,7` (`25,121,5041`) for `n<=13`.
- Interpretation:
  - Data supports rarity but cannot address the full infinitude/finite question beyond tiny ranges.

### EP-939
- Quick literature check:
  - Page includes 2024 updates on constructions for coprime 3-powerful triples; higher-`r` questions remain open.
- Finite compute signal:
  - Up to `2e6`, no coprime examples were found for tested `r=3,4,5` additive patterns under direct search.
- Interpretation:
  - Naive finite search misses known structured 3-powerful constructions and gives no decisive evidence for higher `r`.

### EP-942
- Quick literature check:
  - Problem remains open; known lower-growth results and density statements are recorded.
- Finite compute signal:
  - For `n<=50000`, maximum observed `h(n)` was `8`; empirical density of `h(n)=1` near `0.284` in this range.
- Interpretation:
  - Finite statistics are consistent with known distributional behavior and unboundedness, but do not identify sharp order/exponent.

### EP-944
- Quick literature check:
  - 2025 progress shows existence for large enough `k` (depending on `r`), while the `k=4, r=1` case remains open.
- Finite compute signal:
  - Random search on `n=8..12` found many `\chi=4` graphs but no sampled graph that was simultaneously vertex-critical and free of single critical edges.
- Interpretation:
  - No small witness emerged; this is consistent with the listed hardness of the unresolved `k=4` case.

### EP-945
- Quick literature check:
  - Still open; known bounds leave a large gap relative to polylog target.
- Finite compute signal:
  - Distinct-`\tau` run proxy up to `x=2e6` reached length `11`, with `F(x)/\log x` decreasing in sampled scales.
- Interpretation:
  - Finite behavior is mild and compatible with polylogarithmic-scale hypotheses, but far from proof-level evidence.

### EP-955
- Quick literature check:
  - Open with notable partial cases proved for specific sparse sets.
- Finite compute signal:
  - For `n<=1e6`, preimage densities for sparse targets (primes, powers of two, squares) were decreasing but still non-negligible at this scale.
- Interpretation:
  - Numerics show downward trend for several test sets but remain far from asymptotic density-zero conclusions.

### EP-959
- Quick literature check:
  - 2025 paper establishes a lower bound of order `n log n` for the top multiplicity gap.
- Finite compute signal:
  - Sampled constructions (especially two-line configurations) produced gaps growing roughly linearly in tested `n` (`40..100`), with positive normalized `gap/(n log n)`.
- Interpretation:
  - Finite data is directionally consistent with a superlinear-in-`n` gap and with recent lower-bound progress.

### EP-969
- Quick literature check:
  - Problem remains open; classical upper/lower landscapes are still far from matching the conjectural order.
- Finite compute signal:
  - For `x<=2e6`, observed max `|E(x)|` stayed small and the empirical exponent `log(max|E|)/log x` near `0.22..0.23`.
- Interpretation:
  - Finite regime is compatible with sub-`x^{1/4+epsilon}` style behavior but far too small to infer true asymptotic order.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/931
  - https://www.erdosproblems.com/934
  - https://www.erdosproblems.com/936
  - https://www.erdosproblems.com/939
  - https://www.erdosproblems.com/942
  - https://www.erdosproblems.com/944
  - https://www.erdosproblems.com/945
  - https://www.erdosproblems.com/955
  - https://www.erdosproblems.com/959
  - https://www.erdosproblems.com/969
- Additional primary references surfaced in quick scan:
  - https://arxiv.org/abs/2505.04283
  - https://arxiv.org/abs/2502.01105
