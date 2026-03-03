# Harder Batch 2: Web + Compute

Batch: `EP-32, EP-33, EP-36, EP-39, EP-41, EP-44, EP-51, EP-52, EP-60, EP-61`

Computation artifact:
- `data/harder_batch2_quick_compute.json`

## Per-problem quick outcomes

### EP-32
- Quick literature check:
  - Found recent additive-complement progress in a related direction (complements in complements of positive-density sets, 2025), but no direct closure of the prime-complement $O(\log N)$ frontier in this quick pass.
- Finite compute signal:
  - Random finite probes on $[X/2, X]$ with $X\in\{5\times10^4,10^5,2\times10^5\}$ and $k=24$ shifts gave best coverage about $0.939, 0.924, 0.907$.
- Interpretation:
  - Log-scale-size complements can cover a large finite fraction, but full eventual coverage remains far from certified.

### EP-33
- Quick literature check:
  - Found a recent note on additive complements of squares (2026), indicating current activity.
- Finite compute signal:
  - Greedy bounded-shift cover of $[X/2, X]$ using $n=t^2+a$ with at most $120$ shifts and $a\le 4\sqrt{X}$ reaches coverage about:
    - $0.504$ for $X=20000$
    - $0.319$ for $X=50000$
    - $0.224$ for $X=100000$
- Interpretation:
  - Finite interval-covering difficulty grows quickly with scale in this constrained model.

### EP-36
- Quick literature check:
  - Confirmed ongoing updates to the minimum-overlap constant window on the Erdős Problems page (latest listed 2026 update there).
- Finite compute signal:
  - Local search on balanced partitions ($N=120,200,300$) found best overlap ratios near $0.42..0.427$.
- Interpretation:
  - Finite optimization lands above the current best upper-bound regime, consistent with the problem being delicate at constant level.

### EP-39
- Quick literature check:
  - Located recent work around dense/structured Sidon-related sequences (2023), but no direct proof of the target $N^{1/2-\varepsilon}$-for-all-$\varepsilon$ infinite Sidon growth.
- Finite compute signal:
  - Ascending greedy Sidon prefix to $N=2\times10^6$ gives count $490$, with $\lvert A\cap[1,N]\rvert / N^{1/3}\approx 3.89$.
- Interpretation:
  - Finite greedy behavior remains closer to low-exponent growth than to the conjectural near-$N^{1/2}$ regime.

### EP-41
- Quick literature check:
  - No clear modern theorem-level closure of the odd-$h$ case in this quick scan; classical even-$h$ results remain the main anchor.
- Finite compute signal:
  - Greedy $B_3$-type construction to $N=60000$ gives count $29$, with $\lvert A\cap[1,N]\rvert / N^{1/3}\approx 0.741$.
- Interpretation:
  - Finite profile does not suggest a direct route to settling the liminf question.

### EP-44
- Quick literature check:
  - No direct modern closure found quickly; also saw recent 2025 work giving counterexamples in a related perfect-difference-set extension setting.
- Finite compute signal:
  - Random extension experiments from Sidon $A\subseteq[1,N]$ into $[N+1,3N]$ (target $(1-\varepsilon)\sqrt{3N}$, $\varepsilon=0.2$) succeed in:
    - $94\%$ of trials for $N=120$
    - $83\%$ for $N=180$
    - $50\%$ for $N=240$
- Interpretation:
  - Finite random behavior looks moderately favorable at small `N`, but degrades as `N` grows in this quick model.

### EP-51
- Quick literature check:
  - Found new 2025 results proving Carmichael totient conjecture in special cases.
- Finite compute signal:
  - For totients up to $5\times10^5$, max observed ratio $\min n_a/a$ is about $2.035$ (at $a=5888$), while many large sampled $a$ values are close to ratio $1$.
- Interpretation:
  - Finite data shows intermittent large ratios but no clear monotone divergence pattern.

### EP-52
- Quick literature check:
  - Found 2025 updates on sum-product (Bloom lecture notes survey and Compositio paper on few-prime-factor sets), consistent with ongoing active progress.
- Finite compute signal:
  - Effective exponents $\log(\max(\lvert A+A\rvert,\lvert AA\rvert))/\log\lvert A\rvert$ in tested finite regimes:
    - AP sets: about $1.68..1.71$
    - best random sets found: about $1.76..1.82$ for $\lvert A\rvert=20..60$
- Interpretation:
  - Finite exponents remain well above $1$, but far below the conjectural near-$2$.

### EP-60
- Quick literature check:
  - Located published work proving the conjecture for infinitely many $n$ of special form (and related 2023 cycle-count papers).
- Finite compute signal:
  - At small exact-table points $n\le 39$, random search at $\mathrm{ex}(n;C_4)+1$ edges still gives substantial minimum $C_4$ counts (e.g. $28$ at $n=20$, $115$ at $n=36$).
- Interpretation:
  - Finite supersaturation signal is strong; global $\gg\sqrt{n}$ lower bound for all $n$ remains open.

### EP-61
- Quick literature check:
  - Confirmed 2023/2024 “loglog step” improvements toward Erdős-Hajnal.
- Finite compute signal:
  - In random cograph ($P_4$-free subclass) experiments, minimum observed $\max(\alpha,\omega)$ scales around exponent $\sim 0.64..0.66$ for $n=64..512$.
- Interpretation:
  - Special forbidden-induced classes exhibit strong polynomial behavior, but this does not settle general `H`.

## Web sources used
- EP-32:
  - https://www.cambridge.org/core/journals/bulletin-of-the-london-mathematical-society/article/additive-complements-in-the-complement-of-a-set-of-positive-density/2D5A884D8575A416C0A2F251F33242ED
- EP-33:
  - https://www.sciencedirect.com/science/article/pii/S0012365X2500494X
- EP-36:
  - https://www.erdosproblems.com/36
- EP-39:
  - https://arxiv.org/abs/2308.13028
  - https://arxiv.org/abs/2302.01936
- EP-44:
  - https://www.erdosproblems.com/44
  - https://arxiv.org/abs/2507.00696
- EP-51:
  - https://nntdm.net/volume-31-2025/number-2/1049-1061/
- EP-52:
  - https://arxiv.org/abs/2501.09470
  - https://www.cambridge.org/core/journals/compositio-mathematica/article/sumproduct-estimates-for-sets-with-few-prime-factors/39D63C9012834D2A3408830EB03F90FC
- EP-60:
  - https://arxiv.org/abs/2106.12431
  - http://www.global-sci.com/article/91885/new-results-on-4-cycles-in-a-graph
- EP-61:
  - https://arxiv.org/abs/2301.10147
  - https://academic.oup.com/imrn/article/2024/4/3094/7210838
