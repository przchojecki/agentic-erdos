# Harder Batch 1: Web + Compute

Batch: `EP-1, EP-3, EP-5, EP-9, EP-12, EP-15, EP-17, EP-20, EP-28, EP-30`

Computation artifact:
- `data/harder_batch1_quick_compute.json`

## Per-problem quick outcomes

### EP-1
- Quick literature check:
  - Found a recent related extension in modular setting: Dousse et al., *Modular distinct subset sums* (Acta Arith., 2025).
- Finite compute signal:
  - Central-binomial scale check gives $\binom{n}{\lfloor n/2\rfloor} 2^{-n}\sqrt{n}$ approaching about $0.795$ by $n=64$.
- Interpretation:
  - Finite profile matches the known $2^n/\sqrt{n}$ scale and still leaves the $\sqrt{n}$ gap to the conjectural $c\,2^n$ target.

### EP-3
- Quick literature check:
  - Recent progress remains active: Leng-Sah-Sawhney (2024) on improved quantitative Szemeredi bounds.
- Finite compute signal:
  - A simple ascending greedy 3-AP-free proxy in $[1,N]$ reaches size $2048$ at $N=100000$, with reciprocal sum about $2.9796$.
- Interpretation:
  - Finite proxies show substantial AP-avoidance room, but do not resolve the divergent-harmonic implication for all progression lengths.

### EP-5
- Quick literature check:
  - No clearly newer direct breakthrough than the modern limit-point structure papers quickly surfaced; Merikoski (2020) remains central in this scan.
- Finite compute signal:
  - For first $4\times 10^5$ prime indices, normalized gaps $\frac{p_{n+1}-p_n}{\log n}$ occupy all bins in $[0,10]$ at step $0.25$; observed max about $12.42$.
- Interpretation:
  - Empirically broad spread supports rich limit-point behavior, but finite data cannot prove full $S=[0,\infty)$.

### EP-9
- Quick literature check:
  - No obvious post-2011 direct update was identified in this quick pass.
- Finite compute signal:
  - Up to $10^6$, only $2$ odd numbers were found not representable as $p+2^a+2^b$ (density among odds about $4\times 10^{-6}$).
- Interpretation:
  - Finite range remains extremely sparse for exceptions; this does not contradict known infinitude but gives no density-positivity evidence.

### EP-12
- Quick literature check:
  - Elsholtz-Planitzer (2017) remains the key modern constructive reference found quickly.
- Finite compute signal:
  - For $A=\{p^2: p\equiv 3\pmod 4,\ p\ \text{prime}\}$, $\lvert A\cap[1,N]\rvert\log N/\sqrt{N}$ stays around $1.14..1.24$ over $10^4..10^8$.
  - Partial reciprocal sum over this $A$ stabilizes near $0.14843$.
- Interpretation:
  - This benchmark construction stays near $\sqrt{N}/\log N$ scale and is consistent with convergent reciprocal behavior.

### EP-15
- Quick literature check:
  - Tao's conditional convergence result is now in published form (Communications of the AMS, 2024).
- Finite compute signal:
  - Partial sums of $\sum (-1)^n n/p_n$ up to $n=10^6$ drift to about $-0.01986$ with small oscillation envelope after early terms.
- Interpretation:
  - Numerical profile is compatible with convergence, still not an unconditional proof.

### EP-17
- Quick literature check:
  - No clear newer theorem-level improvement over the classical/open-status framing appeared in this quick scan.
- Finite compute signal:
  - Cluster-prime scan up to $p\le 200000$ found $2801$ examples, largest $199933$.
- Interpretation:
  - Strong finite abundance signal continues, but infinitude remains unproved.

### EP-20
- Quick literature check:
  - Recent sunflower progress includes 2025 results for small VC-dimension frameworks.
- Finite compute signal:
  - Random greedy 3-sunflower-free families (small-universe proxy):
    - $m=3$: best $14$
    - $m=4$: best $27$
    - $m=5$: best $52$
- Interpretation:
  - Small-scale growth is consistent with exponential-type behavior in $m$, but does not settle the full $c_k^n$ threshold question.

### EP-28
- Quick literature check:
  - No direct post-2004 decisive result for this exact Erdos-Turan representation-growth form was identified quickly.
  - Related modern bounded-representation variants exist.
- Finite compute signal:
  - Random finite proxies at $N=1000,2000$ reached coverage $\ge 0.99$ with minimum observed peak representation counts $58$ and $112$, respectively.
- Interpretation:
  - In finite experiments, forcing near-full sumset coverage already pushes high multiplicities, aligned with the conjectural direction.

### EP-30
- Quick literature check:
  - Carter-Hunter-O'Bryant (2025) improves the upper-bound correction constant in the $N^{1/4}$ term.
- Finite compute signal:
  - Structured $N=q^2+q+1$ profile (prime $q$) gives lower bound size $q+1=\sqrt{N}+O(1)$, numerically near $\sqrt{N}+0.5$ (ratio to $\sqrt{N}$ near $1.001$ at $q=509$).
- Interpretation:
  - Computation supports strong near-$\sqrt{N}$ lower-scale behavior; the open part is tightening the upper error to $N^\epsilon$ (or $O(1)$).

## Web sources used
- EP-1:
  - https://www.impan.pl/en/publishing-house/journals-and-series/acta-arithmetica/all/232/1/119982/modular-distinct-subset-sums
- EP-3:
  - https://math.mit.edu/research/highschool/primes/materials/2024/LengSahSawhney.pdf
- EP-5:
  - https://researchportal.helsinki.fi/en/publications/limit-points-of-normalized-prime-gaps
- EP-12:
  - https://link.springer.com/article/10.1007/s00605-016-0927-y
- EP-15:
  - https://www.ams.org/journals/cams/2024-07-03/S2692-3688-2024-00029-9/home.html
- EP-17:
  - https://www.erdosproblems.com/17
- EP-20:
  - https://link.springer.com/article/10.1007/s10623-025-01494-z
- EP-28:
  - https://www.erdosproblems.com/28
  - https://www.cambridge.org/core/journals/combinatorics-probability-and-computing/article/bounded-representation-bases-with-rapidly-growing-representation-function/0B4A198DE22A0B9B8D81A7E111ED4187
- EP-30:
  - https://link.springer.com/article/10.1007/s10474-025-01542-w
