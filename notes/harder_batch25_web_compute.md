# Harder Batch 25: Web + Compute

Batch: `EP-1085, EP-1086, EP-1094, EP-1095, EP-1097, EP-1103, EP-1104, EP-1105, EP-1109, EP-1110`

Computation artifact:
- `data/harder_batch25_quick_compute.json`

Method note:
- Applied `cycle-method.md`: each item uses a targeted finite mechanism probe and an explicit asymptotic bottleneck.

## Per-problem quick outcomes

### EP-1085
- Quick literature check:
  - Page is open (last edited 17 October 2025); core difficult cases remain `d=2` and `d=3`.
- Finite compute signal:
  - Grid constructions in `d=2,3` show the expected polynomial scaling profiles for unit-distance counts (with declining normalized constants as side length grows).
- Interpretation:
  - Finite lattice behavior is consistent with classical exponent frameworks but does not improve extremal bounds.

### EP-1086
- Quick literature check:
  - Open (last edited 16 October 2025); best listed upper bound remains `g(n) << n^{20/9}`.
- Finite compute signal:
  - Random integer-grid searches for `n=12..24` found repeated-area multiplicities growing to the low twenties in sampled runs.
- Interpretation:
  - Finite multiplicities grow quickly but are far from distinguishing between competing exponents.

### EP-1094
- Quick literature check:
  - Open (last edited 24 October 2025); page records a conjectured finite exception list of size `14`.
- Finite compute signal:
  - Exact scan through `n<=420` found exactly `14` violations of `lpf(C(n,k)) <= max(n/k,k)` and matches the listed exception pattern in this range.
- Interpretation:
  - Finite evidence strongly supports the finite-exception formulation, but cannot prove no new exceptions beyond scanned ranges.

### EP-1095
- Quick literature check:
  - Open (edited 01 December 2025, with 2026 thread updates); heuristic focus remains around `log g(k) ~ k/log k`.
- Finite compute signal:
  - Exact small-`k` computations show highly irregular `g(k)` values and occasional large jumps; some `k` in the tested window required ranges near the search cap.
- Interpretation:
  - Finite data supports oscillatory behavior and irregular ratios, consistent with long-standing limsup/liminf heuristics.

### EP-1097
- Quick literature check:
  - Open (last edited 03 December 2025); page now highlights equivalence to a sums-differences/Kakeya-type exponent problem and records improved lower-side progress.
- Finite compute signal:
  - Random search for `|A|=20..44` found best distinct 3-AP-difference counts around `0.21..0.24 * n^{3/2}` in sampled windows.
- Interpretation:
  - Finite lower-bound constructions are consistent with superlinear growth and remain compatible with an `O(n^{3/2})` upper target.

### EP-1103
- Quick literature check:
  - Open (last edited 03 December 2025); page includes 2025 results giving stronger lower growth and subexponential constructions.
- Finite compute signal:
  - Greedy squarefree-sumset sequence up to `20000` reaches `96` terms; count-to-`x` grows faster than logarithmic in tested range.
- Interpretation:
  - Finite growth is sparse but nontrivial; asymptotic gap between polynomial lower constraints and subexponential constructions remains wide.

### EP-1104
- Quick literature check:
  - Open (last edited 21 January 2026); current best asymptotic bracket remains `(1-o(1))sqrt(n/log n)` to `(2+o(1))sqrt(n/log n)`.
- Finite compute signal:
  - Mycielski family exactly realizes `chi=3,4,5` at `n=5,11,23`; random triangle-free process samples at `n<=30` reached chromatic number `4`.
- Interpretation:
  - Finite models are consistent with slow chromatic growth and known constructions, without narrowing the asymptotic constant factor.

### EP-1105
- Quick literature check:
  - Page is now marked **PROVED** (last edited 29 January 2026), citing exact cycle and path anti-Ramsey formula progress.
- Finite compute signal:
  - Exact small-`n` brute force for `C_3` recovers `AR(n,C_3)=n-1` for `n=4,5,6`.
- Interpretation:
  - Treat as resolved on the list; finite computation is a consistency check only.

### EP-1109
- Quick literature check:
  - Open (last edited 03 December 2025), with best listed bounds still leaving a substantial gap.
- Finite compute signal:
  - Exact maxima for `N=30..80` give `f(N)` in the range `4..7`, with values substantially below any power-law behavior at this scale.
- Interpretation:
  - Finite exact data supports extreme sparsity and aligns directionally with polylog-style heuristics, but is too small-range to infer final order.

### EP-1110
- Quick literature check:
  - Open (last edited 22 January 2026), with major 2022/2025 partial results covering many parameter regimes.
- Finite compute signal:
  - Antichain-sum representability scans (`N=5000`) for sample pairs `(p,q)=(5,2),(7,3),(11,2)` show many non-representable values and many coprime non-representables in tested windows.
- Interpretation:
  - Finite profiles are consistent with positive-density non-representable behavior in non-`{2,3}` regimes, matching direction of modern partial theorems.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/1085
  - https://www.erdosproblems.com/1086
  - https://www.erdosproblems.com/1094
  - https://www.erdosproblems.com/1095
  - https://www.erdosproblems.com/1097
  - https://www.erdosproblems.com/1103
  - https://www.erdosproblems.com/1104
  - https://www.erdosproblems.com/1105
  - https://www.erdosproblems.com/1109
  - https://www.erdosproblems.com/1110
