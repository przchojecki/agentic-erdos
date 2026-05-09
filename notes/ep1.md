# EP-1

## Problem Statement
If $A\subseteq \{1,\ldots,N\}$ with $\lvert A\rvert=n$ is such that the subset sums $\sum_{a\in S}a$ are distinct for all $S\subseteq A$ then\[N \gg 2^{n}.\]

## Source Status
- Source: https://www.erdosproblems.com/1
- Forum: https://www.erdosproblems.com/forum/discuss/1
- LaTeX source: https://www.erdosproblems.com/latex/1
- Accessed: 2026-05-08
- Page status: OPEN ($500)
- Database status last update: 2025-08-31
- Page last edited: 06 April 2026
- Tags: number theory, additive combinatorics
- OEIS: A276661
- Formalized statement: yes (last update 2025-08-31)
- Forum comment activity: None - There are no solutions, partial or complete, claimed in the comments.

## Site Remarks
Erd\H{o}s called this 'perhaps my first serious problem' (in \cite{Er98} he dates it to 1931). The powers of $2$ show that $2^n$ would be best possible here: this provides an upper bound for the minimal such $N$ of $N\leq 2^{n-1}$. This was improved by Conway and Guy \cite{CoGu68} (see also \cite{Gu82}) to $N\leq 2^{n-2}$ (for all large $n$). The best known upper bound is\[N\leq 0.22002\cdot 2^n,\]due to Bohman.

The trivial lower bound is $N \gg 2^{n}/n$, since all $2^n$ distinct subset sums must lie in $[0,Nn)$. Erd\H{o}s and Moser \cite{Er56} proved\[ N\geq (\tfrac{1}{4}-o(1))\frac{2^n}{\sqrt{n}}.\](In \cite{Er85c} Erd\H{o}s offered \$100 for any improvement of the constant $1/4$ here.)

A number of improvements of the constant have been given (see \cite{St23} for a history), with the current record $\sqrt{2/\pi}$ first proved in unpublished work of Elkies and Gleason. Two proofs achieving this constant are provided by Dubroff, Fox, and Xu \cite{DFX21}, who in fact prove the exact bound $N\geq \binom{n}{\lfloor n/2\rfloor}$.

An equivalent formulation is to ask for the maximal size of a set of integers in $[1,x]$ which is dissociated (all subset sums are distinct). If $F(x)$ is the size of such a set then this problem is equivalent to\[F(x) <\log_2x+O(1).\]Conway and Guy (see \cite{Gu82}) conjectured that $F(2^k)=k+2$ for all large $k$, but Erd\H{o}s \cite{Er80} wrote he had 'no opinion'.

In \cite{Er73} and \cite{ErGr80} the generalisation where $A\subseteq (0,N]$ is a set of real numbers such that the subset sums all differ by at least $1$ is proposed, with the same conjectured bound. (The second proof of \cite{DFX21} applies also to this generalisation.) This generalisation seems to have first appeared in \cite{Gr71}.

This problem appears in Erd\H{o}s' book with Spencer \cite{ErSp74} in the final chapter titled 'The kitchen sink'. As Ruzsa writes in \cite{Ru99} "it is a rich kitchen where such things go to the sink".

The sequence of minimal $N$ for a given $n$ is A276661 (https://oeis.org/A276661) in the OEIS.

See also [350].

This is discussed in problem C8 of Guy's collection \cite{Gu04}.

## Site References
- [CoGu68] J. H. Conway and R. K. Guy, Sets of natural numbers with distinct sums. Notices Amer. Math. Soc. (1968), 345.
- [DFX21] Dubroff, Q. and Fox, J. and Xu, M. W., A note on the Erd\H{o}s distinct subset sums problem. SIAM Journal on Discrete Mathematics (2021), 322-324.
- [Er56] Erd\H{o}s, P., Problems and results in additive number theory. Colloque sur la Th\'{e}orie des Nombres, Bruxelles, 1955 (1956), 127-137.
- [Er73] Erd\H{o}s, P., Problems and results on combinatorial number theory. A survey of combinatorial theory (Proc. Internat. Sympos., Colorado State Univ., Fort Collins, Colo., 1971) (1973), 117-138.
- [Er80] Erd\H{o}s, Paul, A survey of problems in combinatorial number theory. Ann. Discrete Math. (1980), 89-115.
- [Er85c] Erd\H{o}s, P., On some of my problems in number theory I would most like to see solved. Number theory (Ootacamund, 1984) (1985), 74-84.
- [Er98] Erd\H{o}s, Paul, Some of my new and almost new problems and results in combinatorial number theory. Number theory (Eger, 1996) (1998), 169-180.
- [ErGr80] Erd\H{o}s, P. and Graham, R., Old and new problems and results in combinatorial number theory. Monographies de L'Enseignement Mathematique (1980).
- [ErSp74] Erd\H{o}s, Paul and Spencer, Joel, Probabilistic methods in combinatorics. Akad\'{e}miai Kiad\'{o} (1974).
- [Gr71] Graham, R. L., On sums of integers taken from a fixed sequence. (1971), 22--40.
- [Gu04] Guy, Richard K., Unsolved problems in number theory. (2004), xviii+437.
- [Gu82] Guy, Richard K., Sets of integers whose subsets have distinct sums. (1982), 141--154.
- [Ru99] Ruzsa, I., Erd\H{o}s and the Integers. Journal of Number Theory (1999), 115-163.
- [St23] Steinerberger, S., Some remarks on the Erd\H{o}s distinct subset sums problem. arXiv:2208.12182 (2023).

## Forum Discussion
The site comment-activity widget records no claimed partial or complete solution. The 4 forum comment(s) are ordinary discussion, corrections, references, or clarification.

## Forum Comments
- 12:48 on 16 Jan 2026 - Sayan Dutta:
  The DFX proof can be slightly written in a slightly general way, as shown in Theorem 1.4 of this paper (https://arxiv.org/pdf/2601.07068).

- 13:53 on 12 Sep 2025 - StijnC:
  The trivial construction was with $S$ being set of powers of $2$ up to $N=2^{n-1}$.
  The best construction (by Bohman, ElJC'98) so far, has
  $N=(0.22002+o(1))\cdot 2^n$.
  
  So a construction with $N<2^n/5$ would be interesting, while not being a counterexample.

- 03:37 on 12 Sep 2025 - 33:
  A={2，3，4}⊆{1，2，3，4}，2+3≠2+4≠3+4≠2+3+4≠2≠3≠4≠0，4≫2^|A|?

- 09:09 on 12 Sep 2025 - Thomas Bloom (reply depth 1):
  Yes. Here $\gg$ is the Vinogradov notation, which means 'up to an absolute constant'. In particular this problem cannot be disproved by any fixed finite example.

## Local Computation
- computation:
 - exact branch-and-bound search for maximal cardinality in $[1,N]$ for all $N\le 70$;
 - randomized construction search up to $N=600$.
- This computes
\[
m(N):=\max\{|A|:A\subseteq[1,N],\ \text{all subset sums distinct}\}.
\]

Deep run (DEPTH=4) took about 108 seconds and found:
- For many $N$, one can beat the powers-of-two construction by exactly $+1$ element:
 \[
 m(N)-(\lfloor \log_2 N\rfloor+1)=1
 \]
 at least for ranges like $N=13\text{--}15$, $24\text{--}31$, $44\text{--}63$.
- Example witnesses:
 - $N=13$: $A=\{3,6,11,12,13\}$ gives $|A|=5$ (baseline is 4).
 - $N=50$: $A=\{1,6,12,24,46,48,50\}$ gives $|A|=7$ (baseline is 6).
- Randomized search up to $N=600$ also repeatedly found the same $+1$ gain.
Interpretation: finite data confirms nontrivial constructions beyond pure powers of two, but still far from the conjectural asymptotic scale needed to force $N\gg 2^n$.

## Local Proof Attempts
Approaches to Push:
- Additive-combinatorial anti-concentration route on
 \[
 \sum_{i=1}^n \varepsilon_i a_i.
 \]
- Sieve-style collision control for subset sums (view repeated sums as bad events).
- Probabilistic/LLL framing for local collision constraints among subset signatures.
- EP1-A (constant-scale anti-concentration):
 prove
 \[
 \max_t \mathbf P\!\left(\sum \varepsilon_i a_i=t\right)\le C\,2^{-n}
 \]
 with absolute $C$; current methods lose a $\sqrt n$ factor.
- EP1-B (energy rigidity):
 near-minimal additive energy of subset sums should force support size
 $\gg 2^n$ with absolute constant, not $2^n/\sqrt n$.
What Would Finish the Proof:
- Either EP1-A or EP1-B at full strength implies
 \[
 \#\{\text{subset sums}\}\gg 2^n,
 \]
 hence $N\gg 2^n$ since subset sums lie in $[0,nN]$.

Target:
Upgrade the current \(2^n/\sqrt n\)-scale lower bounds to \(c\,2^n\), yielding
\(N\gg 2^n\).
Step A: Strong Anti-Concentration
For dissociated \(A\), establish near-optimal bound on maximal atom of subset-sum
distribution:
\[
\max_t \mathbf P\!\left(\sum \varepsilon_i a_i=t\right)\le C\,2^{-n}.
\]
Step B: Support Expansion
Deduce
\[
|\operatorname{supp}\text{(subset sums)}|\ge c\,2^n
\]
with absolute \(c>0\).
Step C: Interval Compression Contradiction
Since support lies in \([0,nN]\), infer \(nN\ge c\,2^n\), i.e. \(N\gg 2^n\).
Concrete Blocking Lemma (Most Critical):
Need an inverse Littlewood-Offord theorem tailored to strictly increasing
positive integers that removes the \(\sqrt n\) entropy loss in current bounds.
