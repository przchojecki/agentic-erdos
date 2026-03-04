# Harder Batch 26: Web + Compute

Batch: `EP-1111, EP-1112, EP-1113, EP-1117, EP-1122, EP-1129, EP-1135`

Computation artifact:
- `data/harder_batch26_quick_compute.json`

Method note:
- Applied `cycle-method.md`: each item includes one finite mechanism probe and one explicit bottleneck statement.

## Per-problem quick outcomes

### EP-1111
- Quick literature check:
  - Page still presents the statement as unresolved in full strength, while recording the 2024 Nguyen--Scott--Seymour strengthening in a related direction.
- Finite compute signal:
  - Exact anticomplete-pair scan on `Mycielski(C5)` (`n=11`, `chi=4`, `omega=2`) finds best `min(chi(A),chi(B))=2`; sampled search on the `n=23` lift also found only `2`.
- Interpretation:
  - Finite high-chi triangle-free proxies show anticomplete pair phenomena, but do not force high chromaticity on both sides at larger `c`.

### EP-1112
- Quick literature check:
  - Page status is **OPEN**; background includes known negative results for some concrete parameter choices.
- Finite compute signal:
  - Greedy bounded-gap constructions for `k=3, d1=2, d2=3` are highly sensitive to `B`: very long avoidance for `B={2^i}`, immediate obstruction for `B={3^i}`, intermediate for random lacunary examples.
- Interpretation:
  - Finite behavior is strongly model-dependent, consistent with the known delicate/non-universal nature of `k>=3` cases.

### EP-1113
- Quick literature check:
  - Page status is **OPEN**; discussion still centers on whether non-covering Sierpinski numbers exist.
- Finite compute signal:
  - In odd `m<=3000`, `k<=14` pseudo-Sierpinski screening produced many candidates with all tested `2^k m+1` composite; several admit small greedy covering-prime sets in this finite window.
- Interpretation:
  - Finite pseudo-candidates often look coverable at short horizons, but this does not address true all-`k` behavior or finite-cover nonexistence.

### EP-1117
- Quick literature check:
  - Page status is **OPEN**; first question is solved historically, second (`liminf u(r)=infty`) remains open with 2024 approximate progress.
- Finite compute signal:
  - Angular-maxima counts for polynomial proxies show controllably large `u(r)` in sampled families (e.g., `z^m+1` gives estimated `u(1)=m`).
- Interpretation:
  - Finite proxies support the mechanism behind large `limsup`, but provide no evidence for the stronger `liminf` statement.

### EP-1122
- Quick literature check:
  - Page status is **OPEN** with 2022 partial progress under stronger sparsity/regularity assumptions.
- Finite compute signal:
  - Descent-set density `|{n<=x:f(n+1)<f(n)}|/x` is near `0` for `f(n)=log n`, but stabilizes around positive constants (`~0.43`, `~0.38`, `~0.50`) for sample non-log additive functions.
- Interpretation:
  - Finite profiles support the heuristic that vanishing descent density is highly rigid and atypical among additive models.

### EP-1129
- Quick literature check:
  - Page status is **PROVED**.
- Finite compute signal:
  - Numerical Lebesgue-constant comparisons match theory direction (Chebyshev nodes far better than equispaced), and symmetric `n=4` search gives `t≈0.418`, close to the known `~0.4177`.
- Interpretation:
  - Treat as resolved on the list; finite numerics are consistency checks.

### EP-1135
- Quick literature check:
  - Page status is **OPEN** (Collatz / accelerated map form).
- Finite compute signal:
  - Accelerated-Collatz verification up to `n<=2,000,000` converges for all tested starts; max observed stopping length in this range is `349` at `n=1,723,519`.
- Interpretation:
  - Large finite verification remains fully consistent with the conjecture but gives no asymptotic proof mechanism.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/1111
  - https://www.erdosproblems.com/1112
  - https://www.erdosproblems.com/1113
  - https://www.erdosproblems.com/1117
  - https://www.erdosproblems.com/1122
  - https://www.erdosproblems.com/1129
  - https://www.erdosproblems.com/1135
