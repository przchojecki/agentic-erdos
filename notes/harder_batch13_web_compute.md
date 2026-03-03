# Harder Batch 13: Web + Compute

Batch: `EP-478, EP-483, EP-488, EP-500, EP-503, EP-507, EP-508, EP-510, EP-520, EP-521`

Computation artifact:
- `data/harder_batch13_quick_compute.json`

## Per-problem quick outcomes

### EP-478
- Quick literature check:
  - Recent work continues to focus on lower bounds and product-set expansion for factorial residues mod `p`; asymptotic constant claims remain open.
- Finite compute signal:
  - Sampled primes show `|A_p|/p` very close to `1-1/e` (`~0.631..0.634` on tested primes up to `500009`).
  - In exhaustive scan for primes `p<=20000`, exactly one prime has `|A_p|=p-2`.
- Interpretation:
  - Finite data strongly supports `(1-1/e)p` scale and rarity of maximal-size behavior.

### EP-483
- Quick literature check:
  - Best asymptotic bounds remain exponential-type lower versus factorial upper; exact values are only known for small `k`.
- Finite compute signal:
  - Exact small-`k` checks recover `f(1)=2`, `f(2)=5`, `f(3)=14` (equivalently maximal sum-free-colorable lengths `1,4,13`).
  - Greedy finite constructions for `k=5,6,7` are far below `3.2806^k` at tested scales.
- Interpretation:
  - Heuristic search is not competitive with state-of-the-art lower-bound constructions.

### EP-488
- Quick literature check:
  - Problem statement appears plausible in intended divisibility form; nearby typo variant has known counterexamples.
- Finite compute signal:
  - Singleton family reaches ratio arbitrarily close to `2` from below (`1.995` at `a=200`).
  - Random finite searches found no ratio above `2`; best observed around `1.907`.
- Interpretation:
  - Computation is consistent with sharp constant `2` in the intended statement.

### EP-500
- Quick literature check:
  - Turán’s `5/9`-density construction and Razborov’s upper bound remain the key asymptotic window.
- Finite compute signal:
  - Random greedy K4^3-free packings are clearly suboptimal relative to Turán construction on tested `n`.
  - Explicit Turán-density values in finite `n` remain near `0.59..0.62`, above random greedy outputs.
- Interpretation:
  - The experiment confirms random local heuristics are not enough for this extremal problem.

### EP-503
- Quick literature check:
  - Best known upper bound remains quadratic in `d`; exact values known only in small dimensions.
- Finite compute signal:
  - Verified explicit lower constructions of sizes `binom(d+1,2)` and `binom(d+1,2)+1` satisfy the all-triples-isosceles property for `d=2..8`.
- Interpretation:
  - Construction checks reproduce known lower-bound mechanisms and emphasize the remaining large gap to upper bounds.

### EP-507
- Quick literature check:
  - 2023/2024 improvements lowered the best known upper exponent; lower bound remains logarithmic-over-`n^2` scale.
- Finite compute signal:
  - Best random found minimum triangle area decreases quickly with `n`; scaled quantity `n^2*area_min` decreases on tested range.
- Interpretation:
  - Finite random search supports severe shrinking of minimal area and does not challenge current asymptotic bounds.

### EP-508
- Quick literature check:
  - Current global bounds remain `5 <= chi(R^2) <= 7`.
- Finite compute signal:
  - Constructed a unit-distance 7-vertex Moser-spindle model and verified exact chromatic number `4`.
  - Triangular-lattice patches tested remain exactly `3`-colorable.
- Interpretation:
  - Benchmarks match the classical lower-bound progression (`3`, `4`), still far from resolving the global `5..7` gap.

### EP-510
- Quick literature check:
  - 2025 work gives polynomial negative bounds, but the conjectured `N^{1/2}` scale remains open.
- Finite compute signal:
  - Grid-minimization over `theta` for random sets gives minima of order multiple `sqrt(N)` (ratios around `3.5..5.1`).
  - Structured Sidon-difference set gives much smaller ratio in this finite instance.
- Interpretation:
  - Finite evidence supports substantial cancellation, with set-structure dependence still strong.

### EP-520
- Quick literature check:
  - Best almost-sure upper bounds are near `N^{1/2}(log log N)^{3/4+o(1)}`; the LIL-type constant formulation remains open.
- Finite compute signal:
  - Monte Carlo limsup proxy for `S_N/sqrt(N log log N)` sits around `O(1)` across trials up to `N=3e5`.
  - Alternative quarter-log normalization also remains bounded in tested range.
- Interpretation:
  - Finite runs are compatible with multiple conjectural normalizations; asymptotic discrimination is not possible at this scale.

### EP-521
- Quick literature check:
  - Strong law in `[-1,1]` with `1/pi` constant now has recent progress; full real-root almost-sure law remains delicate.
- Finite compute signal:
  - Approximate root counts in `[-1,1]` give averages with ratio to `log n` around `0.32..0.35`, close to `1/pi`.
- Interpretation:
  - Numerics align with the `1/pi`-constant behavior for interval-restricted roots.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/478
  - https://www.erdosproblems.com/483
  - https://www.erdosproblems.com/488
  - https://www.erdosproblems.com/500
  - https://www.erdosproblems.com/503
  - https://www.erdosproblems.com/507
  - https://www.erdosproblems.com/508
  - https://www.erdosproblems.com/510
  - https://www.erdosproblems.com/520
  - https://www.erdosproblems.com/521
- Additional primary references surfaced in quick scan:
  - https://arxiv.org/abs/2409.07658
  - https://arxiv.org/abs/2509.05260
  - https://arxiv.org/abs/2509.03490
  - https://arxiv.org/abs/2304.00943
  - https://arxiv.org/abs/2403.06353
  - https://arxiv.org/abs/2112.03175
