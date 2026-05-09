# EP-132

## Problem Statement
Let $A\subset \mathbb{R}^2$ be a set of $n$ points. Must there be two distances which occur at least once but between at most $n$ pairs of points? Must the number of such distances $\to \infty$ as $n\to \infty$?

## Source Status
- Source: https://www.erdosproblems.com/132
- Forum: https://www.erdosproblems.com/forum/discuss/132
- LaTeX source: https://www.erdosproblems.com/latex/132
- Accessed: 2026-05-08
- Page status: OPEN ($100)
- Database status last update: 2025-08-31
- Tags: distances
- OEIS: N/A
- Formalized statement: no (last update 2025-08-31)
- Forum comment activity: None - There are no solutions, partial or complete, claimed in the comments.

## Site Remarks
Asked by Erd\H{o}s and Pach. Hopf and Pannowitz \cite{HoPa34} proved that the largest distance between points of $A$ can occur at most $n$ times, but it is unknown whether a second such distance must occur.

It may be true that there are at least $n^{1-o(1)}$ many such distances. In \cite{Er97e} Erd\H{o}s offers \$100 for 'any nontrivial result'.

Erd\H{o}s \cite{Er84c} believed that for $n\geq 5$ there must always exist at least two such distances. This is false for $n=4$, as witnessed by two equilateral triangles of the same side-length glued together. Erd\H{o}s and Fishburn \cite{ErFi95} proved this is true for $n=5$ and $n=6$.

Clemen, Dumitrescu, and Liu \cite{CDL25} have proved that there always at least two such distances if $A$ is in convex position (that is, no point lies inside the convex hull of the others). They also prove it is true if the set $A$ is 'not too convex', in a specific technical sense.

See also [223], [756], and [957].

## Site References
- [CDL25] F. Clemen, A. Dumitrescu, and D. Liu, On multiplicities of interpoint distances. arXiv:2505.04283 (2025).
- [Er84c] Erd\H{o}s, Paul, Some old and new problems in combinatorial geometry. Convexity and graph theory (Jerusalem, 1981) (1984), 129-136.
- [Er97e] Erd\H{o}s, Paul, Some of my favourite unsolved problems. Math. Japon. (1997), 527-537.
- [ErFi95] Erd\H{o}s, Paul and Fishburn, Peter C., Multiplicities of interpoint distances in finite planar sets. Discrete Appl. Math. (1995), 141--147.
- [HoPa34] Hopf, H. and Pannwitz, E., Aufgabe 167. Jber. Deutsch. Math. Verein. (1934), 114.

## Forum Discussion
The site comment-activity widget records no claimed partial or complete solution. The 2 forum comment(s) are ordinary discussion, corrections, references, or clarification.

## Forum Comments
- 10:36 on 28 Jan 2026 - Zeraoulia Rafik:
  Hi all — I wanted to share a short update related to Erdős problem 132 (the “two distances with multiplicity in $[1,n]$” question).
  
  In a brief note I verify the conjectured Erdős–Pach statement for $n=7$, and I also give a structural reduction for $n=8$.
  
  For $n=7$: Let $A$ be a $7$-point set in the plane and let $m_A(d)$ be the multiplicity of distance $d$. If $|D(A)| \ge 4$, then it is impossible that at most one distance has multiplicity $\le 7$: indeed, if all but possibly one distance satisfy $m_A(d) \ge 8$, then
  $21 = \sum_{d \in D(A)} m_A(d) \ge 1 + 3\cdot 8 = 25$,
  a contradiction. Hence in this case there are at least two distances with multiplicity $\le 7$.
  
  So we may assume $|D(A)| \le 3$. Also $|D(A)| \ne 2$ since planar $2$-distance sets have size at most $5$. Therefore $|D(A)| = 3$ and $A$ is a $7$-point $3$-distance set. Using the known classification of maximum planar $3$-distance sets of size $7$ (regular heptagon $R_7$ or the “regular hexagon + center” configuration $R_6^+$), one checks directly that in each configuration at least two distances have multiplicity $\le 7$. This completes the verification for $n=7$.
  
  For $n=8$: A simple counting reduction shows that any counterexample must be extremely rigid. If $|D(A)| \ge 5$ and at most one distance has multiplicity $\le 8$, then
  $28 = \sum_{d \in D(A)} m_A(d) \ge 1 + 4\cdot 9 = 37$,
  contradiction, so any counterexample must satisfy $|D(A)| \le 4$. On the other hand $|D(A)|$ cannot be $3$ because $g(3)=7$ (no planar $3$-distance set has $8$ points). Hence a counterexample would have exactly $|D(A)| = 4$. Combining this with the diameter bound (there exists a distance with multiplicity $\le 8$; in particular the diameter has multiplicity $\le 8$), the only possible multiplicity profile is $\{1,9,9,9\}$, where the distance of multiplicity $1$ is the unique diameter and the other three distances occur exactly $9$ times each. In other words: an $n=8$ counterexample would have a unique diametral pair and the remaining $27$ pairs split into three distance classes of size $9$ each.
  
  The note (with references and a small numerical appendix) is available here:
  https://doi.org/10.13140/RG.2.2.26754.95684 (https://doi.org/10.13140/RG.2.2.26754.95684)
  
  Any feedback or ideas for ruling out the $n=8$ profile $\{1,9,9,9\}$ would be very welcome — it seems like a promising “bottleneck” structure for a full solution.

- 13:23 on 28 Jan 2026 - Przemek Chojecki (reply depth 1):
  Looks like GPT-5.2 can do n=8 in a pretty straightforward way: Let $A\subset\mathbb R^2$ be a set of $8$ points. For $d>0$ define the multiplicity\[
  m_A(d):=\bigl|\{\{x,y\}\subset A:\ |x-y|=d\}\bigr|
  \]and let $D(A)$ be the set of distances determined by $A$.
  We claim that there exist two distinct distances $d_1\neq d_2$ with
  $1\le m_A(d_i)\le 8$ for $i=1,2$.
  
  Assume for contradiction that at most one distance has multiplicity $\le 8$.
  Since $\sum_{d\in D(A)} m_A(d)=\binom82=28$, if $|D(A)|\ge 5$ then\[
  28=\sum_{d\in D(A)} m_A(d)\ge 1+4\cdot 9=37,
  \]a contradiction. Hence a counterexample must satisfy $|D(A)|\le 4$.
  
  It is known that there is no planar $3$-distance set of size $8$ (equivalently, $g_2(3)=7$),
  so $|D(A)|\neq 3$. Therefore any counterexample must have $|D(A)|=4$.
  
  Let $\Delta$ be the diameter of $A$. A classical diameter-graph lemma (Hopf--Pannwitz)
  implies that in an $n$-point planar set the diameter occurs at most $n$ times; hence here
  $m_A(\Delta)\le 8$. Under our counterexample assumption, $\Delta$ must be the unique
  distance with multiplicity $\le 8$, so the remaining three distances have multiplicity
  $\ge 9$. Since the total sum is $28$, this forces the multiplicity profile\[
  \{m_A(d): d\in D(A)\}=\{1,9,9,9\},
  \]in particular $m_A(\Delta)=1$ and $A$ has a unique diametral pair.
  
  Now invoke the classification of planar $8$-point $4$-distance sets: up to similarity,
  every such set is one of the following types:
  (1) the regular octagon $R_8$;
  (2) the regular heptagon together with its center $R_7^+$;
  (3) the exceptional configuration shown in the classification (often drawn as a square
  with four equilateral ''bumps'');
  (4) an $8$-point subset of one of the classified $9$-point $4$-distance sets.
  
  For each type one checks the distance multiplicities and finds at least two distinct
  distances of multiplicity $\le 8$:
  for $R_8$ the four distance classes have multiplicities $(8,8,8,4)$;
  for $R_7^+$ all four distances have multiplicity $7$;
  for the exceptional configuration two of the distances occur only twice;
  and in the remaining finitely many $8$-subsets arising from the $9$-point parents,
  the multiplicity tables show that no configuration has profile $\{1,9,9,9\}$.
  This contradicts the forced profile above. Hence no counterexample exists, and every
  $8$-point planar set determines at least two distances that occur in at most $8$ pairs.

## Local Computation
Finite compute signal:
 - For the known $n=4$ glued-triangles example, exactly one distance has multiplicity $\le n$.
 - Grid/triangular models at $n=36..144$ already show many distances with multiplicity $\le n$.

 - Counterexample at $n=4$ persists, while larger structured models support the “many such distances” direction.

## Local Proof Attempts
Target:
For \(n\)-point planar sets, force many distances whose multiplicity is at most
\(n\), with exponent as close to \(1\) as possible.
Step A: Multiplicity spectrum decomposition
Partition distances by multiplicity scales and bound heavy scales via incidence
theory.
Step B: Energy redistribution
Show total pair count cannot concentrate too strongly in heavy scales.
Step C: Low-multiplicity extraction
Deduce a polynomial lower bound on count of distances with multiplicity \(\le n\).
Concrete Blocking Lemma (Most Critical):
Need a sharp upper bound on number of distance values with multiplicity \(>n\)
that matches known convex-set exponents.

Proposition AQ1 (Pair-count by multiplicities):
Let distance multiplicities be \(m_t\). Then
\[
\sum_t m_t=\binom n2.
\]
\[
\textit{Proof.}
\]
Each unordered point pair contributes to exactly one distance class.
\(\square\)
Proposition AQ2 (Reduction to heavy-tail control):
If
\[
\sum_{t:\,m_t>n} m_t \le \Bigl(1-\eta_n\Bigr)\binom n2,\quad \eta_n>0,
\]
then distances with \(m_t\le n\) contribute at least \(\eta_n\binom n2\) pairs,
hence their count is at least \(\eta_n(n-1)/2\).
\[
\textit{Proof.}
\]
Each low-multiplicity class contributes at most \(n\) pairs; divide the remaining
pair mass by \(n\).
\(\square\)
