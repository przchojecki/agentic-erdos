# Next Problems To Attempt

Generated from the 2026-05-08 erdosproblems.com source/forum cleanup.

Selection rule: prioritize open problems whose forum thread is marked `Solution` or `Partial`, where the discussion gives a concrete proof route, formalization, standard check, or recent preprint that looks reviewable.

## 1. EP-42

Claimed solution for Sidon difference avoidance. The forum now has a detailed route through a Fourier/compactness key lemma: for a nearly positive-definite forbidden-difference set in prime cyclic groups, a random fixed-size set avoids the forbidden differences with positive probability. Tao supplied a clean continuous analogue and discussion of how to pass to a finite version. Next step: write a short finite key lemma with quantitative dependencies in $M$, then reduce the original problem to it.

## 2. EP-283

Claimed Lean formalization for the polynomial representation problem, with a forum check saying it resolves EP-283 and EP-351 if the statements match. Next step: inspect the Lean file and the exact formal statement against the website statement, then produce a human-readable proof note.

## 3. EP-330

Claimed formalization for a positive-upper-density interpretation of the minimal-basis problem. The main risk is interpretation: the FormalConjectures version apparently uses lower density, while the site remarks say Erdős likely meant upper density. Next step: separate upper-density and lower-density variants, then certify the upper-density proof.

## 4. EP-610

Forum claims this clique-transversal problem follows from recent work of Joret-Micek-Reed-Smid, and a standard check found no issues. This looks like a literature-cleanup solve rather than a new proof. Next step: locate the exact theorem, verify the parameter translation, and update the status/remarks.

## 5. EP-696

Claimed solution gives normal-order asymptotics for $h(n)$ and $H(n)$, including a counteranswer to $H(n)/h(n)\to\infty$, with a write-up and Lean formalization conditional on three standard analytic number theory inputs. Next step: audit the three axiomatized inputs against the cited sources and write the informal proof cleanly.

## 6. EP-866

Recent arXiv/Lean-backed partial solution gives sharp small-$k$ values and better general bounds for the pairwise-sums-in-a-dense-set problem. Next step: verify the Lean statement matches the exact problem conventions, especially positivity/distinctness of the $b_i$, then update solved subcases.

## 7. EP-953

Claimed $M(R)\ll R^{1/2}$ upper bound for measurable planar sets avoiding integer distances, matching known lower bounds up to $R^{o(1)}$. Kovac says the proof seems basically okay but should be rewritten, probably as a Delsarte/positive-definite argument. Next step: rewrite the three-page proof in standard harmonic-analysis language and check measurability/regularization details.

## 8. EP-956

Claimed $\Theta(n^{4/3})$ for unit distances between disjoint convex translates, using Erdős-Pach for the upper bound and Valtr-type constructions for the lower bound. The forum found a Valtr preprint that may already contain most of the construction. Next step: compare the claimed modification to Valtr’s result and write the exact reduction.

## 9. EP-995 / EP-996

Recent arXiv preprint claims negative answers and near-sharp growth for lacunary ergodic sums, with forum discussion indicating the EP-995 interpretation may need care. Next step: verify the theorem statements in arXiv:2604.18535 against both problem pages, then mark the precise subquestions resolved.

## 10. EP-1201

Forum suggests a short route from Matomäki-Radziwiłł and related pair-correlation results for large prime factors of consecutive integers. The discussion corrected an initial overstatement but still points to a strong lower-density result. Next step: formulate the exact lower-density version needed by the problem and prove it from the cited multiplicative-function inputs.
