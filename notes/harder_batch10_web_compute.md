# Harder Batch 10: Web + Compute

Batch: `EP-322, EP-325, EP-329, EP-336, EP-338, EP-342, EP-351, EP-352, EP-354, EP-358`

Computation artifact:
- `data/harder_batch10_quick_compute.json`

## Per-problem quick outcomes

### EP-322
- Quick literature check:
  - Problem page still lists the classical Hypothesis-$K$ landscape: disproved for cubes (Mahler), higher-`k` polynomial-power growth question open.
- Finite compute signal:
  - For `k=3` and `n<=2e5`, max observed representation count in `n=a^3+b^3+c^3` (nondecreasing triples) is `5`.
  - For `k=4` and `n<=3.5e5`, max observed count in 4-term fourth-power sums is `4`.
- Interpretation:
  - Finite multiplicities are small in tested ranges; this gives no direct leverage on the conjectured infinite-often polynomial lower growth question.

### EP-325
- Quick literature check:
  - Still open; page cites Wooley-type progress for sums of three cubes (`k=3`) but no full `x^{3/k}` theorem.
- Finite compute signal:
  - For `k=3,4,5`, the ratio `f_{k,3}(X)/X^{3/k}` stays at positive constants in tested windows (roughly `0.11..0.24`).
- Interpretation:
  - Finite behavior is compatible with the conjectured scale `x^{3/k}` but remains far from proof-level asymptotics.

### EP-329
- Quick literature check:
  - Known window remains `1/\sqrt{2} <= limsup <= 1` for Sidon-set normalization, with the exact optimum unresolved.
- Finite compute signal:
  - Greedy Sidon construction gives `|A\cap[1,N]|/\sqrt N` declining from about `0.71` (`N=5000`) to `0.47` (`N=200000`).
- Interpretation:
  - Greedy finite constructions are suboptimal for limsup extraction; no evidence toward the extremal constant.

### EP-336
- Quick literature check:
  - Best known asymptotic bounds on `lim h(r)/r^2` remain between `1/3` and `1/2`.
- Finite compute signal:
  - For the classical half-block set `A=\bigcup_k (2^{2k},2^{2k+1}]` (truncated), finite window proxy reproduces order `2` and exact order `3`.
- Interpretation:
  - Computation validates the canonical order-vs-exact-order separation mechanism, but not the asymptotic `h(r)` limit.

### EP-338
- Quick literature check:
  - Bateman/Kelly/Hennecart phenomenon remains central: unrestricted order may exist while distinct-summand restricted order can fail.
- Finite compute signal:
  - For `A={1}\cup h\mathbb{N}` (`h=3,4,5` truncated), unrestricted finite order proxy exists, while distinct-summand coverage misses an entire residue class.
- Interpretation:
  - Finite behavior cleanly mirrors the theoretical obstruction to restricted order in these constructions.

### EP-342
- Quick literature check:
  - Ulam sequence remains open on density/periodicity/twin-gap style questions.
- Finite compute signal:
  - Generated 3500 terms of `U(1,2)` (last term `45132`); empirical density in `[1,X]` decreases from `0.125` (`X=1e3`) to `~0.0776` (`X=4e4`).
  - Tail difference periodicity checks do not show a strong small-period signature.
- Interpretation:
  - Finite data is consistent with low-density irregular behavior and gives no sign of eventual strict periodicity.

### EP-351
- Quick literature check:
  - Confirmed known positive cases (`p(n)=n`, and noted `p(n)=n^2` route from comments/background), full polynomial statement still open.
- Finite compute signal:
  - Exact subset-sum checks on short finite tails of `p(n)+1/n` show very sparse integer-valued subset sums in tested ranges.
- Interpretation:
  - Naive finite truncations are too coarse to reflect strong completeness, which is an asymptotic tail property after deleting arbitrary finite sets.

### EP-352
- Quick literature check:
  - Strong partial results exist under additional hypotheses; exact finite-threshold statement in full generality remains open.
- Finite compute signal:
  - Grid proxy search (no area-1 triangle among selected lattice points) gives best densities about `0.43` (`m=6`), `0.28` (`m=8`), `0.23` (`m=10`).
- Interpretation:
  - Discrete proxy suggests area constraints quickly suppress density, but this is not directly comparable to measurable-set threshold constants in `\mathbb{R}^2`.

### EP-354
- Quick literature check:
  - Newer results refine negative regimes near power-of-two-related pairs (`\beta=2^k\alpha`), while broad completeness remains open.
- Finite compute signal:
  - For `(\alpha,\beta)=(\sqrt2,\sqrt3)`, contiguous subset-sum reach from `1` grows rapidly with truncation depth.
  - For a power-of-two-related case `(1.5,6)`, reach stays essentially stuck at `1` in tested truncations.
- Interpretation:
  - Finite behavior supports the structural distinction between generic irrational-ratio cases and known problematic power-of-two-related regimes.

### EP-358
- Quick literature check:
  - Still open in intended strong forms (`f(n)\to\infty` or eventual `f(n)\ge2`), with known caveats about trivial variants.
- Finite compute signal:
  - For several candidate sequences, tail minima of `f(n)` over `[X/2,X]` are `0` in tested windows, including `a_n=n`.
  - Maxima do grow in some models (e.g., `a_n=n` reaches `35` on `X<=2e5`).
- Interpretation:
  - Experiments reinforce that having unbounded `\limsup f(n)` is much easier than forcing eventual lower bounds for all large `n`.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/322
  - https://www.erdosproblems.com/325
  - https://www.erdosproblems.com/329
  - https://www.erdosproblems.com/336
  - https://www.erdosproblems.com/338
  - https://www.erdosproblems.com/342
  - https://www.erdosproblems.com/351
  - https://www.erdosproblems.com/352
  - https://www.erdosproblems.com/354
  - https://www.erdosproblems.com/358
