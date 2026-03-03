# Harder Batch 14: Web + Compute

Batch: `EP-522, EP-528, EP-529, EP-530, EP-531, EP-545, EP-552, EP-560, EP-567, EP-571`

Computation artifact:
- `data/harder_batch14_quick_compute.json`

## Per-problem quick outcomes

### EP-522
- Quick literature check:
  - Problem-page updates include almost-sure root-count asymptotics for broad i.i.d. models (including mean-zero, variance-one assumptions), while the strict Rademacher framing remains subtle in presentation.
- Finite compute signal:
  - Argument-principle Monte Carlo gives $\mathbb{E}[R_n]/(n/2)$ near $1$ on tested sizes: about `1.0025` (`n=80`), `1.0043` (`n=160`), `0.9785` (`n=320`).
- Interpretation:
  - Numerics support the conjectured $n/2$ scale for roots in $|z|\le 1$, but finite sampling is not a proof of almost-sure convergence.

### EP-528
- Quick literature check:
  - Connective-constant existence is classical; the page records modern structural progress (including irrationality results in fixed dimensions).
- Finite compute signal:
  - Exact small-$n$ SAW counts produce root-estimate trends toward stable constants:
    - $d=2$: down to `3.029` by `n=10`
    - $d=3$: down to `5.142` by `n=8`
    - $d=4$: down to `7.214` by `n=7`
- Interpretation:
  - Finite data is consistent with convergence to dimension-dependent $C_k$, without identifying exact values.

### EP-529
- Quick literature check:
  - The page reflects known diffusive behavior in high dimension and super-diffusive expectations/open structure in low dimensions.
- Finite compute signal:
  - In $d=2$, $d_2(n)/\sqrt{n}$ rises from `0.85` to `1.44` over `n=2..10`.
  - In $d=3,4$, the same ratio grows more slowly over tested small $n$.
- Interpretation:
  - Small-$n$ profiles are compatible with super-diffusive $d=2$ behavior, but not decisive asymptotically.

### EP-530
- Quick literature check:
  - Problem-page bounds remain centered on the $\ell(N)\asymp N^{1/2}$ paradigm, with unknown sharp constant in the universal worst case.
- Finite compute signal:
  - Exact interval cases:
    - $N=16\to 5$
    - $N=20\to 6$
    - $N=24\to 6$
  - Random distinct-integer sets of the same size admit much larger Sidon subsets (best `11,12,13`).
- Interpretation:
  - Data reinforces that intervals are near-extremal obstructions, while generic sets are substantially easier.

### EP-531
- Quick literature check:
  - Existing bounds for Folkman numbers stay very far apart (doubly exponential lower side versus large upper constructions).
- Finite compute signal:
  - Exact tiny model (distinct-summand finite-sums formulation used in script) gives `F_2=9`.
  - Randomized $k=3$ colorings avoid target monochromatic finite-sums structures through long prefixes (best up to `39` for tested runs).
- Interpretation:
  - Computation confirms nontrivial growth and difficulty; no route to tight asymptotics yet.

### EP-545
- Quick literature check:
  - Page notes small-$m$ failures of the "as complete as possible" maximizer heuristic.
- Finite compute signal:
  - Exact diagonal checks recover:
    - $R(P_3)=3$
    - $R(2K_2)=5$
    - $R(K_3)=6$
- Interpretation:
  - Explicitly confirms the counterexample pattern at $m=2$: $R(2K_2)>R(P_3)$.

### EP-552
- Quick literature check:
  - Current bounds remain around $n+\sqrt{n}$ with additive slack; exact asymptotics and strengthened infinite-often improvements remain open.
- Finite compute signal:
  - Exact small-$n$ values in tractable range:
    - $R(C_4,S_2)=4$
    - $R(C_4,S_3)=6$
    - For $n=4$, no forcing by $N\le 6$ (so $R(C_4,S_4)\ge 7$).
  - Random search at $(n,N)=(4,7)$ found no avoiding colorings in 600 trials.
- Interpretation:
  - Finite evidence supports transition near $n+\sqrt{n}$, but does not settle the infinite-often improvement question.

### EP-560
- Quick literature check:
  - Problem-page updates include stronger modern bounds for size-Ramsey numbers of $K_{s,t}$ in asymmetric regimes.
- Finite compute signal:
  - Random-color thresholds on $K_{M,M}$:
    - For $K_{2,2}$, monochromatic probability jumps to near `1` by $M=4$.
    - For $K_{3,3}$, probabilities: `0.184` ($M=5$), `0.488` ($M=6$), `0.852` ($M=7$), `0.972` ($M=8$).
- Interpretation:
  - Small-host threshold behavior is visible, but asymptotic polynomial-factor gaps in $\hat R(K_{n,n})$ remain untouched.

### EP-567
- Quick literature check:
  - Recent work on subdivisions of $K_4$ gives linear Ramsey-size behavior in broad cases and specifically strong partial progress for $H_5$.
- Finite compute signal:
  - Heuristic random-color checks found zero avoiding samples for $R(H_5,mK_2)$ proxies at tested points $(m,N)\in\{2,3,4\}\times\{8,10,12\}$.
- Interpretation:
  - Empirical signal is consistent with linear-in-$m$ behavior, but not a proof for all no-isolated $H$.

### EP-571
- Quick literature check:
  - Web scan confirms continued growth of realizable Turan-exponent families, but still not full coverage of all rational $\alpha\in[1,2)$ for single bipartite graphs.
- Finite compute signal:
  - Denominator-bounded map (`den<=60`) covers `558/1101` reduced rationals in $[1,2)$ from currently listed families.
- Interpretation:
  - Coverage is substantial yet incomplete, matching the problem's "all rational exponents" frontier.

## Web sources used
- Problem pages:
  - https://www.erdosproblems.com/522
  - https://www.erdosproblems.com/528
  - https://www.erdosproblems.com/529
  - https://www.erdosproblems.com/530
  - https://www.erdosproblems.com/531
  - https://www.erdosproblems.com/545
  - https://www.erdosproblems.com/552
  - https://www.erdosproblems.com/560
  - https://www.erdosproblems.com/567
  - https://www.erdosproblems.com/571
- Additional primary references surfaced in quick scan:
  - https://arxiv.org/abs/2212.02514
  - https://arxiv.org/abs/2412.00050
