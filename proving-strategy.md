# Proving Strategy (No New Computations)

## Core Rule
- From now on, do **not** add any new computations.
- Focus only on:
  - literature search,
  - proof attempts,
  - concrete blocking lemmas and reduction steps.

## Per-Problem Workflow
For each EP problem, work strictly one-by-one and record:
1. Exact statement (normalized, with precise quantifiers).
2. Best known literature status (proved/partial/open variants).
3. Candidate proof routes.
4. Precise blocker: the concrete lemma/theorem estimate that is currently missing.
5. Next proof tasks that are local and checkable.

## Queue Policy
- Default order: easiest/highest-rank first, using `data/erdos_to_check_ranked.csv`.
- If rank metadata is missing for many entries, use EP number order as fallback.
- Recompute ranking periodically with:
  - `node classify_erdos_by_refs.mjs`

## Priority Method Families
When trying each problem, prioritize the following themes first:
- Sieve methods (especially Tao-style decompositions and transference arguments).
- Random colorings / probabilistic constructions.
- Lovasz Local Lemma (and variants, including lopsided LLL where relevant).
- Red-blue coloring formulations / Ramsey reformulations.
- Arithmetic geometry approaches (finiteness of rational/integer solutions, structure of low-degree varieties).

## Required Output Per Problem
For each problem note, include:
- `Problem Statement`
- `Literature`
- `Our Approaches`
- `Blocking Lemma(s)`
- `What Would Finish the Proof`

Each `Blocking Lemma` entry should be specific, e.g.:
- "Need quantitative bound X <= Y(N) at scale N^{-2}."
- "Need stability lemma converting near-extremizer measure to structural rigidity."
- "Need finite-N version of asymptotic theorem T with explicit error term."

## Anti-Drift Rules
- Do not default back to computational scans.
- Do not add batch runs.
- Do not treat empirical evidence as proof progress.
- Prefer theorem-strength reductions over heuristic narratives.

## Global-Method Switch (When Local Casework Stalls)
If a problem is progressing only by small finite-layer case splits, switch to a global method pass:
1. Write a discrepancy decomposition (`main term + oscillation/error`) and identify the exact sign-sensitive estimate needed.
2. Formulate an extremizer/stability statement: characterize near-equality structure.
3. Build a dual/optimization viewpoint (LP, entropy, or variational bound) to upper-bound the global ratio directly.
4. Convert “finite initial range” into a finite pattern-class theorem (symbolic classes, not numerical scans).
5. Return to local lemmas only after the global bottleneck theorem is explicitly stated.

## EP-488 Specific Global Program
- Decomposition: \(M_A(x)=\delta_A x+E_A(x)\); current \(L^\infty\) bound on \(E_A\) is too weak.
- Missing key: sign-aware transport inequality for \(E_A(m)-2E_A(n)\).
- Stability target: near-factor-2 implies singleton-dominant reduced set.
- Pattern target: bounded complexity of reduced profiles at fixed \(|B\cap[1,n]|=t\).
- Success criterion: one theorem that covers all \(t\) at once, replacing layer-by-layer closure.

## EP-488 Update (GL1 Executed)
- Added weighted-lcm exact identity and signed bound:
  - \(D_A(m)-2D_A(n)\le -\delta_A + 2W_+(A)/n + W_-(A)/m\).
- New finite-\(n\) criterion:
  - if \(n > (2W_+(A)+W_-(A))/\delta_A\), then inequality holds for all \(m>n\).
- This is stronger than the old \(3C_A/\delta_A\) bound when lcm-layer aggregation cancels.
- Next global target remains GL2 (near-extremizer rigidity), now in reduced finite window.

## EP-488 Update (GL2 Partial Executed)
- Proved a near-extremizer finite-window lemma:
  - if \(R_A(n,m)>2-\varepsilon\) with \(0<\varepsilon<\delta_A\), then
    \[
    n<\frac{2W_+(A)+W_-(A)}{\delta_A-\varepsilon}.
    \]
- So near-factor-2 behavior is now rigorously confined to an explicit finite initial window.
- Remaining GL2 task:
  - structural rigidity inside that window (singleton-dominant or finite pattern classification).

## EP-488 Update (Gap Shrink)
- Closed the full \(|B\cap[1,n]|=6\) layer:
  - \(r=4,5\) via Lemma B15,
  - \(r=3\) via new Lemma B21.
- Current unresolved core:
  - \(|B\cap[1,n]|\ge 7\),
  - reduced size \(r\ge 3\),
  - finite initial window only.

## EP-488 Update (No-Finite-Checks Pivot)
- New global reduction lemma:
  - enough to prove \(M_A(n)/n \ge \mu(A_{\min})/2\) for all \(n\ge \max A\).
- New overlap bottleneck:
  - sufficient condition \(\Omega_G(n)\le \mu_G/2-|G|/n\), where
    \(\Omega_G(n)=\sum_{g<h}\lfloor n/\mathrm{lcm}(g,h)\rfloor/n\).
- This reframes the remaining work as a sieve overlap theorem, not finite pattern enumeration.

## EP-488 Update (GL2 Coercion)
- Added rigorous near-extremizer coercion:
  - if \(R_A(n,m)>2-\varepsilon\), then
    \[
    \Omega_G(n) > S_1(n)-\mu_G/(2-\varepsilon)
    \]
    and hence
    \[
    \Omega_G(n) > \mu_G(1-\varepsilon)/(2-\varepsilon)-|G|/n.
    \]
- Interpretation:
  - near-extremizers must have very high pair-overlap mass.
  - next target is a structural theorem classifying reduced high-overlap families.

## EP-488 Update (Anchor-Core Step)
- Added rigorous anchor-overlap lemmas:
  - existence of an anchor \(g_*\) carrying average pair-lcm mass,
  - quantitative lower bound on anchor mass in near-extremizers,
  - corrected threshold-core lemma \(N_Y\ge (Y T_*-(r-1))/(Y-1)\),
  - anchor factorization + universal upper bound \(T_*\le (r-1)/(2g_*)\),
  - resulting near-extremizer constraint
    \[
    \mu_G\frac{1-\varepsilon}{2-\varepsilon}<\frac{r(r-1)}{4g_*}+\frac{r}{n}.
    \]
- Active theorem target:
  - prove reduced antichains with such large low-lcm anchor cores are singleton-dominant (or finitely classifiable).

## EP-488 Update (Incidence Coercion)
- Added anchor gcd-incidence lemmas:
  - upper bound \(T(g)\le \mu_{-g}/g + (1-1/g)H_{\mathrm{nc}}(g)\),
  - hence near-extremizers force large non-coprime harmonic mass around the anchor.
- New concrete bottleneck theorem:
  - bound \(H_{\mathrm{nc}}(g_*)\) from above for reduced antichains in terms of \(\mu_G,r,g_*\) strongly enough to contradict the near-extremizer lower bound.

## EP-488 Update (Prime-Fiber Reduction)
- Reduced \(H_{\mathrm{nc}}(g_*)\) bottleneck to a single prime divisor fiber:
  - there exists \(p_*\mid g_*\) with
    \[
    H_{p_*}(g_*)\ge H_{\mathrm{nc}}(g_*)/\omega(g_*).
    \]
- Under near-extremizer assumptions this yields an explicit lower bound on one \(H_{p_*}(g_*)\).
- Active final blocker:
  - prove a matching upper bound on \(H_p(g)\) in reduced antichains (prime-fiber incidence theorem).

## EP-488 Update (Counterexample Profile)
- Added exact-\(2\) necessary inequalities (N1–N3) for any genuine counterexample pair.
- Added asymptotic consequence: along any counterexample sequence, \(p_{\min}(g_*)\lesssim r\).
- Final target is now explicit:
  - prove the N1/N2/N3 corridor is empty for reduced antichains.
- Added quantitative exclusion:
  - if \(p_{\min}(g_*)>r\), then \(n\) is explicitly bounded:
    \[
    n<\frac{2}{\mu_G(1/r-1/p_{\min})}.
    \]
  - so this branch is finite; infinite obstruction can only occur with \(p_{\min}(g_*)\le r\).
- Added low-prime branch inequality:
  - prime-fiber packing bound \(H_p(g)\le (r-1)/(2p)\),
  - combined with B34 gives explicit necessary condition (B44) in the residual branch \(p_{\min}(g_*)\le r\).

## EP-488 Update (Dense/Sparse Split)
- Added a proved global split:
  - if \(D(n)\ge 1/2\), theorem is immediate (\(D(m)<1\le 2D(n)\)).
- Remaining proof is now sparse-only (\(D(n)<1/2\)).
- New single combinatorial target:
  - prove \(I(n)+r\le 2M_A(n)\) for reduced \(G\) in sparse regime.
  - This would imply \(\mu_G\le 2D(n)\), hence full EP-488 by \(D(m)<\mu_G\).
- Added equivalent forms:
  - duplicate-incidence form \(\mathrm{Dup}\le N_{\mathrm{nb}}\),
  - pair-overlap sufficient form \(P(n)\le M_A(n)-r\), where
    \(P(n)=\sum_{g<h}\lfloor n/\mathrm{lcm}(g,h)\rfloor\).
  - correction: this \(P\)-form is not necessary and can fail even when \(D(n)<1/2\); keep it only as a sufficient criterion.
- New active proof target:
  - order-slack identity \(2M-I-r=\sum_i(2t_i-u_i-1)\),
  - prove existence of an ordering (or averaged slack bound) giving total nonnegative slack in sparse regime.

## EP-488 Current Endgame
- Exact remaining statement is OL1 (order-slack existence).
- Residual branch after all constraints:
  - sparse regime \(D(n)<1/2\),
  - low-prime corridor \(p_{\min}(g_*)\le r\),
  - B44 still satisfiable a priori.
- Next work should focus on:
  - improved prime-fiber upper bounds using sparse-density interaction, or
  - constructive ordering theorem proving nonnegative total slack.

## EP-488 Update (Anchor Exclusion)
- Added prime-anchor exclusion:
  - near-extremizers with \(L_*>\mu_*/g_*\) cannot have \(g_*\) prime.
- Practical impact:
  - remaining structural proof can focus on composite anchors only.
- Added prime-power anchor criterion:
  - for \(g_*=p^k\), \(T(g_*)\le \mu_*/p\), so \(L_*>\mu_*/p\) excludes this branch.
- Unified all anchor exclusions:
  - for any anchor \(g_*\), \(T(g_*)\le \mu_*/p_{\min}(g_*)\),
  - thus near-extremizers must satisfy \(L_*\le \mu_*/p_{\min}(g_*)\).

## Future-Run Remarks
- Keep reductions explicit: write `A => B => C`, and state exactly where implication fails.
- Distinguish clearly:
  - "known in literature",
  - "proved in-note",
  - "conjectural route".
- If a problem has multiple interpretations/variants, split them and mark which variant is trivial, solved, or open.
- When possible, target one strong intermediate lemma per problem instead of broad speculative text.
- Revisit older notes that are computation-heavy and convert them into lemma-driven proof roadmaps.
