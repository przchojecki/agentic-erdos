# Harder Batch 6: Web + Compute

Batch: `EP-160, EP-161, EP-165, EP-169, EP-170, EP-172, EP-174, EP-177, EP-181, EP-183`

Computation artifact:
- `data/harder_batch6_quick_compute.json`

## Per-problem quick outcomes

### EP-160
- Quick literature check:
  - The problem page records recent bounds: upper exponent around $N^{0.355+o(1)}$ and lower growth at least stretched-polylogarithmic via 3-AP-free set technology.
- Finite compute signal:
  - Local search found feasible colorings at small scales with empirical upper bounds:
    - $h(20)\le 4$, $h(30)\le 5$, $h(40)\le 6$, $h(60)\le 8$ (no witness found for $N=80$ up to $k=8$ in this run).
- Interpretation:
  - Finite trend supports growth of $h(N)$, but is too small-scale/noisy to infer exponents.

### EP-161
- Quick literature check:
  - As noted on the problem page, fixed-$\alpha>0$ behavior has polylog-type scale, while jump-structure in $\alpha$ remains the conceptual question.
- Finite compute signal:
  - Sampled proxy for $F^{(3)}(20,\alpha)$ increased from about `4` at $\alpha=0$ to about `7` by $\alpha=0.2$ in tested random colorings.
- Interpretation:
  - Finite sampled profile is monotone in this range; it does not resolve continuity vs jump behavior asymptotically.

### EP-165
- Quick literature check:
  - The page reflects active 2025 updates on the leading lower constant in $R(3,k)\sim c\,k^2/\log k$ scale; full asymptotic formula remains open.
- Finite compute signal:
  - Triangle-free process proxy gives empirical witnesses with independence number below $k$ at $n\approx(0.64..0.75)\,k^2/\log k$ for tested $k=20,30,40,50$.
- Interpretation:
  - Finite process behavior matches the expected $k^2/\log k$ scale but does not identify the true asymptotic constant.

### EP-169
- Quick literature check:
  - Recent 2025 progress (including new values/lower bounds) appears on the problem page; core asymptotics remain open.
- Finite compute signal:
  - Greedy AP-free sets yielded harmonic sums around:
    - $k=3$: `2.95..2.98` up to $N=10^5$,
    - $k=4$: `3.96..4.05` up to $N=12000$.
- Interpretation:
  - Finite harmonic sums continue to grow slowly and are consistent with nontrivial extremal behavior, but not decisive for $f(k)$ asymptotics.

### EP-170
- Quick literature check:
  - The known asymptotic constant lies in $[1.56,\sqrt{3}]$ from classical sparse-ruler bounds.
- Finite compute signal:
  - A naive greedy difference-cover heuristic produced ratios `2.0+`, clearly above the known upper-constant window.
- Interpretation:
  - This computation is a weak baseline and confirms the heuristic is far from extremal-quality sparse-ruler constructions.

### EP-172
- Quick literature check:
  - The page records strong recent progress over rationals (Alweiss 2023), while the original integer version remains open.
- Finite compute signal:
  - In random finite colorings (proxy for $|A|=3$ patterns), witness rates were very high in tested ranges (especially for 2 colors).
- Interpretation:
  - Finite random behavior is favorable but not a proof of arbitrarily large monochromatic sum-product sets in $\mathbb{N}$.

### EP-174
- Quick literature check:
  - Characterization of Euclidean Ramsey sets remains open; spherical/subtransitive criteria are still central conjectural frameworks.
- Finite compute signal:
  - In a discrete proxy ($\mathbb{F}_2^d$ sampled rectangles), monochromatic-rectangle rates stayed around `~0.12` under random 2-colorings.
- Interpretation:
  - Random finite colorings naturally contain many monochromatic rectangle copies; this is only a heuristic proxy for the geometric classification problem.

### EP-177
- Quick literature check:
  - Best known general upper/lower growth remains polynomial-windowed between roughly $d^{1/2}$ and $d^{8+\varepsilon}$.
- Finite compute signal:
  - On prefix length $N=30000$, random sequences gave moderate $h_N(d)$ profiles, while Thue-Morse showed dramatic spikes at several $d$ values.
- Interpretation:
  - Finite evidence suggests sequence choice is delicate; structured sequences can behave very differently across differences.

### EP-181
- Quick literature check:
  - Current best upper bound remains sub-$2^{2n}$ but still far from linear-in-$2^n$ (Tikhomirov 2022 framework on page).
- Finite compute signal:
  - Bound-exponent table shows large remaining gap to the target $\log_2 R(Q_n)=n+O(1)$ scale.
  - As a small proxy, random colorings of $K_m$ almost surely contain monochromatic $C_4$ for $m\ge6$.
- Interpretation:
  - Data is consistent with the conjectural direction but far from proving $R(Q_n)\ll 2^n$.

### EP-183
- Quick literature check:
  - The page still frames finiteness of $\lim R(3;k)^{1/k}$ as open; strongest lower root is constant-scale from Schur-number methods.
- Finite compute signal:
  - Lower-root benchmark remains about `3.2806`, while recursive factorial-scale upper roots keep increasing with $k$.
- Interpretation:
  - The window remains extremely wide; no finite evidence here narrows the limit question substantially.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/160
  - https://www.erdosproblems.com/161
  - https://www.erdosproblems.com/165
  - https://www.erdosproblems.com/169
  - https://www.erdosproblems.com/170
  - https://www.erdosproblems.com/172
  - https://www.erdosproblems.com/174
  - https://www.erdosproblems.com/177
  - https://www.erdosproblems.com/181
  - https://www.erdosproblems.com/183
- Additional primary references surfaced in quick scan:
  - https://arxiv.org/abs/2309.02353
  - https://arxiv.org/abs/2505.13371
  - https://arxiv.org/abs/2510.19718
  - https://arxiv.org/abs/2307.08901
  - https://arxiv.org/abs/2402.17995
  - https://arxiv.org/abs/2208.14568
  - https://arxiv.org/abs/2112.03175
