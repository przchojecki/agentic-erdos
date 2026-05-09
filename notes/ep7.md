# EP-7

## Problem Statement
Is there a distinct covering system all of whose moduli are odd?

## Source Status
- Source: https://www.erdosproblems.com/7
- Forum: https://www.erdosproblems.com/forum/discuss/7
- LaTeX source: https://www.erdosproblems.com/latex/7
- Accessed: 2026-05-08
- Page status: VERIFIABLE (no)
- Database status last update: 2025-08-31
- Page last edited: 22 January 2026
- Tags: number theory, covering systems
- OEIS: N/A
- Formalized statement: yes (last update 2026-04-20)
- Forum comment activity: None - There are no solutions, partial or complete, claimed in the comments.

## Site Remarks
Asked by Erd\H{o}s and Selfridge (sometimes also with Schinzel). They also asked whether there can be a covering system such that all the moduli are odd and squarefree. The answer to this stronger question is no, proved by Balister, Bollob\'{a}s, Morris, Sahasrabudhe, and Tiba \cite{BBMST22}.

Hough and Nielsen \cite{HoNi19} proved that at least one modulus must be divisible by either $2$ or $3$. A simpler proof of this fact was provided by Balister, Bollob\'{a}s, Morris, Sahasrabudhe, and Tiba \cite{BBMST22}, who also prove that if an odd covering system exists then the least common multiple of its moduli must be divisible by $9$ or $15$.

Selfridge has shown (as reported in \cite{Sc67}) that such a covering system exists if a covering system exists with moduli $n_1,\ldots,n_k$ such that no $n_i$ divides any other $n_j$ (but the latter has been shown not to exist, see [586]).

Filaseta, Ford, and Konyagin \cite{FFK00} report that Erd\H{o}s, 'convinced that an odd covering does exist, offered \$25 for a proof that no odd covering exists; Selfridge, convinced (at that point) that no odd covering exists, offered \$300 for the first explicit example...no award was promised to someone who gave a non-constructive proof that an odd covering of the integers exists...Selfridge (private communication) has informed us that he is now increasing his award to \$2000.'

## Site References
- [BBMST22] Balister, Paul and Bollob\'{a}s, B\'{e}la and Morris, Robert and Sahasrabudhe, Julian and Tiba, Marius, On the Erd\H{o}s covering problem: the density of the uncovered set. Invent. Math. (2022), 377-414.
- [FFK00] Filaseta, M. and Ford, K. and Konyagin, S., On an irreducibility theorem of {A}. Schinzel associated with coverings of the integers. Illinois J. Math. (2000), 633--643.
- [HoNi19] Hough, Robert D. and Nielsen, Pace P., Covering systems with restricted divisibility. Duke Math. J. (2019), 3261-3295.
- [Sc67] Schinzel, A., Reducibility of polynomials and covering systems of congruences. Acta Arith. (1967/68), 91-101.

## Forum Discussion
The site comment-activity widget records no claimed partial or complete solution. The 21 forum comment(s) are ordinary discussion, corrections, references, or clarification.

## Forum Comments
- 16:21 on 02 May 2026 - jinooklee:
  A proof of the Erdős–Selfridge conjecture via sieve monotonicity
  I would like to share a proposed proof that no covering system with distinct odd moduli greater than 1 exists, extending the BBMST framework for square-free moduli to the general case.
  The key observation is that non-square-free moduli make covering harder, not easier. Replacing a prime modulus p with p^e enlarges the block size from p−1 to p^e−1, which decreases the sieve product. Since BBMST proved the square-free sieve product is approximately 0.612 < 1, the sieve product for any configuration of odd moduli is also less than 1, and covering is impossible.
  The argument has been formalized in Lean 4 with Mathlib. Three axioms reference published BBMST results; the monotonicity chain (block comparison + sieve product antitone) is proved sorry-free. The formalization was audited by the Aristotle verification system (7/7 checks passed).
  Paper (5 pages, self-contained): https://github.com/axxen95/Lean-4-formalization-of-the-Erd-s-Selfridge-odd-covering-system-conjecture/blob/main/erdos_selfridge_paper.pdf
  Lean 4 code + audit report: https://github.com/axxen95/Lean-4-formalization-of-the-Erd-s-Selfridge-odd-covering-system-conjecture
  DOI: https://doi.org/10.5281/zenodo.19982394
  I would very much appreciate feedback from anyone familiar with the BBMST sieve framework, particularly regarding whether the sieve construction for primes p ≤ 73 extends to non-square-free moduli without additional difficulty. This is the one aspect of the proof that relies on a structural argument rather than formal verification.

- 12:33 on 06 May 2026 - Thomas Bloom (reply depth 1):
  To clarify: you are claiming that your Lean code proves this result, which is sorry-free, but assumes three 'axioms', which you believe follow from the [BBMST] paper? Or are you saying at the end that there is still a gap in the proof even then? (I have not checked whether your Lean code is doing as you report.)

- 12:39 on 06 May 2026 - jinooklee (reply depth 2):
  To clarify: the Lean code is sorry-free, and the three axioms are intended to faithfully encode published results from BBMST (Theorems 1.1 and 3.1, and the sieve data construction from Sections 2–3). The monotonicity chain connecting these axioms — that actual block sizes are pointwise ≥ square-free block sizes, and that the sieve product is antitone in block sizes — is fully proved in Lean with no axioms beyond the three stated ones.
  I am not claiming there is a gap in the proof itself. I believe the axioms correctly capture the BBMST results. The question I raised at the end is whether BBMST's sieve construction for primes p ≤ 73 (which involves LP optimization and explicit enumeration) carries over to non-square-free moduli without modification. Since the distortion parameters δ_k depend only on the prime index and not on the exponent, I believe it does, but I would welcome confirmation from someone familiar with the details of Sections 4–5 of the BBMST paper.

- 12:59 on 06 May 2026 - Thomas Bloom (reply depth 3):
  Thanks for clarifying. I had a quick look but it is hard to easily tell whether your formal statements of these three 'axioms' are indeed correct translations of the results from [BBMST19]. Your writeup is also extremely short, and it seems to claim that basically [BBMST19] already essentially proved this result (i.e. that the squarefree assumption can be dropped from their result with a trivial modification of their method); I would be surprised if this were the case, since I'm sure they did think quite hard at the time about whether the squarefree assumption can be removed!
  
  I will leave these comments in case others would like to peruse, but I assume that this proof is flawed, until either a trusted expert in this sort of number theory vouches that your observation is correct, or you provide a full Lean formalisation which is both sorry and axiom-free (i.e. formalise the [BBMST19] results also in Lean). (Or until I find the time to sit down and carefully read your PDF/the Lean code, but I don't know when this will be.)

- 13:51 on 06 May 2026 - jinooklee (reply depth 4):
  Thank you for the thoughtful response. You raise a fair point — if the square-free assumption could be removed trivially, one would expect BBMST to have done so.I should clarify: I am not claiming that the modification is trivial in a mathematical sense. What the argument does is isolate one specific structural observation — that non-square-free moduli produce larger block sizes, which makes the sieve product smaller — and show that this is sufficient to extend the result under the existing framework.It is possible that BBMST considered and dismissed this direction because the sieve construction for p ≤ 73 involves LP optimization that may not obviously carry over to non-square-free moduli. My argument relies on the claim that the distortion parameters δ_k depend only on the prime index, not on the exponent, so the monotonicity propagates through the δ-adjusted block sizes. Whether this is correct is exactly the point I would welcome expert verification on.I have written to Dr. Tiba to ask whether the BBMST framework does indeed extend in this way. I will report back if I hear from him.

- 14:11 on 06 May 2026 - jinooklee (reply depth 4):
  I have written to Dr. Tiba directly, but the email bounced (the KCL address appears to reject external mail). If you happen to be in contact with him or any of the BBMST authors, I would be grateful if you could pass this along.

- 15:48 on 06 May 2026 - natso26 (reply depth 1):
  This is incorrect. Here's decisive evidence.
  
  The assumed axiom bbmst_sf_lt_1 is false. The relevant snippet is:
  
  def updateFactor (s : Rat) (x : Rat) : Rat := 1 + x / s
  
  def sieveProd : List Rat → Rat → Rat
   | [], _ => 1
   | s :: ss, x => updateFactor s x * sieveProd ss x
  
  /-- **BBMST Theorem 1.1: SF sieve bound.**
   The sieve product with δ-adjusted SF block sizes is < 1.
   Computed to be approximately 0.612 using N = 500 primes.
  
   Bound to the specific data from exists_bbmst_data, not arbitrary data.
   For arbitrary nonempty positive lists, sieveProd at x=1 is always > 1,
   so this axiom would be false if quantified over all BBMSTData.
  
   Reference: BBMST (2019), Theorem 1.1 + Section 5. -/
  axiom bbmst_sf_lt_one (K : Nat) (cs : CoveringSystem K)
   (h_odd : CS_allOdd cs) :
   sieveProd (exists_bbmst_data K cs h_odd).sfBlocks 1 < 1
  
  Here sieveProd, as defined, has to be at least $1$. So the axiom that it is less than $1$ is impossible.
  
  BBMST Theorem 1.1 does not say this, but says: "In any finite collection of arithmetic progressions with distinct square-free moduli that covers the integers, at least one of the moduli is even."
  
  Credit to GPT for discussion (https://chatgpt.com/share/69fb61aa-c560-8399-b305-86cfec9c2580).

- 22:43 on 06 May 2026 - jinooklee (reply depth 2):
  Thank you, this is a valid and decisive objection to the Lean formalization as stated. You are correct: sieveProd, as defined, is a product of factors (1 + x/s) with s > 0 and x = 1, so each factor exceeds 1, and the product is always > 1. The axiom bbmst_sf_lt_one is therefore false under this definition.
  The error is a mistranslation of the BBMST sieve criterion into Lean. In BBMST, the accumulated sieve function is c_N(x) = c_0(x) · Π_k (1 + x/((1-δ_k)·s_k)), where c_0(x) is an initial value obtained by LP optimization on the first 5 primes. This initial value is much less than 1 (approximately 0.098), which is why the full product c_N(1) ≈ 0.612 < 1 despite each update factor being > 1. My formalization omitted c_0 entirely, making the axiom provably false.
  The underlying mathematical observation — that non-square-free block sizes p^e − 1 are at least the square-free block sizes p − 1, and that each update factor (1 + x/((1-δ)·s)) is decreasing in s — remains valid independently of this formalization error. The monotonicity argument says: if c_N^{SF}(1) < 1, and each update factor for the actual system is ≤ the corresponding SF factor, then c_N^{actual}(1) ≤ c_N^{SF}(1) < 1. This reasoning does not depend on the Lean code.
  I will revise the formalization to correctly encode the BBMST sieve criterion. I appreciate the careful review.

- 10:10 on 07 May 2026 - Thomas Bloom (reply depth 1):
  Because this conversation could go on indefinitely, and I believe that this approach of 'an easy modification of [BBMST]' is fundamentally flawed, I will not allow further comments on the technical details of how this Lean code is fixed/changed.
  
  Anyone interested in discussing the details with jinooklee is welcome to contact them and continue this discussion outside the site. I will only allow further comments in this thread referring to this proof attempt if it is a link to a complete, self-contained, Lean formalisation, without any sorry or axioms appealing to external work.

- 00:14 on 12 Feb 2026 - Dogmachine:
  Here are a couple of elementary observations I would like to write down. First, a finite covering system only needs to cover almost all integers in order to cover all of them. Second, If we allow infinite covering systems, then the answer is strongly positive, since for every positive integer $k$, almost all integers are multiple of one of $p_{k+1},p_{k+2},...$, and we may use a collection of homogeneous congruences using only odd moduli.

- 13:55 on 24 Jan 2026 - Zeraoulia Rafik:
  I wrote a brief note recording a folklore necessary condition for Erdős Problem~\#7.
  If $\{a_i \bmod m_i\}_{i=1}^k$ is a distinct covering system and $L=\mathrm{lcm}(m_1,\dots,m_k)$, then\[
  \sum_{\substack{d\mid L\\ d>1}} \frac{1}{d} \ge 1
  \qquad\text{equivalently}\qquad
  \sigma(L)\ge 2L,
  \]so $L$ must be abundant.
  In particular, any \emph{odd} distinct covering would require odd abundant $L$, hence $L\ge 945$
  (since $945$ is the smallest odd abundant number).
  This observation appears in community discussions (e.g.\ MathOverflow); my note provides a self-contained proof
  and a small reproducible script listing candidate overall moduli $L$ (together with $\sigma(L)/L$) in a given range.
  
  link:https://zenodo.org/records/18360978 (https://zenodo.org/records/18360978)

- 00:31 on 11 Jan 2026 - gebyjaff:
  We have posted a candidate solution here. It is mostly formalized in Lean, with two axiomatic statements. The first is based on a published paper, which we found difficult to formalize fully. The second is included as an additional proof, with sources provided in the appendix. There are most likely errors in this work, but we are seeking a review. The proof was generated using Archivara and Aristotle, with a human bridging the final gap through the appendix. We also invite the community to help assess the novelty of this approach.
  
  https://github.com/spicylemonade/erdos-007

- 00:49 on 11 Jan 2026 - AlejandroZarzuelo (reply depth 1):
  While the proof is hybrid, we expect that it is easy to understand the logic between the appendix that bridges the final gap in the Lean proof

- 01:09 on 11 Jan 2026 - TerenceTao (reply depth 2):
  In order to have any meaningful chance of external commentary on a work in progress, one would probably need a high-level, human-readable and preferably human-generated description of what one has actually achieved here, for instance describing the general strategy of proof, what reductions have been achieved, and what gaps remain, at the level of writing comparable to that of a professional research paper. (The appendix provided is too focused on low-level Lean implementation details and/or specific technical nuances of the Hough paper to be of much use to an external human reader.)

- 01:40 on 11 Jan 2026 - gebyjaff (reply depth 3):
  Thank you for the feedback! We will create a cleaner paper of the full candidate solution.

- 06:39 on 11 Jan 2026 - llllvvuu (reply depth 4):
  While we wait for this, I asked Gemini to extract the argument for the main assumption 'HoughNielsenGoodFibre'. The TeX is here (https://gist.github.com/llllvvuu/7afe1e1d51cc1f9f6a24644c2d057317). I note that Gemini itself is not certain about this argument, citing uncertainty especially about the independence assumption.
  
  I also asked Aristotle to interpret this writeup, and it left 3 holes (one of these holes is the independence assumption that Gemini also flagged). This is also linked above.

- 03:04 on 11 Jan 2026 - DanielLarsen (reply depth 1):
  Let me just start by saying that this is a very preliminary assessment, and I am very ignorant of the literature around this problem, so everything I say should be taken with a very large grain of salt.
  
  With that being said, while the general strategy doesn't seem crazy, it seems like the appendix is hiding all the difficulty. The key claim is that the $R$ of Hough-Nielsen is related with collision events. I don't see the explanation for that, and if that claim is false, the analysis provided falls apart. Generally, I see no particular reason to expect the distinctness of active $m_i$.

- 07:32 on 11 Jan 2026 - natso26 (reply depth 1):
  If I understand correctly, there is a “gap” in the current Lean work in progress on this problem. The provided document attempts to prove (informally) that this gap can be filled by some existing results in literature, specifically results due to Hough-Nielsen and Shearer.
  
  I note that this informal proof is likely generated by LLM by stylistic considerations and so exercise caution in accepting its validity.
  
  I also note that the language used in the writeup is actively attempting to persuade the reader in a way that is not neutral. For example, the introduction states that the formalization is “close to completion”, and one literature result is explicitly stated to be “accepted in the Annals of Mathematics”.

- 05:38 on 15 Nov 2025 - Alfaiz:
  In this paper (https://people.math.sc.edu/filaseta/papers/schinzcovpap.pdf) of M. Filaseta, K. Ford and S. Konyagin, they state the fact that Erdos, convinced that an odd covering does exist, offered 25 dollars for a proof that no odd covering exists. Selfridge, convinced that no odd covering exists, offered 300 dollars for the first explicit example of an odd covering, which he further increased to 2000 dollars.
  
  Note: No award was promised to someone who gave a non-constructive proof that an odd covering of the integers exists.
  
  (The site has been updated to address this comment.)

- 07:49 on 13 Nov 2025 - Alfaiz:
  Note: [BBMST22] also show that if an odd covering system exists, then the least common multiple of its moduli must be divisible by 9 or 15.
  
  (The site has been updated to address this comment.)

- 03:11 on 05 Nov 2025 - Adenwalla:
  The question should say 'distinct' covering system.
  
  (The site has been updated to address this comment.)

## Local Computation
No local computation recorded yet.

## Local Proof Attempts
No local proof attempt recorded yet.
