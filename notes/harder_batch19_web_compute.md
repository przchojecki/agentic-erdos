# Harder Batch 19: Web + Compute

Batch: `EP-825, EP-827, EP-828, EP-829, EP-830, EP-840, EP-849, EP-850, EP-856, EP-857`

Computation artifact:
- `data/harder_batch19_quick_compute.json`

## Per-problem quick outcomes

### EP-825
- Quick literature check:
  - Problem page now marks this as solved in the affirmative (Larsen, Jan 2026 thread update; page edited Feb 2026).
- Finite compute signal:
  - Weird-number scan to `N=25000` found `46` weird numbers, with max observed abundancy about `2.07095`.
- Interpretation:
  - Treat as resolved on the list (subject to normal verification/publication workflow); finite scan is only consistency context.

### EP-827
- Quick literature check:
  - Still open; corrected existence/bound argument from Martinez--Roldan-Pensado gives polynomial upper bound (`n_k << k^9`).
- Finite compute signal:
  - Random general-position tests for `n=10,12,13` often achieved full-size subsets with all circumradii distinct.
- Interpretation:
  - Small finite behavior is favorable, but no route to asymptotic/sharp `n_k` from current methods.

### EP-828
- Quick literature check:
  - Remains open; no major post-classical resolution visible in quick scan.
- Finite compute signal:
  - For `n<=5e5`, counts of `phi(n) | n+a` vary sharply by `a`; very sparse for small positive `a` (e.g. `a=1` gave 5 hits), much denser for some nonpositive shifts.
- Interpretation:
  - Strongly shift-dependent arithmetic structure; no finite evidence toward a full infinitude theorem for all `a`.

### EP-829
- Quick literature check:
  - Open; page/thread reflects known lower-bound progress (`(log n)^{11/13}` infinitely often) but no polylog upper bound proof.
- Finite compute signal:
  - For `n<=2e8`, max representation multiplicity by two cubes was `3` (no `r(n)>=4` seen).
- Interpretation:
  - Finite range suggests low multiplicity at this scale; asymptotic upper bound remains inaccessible.

### EP-830
- Quick literature check:
  - Open; standard upper bounds remain far from the conjectural lower-growth direction.
- Finite compute signal:
  - Direct amicable-pair count up to `x=4e5` gives `A(x)=25` with slowly decaying `A(x)/x`.
- Interpretation:
  - Data does not indicate near-linear-scale growth, but finite counts are too small to infer asymptotics.

### EP-840
- Quick literature check:
  - Open; classical `N^{1/2}`-scale bounds remain the main asymptotic frame in quick scan.
- Finite compute signal:
  - Greedy quasi-Sidon constructions (`|A+A|` ratio thresholds `0.9,0.95,0.98`) give `|A|/sqrt(N)` around `0.94..1.48` in tested `N`.
- Interpretation:
  - Finite behavior matches `sqrt(N)` growth heuristic; no asymptotic constant improvement.

### EP-849
- Quick literature check:
  - Open (Singmaster-type question); partial interior-of-Pascal results exist but no full multiplicity characterization by exact `t`.
- Finite compute signal:
  - Scan to row `n<=600` found max multiplicity `3` (no value with multiplicity `>=4` in that window).
- Interpretation:
  - Small finite windows remain consistent with rarity of high multiplicities; does not approach global conjectural structure.

### EP-850
- Quick literature check:
  - Open; known exceptional pair `(75,1215)` for the 2-shift support-sharing pattern is recorded, and conditional negative results are known under strong ABC variants.
- Finite compute signal:
  - Collision search up to `x<=2e5` found no `x!=y` with matching prime-support triples on `(x,x+1,x+2)`.
- Interpretation:
  - No new counterexample candidate found; finite search remains far from settling existence/nonexistence.

### EP-856
- Quick literature check:
  - Open but has recent 2025 progress (Tang--Zhang) linking exponents to sunflower-free capacity and giving explicit polylog-power bounds.
- Finite compute signal:
  - Greedy constructions gave harmonic sums around `4.04` (`k=3,N=500`) and `6.25` (`k=4,N=500`), with `k=3` profile below `log N` scale in tested range.
- Interpretation:
  - Finite experiments are consistent with sub-`log N` behavior trends for `k=3`, aligning directionally with current theory.

### EP-857
- Quick literature check:
  - Open; for `k=3` the benchmark upper bound remains the Naslund--Sawin exponential base `(3/2^{2/3})` framework.
- Finite compute signal:
  - Greedy random families on `[n]` for `n=7..10` achieved sizes with ratio to `(3/2^{2/3})^n` decreasing as `n` grows.
- Interpretation:
  - Finite lower bounds are far below the upper-bound scale and do not narrow asymptotic base constants.

## Web sources used
- Problem pages / threads:
  - https://www.erdosproblems.com/825
  - https://www.erdosproblems.com/forum/thread/825
  - https://www.erdosproblems.com/827
  - https://www.erdosproblems.com/forum/thread/827
  - https://www.erdosproblems.com/828
  - https://www.erdosproblems.com/829
  - https://www.erdosproblems.com/forum/thread/829
  - https://www.erdosproblems.com/830
  - https://www.erdosproblems.com/840
  - https://www.erdosproblems.com/forum/thread/849
  - https://www.erdosproblems.com/850
  - https://www.erdosproblems.com/forum/thread/850
  - https://www.erdosproblems.com/857
- Additional primary references surfaced in quick scan:
  - https://arxiv.org/abs/2512.20055
  - https://doi.org/10.37236/13277
