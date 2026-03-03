# Harder Batch 9: Web + Compute

Batch: `EP-271, EP-274, EP-276, EP-283, EP-291, EP-293, EP-304, EP-306, EP-319, EP-320`

Computation artifact:
- `data/harder_batch9_quick_compute.json`

## Per-problem quick outcomes

### EP-271
- Quick literature check:
  - Classical Odlyzko-Stanley structure and growth dichotomy discussion remains central; no clean full explicit formula for all starts surfaced quickly.
- Finite compute signal:
  - Greedy sequences for starts `n=1,2,3,4,5,7,10` show fitted exponents around `1.57..1.69` (220-term window).
  - `n=1` profile matches the base-3-digit-`{0,1}` pattern in early terms.
- Interpretation:
  - Data supports polynomial growth with exponent near the expected regime, but does not settle asymptotic classification for all `n`.

### EP-274
- Quick literature check:
  - For broad classes (notably abelian / subnormal settings), nonexistence of such exact coverings is known; full general scope remains tied to Herzog-Sch"onheim-type conjectural territory.
- Finite compute signal:
  - Exhaustive exact-cover search in cyclic groups `Z_n` for `n<=30` found no partition by cosets with pairwise distinct indices.
- Interpretation:
  - Computation aligns with known impossibility in abelian examples and does not suggest a small counterexample.

### EP-276
- Quick literature check:
  - Composite Lucas constructions via covering methods exist; the stronger “no global common-factor mechanism” direction remains delicate.
- Finite compute signal:
  - Small-seed scan (`a_0,a_1` composite in `[4,120]`) found examples with at least 28 initial composite terms and prefix gcd `1`.
- Interpretation:
  - Finite evidence shows long composite stretches can coexist with gcd collapse, but this is far from an infinite all-composite proof.

### EP-283
- Quick literature check:
  - The polynomial Egyptian-fraction direction has active 2025 updates (including recent Erdos-Graham-question papers); case `p(n)=n^2` has strong known progress.
- Finite compute signal:
  - Random split-generated decompositions of `1` produced many attainable `m=\sum p(n_i)` values.
  - Coverage is nontrivial for `p(x)=x` and much sparser for `p(x)=x^2` in tested finite ranges.
- Interpretation:
  - Supports abundance heuristics for linear-type polynomials; quadratic and general-polynomial asymptotics are still hard.

### EP-291
- Quick literature check:
  - Second part (`(a_n,L_n)>1` infinitely often) is essentially easy; the infinite coprime-occurrence side remains the subtle part.
- Finite compute signal:
  - Exact BigInt computation to `n=500` finds both behaviors frequently (`gcd=1` and `>1`), with coprime cases still present but less dense.
- Interpretation:
  - Finite profile strongly supports coexistence of both regimes, without asymptotic proof of infinitude for the coprime side.

### EP-293
- Quick literature check:
  - 2025 work improved lower growth understanding (`v(k)` at least stretched/exponential-in-`k^2` scale in known bounds).
- Finite compute signal:
  - Exact enumeration for `k=3..6` yields rapidly growing “first missing denominator” proxy (`4,11,17,53`) under finite search bounds.
- Interpretation:
  - Finite behavior indicates strong growth pressure in `v(k)`, consistent with the modern lower-bound direction.

### EP-304
- Quick literature check:
  - The `N(b)` problem remains open at the conjectural `O(log log b)` scale, though Egyptian-fraction length bounds continue to improve.
- Finite compute signal:
  - For small tested `b` (`8..24`), all `a/b` were represented within `<=3` terms under modest denominator caps.
- Interpretation:
  - Small-`b` behavior is very short-length and consistent with slow-growth `N(b)`, but does not indicate asymptotic sharpness.

### EP-306
- Quick literature check:
  - Distinct-semiprime-denominator variant remains much harder than unrestricted Egyptian fractions, with only partial analogous results known.
- Finite compute signal:
  - For squarefree `b in {6,10,14,15,21,30}`, only a subset of coprime numerators were representable within search limits.
- Interpretation:
  - Finite search suggests real structural obstructions under semiprime restrictions; likely needs new constructive machinery.

### EP-319
- Quick literature check:
  - No clear modern theorem-level closure surfaced quickly; known lower-bound constructions remain the primary route.
- Finite compute signal:
  - Split-based constructions produce sets `B` with `\sum_{b\in B}1/b=1` and size up to `10` at `N=100`, giving `|A|>=11` lower-bound witnesses.
- Interpretation:
  - Confirms constructive growth but still far below expected near-linear extremal scale.

### EP-320
- Quick literature check:
  - Recent 2025 progress improves lower bounds for `\log S(N)` in the iterated-log framework.
- Finite compute signal:
  - Exact `S(N)` for `N<=20` shows steady growth of normalized quantity `\log S(N)/(N/\log N)` around `1.4..1.76`.
- Interpretation:
  - Finite trend supports exponential-in-`N/\log N` scale with slowly varying factors, matching the problem’s asymptotic form.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/271
  - https://www.erdosproblems.com/274
  - https://www.erdosproblems.com/276
  - https://www.erdosproblems.com/283
  - https://www.erdosproblems.com/291
  - https://www.erdosproblems.com/293
  - https://www.erdosproblems.com/304
  - https://www.erdosproblems.com/306
  - https://www.erdosproblems.com/319
  - https://www.erdosproblems.com/320
- Additional primary references surfaced in quick scan:
  - https://arxiv.org/abs/2508.05282
  - https://arxiv.org/abs/2508.05283
  - https://discreteanalysisjournal.com/article/141157-asymptotic-lower-bound-for-the-number-of-partial-sums-of-the-harmonic-series
