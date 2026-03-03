# Harder Batch 7: Web + Compute

Batch: `EP-184, EP-188, EP-195, EP-202, EP-208, EP-212, EP-213, EP-222, EP-233, EP-236`

Computation artifact:
- `data/harder_batch7_quick_compute.json`

## Per-problem quick outcomes

### EP-184
- Quick literature check:
  - Current best bound remains near-linear with an iterated-log factor ($O(n\log^* n)$, Bucić-Montgomery 2022), while the conjectured $O(n)$ remains open.
- Finite compute signal:
  - Greedy cycle+edge decomposition on random sparse/dense graphs gave piece counts around `0.6n..0.9n` in tested regimes.
  - For `K_{3,n-3}` (linear lower-obstruction family), decomposition counts were about `1.45n..1.48n` in this greedy run.
- Interpretation:
  - Finite behavior is consistent with linear-scale piece counts but does not address worst-case constants rigorously.

### EP-188
- Quick literature check:
  - Known lower bound is now at least `6` for the intended distance-1 blue progression version.
- Finite compute signal:
  - Triangular-lattice proxy optimization produced colorings with best max blue run lengths `4,5,6,7` as patch size increased.
- Interpretation:
  - Proxy supports growth pressure on unavoidable blue unit-step progressions, but this is not a proof in the Euclidean plane.

### EP-195
- Quick literature check:
  - Known upper bound improved to `k <= 4` (Adenwalla 2022); exact value remains unresolved.
- Finite compute signal:
  - Random permutations of `[1..N]` for `N=30..60` still had nonzero counts of monotone 4-term value-APs in all tested samples.
- Interpretation:
  - Random finite search does not locate extremal avoiding constructions; it neither proves nor disproves `k=4` as the exact threshold.

### EP-202
- Quick literature check:
  - State of the art remains around $N/L(N)^c$-type envelopes with a gap between known lower and upper exponents.
- Finite compute signal:
  - Randomized residue-class packing heuristics gave best `r` values roughly `0.15N..0.25N` on tested `N`.
- Interpretation:
  - Finite heuristic solutions are substantial but far from asymptotic sharpness.

### EP-208
- Quick literature check:
  - Best unconditional exponent on maximal squarefree gaps remains above polylogarithmic, with ABC implying the $n^\varepsilon$ target.
- Finite compute signal:
  - Observed max gaps up to `X=5e6` were small (`<=9`) and normalized ratios near the conjectural $
  (\pi^2/6)\log x/\log\log x$ scale stayed around `~1.0` in this range.
- Interpretation:
  - Small-range numerics are compatible with the logarithmic-scale conjectural order but not evidentiary for asymptotics.

### EP-212
- Quick literature check:
  - Conditional Bombieri-Lang framework strongly constrains rational distance sets; unconditional full resolution remains open.
- Finite compute signal:
  - Integer-grid proxy (integer-distance specialization) finds relatively large finite cliques, dominated by near-collinear structures.
- Interpretation:
  - Finite proxies do not approach density-in-plane behavior and mainly reflect one-dimensional artifacts.

### EP-213
- Quick literature check:
  - Best known explicit construction size remains `7`; no general all-`n` construction known.
- Finite compute signal:
  - Integer-grid proxy with general-position constraints (`no 3 collinear`, `no 4 concyclic`) found max size `4` in tested boxes.
- Interpretation:
  - Crude finite search remains far from known best constructions, confirming the problem’s geometric delicacy.

### EP-222
- Quick literature check:
  - Recent work continues to improve large-gap lower constants; best upper bounds are still far from conjectural logarithmic order.
- Finite compute signal:
  - Max observed gaps between sums of two squares reached `48` by `X=5e6`, with normalized log-scale ratios growing in tested range.
- Interpretation:
  - Finite data supports existence of comparatively large gaps and aligns with the hard asymptotic gap problem.

### EP-233
- Quick literature check:
  - Core second-moment bound remains open in the strong $N(\log N)^2$ form.
- Finite compute signal:
  - For `N` up to `5e5`, $
  \sum_{n\le N} d_n^2 /(N(\log N)^2)$ stabilized near `~2.13` in this finite range.
- Interpretation:
  - Finite profile is consistent with conjectured order of magnitude, without providing proof-level control.

### EP-236
- Quick literature check:
  - No full asymptotic resolution; classical lower spikes and upper-distribution bounds remain central.
- Finite compute signal:
  - Up to `X=2e6`, maximum observed `f(n)` was `15`, and `max f(n)/log n` stayed around `~1.05` at the maximizing examples.
- Interpretation:
  - Finite behavior suggests logarithmic-scale maxima are plausible but does not settle `f(n)=o(log n)`.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/184
  - https://www.erdosproblems.com/188
  - https://www.erdosproblems.com/195
  - https://www.erdosproblems.com/202
  - https://www.erdosproblems.com/208
  - https://www.erdosproblems.com/212
  - https://www.erdosproblems.com/213
  - https://www.erdosproblems.com/222
  - https://www.erdosproblems.com/233
  - https://www.erdosproblems.com/236
- Additional primary references surfaced in quick scan:
  - https://arxiv.org/abs/2211.07689
  - https://arxiv.org/abs/2211.04451
  - https://arxiv.org/abs/2407.19026
  - https://arxiv.org/abs/2208.14568
  - https://arxiv.org/abs/2112.03175
  - https://arxiv.org/abs/1901.02616
