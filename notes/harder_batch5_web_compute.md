# Harder Batch 5: Web + Compute

Batch: `EP-131, EP-132, EP-138, EP-141, EP-142, EP-143, EP-145, EP-146, EP-148, EP-149`

Computation artifact:
- `data/harder_batch5_quick_compute.json`

## Per-problem quick outcomes

### EP-131
- Quick literature check:
  - Recent progress (Pham-Zakharov, 2024) implies $F(N)\le N^{1/4+o(1)}$, so the historical subquestion $F(N)>N^{1/2-o(1)}$ is now negative.
- Finite compute signal:
  - Random-greedy search on $N\in\{80,120,180,260\}$ found best sizes `7,7,8,8`.
- Interpretation:
  - Finite behavior is consistent with sub-square-root growth and with the modern upper-bound direction.

### EP-132
- Quick literature check:
  - The problem page records a 2025 result with at least $n^{0.864+o(1)}$ such distances for convex sets (Cibulka-Dvořák-Lidický).
- Finite compute signal:
  - For the known $n=4$ glued-triangles example, exactly one distance has multiplicity $\le n$.
  - Grid/triangular models at $n=36..144$ already show many distances with multiplicity $\le n$.
- Interpretation:
  - Counterexample at $n=4$ persists, while larger structured models support the “many such distances” direction.

### EP-138
- Quick literature check:
  - No decisive modern proof of $W(k)^{1/k}\to\infty$; strongest lower framework still exponential (Kozik-Shabanov scale), with huge upper gaps.
- Finite compute signal:
  - Included known exact small values $W(3)=27$, $W(4)=35$.
  - Local search reproduces the $k=4$ boundary behavior (`N=34` feasible, `N=35` infeasible in run).
  - Berlekamp lower-root profile stays around $\sim 2.29..2.34$ on sampled prime-based points.
- Interpretation:
  - Finite data remains consistent with wide asymptotic uncertainty for $W(k)$.

### EP-141
- Quick literature check:
  - Still open in general, and even infinitude for $k=3$ consecutive-prime AP remains unproved.
- Finite compute signal:
  - Up to $5\times 10^6$, found many examples for $k=3,4$ and none for $k\ge5$ in this range.
- Interpretation:
  - Strong finite abundance for short lengths, but no asymptotic theorem-level advance.

### EP-142
- Quick literature check:
  - Modern quantitative bounds improved (notably for $k=3,4,$ and general $k$), but asymptotic formulas remain far out of reach.
- Finite compute signal:
  - Greedy AP-free sizes decline in density with $N$ for both $k=3$ and $k=4$ test tracks.
- Interpretation:
  - Finite profiles reflect known sparsity behavior, still far from asymptotic formula precision.

### EP-143
- Quick literature check:
  - Recent work (Kustov-Lagarias-Liu, 2025) gives a negative answer to the broad sparsity question: the condition does not force global sparsity in full generality.
- Finite compute signal:
  - In a discretized finite proxy, best feasible sets grow with window size while harmonic sums remain controlled.
- Interpretation:
  - The overall “must be sparse” claim is not valid as stated; sharper variants remain the meaningful open part.

### EP-145
- Quick literature check:
  - Moment range has been extended gradually (most recently beyond earlier thresholds), but full all-$\alpha$ completion remains open unconditionally.
- Finite compute signal:
  - Empirical moments for $\alpha=1,2,3,3.5,3.75,4$ stabilize numerically across $X=2\times10^5$ to $2\times10^6$.
- Interpretation:
  - Finite stability is consistent with existence but does not establish all-$\alpha$ convergence.

### EP-146
- Quick literature check:
  - No full resolution of the Erdős-Simonovits conjectured exponent for all $r$-degenerate bipartite $H$.
- Finite compute signal:
  - Random-greedy $C_4$-free and $K_{2,3}$-free profiles scale near $n^{3/2}$ in tested ranges (the $r=2$ benchmark exponent).
- Interpretation:
  - Finite scaling is compatible with conjectured exponent patterns for standard $r=2$ examples, without proving the general statement.

### EP-148
- Quick literature check:
  - Bounds continue to be very far apart (double-exponential style lower and much larger upper envelopes).
- Finite compute signal:
  - Exact small-$k$ counts from the script: $F(2)=0$, $F(3)=1$, $F(4)=6$, $F(5)=72$.
- Interpretation:
  - Small-$k$ exact growth is rapid, but asymptotic regime remains wide open.

### EP-149
- Quick literature check:
  - Best general upper constant has been improved substantially below $2$ (Havet-Jing-Kang, 2022), while the $(5/4)\Delta^2$ conjecture remains open.
- Finite compute signal:
  - For $C_5$ blowups ($t=2,3,4$), greedy strong-color counts hit exactly $(5/4)\Delta^2$ in tested instances.
  - Random bounded-degree graphs in this run stayed notably below the conjectural threshold.
- Interpretation:
  - Classical extremal witness behavior is reproduced, and generic random graphs do not approach the conjectural worst case.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/131
  - https://www.erdosproblems.com/132
  - https://www.erdosproblems.com/138
  - https://www.erdosproblems.com/141
  - https://www.erdosproblems.com/142
  - https://www.erdosproblems.com/143
  - https://www.erdosproblems.com/145
  - https://www.erdosproblems.com/146
  - https://www.erdosproblems.com/148
  - https://www.erdosproblems.com/149
- Additional primary references surfaced in quick scan:
  - https://arxiv.org/abs/2410.14624
  - https://link.springer.com/article/10.1007/s10474-025-01562-y
  - https://arxiv.org/abs/1606.01606
  - https://arxiv.org/abs/2402.17995
  - https://arxiv.org/abs/2007.07874
