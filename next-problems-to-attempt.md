# Next Problems To Attempt

Corrected on 2026-05-09 after rechecking the selection rule.

Selection rule: include only problems whose source page is still open and whose
forum comment-activity state is `None`, meaning the site records no partial or
complete solution claimed in the comments. A live check on 2026-05-09 confirmed
that every problem below still has forum activity label `None`.

This intentionally excludes the previously listed problem numbers 42, 283, 330,
610, 696, 866, 953, 956, 995/996, and 1201, because those threads are marked
`Solution` or `Partial`.

## 1. EP-1107

Problem: for fixed \(r\ge 2\), is every sufficiently large integer a sum of at
most \(r+1\) many \(r\)-powerful numbers?

Why it is worth attempting: the local bitset scans found eventual coverage up to
\(10^8\) for \(3\le r\le 7\), with no missing values in the final tested tail.
The known \(r=2\) theorem gives a model case, and Waring gives a much weaker
finite-summand fallback. First move: try to prove a residue-covering lemma for
sums of \(r+1\) \(r\)-powerful residues modulo growing moduli.

## 2. EP-68

Problem: prove or disprove irrationality of
\[
\sum_{n\ge 2}\frac{1}{n!-1}.
\]

Why it is worth attempting: the problem is isolated, has no forum discussion,
and the local exact interval exclusions rule out rational candidates with
denominator up to \(10^7\) for a rigorous tail interval. First move: look for a
usable gcd/cancellation bound among the shifted factorial factors \(n!-1\), then
turn the finite interval method into a general rational-exclusion argument.

## 3. EP-273

Problem: is there a covering system all of whose moduli are of the form \(p-1\)
for primes \(p\ge 5\)?

Why it is worth attempting: the local randomized greedy searches reached high
but incomplete finite-prefix coverage, which is useful evidence for both
construction and obstruction routes. First move: formalize finite truncations as
periodic covers modulo the lcm, then search for either a certified finite
covering pattern or a density obstruction that survives all truncations.

## 4. EP-341

Problem: for the greedy extension avoiding prior pairwise sums, are the
successive differences eventually periodic for every finite starting set?

Why it is worth attempting: deep simulations across several seeds found tail
periods after long transients, including periods \(1,2,5,11,12\). First move:
develop the finite-memory formulation suggested by the computation: identify a
bounded frontier state that determines the next greedy gap.

## 5. EP-295

Problem: if \(k(N)\) is the minimum number of distinct denominators
\(n_i\ge N\) needed for \(\sum 1/n_i=1\), is
\[
k(N)-(e-1)N\to\infty?
\]

Why it is worth attempting: the baseline harmonic lower bound is clean and
rigorous but only gives \(O(1)\)-scale slack. First move: strengthen harmonic
majorization by adding the distinct-denominator and exact-sum constraints, aiming
for an additive \(\omega(1)\) improvement over the harmonic envelope.

## 6. EP-81

Problem: can every chordal graph on \(n\) vertices have its edges partitioned
into \(n^2/6+O(n)\) cliques?

Why it is worth attempting: this is a structural graph problem with no forum
activity, and chordal graphs have clique-tree decompositions that give explicit
counting identities. First move: convert the clique-tree separator identity into
a quadratic optimization problem and test whether split-like templates are the
only extremal obstructions.

## 7. EP-302

Problem: estimate the largest \(A\subseteq[1,N]\) with no distinct
\(a,b,c\in A\) satisfying \(1/a=1/b+1/c\).

Why it is worth attempting: the original \(1/2\)-density guess is already
surpassed by recorded lower bounds, but the true constant remains open between
known lower and upper bounds. First move: use the parametrization
\((b-a)(c-a)=a^2\) to build a dense-set forcing theorem or improve the explicit
construction beyond the current lower bound.

## 8. EP-1120

Problem: for monic degree-\(n\) polynomials with all roots in the unit disk,
bound the shortest path inside \(\{|f(z)|\le1\}\) from \(0\) to \(|z|=1\).

Why it is worth attempting: random-root grid experiments found short paths in
all tested instances, so the work is now to identify true extremal geometry.
First move: search for a geometric bottleneck lemma connecting sublevel-set
channels to conformal modulus or distortion bounds.

## 9. EP-1108

Problem: do subset sums of distinct factorials contain only finitely many
perfect powers or powerful numbers?

Why it is worth attempting: the fixed-number-of-terms theorem of
Brindza-Erdos gives a serious foothold, but the full problem needs a uniform
argument over arbitrary subset sizes. First move: attack large primes
\(\ell\in(M/2,M]\) for \(M=\max S\), where \(v_\ell(M!)=1\), and force enough
simultaneous valuation constraints to bound \(M\).

## 10. EP-278

Problem: for finite moduli \(A=\{n_1<\cdots<n_r\}\), maximize the density covered
by one chosen residue class modulo each \(n_i\).

Why it is worth attempting: the minimum-density side is already settled in the
site remarks, but the maximum side has a concrete finite optimization flavor.
The local work gives an exact partition reduction for
\(A=\{3\}\cup\{3p:p\in P\}\). First move: generalize that reduction to prime
clusters, where the maximum-density choice becomes a controlled combinatorial
optimization problem.
