# EP-5

## Problem Statement
Let $C\geq 0$. Is there an infinite sequence of $n_i$ such that\[\lim_{i\to \infty}\frac{p_{n_i+1}-p_{n_i}}{\log n_i}=C?\]

## Source Status
- Source: https://www.erdosproblems.com/5
- Forum: https://www.erdosproblems.com/forum/discuss/5
- LaTeX source: https://www.erdosproblems.com/latex/5
- Accessed: 2026-05-08
- Page status: OPEN (no)
- Database status last update: 2025-08-31
- Tags: number theory, primes
- OEIS: A001223
- Formalized statement: no (last update 2025-08-31)
- Forum comment activity: None - There are no solutions, partial or complete, claimed in the comments.

## Site Remarks
Let $S$ be the set of limit points of $(p_{n+1}-p_n)/\log n$. This problem asks whether $S=[0,\infty]$. Although this conjecture remains unproven, a lot is known about $S$. Some highlights:
{UL}
{LI}$\infty\in S$ by Westzynthius' result \cite{We31} on large prime gaps,{/LI}
{LI}$0\in S$ by the work of Goldston, Pintz, and Yildirim \cite{GPY09} on small prime gaps,{/LI}
{LI}Erd\H{o}s \cite{Er55} and Ricci \cite{Ri56} independently showed that $S$ has positive Lebesgue measure,{/LI}
{LI} Hildebrand and Maier \cite{HiMa88} showed that $S$ contains arbitrarily large (finite) numbers,{/LI}
{LI} Pintz \cite{Pi16} showed that there exists some small constant $c>0$ such that $[0,c]\subset S$,{/LI}
{LI} Banks, Freiberg, and Maynard \cite{BFM16} showed that at least $12.5\%$ of $[0,\infty)$ belongs to $S$,{/LI}
{LI} Merikoski \cite{Me20} showed that at least $1/3$ of $[0,\infty)$ belongs to $S$, and that $S$ has bounded gaps.{/LI}
{/UL}
In \cite{Er65b}, \cite{Er85c}, and \cite{Er97c} Erd\H{o}s asks whether $S$ is everywhere dense (but Weisenberg notes that clearly $S$ is closed so this is equivalent to asking whether $S=[0,\infty]$).

See also [234].

## Site References
- [BFM16] Banks, William D. and Freiberg, Tristan and Maynard, James, On limit points of the sequence of normalized prime gaps. Proc. Lond. Math. Soc. (3) (2016), 515-539.
- [Er55] Erd\H{o}s, Paul, Some remarks on number theory. Riveon Lematematika (1955), 45-48.
- [Er65b] Erd\H{o}s, Paul, Some recent advances and current problems in number theory. Lectures on Modern Mathematics, Vol. III (1965), 196-244.
- [Er85c] Erd\H{o}s, P., On some of my problems in number theory I would most like to see solved. Number theory (Ootacamund, 1984) (1985), 74-84.
- [Er97c] Erd\H{o}s, Paul, Some of my favorite problems and results. The mathematics of Paul Erd\H{o}s, I (1997), 47-67.
- [GPY09] Goldston, Daniel A. and Pintz, J\'{a}nos and Y\i ld\i r\i m, Cem Y., Primes in tuples. I. Ann. of Math. (2) (2009), 819-862.
- [HiMa88] Hildebrand, Adolf and Maier, Helmut, Gaps between prime numbers. Proc. Amer. Math. Soc. (1988), 1-9.
- [Me20] Merikoski, Jori, Limit points of normalized prime gaps. J. Lond. Math. Soc. (2) (2020), 99-124.
- [Pi16] Pintz, J\'{a}nos, Polignac numbers, conjectures of Erd\H{o}s on gaps between primes, arithmetic progressions in primes, and the bounded gap conjecture. From arithmetic to zeta-functions (2016), 367-384.
- [Ri56] Ricci, Giovanni, Recherches sur l'allure de la suite $\{p_{n+1}-p_n/\log p_n\}$. Colloque sur la Th\'{e}orie des Nombres, Bruxelles, 1955 (1956), 93-106.
- [We31] Westzynthius, E., \"{U}ber die Verteilung der Zahlen, die zu den n ersten Primzahlen teilerfremd sind. Commentat. Phys. Math. (1931), 1-37.

## Forum Discussion
The site comment-activity widget records no claimed partial or complete solution. The 3 forum comment(s) are ordinary discussion, corrections, references, or clarification.

## Forum Comments
- 19:17 on 04 May 2026 - Woett:
  In the remarks [Er55] is referenced, but this should be [Er55c, p. 4] (https://users.renyi.hu/~p_erdos/1955-12.pdf). Some other page numbers:
  
  [Er57, p. 292] (https://users.renyi.hu/~p_erdos/1957-13.pdf), [Er61, p. 222] (https://users.renyi.hu/~p_erdos/1961-22.pdf), [Er65b, p. 202] (https://users.renyi.hu/~p_erdos/1965-17.pdf), [Er85c, p. 80] (https://users.renyi.hu/~p_erdos/1985-17.pdff).

- 18:39 on 09 Aug 2025 - Dogmachine:
  Given the PNT, one of the most natural limit points here would be 1. Is this case open too?

- 21:37 on 10 Aug 2025 - Thomas Bloom (reply depth 1):
  I believe it is still open, yes. I think the only explicit numbers known to be in $S$ are $0$ and $\infty$.

## Local Computation
- computation:
 - computes prime gaps up to the first $5\cdot 10^6$ prime indices;
 - analyzes two normalizations:
 \[
 \frac{p_{n+1}-p_n}{\log n}
 \quad\text{and}\quad
 \frac{p_{n+1}-p_n}{\log p_n};
 \]
 - extracts extreme values, quantiles, and occupancy of fine bins in $[0,20)$.

Deep run (DEPTH=5, N_PRIMES=5,000,000) found:
- For normalization by $\log n$:
 - min $\approx 0.1297$, max $\approx 14.9009$,
 - 127 occupied bins out of 200 in $[0,20)$ at step $0.1$.
- For normalization by $\log p_n$:
 - min $\approx 0.1095$, max $\approx 12.4615$,
 - 105 occupied bins out of 200 in $[0,20)$ at step $0.1$.
- Upper-tail events persist at finite scale (nontrivial fraction above 6), while small normalized gaps also remain frequent.
Interpretation: finite data strongly supports a rich spread of normalized gaps, but cannot prove full surjectivity of limit points.

## Local Proof Attempts
Approaches to Push:
- Sieve-first route (Maynard-Tao style) with a target normalized-gap parameter
 \[
 \frac{p_{n+1}-p_n}{\log n}\approx \alpha.
 \]
- Probabilistic/residue-class model for local prime-gap pattern realization.
- LLL/local dependence control for constrained prime-indicator windows.
- Red-blue (small/target/large gap) coding to force recurrent target-scale events.
- EP5-A (target-gap realization):
 for each fixed $\alpha>0,\varepsilon>0$, infinitely many $n$ satisfy
 \[
 \left|\frac{p_{n+1}-p_n}{\log n}-\alpha\right|<\varepsilon.
 \]
- EP5-B (uniform sieve transport):
 preserve enough uniformity while pinning a prescribed single-gap scale.
- EP5-C (interval-to-pointwise transport):
 turn interval/positive-measure limit-point information into full pointwise
 coverage of $(0,\infty)$.
What Would Finish the Proof:
- EP5-A for all $\alpha>0$ implies immediately
 \[
 S=[0,\infty).
 \]
- Practically: EP5-B + EP5-C is the likely route to proving EP5-A.

Target:
Show every \(\alpha>0\) is a normalized prime-gap limit point:
\[
\exists\,n_j\to\infty,\quad \frac{p_{n_j+1}-p_{n_j}}{\log n_j}\to \alpha.
\]
Step A: Target-Window Production
For fixed \(\alpha,\varepsilon\), produce infinitely many \(n\) with
\[
\frac{p_{n+1}-p_n}{\log n}\in[\alpha-\varepsilon,\alpha+\varepsilon].
\]
Step B: Quantitative Density of Hits
Upgrade to positive lower density of such hits along a sparse subsequence of
scales, robust under narrowing \(\varepsilon\).
Step C: Diagonalization in \(\varepsilon\)
Apply \(\varepsilon_m\downarrow0\) and subsequence extraction to obtain a true
limit point \(\alpha\).
Concrete Blocking Lemma (Most Critical):
Need a sieve distribution theorem with two-sided gap control: simultaneously
exclude nearby extra primes and force one prime at the target offset with
uniform error terms across scales.
