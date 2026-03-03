# Harder Batch 4: Web + Compute

Batch: `EP-91, EP-92, EP-96, EP-100, EP-101, EP-114, EP-120, EP-123, EP-124, EP-125`

Computation artifact:
- `data/harder_batch4_quick_compute.json`

## Per-problem quick outcomes

### EP-91
- Quick literature check:
  - The problem page records small-$n$ structure updates: two non-similar minimizers for $n=4$, unique regular pentagon for $n=5$ (with a published 2024 proof), and explicit non-similar examples noted for $6\le n\le 9$.
- Finite compute signal:
  - Reproduced $n=4$ equality of distinct-distance count for square vs two equilateral triangles sharing an edge (both `2`).
  - For $n=9$, both a regular nonagon and a hexagon+center+two reflections model gave `4` distinct distances in this probe.
- Interpretation:
  - Finite explicit constructions are consistent with the non-uniqueness direction at small $n$, but not a proof for all large $n$.

### EP-92
- Quick literature check:
  - The problem page now cites a circle-point incidence consequence giving $f(n)\ll n^{4/11}$ (via Janzer-Janzer-Methuku-Tardos-type input).
- Finite compute signal:
  - Model families (grids, triangular patches, regular polygons) gave finite $f$-values mostly in the low single digits for $n\le 64$.
- Interpretation:
  - Finite models are compatible with subpolynomial ambitions, but too small-scale to discriminate between $n^{o(1)}$ and slower power laws.

### EP-96
- Quick literature check:
  - Best published upper bound remains of the form $n\log_2 n+O(n)$ (Aggarwal 2015), with conjectural linear behavior still open.
- Finite compute signal:
  - In regular $n$-gons (after optimal scaling), the maximum number of unit pairs is exactly `n` in our profile.
  - Random convex-on-circle samples had very low max repeated-distance multiplicity compared to linear scale.
- Interpretation:
  - Structured examples remain linear-scale; random convex polygons do not approach the current upper bound regime.

### EP-100
- Quick literature check:
  - The page still records the $\gg n/\log n$ lower bound route via Guth-Katz distinct-distance theory and no known linear lower bound theorem.
- Finite compute signal:
  - Lattice-greedy search under 1-separated distance-spectrum constraints found size-$n$ sets for $n=6..10$ with best diameters around `8..11`.
- Interpretation:
  - Small finite constructions are compatible with linear-diameter growth, but do not close the asymptotic gap.

### EP-101
- Quick literature check:
  - The statement as originally hoped ($o(n^2)$ four-point lines) is already contradicted by near-quadratic constructions (Solymosi-Stojakovic 2013), as reflected on the problem page.
- Finite compute signal:
  - Random constructive search with no 5-collinear points reached `2, 7, 13` four-point lines for target sizes `40, 60, 80`.
- Interpretation:
  - Naive finite constructions remain far below near-quadratic scale, highlighting that known high-density constructions are highly nontrivial.

### EP-114
- Quick literature check:
  - Major update: Tao (arXiv 2025) proves the Erdős-Herzog-Piranian maximizer statement for all sufficiently large degrees.
- Finite compute signal:
  - For the candidate extremizer $p(z)=z^n-1$, computed exact length profile values match the expected near-$2n$ growth and track closely to $2n+4\log 2$ at moderate $n$.
- Interpretation:
  - This item is now in a "mostly resolved up to bounded degree" state rather than a fully unconstrained open problem.

### EP-120
- Quick literature check:
  - The Erdős similarity conjecture remains open; recent survey-level updates (2024/2025) and bi-Lipschitz variants are active.
- Finite compute signal:
  - In a discrete proxy (avoiding affine copies of finite geometric patterns), best-found avoidance densities stay positive and substantial on tested ranges.
- Interpretation:
  - Finite combinatorial avoidance remains feasible at moderate density, but this does not transfer directly to the measurable-set conjecture.

### EP-123
- Quick literature check:
  - The problem page records substantial partial progress for many parameter families, with latest listed progress extending validated ranges.
- Finite compute signal:
  - Heuristic antichain-constrained representation search on sampled targets in $[N/2,N]$ (with $N=1400$) succeeded in all sampled instances for tested triples, including $(3,5,7)$ and two $(2,5,c)$ examples.
- Interpretation:
  - Strong finite heuristic signal supports d-complete behavior in known-friendly families, but is not a proof for general pairwise-coprime triples.

### EP-124
- Quick literature check:
  - The first question is now reported as positively resolved (with a simple proof and Lean formalization); the second question remains open in general.
- Finite compute signal:
  - For $(3,4,7)$ with $k=0$, full coverage held up to $N=20000$ in this probe.
  - Shifted versions ($k=1$) remained near-full in tested ranges; a comparison bad-family case ($3,9,81$) had much lower coverage.
- Interpretation:
  - Finite evidence aligns with known positive and negative structural directions from the literature notes.

### EP-125
- Quick literature check:
  - Recent progress improved counting-function exponents (Hasler-Melfi 2024), while positive asymptotic density remains open; upper bounds on lower density are known.
- Finite compute signal:
  - For $A+B$ (base-3/base-4 binary-digit sets), observed initial-segment density over $[1,N]$ stayed around `0.84..0.89` on tested $N$, with substantial uncovered gaps still present.
- Interpretation:
  - Finite densities are high but unstable across windows/scales and do not settle positive asymptotic density.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/91
  - https://www.erdosproblems.com/92
  - https://www.erdosproblems.com/96
  - https://www.erdosproblems.com/100
  - https://www.erdosproblems.com/101
  - https://www.erdosproblems.com/114
  - https://www.erdosproblems.com/120
  - https://www.erdosproblems.com/123
  - https://www.erdosproblems.com/124
  - https://www.erdosproblems.com/125
- Additional primary references surfaced in quick scan:
  - https://arxiv.org/abs/2512.12455
  - https://terrytao.wordpress.com/2025/12/15/the-maximal-length-of-the-erdos-herzog-piranian-lemniscate-in-high-degree/comment-page-1/
  - https://arxiv.org/abs/2412.11062
  - https://academic.oup.com/imrn/article/2024/17/12327/7725885
  - https://www.sciencedirect.com/science/article/pii/S0012365X14003847
  - https://doi.org/10.1007/s00454-013-9526-9
  - https://doi.org/10.2140/cnt.2024.13.141
