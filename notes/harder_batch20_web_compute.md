# Harder Batch 20: Web + Compute

Batch: `EP-860, EP-872, EP-885, EP-889, EP-893, EP-901, EP-917, EP-920, EP-928, EP-929`

Computation artifact:
- `data/harder_batch20_quick_compute.json`

## Per-problem quick outcomes

### EP-860
- Quick literature check:
  - Problem page remains open (page updated in 2025), with classical bounds still far apart.
- Finite compute signal:
  - Hall-matching proxy (over `m<=800`) gave worst required interval lengths around `46` (`n=30`), `47` (`n=50`), `79` (`n=80`).
- Interpretation:
  - Finite behavior is compatible with superlinear-vs-nearlinear uncertainty; no asymptotic resolution signal.

### EP-872
- Quick literature check:
  - Still open (updated 2025); comments suggest even strong linear lower bounds remain unclear.
- Finite compute signal:
  - Exact minimax for `n<=20` gives game lengths roughly `0.44n` to `0.50n` when the long-game player starts.
- Interpretation:
  - Small exact game values support linear-length behavior at finite scales, but do not certify a uniform `\epsilon n` theorem.

### EP-885
- Quick literature check:
  - Open in full generality; known solved cases include `k=2,3,4` (latest listed progress through 2019).
- Finite compute signal:
  - Bounded search (`N<=30000`) found witnesses for `k=2,3`; no witness found for `k=4,5,6` in this range/strategy.
- Interpretation:
  - Negative finite result is purely range-limited and consistent with known theorem that `k=4` is true.

### EP-889
- Quick literature check:
  - Remains open; no listed modern closure for growth of `v_0(n)`.
- Finite compute signal:
  - In bounded search (`n<=2500`, `k<=6000`), max observed value is `5`, while prefix minima stay at `1`.
- Interpretation:
  - Finite data shows growth in sampled maxima but is too weak to infer `v_0(n)\to\infty`.

### EP-893
- Quick literature check:
  - 2025 work (Kovac--Luca, arXiv:2506.04883) shows no finite limit, with `\limsup f(2n)/f(n)=\infty`; page remains listed open for full limit behavior.
- Finite compute signal:
  - Exact prefix computation up to `k=44` gives `f(2n)/f(n)` rising from about `3` to about `8.08` in sampled `n`.
- Interpretation:
  - Numerics align with non-convergence to a finite limit and support the observed upward trend.

### EP-901
- Quick literature check:
  - Still open; classical `2^n` to polynomial-times-`2^n` gap remains.
- Finite compute signal:
  - Greedy constructions of non-2-colorable `n`-uniform hypergraphs gave finite upper-bound witnesses with edge counts about `30` (`n=4`), `92` (`n=5`), `327` (`n=6`).
- Interpretation:
  - Constructions are qualitatively in the expected exponential regime but do not sharpen asymptotic exponents.

### EP-917
- Quick literature check:
  - Updated references (2023) keep the central dense-critical asymptotics open, especially the `k=6` main case.
- Finite compute signal:
  - Dirac-type join-of-two-odd-cycles constructions were verified at `t=2..5` to have `\chi=6`, exact edge formula, and sampled edge-criticality.
- Interpretation:
  - Finite checks reinforce known lower-bound construction behavior near density `n^2/4` for `k=6`.

### EP-920
- Quick literature check:
  - Open (updated 2026); known bounds improved for `k=4` but target exponent form remains unresolved.
- Finite compute signal:
  - Mycielski K4-free constructions verified through several iterations (still K4-free), yielding explicit finite lower bounds for `f_4(n)` via high chromatic number.
- Interpretation:
  - Construction data gives concrete finite lower bounds but no evidence close to conjectured near-optimal asymptotic growth.

### EP-928
- Quick literature check:
  - Open; existence/value of joint smoothness density remains unsettled in full generality.
- Finite compute signal:
  - For `N=10^6`, joint densities were close to but below product heuristics; joint/product ratios ranged about `0.88..0.98` for tested `(\alpha,\beta)`.
- Interpretation:
  - Finite data suggests near-independence with mild negative correlation at this scale.

### EP-929
- Quick literature check:
  - Open; known lower and upper bounds still leave a substantial asymptotic gap.
- Finite compute signal:
  - For `N=250000`, minimal `x` with any occurrence of a fully `x`-smooth block of length `k` rose with `k` (e.g. `x=7` for `k=6`, `x=17` for `k=16`), while tested densities remained below `10^{-4}`.
- Interpretation:
  - Finite proxy indicates increasing smoothness threshold with block length, consistent with nontrivial growth of `S(k)`.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/860
  - https://www.erdosproblems.com/872
  - https://www.erdosproblems.com/885
  - https://www.erdosproblems.com/889
  - https://www.erdosproblems.com/893
  - https://www.erdosproblems.com/901
  - https://www.erdosproblems.com/917
  - https://www.erdosproblems.com/920
  - https://www.erdosproblems.com/928
  - https://www.erdosproblems.com/929
- Additional primary references surfaced in quick scan/background:
  - https://arxiv.org/abs/2506.04883
