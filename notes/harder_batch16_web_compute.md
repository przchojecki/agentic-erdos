# Harder Batch 16: Web + Compute

Batch: `EP-620, EP-625, EP-633, EP-634, EP-642, EP-643, EP-652, EP-657, EP-668, EP-677`

Computation artifact:
- `data/harder_batch16_quick_compute.json`

## Per-problem quick outcomes

### EP-620
- Quick literature check:
  - Problem page remains open and now records near-sharp behavior `f(n)=n^{1/2+o(1)}` with best listed bounds around `n^{1/2} (log n)^{1/2}/log log n` (lower) and `n^{1/2} log n` (upper), including 2024 update.
- Finite compute signal:
  - On random maximal `K_4`-free graphs (`n=50,70,90`), heuristic largest triangle-free induced subsets were around `23,28,33` (best), i.e. roughly `3.3*sqrt(n)` in this range.
- Interpretation:
  - Finite behavior is consistent with the `n^{1/2+o(1)}` scale, not with a substantially larger power.

### EP-625
- Quick literature check:
  - Page remains open with 2024 progress (Heckel/Steiner) showing the gap is not bounded whp and giving strong lower behavior along large sets of `n`.
- Finite compute signal:
  - Greedy estimates on `G(n,1/2)` gave small positive `chi-zeta` gaps (typically `0` or `1`) for `n<=120`.
- Interpretation:
  - Small-size heuristic coloring is too crude to reflect asymptotic gap growth; no contradiction with modern results.

### EP-633
- Quick literature check:
  - Still open; known existence of triangles that only admit square numbers of congruent pieces (Soifer).
- Finite compute signal:
  - Arithmetic map from known constructive families already yields many non-square admissible counts, confirming that square-only behavior is highly shape-dependent.
- Interpretation:
  - Classification remains difficult because both phenomena coexist: triangles with only square counts and many non-square realizable counts globally.

### EP-634
- Quick literature check:
  - Still open; page includes 2025 update (Zhang) giving large new infinite families (notably `n^2ab` above an explicit threshold).
- Finite compute signal:
  - Coverage from known families up to `260` leaves many missing values; in particular `7,11,19` are still absent in this constructive map.
- Interpretation:
  - Recent family expansions improve positive coverage but do not resolve the full characterization.

### EP-642
- Quick literature check:
  - Open; best listed bound improved to near-linear `f(n) << n (log n)^8` (2024), far below the older `n^{3/2}` bound.
- Finite compute signal:
  - Small-`n` greedy maxima under exact cycle-diagonal checks are about `1.9n` edges (`n=8,9,10`).
- Interpretation:
  - Finite extremal behavior is strongly linear-like, compatible with conjectural `f(n) << n`.

### EP-643
- Quick literature check:
  - Open; for `t=3` page records upper constants around `(13/9) * binom(n,2)` and asymptotic ratio still unresolved.
- Finite compute signal:
  - Greedy 3-uniform constructions gave about `0.59..0.62 * binom(n,2)` for `n=12,15,18`.
- Interpretation:
  - Computation gives lower-side witnesses only; substantial constant-factor gap remains.

### EP-652
- Quick literature check:
  - Problem page is now marked `PROVED` (affirmative), with January 2026 page update.
- Finite compute signal:
  - Grid instances show low ordered pinned counts (`R(x_k)/sqrt(n)` around `2-3` for small `k`), while random sets are much larger.
- Interpretation:
  - Numerics are consistent with strong growth in `k`-ordered pinned distances; theorem status is already affirmative.

### EP-657
- Quick literature check:
  - Open; page still frames this via no-isosceles constraints and equivalent difference-set/AP-free formulations.
- Finite compute signal:
  - In a 1D AP-free surrogate search, best distinct-difference counts for `n=10,12,14` were `22,27,32` (roughly `2.2n` to `2.29n`).
- Interpretation:
  - Finite surrogate suggests growth beyond linear constants, but does not settle the required unbounded-factor statement.

### EP-668
- Quick literature check:
  - Open with 2025 computational evidence indicating uniqueness (up to graph isomorphism) for many tested small `n`.
- Finite compute signal:
  - Random lattice search found one best coarse signature for `n=4,5`, and multiple for `n=6,7` (using distance-multiset signature only).
- Interpretation:
  - Coarse finite signatures are not decisive for congruence-class counting; consistent with unresolved uniqueness/multiplicity question.

### EP-677
- Quick literature check:
  - Still open; page confirms no known general resolution and keeps Erdos’ classical examples for cross-`k` equalities.
- Finite compute signal:
  - Exhaustive scan up to `n<=500`, `k<=8` found no same-`k` collisions with `m>=n+k`; cross-`k` scan reproduces known examples and finds additional finite cross-`k` coincidences in-range.
- Interpretation:
  - Computation supports rarity of equal interval-LCM values for fixed `k`, but cannot address asymptotic finiteness alone.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/620
  - https://www.erdosproblems.com/625
  - https://www.erdosproblems.com/633
  - https://www.erdosproblems.com/634
  - https://www.erdosproblems.com/642
  - https://www.erdosproblems.com/643
  - https://www.erdosproblems.com/652
  - https://www.erdosproblems.com/657
  - https://www.erdosproblems.com/668
  - https://www.erdosproblems.com/677
- Additional primary references surfaced in quick scan:
  - https://arxiv.org/abs/2411.10394
  - https://arxiv.org/abs/2411.18906
  - https://doi.org/10.1016/j.aim.2025.110228
  - https://arxiv.org/abs/2508.20041
  - https://arxiv.org/abs/2506.14910
