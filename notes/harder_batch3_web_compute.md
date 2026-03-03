# Harder Batch 3: Web + Compute

Batch: `EP-65, EP-66, EP-77, EP-78, EP-80, EP-82, EP-84, EP-86, EP-89, EP-90`

Computation artifact:
- `data/harder_batch3_quick_compute.json`

## Per-problem quick outcomes

### EP-65
- Quick literature check:
  - The problem page records that the first part ($\sum 1/a_i \gg \log k$) is solved, including the asymptotically sharp lower bound $\geq (\tfrac12-o(1))\log k$ by Liu-Montgomery.
- Finite compute signal:
  - In a complete-bipartite proxy at edge scale $kn$ ($n=400$), the normalized quantity
    $\left(\sum 1/a_i\right)/\log k$ stays around $0.44..0.60$ for $k=2..40$.
- Interpretation:
  - Data is compatible with the known logarithmic scale; the remaining open part is the extremal minimizer question.

### EP-66
- Quick literature check:
  - Quick scan did not reveal a post-classical full resolution; the impossibility constraints listed on the problem page remain the key baseline.
- Finite compute signal:
  - Model sets give contrasting profiles for $1_A*1_A(n)/\log n$:
    - squares: about $0.49..0.55$ at sampled points,
    - primes: very large values,
    - powers of two: $0$ throughout sampled points.
- Interpretation:
  - Finite behavior is highly model-dependent; no pathway yet to a global nonzero limit (or to ruling it out).

### EP-77
- Quick literature check:
  - The problem page records recent diagonal Ramsey upper-bound improvements (CGMS 2023, GNNW 2024, and later multicolor-related refinements).
- Finite compute signal:
  - Classical lower/upper templates still leave a broad base window:
    - at $k=10$: about $1.5849..2.9423$,
    - at $k=20$: about $1.5425..3.3683$.
- Interpretation:
  - The exponential base remains unresolved, with a substantial gap between known lower and upper scales.

### EP-78
- Quick literature check:
  - The problem page notes explicit-construction progress (Cohen 2015; Li 2023) but still no constructive $R(k)>C^k$ theorem.
- Finite compute signal:
  - Random search did not find colorings with zero monochromatic $K_k$ in tested runs.
  - The explicit Paley-type check for $(k,n)=(4,17)$ verifies `0` monochromatic $K_4$ (as expected from the known construction).
- Interpretation:
  - Finite checks validate known small explicit witnesses but do not advance asymptotic constructive bounds.

### EP-80
- Quick literature check:
  - The problem page still highlights Fox-Loh style upper behavior for $c<1/4$ and very weak general lower bounds; no quick closure found.
- Finite compute signal:
  - In complete-multipartite models ($n=300$), edge density from $0.333$ to $0.458$ coincides with large books of size about $(0.333..0.833)n$.
- Interpretation:
  - Structured dense examples naturally force linear-size books in these regimes, but this does not settle universal lower growth for all admissible graphs.

### EP-82
- Quick literature check:
  - No decisive recent closure found in quick scan; known baseline remains between Ramsey-type lower and near-$n^{1/2}$ upper behavior.
- Finite compute signal:
  - Random lower-envelope search found worst max regular induced sizes $4,5,6,6$ for $n=10,12,14,16$.
- Interpretation:
  - Small-$n$ data is consistent with $F(n)$ above pure logarithmic constants, but far from asymptotic proof of $F(n)/\log n\to\infty$.

### EP-84
- Quick literature check:
  - The problem page records the 2025 Nenadov improvement for the first target ($f(n)=o(2^n)$ direction).
- Finite compute signal:
  - Distinct cycle-set counts are exactly $2,4,6,11$ for $n=3,4,5,6$; a $30{,}000$-graph sample at $n=7$ also produced $11$.
- Interpretation:
  - Small exact counts are consistent with heavy structural constraints but do not resolve the second asymptotic target $f(n)/2^{n/2}\to\infty$.

### EP-86
- Quick literature check:
  - Quick scan did not surface a full post-2014 resolution; known bounds remain around constants above $1/2$ on the upper side.
- Finite compute signal:
  - Random greedy $C_4$-free subgraphs of $Q_d$ ($d=4..9$) reach edge-density about $0.56..0.69$ of all hypercube edges.
- Interpretation:
  - Finite constructive densities staying above $1/2$ align with known difficulty of proving the sharp asymptotic threshold.

### EP-89
- Quick literature check:
  - The Guth-Katz lower bound benchmark remains the central near-solution baseline in quick scan.
- Finite compute signal:
  - On square-grid samples, distinct-distance counts normalize to about $1.09..1.10$ times $n/\sqrt{\log n}$.
- Interpretation:
  - Finite grid behavior is consistent with the conjectured sharp scale, but does not constitute a proof for all point sets.

### EP-90
- Quick literature check:
  - Quick scan did not show closure of the unit-distance conjecture; the classical $O(n^{4/3})$ frontier context remains relevant.
- Finite compute signal:
  - In lattice models, ratios against $n^{1+1/\log\log n}$ are small and decreasing over tested $n$.
- Interpretation:
  - Finite trends are suggestive but not close to resolving the asymptotic exponent question.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/65
  - https://www.erdosproblems.com/66
  - https://www.erdosproblems.com/77
  - https://www.erdosproblems.com/78
  - https://www.erdosproblems.com/80
  - https://www.erdosproblems.com/82
  - https://www.erdosproblems.com/84
  - https://www.erdosproblems.com/86
  - https://www.erdosproblems.com/89
  - https://www.erdosproblems.com/90
- Additional primary references surfaced in quick scan:
  - https://arxiv.org/abs/2303.09521
  - https://arxiv.org/abs/2407.19026
  - https://eccc.weizmann.ac.il/report/2015/146/
  - https://arxiv.org/abs/2303.06802
  - https://arxiv.org/abs/2501.09904
