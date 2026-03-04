# Harder Batch 22: Web + Compute

Batch: `EP-970, EP-978, EP-986, EP-997, EP-1005, EP-1011, EP-1016, EP-1017, EP-1021, EP-1039`

Computation artifact:
- `data/harder_batch22_quick_compute.json`

## Per-problem quick outcomes

### EP-970
- Quick literature check:
  - Still open; page keeps Jacobsthal's conjectural `h(k) << k^2` with classical upper bound `(k log k)^2` and FGKMT18 lower growth.
- Finite compute signal:
  - Primorial profile through `k=8` gives `j(n)=34` at `n=9699690`, with `j(n)/k^2` around `0.53`; sampled squarefree moduli gave similar scale.
- Interpretation:
  - Finite data supports moderate (subquadratic-looking at this scale) growth but gives no asymptotic separation between `k^2` and `(k log k)^2`.

### EP-978
- Quick literature check:
  - Open in the highlighted low-degree case (`n^4+2` squarefree infinitely often); higher-degree `(k-2)`-power-free cases are known for large `k`.
- Finite compute signal:
  - Exact factorization scan for `n<=3000` finds squarefree density of `n^4+2` near `0.757`.
- Interpretation:
  - Strong finite squarefree frequency is consistent with infinitude heuristics, but finite density samples do not imply a proof.

### EP-986
- Quick literature check:
  - General fixed-`k` lower bound remains open; page records solved cases `k=3` (Spencer) and `k=4` (Mattheus--Verstraete, 2023).
- Finite compute signal:
  - Triangle-free process samples with exact `alpha(G)` yielded witnesses such as `R(3,12)>30`.
- Interpretation:
  - Finite constructions match the expected off-diagonal Ramsey growth regime for `k=3`, but do not advance the general-`k` conjecture.

### EP-997
- Quick literature check:
  - Open as stated ("for every `alpha`"); page records 2024 progress proving existence of an irrational `alpha` where `{alpha p_n}` is not well-distributed.
- Finite compute signal:
  - Sliding-window discrepancy scan on first `40000` primes for several irrational `alpha` found max relative deviations around `0.09..0.115`.
- Interpretation:
  - Finite windows show persistent irregularity signals for tested `alpha`, but this is far from an all-`alpha` theorem.

### EP-1005
- Quick literature check:
  - Open; 2025 update gives bounds `((1/12)-o(1))n <= f(n) <= n/4 + O(1)` and conjectures the upper-constant side is sharp.
- Finite compute signal:
  - Exact finite `f(n)` computation up to `n=240` gives `f(n)/n` drifting from `0.525` (`n=40`) to about `0.504` (`n=240`).
- Interpretation:
  - Finite trend is near a linear law with constant close to `1/2` in this range; asymptotic constant remains unresolved.

### EP-1011
- Quick literature check:
  - Still open in full generality; recent updates sharpen `f_4(n)` substantially (including corrected exact formula for large `n`).
- Finite compute signal:
  - Random triangle-free process search found small `n` examples with `chi>=4` and edges up to `45` at `n=16`; none found at `n=11,12` in sampled runs.
- Interpretation:
  - Small finite search confirms feasibility of relatively dense triangle-free `4`-chromatic graphs, but is not close to asymptotic threshold determination.

### EP-1016
- Quick literature check:
  - Open; benchmark remains around Bondy/Erdos logarithmic-band bounds for pancyclic excess edges.
- Finite compute signal:
  - Random search for `n<=12` found pancyclic witnesses with `h` between `2` and `4`.
- Interpretation:
  - Small-`n` behavior is compatible with logarithmic-scale growth, but finite random witnesses give only upper-bound evidence.

### EP-1017
- Quick literature check:
  - Open for the sharpened `k>n^2/4` question; page records complete `K_4`-free additive-triangle result (Gyori--Keszegh 2017).
- Finite compute signal:
  - In explicit `K_4`-free constructions with `e = floor(n^2/4)+q`, greedy edge-disjoint triangle packing reached at least `q` in tested cases.
- Interpretation:
  - Finite construction checks align with the known `K_4`-free phenomenon, without resolving the full clique-partition function.

### EP-1021
- Quick literature check:
  - Problem page now records an affirmative resolution: Conlon--Lee proved the subdivision bound, with Janzer improving the exponent to `c_k=1/(4k-6)`.
- Finite compute signal:
  - Small greedy `C_6`-free (`k=3`) constructions yield edge counts consistent with sub-`n^{3/2}` growth heuristics.
- Interpretation:
  - Treat as resolved on the list in the stated existential form for each fixed `k`; finite probe is only consistency context.

### EP-1039
- Quick literature check:
  - Open; latest listed progress (2025) improves lower bound to about `1/(n*sqrt(log n))`, still short of the target `1/n`.
- Finite compute signal:
  - Coarse grid lemniscate estimates for `z^n-1` gave `n*rho` around `1.21..1.33` for `n=8,12,16`.
- Interpretation:
  - Finite numerics are compatible with `rho` on `1/n`-scale in canonical examples; this does not settle uniform lower bounds over all root configurations.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/970
  - https://www.erdosproblems.com/978
  - https://www.erdosproblems.com/986
  - https://www.erdosproblems.com/997
  - https://www.erdosproblems.com/1005
  - https://www.erdosproblems.com/1011
  - https://www.erdosproblems.com/1016
  - https://www.erdosproblems.com/1017
  - https://www.erdosproblems.com/1021
  - https://www.erdosproblems.com/1039
