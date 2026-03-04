# Harder Batch 17: Web + Compute

Batch: `EP-687, EP-690, EP-695, EP-701, EP-704, EP-705, EP-711, EP-713, EP-769, EP-774`

Computation artifact:
- `data/harder_batch17_quick_compute.json`

## Per-problem quick outcomes

### EP-687
- Quick literature check:
  - Problem-page status remains open; classical upper bound still near `x^2` with much smaller known lower growth.
- Finite compute signal:
  - Random/hillclimb residue-covering search gives modest prefixes (`~0.65x` to `~1.35x` over tested `x=20..100`), far below quadratic scale in this range.
- Interpretation:
  - Finite optimization does not suggest near-`x^2` behavior at small scales; asymptotic upper/lower gap remains wide.

### EP-690
- Quick literature check:
  - New 2026 paper reports a strong negative resolution trend: only `d_1(p)` is unimodal, with non-unimodality broadly established for larger `k`.
- Finite compute signal:
  - Exact density recursion over primes shows sampled unimodality for `k<=3` and clear multiple local maxima for `k>=4`.
- Interpretation:
  - Computational profile aligns with the modern negative direction for general `k`.

### EP-695
- Quick literature check:
  - Problem-page status remains open; growth of chains is tied to least-prime-in-progression bounds.
- Finite compute signal:
  - Greedy chain (`p_{i+1}` smallest prime `≡1 mod p_i`) grows quickly (`p_10=1,180,247`), with no small-scale contradiction to either question.
- Interpretation:
  - Data is consistent with rapid growth and does not resolve asymptotic limits.

### EP-701
- Quick literature check:
  - Still open globally; best recent progress includes positive cases such as covering number `2`.
- Finite compute signal:
  - In sampled small downsets (with exact intersecting-subfamily optimization), no counterexample to the star bound appeared.
- Interpretation:
  - Finite checks are supportive but not close to a general proof.

### EP-704
- Quick literature check:
  - Status remains open; exponential lower/upper bases are still far apart.
- Finite compute signal:
  - Bound-window table shows the multiplicative uncertainty grows rapidly with `n` despite fixed exponential bases.
- Interpretation:
  - The main task is narrowing exponential bases and understanding limit existence.

### EP-705
- Quick literature check:
  - Marked `DISPROVED` (2025): there are unit-distance graphs of arbitrarily large girth with chromatic number at least `4`.
- Finite compute signal:
  - Exact check on the standard Moser spindle gives `chi=4`, girth `3`.
- Interpretation:
  - Original “large girth implies 3-colorable” statement is false.

### EP-711
- Quick literature check:
  - Latest 2026 update: second statement (`max_m (f(n,m)-f(n,n)) -> infinity`) is proved affirmative; first near-linear upper question remains open.
- Finite compute signal:
  - Exact sampled `f(n,m)` computations (`n=20,30,40`, sampled `m`) show positive gaps (`10,11,15`) versus `f(n,n)`.
- Interpretation:
  - Finite experiments are consistent with the now-proved divergence of the gap.

### EP-713
- Quick literature check:
  - Problem remains open; landscape of known Turan exponents continues to broaden, but full asymptotic formula `ex(n;G)~cn^alpha` for every bipartite `G` is unresolved.
- Finite compute signal:
  - Greedy `C4`-free constructions show local log-log slopes near `1.5`, serving as a rational-exponent benchmark.
- Interpretation:
  - Supports familiar `3/2`-type behavior in a model case, not the full conjectural classification.

### EP-769
- Quick literature check:
  - Still open; lower and upper bounds remain far apart in high dimensions.
- Finite compute signal:
  - Numeric table of known bounds shows the ratio gap widens dramatically with `n`.
- Interpretation:
  - Current theory leaves a large asymptotic uncertainty for `c(n)`.

### EP-774
- Quick literature check:
  - Still open in the dissociated setting; 2024 negative result is for the analogous Sidon-partition question, not a full resolution of this exact problem.
- Finite compute signal:
  - Random finite sets show moderate dissociated dimension ratios and small partition counts (`2` or `3`) into dissociated classes in tested sizes.
- Interpretation:
  - Finite behavior does not decide whether proportional dissociation implies bounded union of dissociated sets in general.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/687
  - https://www.erdosproblems.com/690
  - https://www.erdosproblems.com/695
  - https://www.erdosproblems.com/701
  - https://www.erdosproblems.com/704
  - https://www.erdosproblems.com/705
  - https://www.erdosproblems.com/711
  - https://www.erdosproblems.com/713
  - https://www.erdosproblems.com/769
  - https://www.erdosproblems.com/774
- Additional primary references surfaced in quick scan:
  - https://doi.org/10.1016/j.jnt.2026.03.017
  - https://arxiv.org/abs/2508.20041
  - https://arxiv.org/abs/2410.16554
  - https://arxiv.org/abs/1806.06668
  - https://arxiv.org/abs/2402.19077
