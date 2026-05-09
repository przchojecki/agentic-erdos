# EP-3

## Problem Statement
If $A\subseteq \mathbb{N}$ has $\sum_{n\in A}\frac{1}{n}=\infty$ then must $A$ contain arbitrarily long arithmetic progressions?

## Source Status
- Source: https://www.erdosproblems.com/3
- Forum: https://www.erdosproblems.com/forum/discuss/3
- LaTeX source: https://www.erdosproblems.com/latex/3
- Accessed: 2026-05-08
- Page status: OPEN ($5000)
- Database status last update: 2025-08-31
- Page last edited: 04 April 2026
- Tags: number theory, additive combinatorics, arithmetic progressions
- OEIS: A003002, A003003, A003004, A003005
- Formalized statement: yes (last update 2025-08-31)
- Forum comment activity: None - There are no solutions, partial or complete, claimed in the comments.

## Site Remarks
This is essentially asking for good bounds on $r_k(N)$, the size of the largest subset of $\{1,\ldots,N\}$ without a non-trivial $k$-term arithmetic progression. For example, a bound like\[r_k(N) \ll_k \frac{N}{(\log N)(\log\log N)^2}\]would be sufficient.

Even the case $k=3$ is non-trivial, but was proved by Bloom and Sisask \cite{BlSi20}. Much better bounds for $r_3(N)$ were subsequently proved by Kelley and Meka \cite{KeMe23}. Green and Tao \cite{GrTa17} proved $r_4(N)\ll N/(\log N)^{c}$ for some small constant $c>0$. Gowers \cite{Go01} proved\[r_k(N) \ll \frac{N}{(\log\log N)^{c_k}},\]where $c_k>0$ is a small constant depending on $k$. The current best bounds for general $k$ are due to Leng, Sah, and Sawhney \cite{LSS24}, who show that\[r_k(N) \ll \frac{N}{\exp((\log\log N)^{c_k})}\]for some constant $c_k>0$ depending on $k$.

Curiously, Erd\H{o}s \cite{Er83c} thought this conjecture was the 'only way to approach' the conjecture that there are arbitrarily long arithmetic progressions of prime numbers, now a theorem due to Green and Tao \cite{GrTa08} (see [219]).

In \cite{Er81} Erd\H{o}s makes the stronger conjecture that\[r_k(N) \ll_C\frac{N}{(\log N)^C}\]for every $C>0$ (now known for $k=3$ due to Kelley and Meka \cite{KeMe23}) - see [140].

See also [139] and [142].

This is discussed in problem A5 of Guy's collection \cite{Gu04}.

## Site References
- [BlSi20] Bloom, T.F. and Sisask, O., Breaking the logarithmic barrier in Roth's theorem on arithmetic progressions. arXiv:2007.03528 (2020).
- [Er81] Erd\H{o}s, P., On the combinatorial problems which I would most like to see solved. Combinatorica (1981), 25-42.
- [Er83c] Erd\H{o}s, Paul, Combinatorial problems in geometry. Math. Chronicle (1983), 35-54.
- [Go01] Gowers, W. T., A new proof of Szemer\'{e}di's theorem. Geom. Funct. Anal. (2001), 465-588.
- [GrTa08] Green, Ben and Tao, Terence, The primes contain arbitrarily long arithmetic progressions. Ann. of Math. (2) (2008), 481-547.
- [GrTa17] Green, Ben and Tao, Terence, New bounds for Szemer\'{e}di's theorem, III: a polylogarithmic bound for $r_4(N)$. Mathematika (2017), 944-1040.
- [Gu04] Guy, Richard K., Unsolved problems in number theory. (2004), xviii+437.
- [KeMe23] Kelley, Z. and Meka, R., Strong Bounds for 3-Progressions. arXiv:2302.05537 (2023).
- [LSS24] Leng, J., Sah, A. and Sawhney, M., Improved bounds for Szemer\'{e}di's theorem. arXiv:2402.17995 (2024).

## Forum Discussion
The site comment-activity widget records no claimed partial or complete solution. The 2 forum comment(s) are ordinary discussion, corrections, references, or clarification.

## Forum Comments
- 21:28 on 04 Sep 2025 - Dogmachine:
  What about the stronger version where one requires arbitrarily long arithmetic progressions of consecutive terms of the set? Perhaps this is too much to ask for? Is there a counterexample? Otherwise, this stronger version would imply [141]

- 21:41 on 04 Sep 2025 - Thomas Bloom (reply depth 1):
  This is false even for k=3. For example take all integers congruent to 0 or 1 modulo 3.

## Local Computation
- long-range computation:
 - builds the canonical ascending greedy 3-AP-free sequence up to large $N$;
 - tracks size growth, effective exponent $\log |A\cap[1,N]|/\log N$, and harmonic partial sums.

Deep run (DEPTH=4, Nmax=10^7) gives:
- \[
|A\cap[1,10^7]|=32768,
\]
with effective growth exponent near $0.64$ to $0.68$ across checkpoints.
- Harmonic partial sum over this construction is
\[
\sum_{a\in A,\,a\le 10^7}\frac1a \approx 3.002345,
\]
still very slowly increasing.
Interpretation:
- this major 3-AP-free model remains too sparse to force evident fast divergence in finite range;
- finite evidence is compatible with a convergent or extremely slowly diverging harmonic profile for this specific construction, so it does not approach a proof of the full conjectural implication.

## Local Proof Attempts
Approaches to Push:
- Tao-style transference: convert reciprocal-mass divergence into structured
 density increments on many scales.
- Hypergraph container route with harmonic weights.
- LLL-inspired local-obstruction control for AP constraints.
- Red-blue block reformulation of density profiles across dyadic scales.
- EP3-A (harmonic-to-density bridge):
 divergent
 \[
 \sum_{a\in A}\frac1a
 \]
 must force infinitely many $N$ where density is above the threshold needed by
 quantitative $k$-AP theorems (uniformly in fixed $k$).
- EP3-B (weighted container bound):
 every $k$-AP-free container should obey a uniform reciprocal-mass ceiling
 unless it falls into a rigid exceptional class.
- EP3-C (decay threshold for $r_k(N)$):
 a bound strong enough to imply reciprocal convergence for all $k$-AP-free sets.
What Would Finish the Proof:
- A theorem delivering EP3-C for each fixed $k\ge3$ settles the implication by
 partial summation.
- Alternatively, EP3-A + EP3-B closes the argument through a transference chain.

Target:
Prove the full Erdős-Turán harmonic implication:
\[
\sum_{a\in A}\frac1a=\infty \ \Longrightarrow\ A\ \text{contains arbitrarily long APs}.
\]
Step A: Harmonic-Mass Localization
From divergence, extract infinitely many dyadic scales where \(A\) carries
quantified weighted mass above a threshold convertible to density information.
Step B: Weighted-to-Uniform Transference
Transfer Step A mass into uniform-enough density on structured subprogressions,
with losses small enough to apply quantitative Szemerédi/hypergraph tools.
Step C: Length Escalation
Iterate in progression length \(k\) and scale to force arbitrarily long APs.
Concrete Blocking Lemma (Most Critical):
Need a scale-uniform transference estimate: harmonic-weight excess on
\([X,2X]\) implies existence of a large subprogression \(P\subset[X,2X]\) with
relative density \(\gg (\log X)^{-O(1)}\) and controlled pseudorandom error.
