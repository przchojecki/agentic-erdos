# EP-9

## Problem Statement
Let $A$ be the set of all odd integers $\geq 1$ not of the form $p+2^{k}+2^l$ (where $k,l\geq 0$ and $p$ is prime). Is the upper density of $A$ positive?

## Source Status
- Source: https://www.erdosproblems.com/9
- Forum: https://www.erdosproblems.com/forum/discuss/9
- LaTeX source: https://www.erdosproblems.com/latex/9
- Accessed: 2026-05-08
- Page status: OPEN (no)
- Database status last update: 2025-08-31
- Page last edited: 07 April 2026
- Tags: number theory, additive basis, primes
- OEIS: A006286
- Formalized statement: yes (last update 2025-08-31)
- Forum comment activity: None - There are no solutions, partial or complete, claimed in the comments.

## Site Remarks
Crocker \cite{Cr71} proved that there are infinitely many odd integers not of this form; his proof in fact proves there are $\gg\log\log N$ such integers in $\{1,\ldots,N\}$. Pan \cite{Pa11} improved this to $\gg_\epsilon N^{1-\epsilon}$ for any $\epsilon>0$. Erd\H{o}s believed this cannot be proved by covering systems, i.e. integers of the form $p+2^k+2^l$ exist in every infinite arithmetic progression.

The sequence of such numbers is A006286 (https://oeis.org/A006286) in the OEIS.

In \cite{Er80} Erd\H{o}s conjectured 'with some trepidation' that for any finite set of primes $P$ all large integers $n$ can be written as $n=m+2^k+2^l$ where $m$ is a multiple of one of the primes in $P$.

See also [10], [11], and [16].

This is discussed in problem A19 of Guy's collection \cite{Gu04}.

## Site References
- [Cr71] Crocker, Roger, On the sum of a prime and of two powers of two. Pacific J. Math. (1971), 103-107.
- [Er80] Erd\H{o}s, Paul, A survey of problems in combinatorial number theory. Ann. Discrete Math. (1980), 89-115.
- [Gu04] Guy, Richard K., Unsolved problems in number theory. (2004), xviii+437.
- [Pa11] Pan, Hao, On the integers not of the form {$p+2^a+2^b$}. Acta Arith. (2011), 55-61.

## Forum Discussion
The site comment-activity widget records no claimed partial or complete solution. The 1 forum comment(s) are ordinary discussion, corrections, references, or clarification.

## Forum Comments
- 09:41 on 13 Oct 2025 - Dogmachine:
  The conjecture that integers of the form $p+2^k+2^l$ appear in every arithmetic progression of odd numbers, can be stated somewhat differently, as Erdos did. Let $p_{1},...,p_{n}$ be the first $n$ odd primes. Then there is a $N(n)$ such that for all $N>N(n)$, there exist $k,l$, with $2^k+2^l<N$ and $N-2^k-2^l$ is not divisible by any of the $p_{i}$, for $i =1,...n$.

## Local Computation
Finite compute signal:
 - Up to $10^6$, only $2$ odd numbers were found not representable as $p+2^a+2^b$ (density among odds about $4\times 10^{-6}$).

 - Finite range remains extremely sparse for exceptions; this does not contradict known infinitude but gives no density-positivity evidence.

## Local Proof Attempts
Route:
Viewed the claim as a density-upgrade problem from known lower bounds on exceptional odd integers not representable as p+2^k+2^l.

Hard point:
Current methods still fall short of proving positive upper density of the exceptional set.

Problem Recast:
Let
\[
\mathcal E:= \{\,n\in 2\mathbb Z+1: n\neq p+2^a+2^b\ \forall p,a,b\,\}.
\]
Target claim: $\overline d(\mathcal E)>0$.
Approaches to Push:
- Sieve-first: representable odds as union of shifted-prime sets
 \[
 \{n:\ n-(2^a+2^b)\ \text{prime}\}
 \]
 and show this union leaves a positive-density complement.
- Random/probabilistic residue modeling of $2^a+2^b$ shifts.
- Lopsided-LLL control of overlap dependencies among representation events.
- Red-blue encoding (representable vs exceptional) with modular expansion barriers.
- EP9-A (second-moment overlap bound):
 control correlations between shifted-prime sets strongly enough that their
 union has density $<1$ among odds.
- EP9-B (uniform distribution of power-sum shifts modulo many moduli):
 enough equidistribution to keep sieve major arcs from saturating.
- EP9-C (weighted-to-unweighted density transfer):
 convert weighted sieve upper bounds on representables into an unweighted
 positive-density lower bound for exceptions.
What Would Finish the Proof:
- EP9-A with explicit constants would already imply positive upper density of
 $\mathcal E$.
- More realistically, EP9-B + EP9-C provide the missing infrastructure needed
 to prove EP9-A.

Target:
Prove positive upper density of exceptional odds:
\[
\overline d(\mathcal E)>0.
\]
Step A: Weighted Cover Bound
Bound representable-odds indicator by a weighted union of shifted-prime events
with explicit second-moment control.
Step B: Correlation Defect Quantification
Show pairwise/higher correlations among shifts \(2^a+2^b\) contribute only
subcritical overlap, leaving uncovered mass \(\ge \delta\) on infinitely many scales.
Step C: Density Extraction
Convert scale-wise uncovered mass into positive upper density via limsup
selection.
Concrete Blocking Lemma (Most Critical):
Need a uniform overlap estimate:
\[
\sum_{(a,b)\neq(a',b')} \!\!\!\!\!\!\!\!\!\!\!\!\!\!\!\!\!\!\! \mu\!\left(E_{a,b}\cap E_{a',b'}\right)
\le (1-\eta)\Big(\sum_{a,b}\mu(E_{a,b})\Big)^2
\]
at relevant scales, where \(E_{a,b}=\{n:\ n-(2^a+2^b)\ \text{prime}\}\).
